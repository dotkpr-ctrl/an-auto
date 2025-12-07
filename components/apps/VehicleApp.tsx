
import React, { useState } from 'react';
import { Car, Lock, Unlock, Fuel, Gauge, AlertTriangle, Fan, Thermometer, Bike, Droplets, CheckCircle2 } from 'lucide-react';
import { VehicleConfig } from '../../types';

interface VehicleAppProps {
    config: VehicleConfig | null;
    onSave: (config: VehicleConfig) => void;
}

const BRANDS = {
    cars: [
        { name: 'Maruti Suzuki', models: ['Swift', 'Baleno', 'Brezza', 'Grand Vitara', 'Fronx', 'Jimny', 'Ertiga', 'Alto K10', 'Dzire'] },
        { name: 'Tata Motors', models: ['Nexon', 'Punch', 'Harrier', 'Safari', 'Tiago', 'Altroz', 'Curvv', 'Tigor'] },
        { name: 'Mahindra', models: ['Thar', 'Scorpio-N', 'XUV700', 'Bolero', 'XUV 3XO', 'Thar Roxx', 'XUV400'] },
        { name: 'Hyundai', models: ['Creta', 'Venue', 'i20', 'Verna', 'Exter', 'Alcazar', 'Tucson', 'Ioniq 5'] },
        { name: 'Kia', models: ['Seltos', 'Sonet', 'Carens', 'EV6', 'Carnival'] },
        { name: 'Toyota', models: ['Innova Crysta', 'Fortuner', 'Hyryder', 'Glanza', 'Rumion', 'Camry', 'Hilux'] },
        { name: 'Honda', models: ['City', 'Amaze', 'Elevate'] },
        { name: 'Volkswagen', models: ['Virtus', 'Taigun', 'Tiguan'] },
        { name: 'Skoda', models: ['Slavia', 'Kushaq', 'Kodiaq', 'Superb'] },
        { name: 'MG', models: ['Hector', 'Astor', 'Comet EV', 'ZS EV', 'Gloster'] }
    ],
    bikes: [
        { name: 'Royal Enfield', models: ['Classic 350', 'Bullet 350', 'Hunter 350', 'Himalayan 450', 'Meteor 350', 'Continental GT 650', 'Interceptor 650', 'Super Meteor 650'] },
        { name: 'Hero', models: ['Splendor+', 'HF Deluxe', 'Xtreme 125R', 'Karizma XMR', 'Mavrick 440', 'Passion+', 'Pleasure+'] },
        { name: 'Honda', models: ['Activa 6G', 'Shine 125', 'SP 125', 'Dio', 'CB350 RS', 'Hness CB350', 'Hornet 2.0', 'Unicorn'] },
        { name: 'Bajaj', models: ['Pulsar N160', 'Pulsar NS200', 'Pulsar 150', 'Dominar 400', 'Avenger 220', 'Platina 110', 'Chetak EV', 'Freedom 125'] },
        { name: 'TVS', models: ['Apache RTR 160 4V', 'Apache RR 310', 'Raider 125', 'Jupiter 125', 'Ntorq 125', 'Ronin', 'iQube'] },
        { name: 'Yamaha', models: ['R15 V4', 'MT-15 V2', 'FZ-S Fi V4', 'Aerox 155', 'Fasino 125', 'RayZR 125'] },
        { name: 'KTM', models: ['Duke 390', 'Duke 200', 'RC 390', 'RC 200', '390 Adventure'] },
        { name: 'Suzuki', models: ['Access 125', 'Burgman Street', 'Gixxer SF 250', 'V-Strom SX'] },
        { name: 'Jawa / Yezdi', models: ['Jawa 42', 'Perak', 'Yezdi Roadster', 'Yezdi Adventure', 'Yezdi Scrambler'] },
        { name: 'Ather', models: ['450X', 'Rizta', '450S'] }
    ]
};

