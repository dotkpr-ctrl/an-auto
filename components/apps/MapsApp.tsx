
import React, { useState } from 'react';
import { Search, Navigation, MapPin, Volume2, BatteryCharging, CircleDollarSign } from 'lucide-react';

interface MapsAppProps {
  isWidget?: boolean;
}

const MapsApp: React.FC<MapsAppProps> = ({ isWidget = false }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Mock markers based on category
  const renderMarkers = () => {
    if (activeCategory === 'Parking') {
        return (
            <>
                <div className="absolute top-1/3 left-1/3 p-2 bg-blue-600 rounded-lg shadow-xl animate-bounce">
                    <div className="flex items-center gap-1 text-white font-bold text-xs"><CircleDollarSign size={12}/> $5.00</div>
                </div>
                <div className="absolute top-1/2 left-2/3 p-2 bg-blue-600 rounded-lg shadow-xl">
                    <div className="flex items-center gap-1 text-white font-bold text-xs"><CircleDollarSign size={12}/> $12.00</div>
                </div>
            </>
        );
    }
    if (activeCategory === 'EV Charging') {
         return (
            <>
                <div className="absolute top-1/4 left-1/2 p-2 bg-green-600 rounded-lg shadow-xl animate-bounce">
                    <div className="flex items-center gap-1 text-white font-bold text-xs"><BatteryCharging size={12}/> Fast</div>
                </div>
                <div className="absolute bottom-1/3 right-1/4 p-2 bg-green-600 rounded-lg shadow-xl">
                    <div className="flex items-center gap-1 text-white font-bold text-xs"><BatteryCharging size={12}/> 150kW</div>
                </div>
            </>
        );
    }
    return null;
  };
  
  // Use a dark map style static image
  if (isWidget) {
    return (
        <div className="h-full w-full bg-zinc-800 rounded-3xl overflow-hidden relative group">
             {/* Map Background */}
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-60"
                style={{ 
                    backgroundImage: `url(https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)` // Dark map like image
                }}
            ></div>
            <div className="absolute inset-0 bg-zinc-900/20"></div>

            {/* Simulated Route Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                <path d="M 50 300 C 150 250, 200 150, 400 100" stroke="#3B82F6" strokeWidth="6" fill="none" strokeLinecap="round" />
            </svg>

             {/* UI Overlays */}
             <div className="absolute top-4 left-4 right-4 bg-zinc-900/90 backdrop-blur-md p-3 rounded-xl border border-zinc-700 flex items-center gap-3 shadow-lg">
                <Navigation className="w-6 h-6 text-green-500 fill-current" />
                <div className="flex-1">
                    <div className="text-white font-bold text-lg leading-tight">1.2 mi</div>
                    <div className="text-zinc-400 text-sm">Turn right on Market St</div>
                </div>
             </div>

             <div className="absolute bottom-4 left-4 bg-zinc-900/90 backdrop-blur-md px-3 py-1 rounded-lg border border-zinc-700">
                <span className="text-green-400 font-bold">14 min</span>
                <span className="text-zinc-400 ml-2 text-sm">10:42 AM</span>
             </div>
        </div>
    );
  }

  // Full App
  return (
    <div className="h-full w-full relative bg-zinc-900">
         {/* Background Map */}
         <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
                backgroundImage: `url(https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)`,
                filter: 'brightness(0.6)'
            }}
        ></div>
        
        {/* Render Fake Pins */}
        {renderMarkers()}

        {/* Header Search */}
        <div className="absolute top-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 z-10">
            <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 rounded-full p-2 flex items-center shadow-2xl focus-within:ring-4 focus-within:ring-blue-500">
                <div className="p-2 ml-1">
                    <Search className="w-6 h-6 text-zinc-400" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search destination..." 
                    className="bg-transparent border-none outline-none text-white text-lg flex-1 px-2 placeholder-zinc-500"
                />
                <button className="p-2 bg-zinc-800 rounded-full text-zinc-300 hover:text-white">
                    <Volume2 className="w-5 h-5" />
                </button>
            </div>
            
            {/* Quick Categories */}
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                {['EV Charging', 'Parking', 'Coffee', 'Restaurants'].map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 backdrop-blur-md border rounded-full whitespace-nowrap text-sm transition-colors focus:ring-4 ring-blue-500
                             ${activeCategory === cat 
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                                : 'bg-zinc-900/90 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white'}
                        `}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        {/* Navigation Info Panel (Bottom Left on big screens, bottom sheet on small) */}
        <div className="absolute bottom-6 left-6 w-80 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 rounded-2xl p-4 shadow-2xl hidden md:block">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center border border-green-700">
                    <Navigation className="w-6 h-6 text-green-400 fill-current" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">24 min</h2>
                    <p className="text-green-500 font-medium">Fastest route</p>
                    <p className="text-zinc-400 text-sm mt-1">10:52 AM arrival • 12 mi</p>
                </div>
            </div>
            <div className="space-y-3">
                 <button className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-colors focus:ring-4 ring-white">
                    End Trip
                 </button>
            </div>
        </div>

         {/* Current Position Marker */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 border-4 border-white rounded-full shadow-lg z-0 animate-pulse"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-45 z-0 mt-[-2px]">
             <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-blue-500"></div>
         </div>
    </div>
  );
};

export default MapsApp;
