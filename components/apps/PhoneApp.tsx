import React from 'react';
import { Phone, User, Star, Clock, Delete } from 'lucide-react';

const CONTACTS = [
    { id: '1', name: 'Mom', number: 'Mobile', avatar: null },
    { id: '2', name: 'John Doe', number: 'Work', avatar: null },
    { id: '3', name: 'Alice Smith', number: 'Mobile', avatar: null },
    { id: '4', name: 'Emergency', number: '911', avatar: null },
];

const PhoneApp: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'favorites' | 'recents' | 'contacts' | 'keypad'>('favorites');
  const [dialNumber, setDialNumber] = React.useState('');

  const KeypadButton = ({ val, sub }: { val: string, sub?: string }) => (
    <button 
        onClick={() => setDialNumber(prev => prev + val)}
        className="w-20 h-20 rounded-full bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 flex flex-col items-center justify-center transition-colors"
    >
        <span className="text-3xl font-medium text-white">{val}</span>
        {sub && <span className="text-xs text-zinc-500 font-bold tracking-widest">{sub}</span>}
    </button>
  );

  return (
    <div className="h-full w-full bg-black flex">
        {/* Sidebar Tabs */}
        <div className="w-24 border-r border-zinc-900 flex flex-col items-center pt-8 gap-8">
            <button onClick={() => setActiveTab('favorites')} className={`flex flex-col items-center gap-1 ${activeTab === 'favorites' ? 'text-blue-400' : 'text-zinc-500'}`}>
                <Star className={`w-8 h-8 ${activeTab === 'favorites' ? 'fill-current' : ''}`} />
                <span className="text-xs font-medium">Favorites</span>
            </button>
            <button onClick={() => setActiveTab('recents')} className={`flex flex-col items-center gap-1 ${activeTab === 'recents' ? 'text-blue-400' : 'text-zinc-500'}`}>
                <Clock className="w-8 h-8" />
                <span className="text-xs font-medium">Recents</span>
            </button>
            <button onClick={() => setActiveTab('contacts')} className={`flex flex-col items-center gap-1 ${activeTab === 'contacts' ? 'text-blue-400' : 'text-zinc-500'}`}>
                <User className="w-8 h-8" />
                <span className="text-xs font-medium">Contacts</span>
            </button>
            <div className="flex-1"></div>
            <button onClick={() => setActiveTab('keypad')} className={`flex flex-col items-center gap-1 mb-8 ${activeTab === 'keypad' ? 'text-blue-400' : 'text-zinc-500'}`}>
                <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-0.5 w-5">
                        {[...Array(9)].map((_, i) => <div key={i} className="w-1 h-1 bg-current rounded-full"></div>)}
                    </div>
                </div>
                <span className="text-xs font-medium">Keypad</span>
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col">
            {activeTab === 'keypad' ? (
                <div className="h-full flex flex-col items-center justify-center max-w-md mx-auto w-full">
                    <div className="w-full h-20 mb-8 flex items-center justify-center relative border-b border-zinc-800">
                        <span className="text-4xl text-white font-mono tracking-wider">{dialNumber}</span>
                        {dialNumber && (
                            <button 
                                onClick={() => setDialNumber(prev => prev.slice(0, -1))}
                                className="absolute right-0 p-4 text-zinc-500 hover:text-white"
                            >
                                <Delete className="w-8 h-8" />
                            </button>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <KeypadButton val="1" />
                        <KeypadButton val="2" sub="ABC" />
                        <KeypadButton val="3" sub="DEF" />
                        <KeypadButton val="4" sub="GHI" />
                        <KeypadButton val="5" sub="JKL" />
                        <KeypadButton val="6" sub="MNO" />
                        <KeypadButton val="7" sub="PQRS" />
                        <KeypadButton val="8" sub="TUV" />
                        <KeypadButton val="9" sub="WXYZ" />
                        <KeypadButton val="*" />
                        <KeypadButton val="0" sub="+" />
                        <KeypadButton val="#" />
                    </div>

                    <button className="w-20 h-20 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center shadow-lg shadow-green-900/50 transition-colors">
                        <Phone className="w-10 h-10 fill-current text-black" />
                    </button>
                </div>
            ) : (
                <div className="h-full overflow-y-auto">
                    <h2 className="text-2xl font-bold text-white mb-6 capitalize">{activeTab}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {CONTACTS.map(contact => (
                            <div key={contact.id} className="bg-zinc-900 p-4 rounded-2xl flex items-center gap-4 active:scale-95 transition-transform cursor-pointer border border-zinc-800 hover:border-zinc-600">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                                    {contact.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-white">{contact.name}</h3>
                                    <p className="text-zinc-400">{contact.number}</p>
                                </div>
                                <button className="p-3 bg-green-900/30 text-green-400 rounded-full hover:bg-green-900/50">
                                    <Phone className="w-6 h-6 fill-current" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default PhoneApp;