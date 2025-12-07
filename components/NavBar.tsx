
import React from 'react';
import { LayoutGrid, Map, Music, Phone, Mic, Home, Signal, Wifi, Battery } from 'lucide-react';
import { AppView } from '../types';

interface NavBarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onAssistantClick: () => void;
  isParked: boolean;
  onTogglePark: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentView, onNavigate, onAssistantClick, isParked, onTogglePark }) => {
  
  const NavButton = ({ view, icon: Icon, active }: { view: AppView | 'ASSISTANT' | 'HOME', icon: any, active?: boolean }) => {
    const isHome = view === 'HOME';
    const isAssistant = view === 'ASSISTANT';
    
    const handleClick = () => {
        if (isAssistant) onAssistantClick();
        else if (isHome) onNavigate(AppView.DASHBOARD);
        else onNavigate(view as AppView);
    };

    return (
        <button 
            onClick={handleClick}
            className={`flex flex-col items-center justify-center h-full w-20 sm:w-24 transition-all duration-200 relative focus:bg-white/10 outline-none
                ${active ? 'text-blue-400 bg-white/5' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}
            `}
        >
            <Icon className={`w-8 h-8 ${active ? 'fill-current' : ''}`} strokeWidth={2} />
            {active && <div className="absolute bottom-0 w-full h-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>}
        </button>
    );
  };

  return (
    <div className="h-20 sm:h-24 bg-black border-t border-zinc-900 flex items-center justify-between px-2 shrink-0 z-40 relative">
        
        {/* App Launcher / Home */}
        <div className="flex items-center h-full">
            <NavButton 
                view={AppView.DRAWER} 
                icon={LayoutGrid} 
                active={currentView === AppView.DRAWER} 
            />
             {/* Dynamic Recents/Shortcuts - Only show on wider screens */}
             <div className="hidden md:flex h-full border-l border-zinc-800 mx-2">
                <NavButton view={AppView.MAPS} icon={Map} active={currentView === AppView.MAPS} />
                <NavButton view={AppView.MUSIC} icon={Music} active={currentView === AppView.MUSIC} />
                <NavButton view={AppView.PHONE} icon={Phone} active={currentView === AppView.PHONE} />
            </div>
        </div>

        {/* Center - Assistant Trigger (Primary CTA) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
             <button 
                onClick={onAssistantClick}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/40 hover:scale-105 active:scale-95 transition-transform focus:ring-4 ring-white"
             >
                 <Mic className="w-8 h-8" />
             </button>
        </div>

        {/* Status / Gear Selector / Home */}
        <div className="flex items-center h-full space-x-6 pr-6">
            
            {/* Gear Selector (Park/Drive Simulation) */}
            <div className="hidden lg:flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                <button 
                    onClick={() => !isParked && onTogglePark()}
                    className={`px-3 py-1 rounded font-bold text-sm transition-all ${isParked ? 'bg-red-600 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    P
                </button>
                <div className="w-px bg-zinc-800 mx-1"></div>
                <button 
                     onClick={() => isParked && onTogglePark()}
                    className={`px-3 py-1 rounded font-bold text-sm transition-all ${!isParked ? 'bg-green-600 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    D
                </button>
            </div>

            {/* Device Info */}
            <div className="flex flex-col items-end justify-center">
                <div className="text-xl font-bold text-white leading-none">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs font-medium text-zinc-500 hidden sm:inline-block">Pixel 8 Pro</span>
                    <div className="flex items-center space-x-1.5 text-zinc-400">
                        <Wifi className="w-4 h-4" />
                        <Signal className="w-4 h-4" />
                        <Battery className="w-4 h-4" />
                    </div>
                </div>
            </div>
            
            <button 
                onClick={() => onNavigate(AppView.DASHBOARD)}
                className={`hidden sm:flex p-3 rounded-full border-2 transition-colors focus:bg-zinc-700 ${currentView === AppView.DASHBOARD ? 'border-zinc-500 bg-zinc-800 text-white' : 'border-zinc-700 text-zinc-500 hover:border-zinc-500'}`}
            >
                <Home className="w-6 h-6" />
            </button>
        </div>
    </div>
  );
};

export default NavBar;
