
import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import AppDrawer from './components/AppDrawer';
import MusicApp from './components/apps/MusicApp';
import MapsApp from './components/apps/MapsApp';
import PhoneApp from './components/apps/PhoneApp';
import CalendarApp from './components/apps/CalendarApp';
import VehicleApp from './components/apps/VehicleApp';
import VideoApp from './components/apps/VideoApp';
import AssistantModal from './components/AssistantModal';
import SetupScreen from './components/SetupScreen';
import { AppView, VehicleConfig } from './types';
import { useLiveAssistant } from './hooks/useLiveAssistant';

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isParked, setIsParked] = useState(true); // Default to Parked to show features
  
  // Vehicle Persistence
  const [vehicleConfig, setVehicleConfig] = useState<VehicleConfig | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('autoos_vehicle_config');
    if (saved) {
      try {
        setVehicleConfig(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse vehicle config");
      }
    }
  }, []);

  const handleSaveVehicle = (config: VehicleConfig) => {
    setVehicleConfig(config);
    localStorage.setItem('autoos_vehicle_config', JSON.stringify(config));
  };

  // Initialize Assistant Hook
  const { connect, disconnect, status, isSpeaking, volume } = useLiveAssistant();

  const handleAssistantToggle = () => {
    if (isAssistantOpen) {
        setIsAssistantOpen(false);
        disconnect();
    } else {
        setIsAssistantOpen(true);
        // connection is handled by the Modal's effect or user action inside
    }
  };

  const handleNavigate = (view: AppView) => {
    if (view === AppView.EXIT) {
        setIsConnected(false);
        setCurrentView(AppView.DASHBOARD);
        disconnect(); // Disconnect assistant if active
    } else {
        setCurrentView(view);
    }
  };

  const renderContent = () => {
    switch (currentView) {
        case AppView.DASHBOARD:
            return <Dashboard />;
        case AppView.DRAWER:
            return <AppDrawer onAppSelect={handleNavigate} vehicleConfig={vehicleConfig} />;
        case AppView.MUSIC:
            return <MusicApp />;
        case AppView.MAPS:
            return <MapsApp />;
        case AppView.PHONE:
            return <PhoneApp />;
        case AppView.CALENDAR:
            return <CalendarApp onNavigateToLocation={() => handleNavigate(AppView.MAPS)} />;
        case AppView.VEHICLE:
            return <VehicleApp config={vehicleConfig} onSave={handleSaveVehicle} />;
        case AppView.VIDEO:
            return <VideoApp isParked={isParked} />;
        case AppView.SETTINGS:
            return <div className="flex items-center justify-center h-full text-zinc-500">Settings Unavailable in Demo</div>;
        default:
            return <Dashboard />;
    }
  };

  if (!isConnected) {
    return <SetupScreen onConnect={() => setIsConnected(true)} vehicleConfig={vehicleConfig} />;
  }

  return (
    <div className="h-screen w-screen bg-black flex flex-col overflow-hidden relative selection:bg-blue-500 selection:text-white animate-in fade-in duration-700">
        
        {/* Main Content Area */}
        <div className="flex-1 relative overflow-hidden z-0">
            {renderContent()}
        </div>

        {/* Assistant Overlay */}
        <AssistantModal 
            isOpen={isAssistantOpen} 
            onClose={() => { setIsAssistantOpen(false); disconnect(); }}
            status={status}
            isSpeaking={isSpeaking}
            volume={volume}
            onConnect={connect}
        />

        {/* Navigation Bar */}
        <NavBar 
            currentView={currentView} 
            onNavigate={handleNavigate}
            onAssistantClick={handleAssistantToggle}
            isParked={isParked}
            onTogglePark={() => setIsParked(!isParked)}
        />
        
        {/* Permission / Env Warning Overlay (Optional, good for dev) */}
        {!process.env.API_KEY && (
            <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center p-2 z-[60] font-bold">
                WARNING: process.env.API_KEY is missing. Voice Assistant will not work.
            </div>
        )}
    </div>
  );
};

export default App;
