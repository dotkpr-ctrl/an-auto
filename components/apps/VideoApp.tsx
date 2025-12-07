
import React, { useState } from 'react';
import { Play, Lock, AlertCircle } from 'lucide-react';

interface VideoAppProps {
  isParked: boolean;
}

const VIDEOS = [
  { id: 1, title: 'Car Review: The Future of Driving', thumbnail: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80', views: '1.2M' },
  { id: 2, title: 'Lo-Fi Beats to Drive To', thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80', views: '840K' },
  { id: 3, title: 'Top 10 Scenic Routes', thumbnail: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80', views: '2.1M' },
  { id: 4, title: 'EV Charging Explained', thumbnail: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80', views: '500K' },
  { id: 5, title: 'Night Drive ASMR', thumbnail: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&q=80', views: '3M' },
  { id: 6, title: 'Maintenance Tips 101', thumbnail: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80', views: '150K' },
];

const VideoApp: React.FC<VideoAppProps> = ({ isParked }) => {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  if (!isParked) {
    return (
        <div className="h-full w-full bg-black flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-6 border border-red-900/50">
                <Lock size={48} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Video Blocked</h2>
            <p className="text-zinc-400 max-w-md">
                For your safety, video playback is not available while driving. 
                Please shift to <span className="text-white font-bold bg-zinc-800 px-2 py-0.5 rounded">P</span> (Park) to access entertainment.
            </p>
        </div>
    );
  }

  if (activeVideo) {
      const video = VIDEOS.find(v => v.id === activeVideo);
      return (
        <div className="h-full w-full bg-black flex flex-col">
             <div className="flex-1 bg-zinc-900 relative">
                 <img src={video?.thumbnail} alt="" className="w-full h-full object-cover opacity-50" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-2xl">
                        <Play size={32} fill="currentColor" />
                    </button>
                 </div>
                 <button 
                    onClick={() => setActiveVideo(null)}
                    className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-md hover:bg-black/70"
                 >
                    Back
                 </button>
             </div>
             <div className="h-24 p-4 bg-zinc-900 border-t border-zinc-800">
                <h3 className="text-xl font-bold text-white">{video?.title}</h3>
                <p className="text-zinc-400">{video?.views} views</p>
             </div>
        </div>
      );
  }

  return (
    <div className="h-full w-full bg-black p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                    <Play size={20} fill="white" className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">CarTube</h1>
            </div>
            <div className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-xs font-bold border border-green-900/50 flex items-center gap-1">
                <AlertCircle size={12} /> PARKED
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VIDEOS.map(video => (
                <button 
                    key={video.id}
                    onClick={() => setActiveVideo(video.id)}
                    className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all text-left focus:ring-4 focus:ring-blue-500"
                >
                    <div className="aspect-video relative overflow-hidden">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                            10:24
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="text-white font-semibold line-clamp-2 mb-1 group-hover:text-blue-400 transition-colors">{video.title}</h3>
                        <p className="text-zinc-500 text-sm">{video.views} views • 2 days ago</p>
                    </div>
                </button>
            ))}
        </div>
    </div>
  );
};

export default VideoApp;