const VehicleApp: React.FC<VehicleAppProps> = ({ config, onSave }) => {
  const [locked, setLocked] = useState(true);
  const [isSetupMode, setIsSetupMode] = useState(!config);
  
  // Setup State
  const [selectedType, setSelectedType] = useState<'car' | 'bike'>('car');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');

  const handleSave = () => {
    if (selectedBrand && selectedModel) {
        onSave({
            brand: selectedBrand,
            model: selectedModel,
            type: selectedType,
            year: new Date().getFullYear().toString()
        });
        setIsSetupMode(false);
    }
  };

  // Setup Wizard UI
  if (isSetupMode) {
      const currentBrands = selectedType === 'car' ? BRANDS.cars : BRANDS.bikes;
      const currentModels = currentBrands.find(b => b.name === selectedBrand)?.models || [];

      return (
        <div className="h-full w-full bg-black p-8 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 overflow-y-auto">
             <div className="max-w-4xl w-full bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-2xl flex flex-col max-h-full">
                <div className="shrink-0">
                    <h1 className="text-3xl font-bold text-white mb-2">Vehicle Setup</h1>
                    <p className="text-zinc-400 mb-8">Select your vehicle to customize your experience.</p>

                    {/* Type Selection */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button 
                            onClick={() => { setSelectedType('car'); setSelectedBrand(''); setSelectedModel(''); }}
                            className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${selectedType === 'car' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-zinc-700 bg-zinc-800 text-zinc-400'}`}
                        >
                            <Car size={32} />
                            <span className="font-bold">Car</span>
                        </button>
                        <button 
                            onClick={() => { setSelectedType('bike'); setSelectedBrand(''); setSelectedModel(''); }}
                            className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${selectedType === 'bike' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-zinc-700 bg-zinc-800 text-zinc-400'}`}
                        >
                            <Bike size={32} />
                            <span className="font-bold">Bike</span>
                        </button>
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar min-h-0">
                    {/* Brand Selection */}
                    <div className="mb-6">
                        <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3 block sticky top-0 bg-zinc-900 py-2 z-10">Select Brand</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {currentBrands.map(b => (
                                <button
                                    key={b.name}
                                    onClick={() => { setSelectedBrand(b.name); setSelectedModel(''); }}
                                    className={`px-4 py-4 rounded-xl text-sm font-medium transition-all text-center border-2 ${selectedBrand === b.name ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'border-zinc-800 bg-zinc-800/50 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'}`}
                                >
                                    {b.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Model Selection */}
                    {selectedBrand && (
                        <div className="mb-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3 block sticky top-0 bg-zinc-900 py-2 z-10">Select Model ({selectedBrand})</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {currentModels.map(m => (
                                    <button
                                        key={m}
                                        onClick={() => setSelectedModel(m)}
                                        className={`px-4 py-4 rounded-xl text-sm font-medium transition-all text-center border-2 ${selectedModel === m ? 'border-white bg-white text-black shadow-lg' : 'border-zinc-800 bg-zinc-800/50 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="shrink-0 pt-6 mt-2 border-t border-zinc-800">
                    <button 
                        onClick={handleSave}
                        disabled={!selectedModel}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-blue-900/20"
                    >
                        Save Vehicle
                    </button>
                </div>
             </div>
        </div>
      );
  }

  // Active Vehicle View
  const isBike = config?.type === 'bike';

  return (
    <div className="h-full w-full bg-black p-4 sm:p-8 flex flex-col md:flex-row gap-6 overflow-y-auto">
        
        {/* Left Col: Vehicle Status */}
        <div className="flex-1 flex flex-col gap-6">
            
            {/* 3D Model Placeholder / Main Visual */}
            <div className="flex-1 bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-3xl relative flex items-center justify-center border border-zinc-700 overflow-hidden group min-h-[300px]">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity z-10">
                     <button onClick={() => setIsSetupMode(true)} className="text-xs font-bold text-zinc-400 hover:text-white border border-zinc-600 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                        CHANGE
                     </button>
                </div>

                {isBike ? (
                    <Bike className="w-64 h-64 text-zinc-500 drop-shadow-2xl" strokeWidth={0.5} />
                ) : (
                    <Car className="w-64 h-64 text-zinc-500 drop-shadow-2xl" strokeWidth={0.5} />
                )}
                
                <div className="absolute top-6 left-6 z-10">
                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg">{config?.brand}</h2>
                    <p className="text-xl text-blue-400 font-bold drop-shadow-lg">{config?.model}</p>
                    <p className="text-zinc-500 text-sm mt-1 flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-green-500"/> Connected via Bluetooth
                    </p>
                </div>
                
                {/* Floating Tags */}
                <div className="absolute bottom-6 left-6 flex gap-2 z-10">
                    <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-600 flex items-center gap-2 text-sm text-white">
                        <Thermometer size={14} className="text-orange-500"/> 195°F Engine
                    </div>
                </div>
            </div>

            {/* Controls (Key/Start) */}
            <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shrink-0">
                <h3 className="text-lg font-medium text-zinc-400 mb-4 uppercase tracking-wider">Remote Controls</h3>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setLocked(true)}
                        className={`flex-1 py-6 rounded-2xl flex flex-col items-center gap-2 transition-all ${locked ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                    >
                        <Lock size={32} className={locked ? 'fill-current' : ''} />
                        <span className="font-bold">{isBike ? 'Alarm On' : 'Lock'}</span>
                    </button>
                    <button 
                        onClick={() => setLocked(false)}
                        className={`flex-1 py-6 rounded-2xl flex flex-col items-center gap-2 transition-all ${!locked ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                    >
                        <Unlock size={32} className={!locked ? 'fill-current' : ''} />
                        <span className="font-bold">{isBike ? 'Alarm Off' : 'Unlock'}</span>
                    </button>
                    {!isBike && (
                        <button className="flex-1 py-6 rounded-2xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 flex flex-col items-center gap-2 transition-all">
                            <Fan size={32} />
                            <span className="font-bold">Climate</span>
                        </button>
                    )}
                </div>
            </div>
        </div>

        {/* Right Col: Diagnostics Grid (ICE Focused) */}
        <div className="w-full md:w-96 flex flex-col gap-4 shrink-0">
             {/* Fuel / Range */}
             <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center">
                        <Fuel size={24} />
                    </div>
                    <div>
                        <div className="text-white font-bold text-lg">Fuel Range</div>
                        <div className="text-zinc-400">345 km</div>
                    </div>
                </div>
                <div className="text-2xl font-bold text-white">72%</div>
             </div>

             {/* Oil Life */}
             <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-700/50 text-zinc-300 flex items-center justify-center">
                        <Droplets size={24} />
                    </div>
                    <div>
                        <div className="text-white font-bold text-lg">Oil Life</div>
                        <div className="text-zinc-400">Good</div>
                    </div>
                </div>
                <div className="text-zinc-500 font-bold">88%</div>
             </div>

             {/* Tire Pressure */}
             <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-yellow-500" />
                    Tire Pressure (PSI)
                </h3>
                {isBike ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-800 p-3 rounded-xl flex justify-between items-center">
                            <span className="text-zinc-500 font-bold">Front</span>
                            <span className="text-white font-mono">28</span>
                        </div>
                        <div className="bg-zinc-800 p-3 rounded-xl flex justify-between items-center">
                            <span className="text-zinc-500 font-bold">Rear</span>
                            <span className="text-white font-mono">32</span>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {['FL', 'FR', 'RL', 'RR'].map((tire) => (
                            <div key={tire} className="bg-zinc-800 p-3 rounded-xl flex justify-between items-center">
                                <span className="text-zinc-500 font-bold">{tire}</span>
                                <span className="text-white font-mono">33</span>
                            </div>
                        ))}
                    </div>
                )}
             </div>

             {/* Odometer */}
             <div className="flex-1 bg-zinc-900 rounded-3xl border border-zinc-800 p-6 flex flex-col justify-center items-center text-center">
                <Gauge className="w-8 h-8 text-zinc-600 mb-2" />
                <div className="text-4xl font-mono text-white mb-1">12,403</div>
                <div className="text-zinc-500 uppercase tracking-widest text-sm font-bold">Odometer (km)</div>
             </div>
        </div>
    </div>
  );
};

export default VehicleApp;
