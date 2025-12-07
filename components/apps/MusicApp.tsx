
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Heart, ListMusic } from 'lucide-react';
import { Song } from '../../types';

// Mock Data with real audio URLs
// Using generic creative commons / reliable CDN samples
const SONGS: Song[] = [
    { 
        id: '1', 
        title: 'Cyber City', 
        artist: 'AutoOS Mix', 
        coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80', 
        duration: 180,
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3' 
    },
    { 
        id: '2', 
        title: 'Night Drive', 
        artist: 'Synthwave', 
        coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&q=80', 
        duration: 200,
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' 
    },
    { 
        id: '3', 
        title: 'Neon Dreams', 
        artist: 'Retrowave', 
        coverUrl: 'https://images.unsplash.com/photo-1621360841013-c768371e93cf?w=800&q=80', 
        duration: 160,
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3' 
    },
    { 
        id: '4', 
        title: 'Sunset Route', 
        artist: 'Chill Vibes', 
        coverUrl: 'https://images.unsplash.com/photo-1594235045816-33cb06f43127?w=800&q=80', 
        duration: 210,
        audioUrl: 'https://cdn.pixabay.com/download/audio/2023/04/19/audio_b41f969f3f.mp3' 
    },
];

// Singleton Audio State (to allow background playback across component mounts)
const globalAudio = new Audio();
let globalIndex = 0;
// Pre-load first song
globalAudio.src = SONGS[0].audioUrl;

interface MusicAppProps {
  isWidget?: boolean;
}

