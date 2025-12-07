
import React from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, ChevronRight } from 'lucide-react';

interface CalendarAppProps {
  onNavigateToLocation: () => void;
}

const CalendarApp: React.FC<CalendarAppProps> = ({ onNavigateToLocation }) => {
  const EVENTS = [
    { id: 1, title: 'Team Sync', time: '10:00 AM', duration: '30 min', location: 'Office HQ', type: 'Work' },
    { id: 2, title: 'Lunch with Client', time: '12:30 PM', duration: '1 hr', location: 'Bistro Downtown', type: 'Personal' },
    { id: 3, title: 'Dentist Appointment', time: '03:00 PM', duration: '45 min', location: 'Smile Clinic', type: 'Health' },
    { id: 4, title: 'Pick up Groceries', time: '05:30 PM', duration: '1 hr', location: 'Whole Foods Market', type: 'Personal' },
  ];

  return (
    <div className="h-full w-full bg-black p-6 flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center">
            <CalendarIcon className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-white">Today's Agenda</h1>
      </div>

      <div className="grid gap-4 max-w-4xl">
        {EVENTS.map((evt) => (
          <div key={evt.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-6 group hover:bg-zinc-800 transition-colors focus-within:ring-4 focus-within:ring-blue-500">
            <div className="flex flex-col items-center min-w-[80px]">
                <span className="text-xl font-bold text-white">{evt.time.split(' ')[0]}</span>
                <span className="text-xs text-zinc-500 font-medium uppercase">{evt.time.split(' ')[1]}</span>
            </div>
            
            <div className="w-1 h-12 bg-zinc-800 rounded-full"></div>

            <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-1">{evt.title}</h3>
                <div className="flex items-center gap-4 text-zinc-400 text-sm">
                    <span className="flex items-center gap-1"><Clock size={14}/> {evt.duration}</span>
                    <span className="flex items-center gap-1"><MapPin size={14}/> {evt.location}</span>
                </div>
            </div>

            <button 
                onClick={onNavigateToLocation}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-transform active:scale-95"
            >
                <NavigationIcon size={18} />
                <span>Go</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper icon
const NavigationIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
);

export default CalendarApp;
