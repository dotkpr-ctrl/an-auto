import React from 'react';
import MapsApp from './apps/MapsApp';
import MusicApp from './apps/MusicApp';
import { CloudRain, Calendar, Bell } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="h-full w-full p-2 sm:p-4 gap-2 sm:gap-4 grid grid-cols-12 grid-rows-6">
        
        {/* Main Card (Maps) - Takes 7/12 width on large, full on mobile top half */}
        <div className="col-span-12 md:col-span-7 row-span-4 md:row-span-6 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 relative bg-zinc-900">
             <MapsApp isWidget={true} />
        </div>

        {/* Side Stack (Media & Context) */}
        <div className="col-span-12 md:col-span-5 row-span-2 md:row-span-6 flex flex-row md:flex-col gap-2 sm:gap-4">
            
            {/* Context Cards (Weather/Calendar) */}
            <div className="flex-1 md:flex-none md:h-1/3 flex gap-2 sm:gap-4">
                 <div className="flex-1 bg-zinc-800 rounded-3xl p-4 flex flex-col justify-between border border-zinc-700/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><CloudRain size={64} /></div>
                    <div className="text-zinc-400 text-sm font-medium">San Francisco</div>
                    <div>
                        <div className="text-4xl font-bold text-white">68°</div>
                        <div className="text-zinc-300">Light Rain</div>
                    </div>
                 </div>
                 
                 <div className="flex-1 bg-zinc-800 rounded-3xl p-4 flex flex-col justify-between border border-zinc-700/50 relative overflow-hidden group hover:bg-zinc-700 transition-colors cursor-pointer">
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="text-zinc-400 text-sm font-medium uppercase tracking-wide flex items-center gap-2">
                        <Calendar size={14} /> Next
                    </div>
                    <div>
                        <div className="text-lg font-bold text-white leading-tight mb-1">Weekly Sync</div>
                        <div className="text-zinc-400 text-sm">11:00 AM • Teams</div>
                    </div>
                 </div>
            </div>

            {/* Media Widget */}
            <div className="flex-1 md:h-2/3 border border-zinc-800 rounded-3xl overflow-hidden shadow-lg">
                <MusicApp isWidget={true} />
            </div>

        </div>
    </div>
  );
};

export default Dashboard;