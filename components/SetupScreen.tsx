
import React, { useState } from 'react';
import { Wifi, Loader2, Bluetooth, Radio, CarFront, Bike } from 'lucide-react';
import { VehicleConfig } from '../types';

interface SetupScreenProps {
  onConnect: () => void;
  vehicleConfig: VehicleConfig | null;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onConnect, vehicleConfig }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate faster wireless handshake
    setTimeout(() => {
      onConnect();
    }, 1200);
  };

  const BrandIcon = vehicleConfig?.type === 'bike' ? Bike : CarFront;

  return (
    <div className="h-full w-full bg-black flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black pointer-events-none"></div>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="relative z-10 flex flex-col items-center max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Logo Area */}
            <div className="w-32 h-32 bg-zinc-800 rounded-3xl flex items-center justify-center mb-8 shadow-2xl border border-zinc-700 relative group overflow-hidden">
                {vehicleConfig ? (
                   <div className="flex flex-col items-center">
                     <BrandIcon className="w-12 h-12 text-white mb-2" />
                     <span className="text-xl font-black text-white uppercase tracking-wider">{vehicleConfig.brand}</span>
                   </div>
                ) : (
                    <Wifi className="w-12 h-12 text-blue-500 relative z-10" />
                )}
                
                {isConnecting && (
                    <div className="absolute inset-0 rounded-3xl animate-pulse ring-4 ring-blue-500/30"></div>
                )}
            </div>

            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                {vehicleConfig ? `${vehicleConfig.brand} Connect` : 'Android Auto'}
            </h1>
            <p className="text-zinc-400 text-lg mb-12">
                {vehicleConfig 
                    ? `Ready to pair with ${vehicleConfig.model}.` 
                    : 'Wireless Android Auto available.'}
            </p>

            {/* Connection Status Area */}
            <div className="h-24 w-full flex flex-col items-center justify-center">
                {isConnecting ? (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                        <p className="text-blue-400 font-medium">Authenticating...</p>
                    </div>
                ) : (
                    <button 
                        onClick={handleConnect}
                        className="group relative flex items-center gap-4 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-900/40 active:scale-95 hover:shadow-blue-500/20"
                    >
                        <span>Connect {vehicleConfig?.type === 'bike' ? 'Headset' : 'Phone'}</span>
                        <Radio className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                )}
            </div>

            {/* Footer Info */}
            <div className="mt-16 flex gap-8 text-zinc-600 justify-center">
                 <div className="flex items-center gap-2 text-sm font-medium text-blue-500/80">
                    <Wifi className="w-4 h-4" /> 5GHz Wi-Fi
                 </div>
                 <div className="flex items-center gap-2 text-sm font-medium">
                    <Bluetooth className="w-4 h-4" /> Bluetooth
                 </div>
            </div>
        </div>
    </div>
  );
};

export default SetupScreen;
