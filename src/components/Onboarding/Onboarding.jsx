import React from 'react';
import { Brain, Loader2 } from 'lucide-react';

const Onboarding = ({ obForm, setObForm, isAnalyzing, analyzeProfile }) => {
  return (
    <div className="max-w-2xl w-full animate-fade-in relative z-10 pointer-events-auto">
      <div className="glass-dark p-8 md:p-12 rounded-[3rem] border border-plasma/30 shadow-plasma-glow">
        <div className="w-16 h-16 bg-plasma/10 rounded-2xl border border-plasma/50 flex items-center justify-center mb-8 mx-auto">
          <Brain className="w-8 h-8 text-plasma" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Dostrojenie Kognitywne</h1>
        <p className="text-graphite text-center mb-10 text-lg">
          Jako Twój Cyfrowy Mentor, muszę spersonalizować atmosferę Twojej nauki.
        </p>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold tracking-widest text-plasma mb-3 uppercase">
                Twój dzisiejszy nastrój
              </label>
              <select
                className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-ghost focus:outline-none focus:border-plasma transition-colors"
                value={obForm.mood}
                onChange={(e) => setObForm({ ...obForm, mood: e.target.value })}
              >
                <option value="">Wybierz...</option>
                <option value="motivated">Zmotywowany</option>
                <option value="fatigued">Zmęczony</option>
                <option value="stressed">Zestresowany</option>
                <option value="joyful">Radosny</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest text-plasma mb-3 uppercase">
                Profil Poznawczy
              </label>
              <select
                className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-ghost focus:outline-none focus:border-plasma transition-colors"
                value={obForm.neuroProfile}
                onChange={(e) => setObForm({ ...obForm, neuroProfile: e.target.value })}
              >
                <option value="neurotypical">Neurotypowy</option>
                <option value="adhd">ADHD / Rozproszenie</option>
                <option value="hsp">Wysoka Wrażliwość</option>
                <option value="calm_needed">Potrzeba Wyciszenia</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest text-plasma mb-3 uppercase">
              Twoje Pasje (Temat Atmosfery)
            </label>
            <div className="flex flex-wrap gap-2">
              {['Kosmos', 'Natura', 'Technologia', 'Cyberpunk', 'Minimalizm'].map((interest) => (
                <button
                  key={interest}
                  onClick={() => setObForm({ ...obForm, interests: interest })}
                  className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                    obForm.interests === interest
                      ? 'bg-plasma border-plasma text-void shadow-plasma-glow scale-105'
                      : 'bg-white/5 border-white/10 text-ghost/50 hover:border-white/30'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={analyzeProfile}
              disabled={!obForm.mood || !obForm.interests || isAnalyzing}
              className="w-full bg-white text-void font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-plasma hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-void transition-all uppercase tracking-widest shadow-2xl group"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> ANALIZA NEURONALNA...
                </>
              ) : (
                <>
                  USTAW ATMOSFERĘ <Brain className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
