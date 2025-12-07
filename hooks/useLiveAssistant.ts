import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createPcmBlob, decode, decodeAudioData } from '../utils/audio';
import { LiveStatus } from '../types';

export const useLiveAssistant = () => {
  const [status, setStatus] = useState<LiveStatus>('disconnected');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0); // For visualizer

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  
  // Ref to hold the active session object for proper cleanup
  const sessionRef = useRef<any>(null);
  // Ref to track if the hook/component is active to prevent race conditions
  const isActiveRef = useRef(false);

  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const connect = useCallback(async () => {
    if (!process.env.API_KEY) {
      console.error("API Key missing");
      setStatus('error');
      return;
    }
    
    // Prevent multiple connection attempts
    if (status === 'connected' || status === 'connecting') return;

    isActiveRef.current = true;

    try {
      setStatus('connecting');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Setup Audio Contexts
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      // Ensure contexts are running (needed for some browsers)
      await inputAudioContextRef.current.resume();
      await outputAudioContextRef.current.resume();

      const outputNode = outputAudioContextRef.current.createGain();
      outputNode.connect(outputAudioContextRef.current.destination);

      // Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            if (!isActiveRef.current) return;
            console.log("Live Session Opened");
            setStatus('connected');
            
            // Setup Input Processing
            if (!inputAudioContextRef.current) return;
            
            const source = inputAudioContextRef.current.createMediaStreamSource(stream);
            sourceRef.current = source;
            
            const processor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;
            
            processor.onaudioprocess = (e) => {
                if (!isActiveRef.current) return;
                const inputData = e.inputBuffer.getChannelData(0);
                
                // Simple volume meter logic
                let sum = 0;
                for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
                const rms = Math.sqrt(sum / inputData.length);
                setVolume(prev => Math.max(0.1, prev * 0.8 + rms * 2)); // Smooth volume

                const pcmBlob = createPcmBlob(inputData);
                
                // Only send if we have a valid session ref
                if (sessionRef.current) {
                    sessionRef.current.sendRealtimeInput({ media: pcmBlob });
                }
            };

            source.connect(processor);
            processor.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (!isActiveRef.current) return;

            const serverContent = message.serverContent;
            
            if (serverContent?.turnComplete) {
                setIsSpeaking(false);
            }
            
            if (serverContent?.interrupted) {
                console.log("Interrupted");
                sourcesRef.current.forEach(src => {
                    try { src.stop(); } catch(e) {}
                });
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
                setIsSpeaking(false);
            }

            const base64Audio = serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
                setIsSpeaking(true);
                const ctx = outputAudioContextRef.current;
                
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                
                const audioBuffer = await decodeAudioData(
                    decode(base64Audio),
                    ctx,
                    24000,
                    1
                );

                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputNode);
                
                source.addEventListener('ended', () => {
                    sourcesRef.current.delete(source);
                    if (sourcesRef.current.size === 0) {
                        // Small delay to ensure state updates cleanly
                        setTimeout(() => setIsSpeaking(false), 200); 
                    }
                });
                
                source.start(nextStartTimeRef.current);
                sourcesRef.current.add(source);
                nextStartTimeRef.current += audioBuffer.duration;
            }
          },
          onclose: () => {
            console.log("Session Closed");
            if (isActiveRef.current) setStatus('disconnected');
          },
          onerror: (err) => {
            console.error("Session Error", err);
            if (isActiveRef.current) setStatus('error');
          }
        },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            },
            systemInstruction: "You are AutoOS, an intelligent, safe, and helpful in-car AI driving assistant. Keep answers concise, relevant to driving, and helpful. Do not be overly verbose. You can help with navigation queries, general knowledge, or just chatting while I drive."
        }
      });
      
      // Securely store the session when promise resolves
      sessionPromise.then(session => {
          if (!isActiveRef.current) {
              // If user disconnected before connection established, close immediately
              console.log("Connection established after disconnect, closing...");
              session.close();
              return;
          }
          sessionRef.current = session;
      }).catch(err => {
          console.error("Failed to establish session", err);
          if (isActiveRef.current) setStatus('error');
      });

    } catch (error) {
      console.error("Failed to connect", error);
      setStatus('error');
    }
  }, [status]);

  const disconnect = useCallback(() => {
    console.log("Disconnecting Live Assistant...");
    isActiveRef.current = false;

    // Stop Audio
    if (processorRef.current && sourceRef.current) {
        processorRef.current.disconnect();
        sourceRef.current.disconnect();
    }
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
        inputAudioContextRef.current.close();
    }
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
        outputAudioContextRef.current.close();
    }
    
    // Close Session properly
    if (sessionRef.current) {
        try {
            sessionRef.current.close();
        } catch (e) {
            console.error("Error closing session", e);
        }
        sessionRef.current = null;
    }
    
    // Reset state
    setStatus('disconnected');
    setIsSpeaking(false);
    setVolume(0);
    sourcesRef.current.clear();
  }, []);

  useEffect(() => {
    return () => {
        disconnect();
    }
  }, [disconnect]);

  return { connect, disconnect, status, isSpeaking, volume };
};