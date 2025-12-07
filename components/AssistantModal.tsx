import React, { useEffect, useRef } from 'react';
import { Mic, X, Loader2 } from 'lucide-react';
import { LiveStatus } from '../types';

interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: LiveStatus;
  isSpeaking: boolean;
  volume: number; // 0 to 1
  onConnect: () => void;
}

const AssistantModal: React.FC<AssistantModalProps> = ({ 
    isOpen, onClose, status, isSpeaking, volume, onConnect 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Auto-connect when opened
  useEffect(() => {
    if (isOpen && status === 'disconnected') {
        onConnect();
    }
  }, [isOpen, status, onConnect]);

  // Visualizer Animation
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const draw = () => {
      time += 0.05;
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      
      ctx.clearRect(0, 0, width, height);

      // Gradient Line
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, 'rgba(66, 133, 244, 0)');
      gradient.addColorStop(0.2, '#4285F4');
      gradient.addColorStop(0.5, '#EA4335');
      gradient.addColorStop(0.8, '#34A853');
      gradient.addColorStop(1, 'rgba(251, 188, 5, 0)');

      ctx.lineWidth = 4;
      ctx.strokeStyle = gradient;
      ctx.lineCap = 'round';

      ctx.beginPath();
      
      // Determine amplitude based on volume/speaking state
      const baseAmp = isSpeaking ? 20 : (volume * 100); 
      const activeAmp = Math.max(5, baseAmp);

      for (let x = 0; x < width; x+=5) {
        // Sine wave math
        const y = centerY + Math.sin(x * 0.02 + time) * activeAmp * Math.sin(x / width * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [isOpen, isSpeaking, volume]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 h-1/2 z-50 flex flex-col items-center justify-end pointer-events-none">
        {/* Backdrop Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-auto" onClick={onClose}></div>
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-2xl pb-10 px-6 flex flex-col items-center pointer-events-auto">
            
            {status === 'connecting' && (
                <div className="flex items-center space-x-2 text-zinc-400 mb-8">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Connecting to Auto AI...</span>
                </div>
            )}
            
            {status === 'error' && (
                <div className="text-red-400 mb-8 font-medium">
                    Connection failed. Please check API Key.
                </div>
            )}

            {status === 'connected' && (
                <div className="w-full h-24 mb-4">
                    <canvas ref={canvasRef} width={600} height={100} className="w-full h-full" />
                </div>
            )}

            <div className="flex items-center justify-between w-full max-w-sm">
                <div className="text-2xl font-semibold text-white">
                    {isSpeaking ? "AutoOS is speaking..." : "Listening..."}
                </div>
                <button 
                    onClick={onClose}
                    className="p-4 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white transition-colors"
                >
                    <X className="w-8 h-8" />
                </button>
            </div>
        </div>
    </div>
  );
};

export default AssistantModal;