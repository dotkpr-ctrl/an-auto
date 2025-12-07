
import React from 'react';
import { Map, Music, Phone, Settings, MessageSquare, Radio, Mic, Calendar, Cloud, LogOut, Car, Bike, PlayCircle, ParkingCircle } from 'lucide-react';
import { AppView, VehicleConfig } from '../types';

interface AppDrawerProps {
  onAppSelect: (app: AppView) => void;
  vehicleConfig: VehicleConfig | null;
}

const AppDrawer: React.FC<AppDrawerProps> = ({ onAppSelect, vehicleConfig }) => {
  
  const isBike = vehicleConfig?.type === 'bike';
  const vehicleAppName = vehicleConfig ? `My ${vehicleConfig.brand}` : 'My Vehicle';

  const APPS = [
    { id: AppView.MAPS, name: 'Maps', icon: Map, color: 'bg-green-100 text-green-700' },
    { id: AppView.MUSIC, name: 'Music', icon: Music, color: 'bg-red-100 text-red-600' },
    { id: AppView.PHONE, name: 'Phone', icon: Phone, color: 'bg-blue-100 text-blue-600' },
    { id: AppView.CALENDAR, name: 'Calendar', icon: Calendar, color: 'bg-orange-100 text-orange-600' },
    { id: AppView.VEHICLE, name: vehicleAppName, icon: isBike ? Bike : Car, color: 'bg-zinc-200 text-zinc-800' },
    { id: AppView.VIDEO, name: 'CarTube', icon: PlayCircle, color: 'bg-rose-100 text-rose-600' },
    { id: 'MESSAGES', name: 'Messages', icon: MessageSquare, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'PODCASTS', name: 'Podcasts', icon: Radio, color: 'bg-purple-100 text-purple-600' },
    { id: 'WEATHER', name: 'Weather', icon: Cloud, color: 'bg-sky-100 text-sky-600' },
    { id: 'PARKING', name: 'Parking', icon: ParkingCircle, color: 'bg-emerald-100 text-emerald-600' },
    { id: AppView.SETTINGS, name: 'Settings', icon: Settings, color: 'bg-zinc-800 text-zinc-400' },
    { id: 'ASSISTANT', name: 'Gemini', icon: Mic, color: 'bg-gradient-to-br from-blue-500 to-red-500 text-white' },
    { id: AppView.EXIT, name: 'Exit', icon: LogOut, color: 'bg-zinc-800 text-red-400 border border-zinc-700' },
  ];

  return (
    <div className="h-full w-full overflow-y-auto p-8 bg-black/95 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
        <h2 className="text-2xl font-bold text-white mb-8 pl-4 border-l-4 border-blue-500">All Apps</h2>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-6 sm:gap-10">
            {APPS.map((app) => (
                <button 
                    key={app.id}
                    onClick={() => {
                        // Special handling for Parking (shortcut to maps)
                        if (app.id === 'PARKING') {
                            onAppSelect(AppView.MAPS);
                            return;
                        }

                        // Cast string ID to AppView if it matches, otherwise ignored (mock apps)
                        if (app.id === AppView.EXIT || Object.values(AppView).includes(app.id as AppView)) {
                            onAppSelect(app.id as AppView);
                        }
                    }}
                    className="flex flex-col items-center gap-4 group outline-none"
                >
                    <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl ${app.color} flex items-center justify-center shadow-lg group-hover:scale-105 group-active:scale-95 transition-all duration-200 group-focus:ring-4 ring-blue-500`}>
                        <app.icon className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={2.5} />
                    </div>
                    <span className="text-zinc-300 font-medium text-lg group-hover:text-white">{app.name}</span>
                </button>
            ))}
        </div>
    </div>
  );
};

export default AppDrawer;
