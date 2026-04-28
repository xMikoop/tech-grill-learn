import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { ATMOSPHERES } from '../lib/immersionConfig';
import { Palette, CheckCircle2 } from 'lucide-react';

const Settings = () => {
  const { activeAtmosphere, setActiveAtmosphere, setView } = useAppStore();

  return (
    <div data-testid="settings-page" className="animate-fade-in max-w-4xl mx-auto pointer-events-auto">
      <header className="mb-12">
        <h2 className="text-4xl font-serif italic mb-4">Centrum Personalizacji</h2>
        <p className="text-ghost/50 text-lg">Dostosuj otaczający Cię wszechświat do swojego nastroju.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(ATMOSPHERES).map(([key, atmos]) => (
          <button
            key={key}
            onClick={() => setActiveAtmosphere(atmos)}
            className={`glass p-6 rounded-[2rem] border transition-all text-left group relative overflow-hidden ${
              activeAtmosphere?.name === atmos.name ? 'border-plasma bg-plasma/10' : 'border-white/5 hover:border-white/20'
            }`}
          >
            {activeAtmosphere?.name === atmos.name && (
              <div className="absolute top-4 right-4 text-plasma">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            )}
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 transition-transform group-hover:scale-110" style={{ background: atmos.bg, borderColor: atmos.accent }}>
                <Palette className="w-6 h-6" style={{ color: atmos.accent }} />
              </div>
              <div>
                <h3 className="font-bold text-lg">{atmos.name}</h3>
                <div className="text-[10px] font-black uppercase tracking-widest text-plasma/60">{atmos.animation} engine</div>
              </div>
            </div>
            
            <p className="text-xs text-ghost/50 leading-relaxed mb-6">{atmos.why}</p>
            
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: atmos.accent }} />
               <div className="text-[10px] font-bold uppercase tracking-tighter text-ghost/30">Primary Pulse Color</div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          onClick={() => setView('dashboard')}
          className="bg-white text-void px-12 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-plasma hover:text-white transition-all shadow-2xl"
        >
          Powrót do nauki
        </button>
      </div>
    </div>
  );
};

export default Settings;
