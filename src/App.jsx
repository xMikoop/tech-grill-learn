import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Shield, Clock, Terminal, CheckCircle, ChevronRight, Trophy, ArrowLeft, 
  Database, Brain, Workflow, Rocket, Music, Play, Pause, Volume2, VolumeX, 
  Loader2, Send, MessageSquare, BookOpen, Star, History, LayoutDashboard, 
  LogOut, Lock, Unlock, User as UserIcon
} from 'lucide-react';
import { lessons } from './data';
import { auth, signInWithGoogle, logout } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import gsap from 'gsap';

// --- VISUAL CONSTANTS ---
const STATIC_STARS = Array.from({ length: 200 }).map((_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: `${Math.random() * 2 + 1}px`,
  duration: `${Math.random() * 3 + 2}s`,
}));

// --- PERSISTENT BACKGROUND COMPONENTS ---

const StarField = React.memo(() => (
  <div className="star-field pointer-events-none absolute inset-0">
    {STATIC_STARS.map(star => (
      <div key={star.id} className="star" style={{ top: star.top, left: star.left, width: star.size, height: star.size, '--duration': star.duration }} />
    ))}
  </div>
));

const Universe3D = React.memo(({ active }) => {
  const cameraRef = useRef(null);
  useEffect(() => {
    if (!cameraRef.current || !active) return;
    const ctx = gsap.context(() => {
      gsap.to(cameraRef.current, {
        rotationY: 8, rotationX: 2, x: 40, z: 50,
        duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut"
      });
    });
    return () => ctx.revert();
  }, [active]);

  return (
    <div className={`universe-container ${active ? 'active' : ''}`}>
      <div ref={cameraRef} className="universe-camera">
        <StarField />
        
        {/* Sun */}
        <div className="sun planet" style={{ top: '5%', left: '5%', transform: 'translateZ(-900px)' }} />

        {/* Saturn */}
        <div style={{ position: 'absolute', top: '55%', left: '15%', transform: 'translateZ(-400px)', transformStyle: 'preserve-3d' }}>
          <div className="planet saturn"><div className="saturn-rings" /></div>
        </div>

        {/* Jupiter */}
        <div style={{ position: 'absolute', top: '25%', right: '10%', transform: 'translateZ(-100px)', transformStyle: 'preserve-3d' }}>
          <div className="planet jovian animate-spin-slow" />
        </div>

        {/* Black Hole */}
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', transform: 'translateZ(-600px)', transformStyle: 'preserve-3d' }}>
          <div className="black-hole-core" />
        </div>

        {/* Earth */}
        <div style={{ position: 'absolute', bottom: '15%', left: '40%', transform: 'translateZ(300px)', transformStyle: 'preserve-3d' }}>
          <div className="planet earth" style={{ width: '45px', height: '45px', background: 'radial-gradient(circle at 30% 30%, #4b9cd3, #004d99)' }} />
        </div>
      </div>
    </div>
  );
});

// --- MAIN APPLICATION ---