const MusicApp: React.FC<MusicAppProps> = ({ isWidget = false }) => {
  // Local state synced with global audio
  const [isPlaying, setIsPlaying] = useState(!globalAudio.paused);
  const [currentSongIndex, setCurrentSongIndex] = useState(globalIndex);
  const [currentTime, setCurrentTime] = useState(globalAudio.currentTime);
  const [duration, setDuration] = useState(globalAudio.duration || SONGS[globalIndex].duration);
  
  const song = SONGS[currentSongIndex];
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Sync state with Global Audio Events
  useEffect(() => {
    const updateState = () => {
        setCurrentTime(globalAudio.currentTime);
        setDuration(globalAudio.duration || SONGS[globalIndex].duration);
        setIsPlaying(!globalAudio.paused);
    };

    const handleEnded = () => {
        handleNext();
    };

    // Attach listeners
    globalAudio.addEventListener('timeupdate', updateState);
    globalAudio.addEventListener('play', updateState);
    globalAudio.addEventListener('pause', updateState);
    globalAudio.addEventListener('ended', handleEnded);
    globalAudio.addEventListener('loadedmetadata', updateState);

    // Initial sync
    updateState();

    return () => {
        globalAudio.removeEventListener('timeupdate', updateState);
        globalAudio.removeEventListener('play', updateState);
        globalAudio.removeEventListener('pause', updateState);
        globalAudio.removeEventListener('ended', handleEnded);
        globalAudio.removeEventListener('loadedmetadata', updateState);
    };
  }, []);

  const playSong = (index: number) => {
    if (index !== globalIndex) {
        globalIndex = index;
        setCurrentSongIndex(index);
        globalAudio.src = SONGS[index].audioUrl;
        globalAudio.load();
    }
    globalAudio.play().catch(e => console.error("Playback failed", e));
  };

  const togglePlay = () => {
    if (globalAudio.paused) {
        globalAudio.play().catch(e => console.error(e));
    } else {
        globalAudio.pause();
    }
  };

  const handleNext = () => {
    const nextIndex = (globalIndex + 1) % SONGS.length;
    playSong(nextIndex);
  };

  const handlePrev = () => {
    // If more than 3 seconds in, restart song
    if (globalAudio.currentTime > 3) {
        globalAudio.currentTime = 0;
        return;
    }
    const prevIndex = (globalIndex - 1 + SONGS.length) % SONGS.length;
    playSong(prevIndex);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (Number(e.target.value) / 100) * duration;
    globalAudio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isWidget) {
    return (
        <div className="h-full w-full bg-zinc-900 rounded-3xl p-4 flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute inset-0 opacity-20 bg-cover bg-center blur-xl transition-all duration-700" style={{ backgroundImage: `url(${song.coverUrl})` }}></div>
            
            <div className="relative z-10 flex space-x-4 items-center">
                <img src={song.coverUrl} alt="Album Art" className="w-16 h-16 rounded-xl shadow-lg bg-zinc-800 object-cover" />
                <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold text-white truncate">{song.title}</h3>
                    <p className="text-zinc-400 truncate">{song.artist}</p>
                </div>
            </div>

            <div className="relative z-10 flex justify-between items-center mt-2">
                 <button onClick={handlePrev} className="p-3 text-zinc-300 hover:text-white transition-colors">
                    <SkipBack className="w-8 h-8 fill-current" />
                </button>
                <button 
                    onClick={togglePlay}
                    className="p-4 bg-white text-black rounded-full hover:scale-105 transition-transform shadow-xl"
                >
                    {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-1" />}
                </button>
                <button onClick={handleNext} className="p-3 text-zinc-300 hover:text-white transition-colors">
                    <SkipForward className="w-8 h-8 fill-current" />
                </button>
            </div>
            
            {/* Progress Bar Mini */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
            </div>
        </div>
    );
  }

  // Full App View
  return (
    <div className="h-full w-full bg-black p-6 flex flex-col md:flex-row gap-8">
        {/* Now Playing Section */}
        <div className="flex-1 bg-zinc-900 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
             {/* Background Blur */}
             <div className="absolute inset-0 opacity-10 bg-cover bg-center blur-3xl transition-all duration-1000" style={{ backgroundImage: `url(${song.coverUrl})` }}></div>
             
             <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
                <img src={song.coverUrl} alt="Album Art" className="w-64 h-64 md:w-80 md:h-80 rounded-2xl shadow-2xl mb-8 object-cover transition-all duration-500" />
                
                <div className="w-full text-center mb-6">
                    <h2 className="text-4xl font-bold text-white mb-2 truncate">{song.title}</h2>
                    <p className="text-xl text-zinc-400">{song.artist}</p>
                </div>

                {/* Controls */}
                <div className="w-full space-y-4">
                     {/* Seek Bar */}
                     <div className="w-full group">
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={progressPercent || 0}
                            onChange={handleSeek}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                            style={{
                                background: `linear-gradient(to right, #3b82f6 ${progressPercent}%, #27272a ${progressPercent}%)`
                            }}
                        />
                        <div className="flex justify-between text-xs text-zinc-500 mt-2 font-medium">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                     </div>

                     <div className="flex items-center justify-between px-4 pt-2">
                        <button className="text-zinc-500 hover:text-zinc-300"><Shuffle className="w-7 h-7" /></button>
                        
                        <div className="flex items-center gap-6">
                            <button onClick={handlePrev} className="text-zinc-200 hover:text-white"><SkipBack className="w-10 h-10 fill-current" /></button>
                            <button 
                                onClick={togglePlay}
                                className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 hover:bg-zinc-100 transition-all shadow-xl shadow-white/10"
                            >
                                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-1" />}
                            </button>
                            <button onClick={handleNext} className="text-zinc-200 hover:text-white"><SkipForward className="w-10 h-10 fill-current" /></button>
                        </div>
                        
                        <button className="text-zinc-500 hover:text-zinc-300"><Repeat className="w-7 h-7" /></button>
                     </div>
                </div>
             </div>
        </div>

        {/* Playlist / Up Next (Hidden on small screens) */}
        <div className="hidden md:flex w-96 bg-zinc-900 rounded-3xl p-6 flex-col border border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ListMusic className="w-6 h-6 text-blue-500" />
                Up Next
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {SONGS.map((s, idx) => (
                    <div 
                        key={s.id}
                        onClick={() => playSong(idx)}
                        className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all
                            ${idx === currentSongIndex ? 'bg-zinc-800 border border-zinc-700 shadow-md' : 'hover:bg-zinc-800/50 border border-transparent'}
                        `}
                    >
                        <div className="relative">
                            <img src={s.coverUrl} className={`w-12 h-12 rounded-lg object-cover ${idx === currentSongIndex ? 'opacity-50' : ''}`} alt={s.title} />
                            {idx === currentSongIndex && isPlaying && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex gap-0.5 h-3 items-end">
                                        <div className="w-1 bg-white animate-[bounce_1s_infinite] h-2"></div>
                                        <div className="w-1 bg-white animate-[bounce_1.2s_infinite] h-3"></div>
                                        <div className="w-1 bg-white animate-[bounce_0.8s_infinite] h-1.5"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className={`font-medium truncate ${idx === currentSongIndex ? 'text-blue-400' : 'text-white'}`}>{s.title}</p>
                            <p className="text-sm text-zinc-500 truncate">{s.artist}</p>
                        </div>
                        <div className="text-xs text-zinc-600 font-mono">
                            {formatTime(s.duration)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default MusicApp;