const App = () => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(null);
  const [xp, setXp] = useState(() => { try { return parseInt(localStorage.getItem('tg_xp') || '0'); } catch(e) { return 0; } });
  const [view, setView] = useState(() => localStorage.getItem('tg_view') || 'onboarding');
  const [unlockedConcepts, setUnlockedConcepts] = useState({});
  const [completedModules, setCompletedModules] = useState(() => { try { const saved = localStorage.getItem('tg_completed'); return saved ? JSON.parse(saved) : []; } catch(e) { return []; } });
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showAchievement, setShowAchievement] = useState(null);
  const [showSupernova, setShowSupernova] = useState(false);
  const [savedLinks, setSavedLinks] = useState([]);
  const [linkInput, setLinkInput] = useState('');
  const [linkTitle, setLinkTitle] = useState('');

  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const [obForm, setObForm] = useState({ mood: '', neuroProfile: 'neurotypical', interests: '', calm: '' });
  const [activeAtmosphere, setActiveAtmosphere] = useState(() => { try { const saved = localStorage.getItem('tg_atmosphere'); return saved ? JSON.parse(saved) : null; } catch(e) { return null; } });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [musicConfig, setMusicConfig] = useState(() => { try { const saved = localStorage.getItem('tg_music'); return saved ? JSON.parse(saved) : null; } catch(e) { return null; } }); 
  
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(45);

  const [chatHistory, setChatHistory] = useState([{ role: 'assistant', text: 'Witaj. Jestem Twoim Cyfrowym Mentorem. W czym mogę pomóc?' }]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user || false);
      setAuthLoading(false);
    });
    const timeout = setTimeout(() => { if (authLoading) setAuthLoading(false); }, 6000);
    return () => { unsubscribe(); clearTimeout(timeout); };
  }, []);

  useEffect(() => {
    localStorage.setItem('tg_view', view);
    localStorage.setItem('tg_xp', xp.toString());
    localStorage.setItem('tg_completed', JSON.stringify(completedModules));
    if (musicConfig) localStorage.setItem('tg_music', JSON.stringify(musicConfig));
    if (activeAtmosphere) localStorage.setItem('tg_atmosphere', JSON.stringify(activeAtmosphere));
  }, [view, xp, completedModules, musicConfig, activeAtmosphere]);

  const addXp = (amount, achievement) => {
    setXp(prev => prev + amount);
    if (achievement) { setShowAchievement(achievement); setTimeout(() => setShowAchievement(null), 4000); }
  };

  const handleReset = () => {
    setView('onboarding'); setActiveAtmosphere(null); setMusicConfig(null); setIsPlaying(false);
    localStorage.clear(); window.location.reload();
  };

  const streams = {
    metal: { title: 'SomaFM Metal Detector', url: 'https://ice1.somafm.com/metal-128-mp3' },
    ambient: { title: 'SomaFM Groove Salad', url: 'https://ice1.somafm.com/groovesalad-128-mp3' },
    synth: { title: 'SomaFM Deep Space One', url: 'https://ice1.somafm.com/deepspaceone-128-mp3' },
    lofi: { title: 'SomaFM The Trip (Lofi)', url: 'https://ice1.somafm.com/thetrip-128-mp3' }
  };

  const analyzeProfile = async () => {
    setIsAnalyzing(true); await new Promise(r => setTimeout(r, 2000));
    setMusicConfig(streams.lofi); setActiveAtmosphere({ bg: 'radial-gradient(circle, #0A0A14 0%, #1A1A2E 100%)', accent: '#7B61FF' });
    setIsAnalyzing(false); setView('dashboard'); setIsPlaying(true);
    addXp(100, 'Zainicjowano profil AI');
  };

  const handleGoogleLogin = async () => {
    try { await signInWithGoogle(); } catch (err) { setAuthError(err.message); setTimeout(() => setAuthError(''), 5000); }
  };

  const renderLessonIcon = (icon) => {
    const props = { className: "w-5 h-5 text-plasma" };
    switch(icon) {
      case 'Zap': return <Zap {...props} />;
      case 'Database': return <Database {...props} />;
      case 'Brain': return <Brain {...props} />;
      case 'Workflow': return <Workflow {...props} />;
      case 'Rocket': return <Rocket {...props} />;
      default: return <Terminal {...props} />;
    }
  };

  // --- CONTENT RENDERING ---

  const renderContent = () => {
    if (authLoading) {
      return (
        <div className="flex h-screen w-full items-center justify-center flex-col gap-4 relative z-10 bg-black/20 backdrop-blur-sm">
          <Loader2 className="w-10 h-10 text-plasma animate-spin" />
          <p className="font-bold animate-pulse text-sm text-white tracking-[0.2em]">INITIALIZING UNIVERSE...</p>
        </div>
      );
    }

    if (!authUser) {
      return (
        <div className="flex h-screen w-full items-center justify-center p-6 relative z-10">
          <div className="w-full max-w-sm p-10 rounded-[3rem] border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl text-center">
            <img src="/logo.png" className="w-20 h-20 mx-auto mb-8 rounded-2xl border border-plasma/40 shadow-plasma-glow" />
            <h1 className="text-4xl font-black tracking-tighter mb-1 text-white">TECH GRILL</h1>
            <p className="text-plasma font-bold text-[10px] tracking-[0.3em] uppercase mb-10">Senior Dev Academy</p>
            <button onClick={handleGoogleLogin} className="w-full bg-white text-void font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" /> Kontynuuj z Google
            </button>
            {authError && <p className="text-red-400 text-xs mt-4">{authError}</p>}
          </div>
        </div>
      );
    }

    if (view === 'onboarding') {
      return (
        <div className="flex h-screen w-full items-center justify-center p-6 relative z-10">
           <div className="max-w-xl w-full p-10 rounded-[3rem] border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl text-center text-white">
              <Brain className="w-12 h-12 text-plasma mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-2">Witaj, {authUser.displayName?.split(' ')[0]}</h2>
              <p className="text-white/50 mb-10">Dostosuj parametry swojej sesji edukacyjnej.</p>
              <div className="space-y-6 text-left">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-plasma mb-2 block">Twój dzisiejszy focus</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-plasma outline-none" value={obForm.mood} onChange={e => setObForm({...obForm, mood: e.target.value})}>
                    <option value="">Wybierz...</option>
                    <option value="high">Maksymalna Produktywność</option>
                    <option value="chill">Spokojna Nauka</option>
                  </select>
                </div>
                <button onClick={analyzeProfile} disabled={isAnalyzing || !obForm.mood} className="w-full bg-plasma text-void font-black py-5 rounded-2xl hover:bg-plasma-light transition-all flex items-center justify-center gap-2">
                  {isAnalyzing ? <Loader2 className="animate-spin" /> : "ZAINICJUJ SYSTEM"}
                </button>
              </div>
           </div>
        </div>
      );
    }

    return (
      <div className="flex h-screen w-full relative z-10">
        <aside className="w-20 lg:w-72 bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
             <img src={authUser.photoURL || "/logo.png"} className="w-10 h-10 rounded-xl border border-plasma/30" />
             <div className="hidden lg:block">
               <div className="font-bold text-sm text-white truncate">{authUser.displayName}</div>
               <div className="text-plasma text-[9px] font-black tracking-widest uppercase">{xp} XP</div>
             </div>
          </div>
          <nav className="p-4 space-y-2 flex-1">
             <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-plasma text-void font-bold' : 'text-white/60 hover:bg-white/5'}`}>
                <LayoutDashboard className="w-5 h-5" /> <span className="hidden lg:block text-sm">Dashboard</span>
             </button>
             <button onClick={() => setView('knowledge')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'knowledge' ? 'bg-plasma text-void font-bold' : 'text-white/60 hover:bg-white/5'}`}>
                <BookOpen className="w-5 h-5" /> <span className="hidden lg:block text-sm">Baza Wiedzy</span>
             </button>
          </nav>
          <div className="p-4 mt-auto border-t border-white/5">
             <button onClick={handleReset} className="w-full text-red-500/50 hover:text-red-500 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 py-2">
                <Zap className="w-3 h-3" /> System Reset
             </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 lg:p-12">
          {view === 'dashboard' && (
            <div className="max-w-5xl mx-auto animate-fade-in">
              <h1 className="text-4xl lg:text-6xl font-black text-white mb-12 tracking-tighter">Wybierz Wektor <span className="text-plasma">Rozwoju</span></h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map((l, i) => (
                  <div key={l.id} onClick={() => { setCurrentLessonIndex(i); setView('lesson'); }} className="bg-black/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] hover:border-plasma/50 cursor-pointer transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-plasma transition-all">
                      {renderLessonIcon(l.icon)}
                    </div>
                    <div className="text-[10px] font-black text-plasma uppercase tracking-widest mb-2">{l.category}</div>
                    <h3 className="text-xl font-bold text-white leading-tight">{l.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}
          {view === 'lesson' && currentLessonIndex !== null && (
             <div className="max-w-3xl mx-auto animate-slide-up">
                <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-white/40 hover:text-plasma mb-8 text-xs font-bold uppercase tracking-widest"><ArrowLeft className="w-4 h-4" /> Powrót</button>
                <div className="bg-black/40 backdrop-blur-2xl p-8 lg:p-12 rounded-[3rem] border border-white/10 text-white">
                   <h2 className="text-3xl font-serif italic mb-8">{lessons[currentLessonIndex].title}</h2>
                   <div className="space-y-6">
                      {lessons[currentLessonIndex].concepts.map((c, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                           <h4 className="font-bold text-plasma mb-2">{c.term}</h4>
                           <div className="text-white/70 text-sm leading-relaxed prose-lesson" dangerouslySetInnerHTML={{ __html: c.explanation }} />
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          )}
        </main>
      </div>
    );
  };

  return (
    <div className="bg-black w-full h-screen overflow-hidden selection:bg-plasma selection:text-white">
      <Universe3D active={!!activeAtmosphere && view !== 'onboarding'} />
      {renderContent()}
      {musicConfig && (
        <audio key={musicConfig.url} ref={audioRef} src={musicConfig.url} loop crossOrigin="anonymous" preload="auto" autoPlay={isPlaying} />
      )}
    </div>
  );
};

export default App;
