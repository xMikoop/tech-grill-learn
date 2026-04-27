import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Shield,
  Clock,
  Terminal,
  Database,
  Brain,
  Workflow,
  Rocket,
  Loader2,
  Star,
  History,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

import { lessons } from './data';
import { auth, signInWithGoogle, logout } from './firebase';
import { getMentorResponse } from './services/mentorService';
import { buildProgressPayload, loadUserProgress, saveUserProgress } from './services/progressService';
import { useReducedMotion } from './hooks/useReducedMotion';
import { VALID_VIEWS, pathFromView, viewFromPath } from './lib/viewRouting';
import { useAppStore } from './store/useAppStore';

// Components
import { Universe3D, CELESTIAL_INFO } from './components/Universe/Universe3D';
import Sidebar from './components/Sidebar/Sidebar';
import Onboarding from './components/Onboarding/Onboarding';
import AchievementPop from './components/Common/AchievementPop';
import GlobalAudio from './components/Audio/GlobalAudio';

// Pages
import Dashboard from './pages/Dashboard';
import Knowledge from './pages/Knowledge';
import Lesson from './pages/Lesson';
import Quiz from './pages/Quiz';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  const currentLessonIndex = useAppStore((state) => state.currentLessonIndex);
  const setCurrentLessonIndex = useAppStore((state) => state.setCurrentLessonIndex);
  const xp = useAppStore((state) => state.xp);
  const setXp = useAppStore((state) => state.setXp);
  const view = useAppStore((state) => state.view);
  const setView = useAppStore((state) => state.setView);
  const activeAtmosphere = useAppStore((state) => state.activeAtmosphere);
  const setActiveAtmosphere = useAppStore((state) => state.setActiveAtmosphere);
  const musicConfig = useAppStore((state) => state.musicConfig);
  const setMusicConfig = useAppStore((state) => state.setMusicConfig);
  const resetSessionState = useAppStore((state) => state.resetSessionState);

  // Lesson state
  const [unlockedConcepts, setUnlockedConcepts] = useState({});
  const [completedModules, setCompletedModules] = useState(() => {
    try {
      const saved = localStorage.getItem('tg_completed');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showAchievement, setShowAchievement] = useState(null);
  const [showSupernova, setShowSupernova] = useState(false);

  // Auth state — Firebase manages session automatically
  const [authUser, setAuthUser] = useState(null); // null = loading, false = not logged in, object = logged in
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Onboarding & Profile state
  const [obForm, setObForm] = useState({
    mood: '',
    neuroProfile: 'neurotypical',
    interests: '',
    calm: '',
    energy: '',
    joy: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isHydratingProgress, setIsHydratingProgress] = useState(true);
  const [isRouteHydrated, setIsRouteHydrated] = useState(false);

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(45);

  // Chatbot State
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: 'Witaj. Jestem Twoim Cyfrowym Mentorem. W czym mogę pomóc?' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [mentorLoading, setMentorLoading] = useState(false);
  const chatEndRef = useRef(null);

  const [focusedPlanet, setFocusedPlanet] = useState(null);

  // Audio Logic Constants
  const streams = {
    metal: { title: 'SomaFM Metal Detector', url: 'https://ice1.somafm.com/metal-128-mp3' },
    ambient: { title: 'SomaFM Groove Salad', url: 'https://ice1.somafm.com/groovesalad-128-mp3' },
    synth: { title: 'SomaFM Deep Space One', url: 'https://ice1.somafm.com/deepspaceone-128-mp3' },
    lofi: { title: 'SomaFM The Trip (Lofi)', url: 'https://ice1.somafm.com/thetrip-128-mp3' },
  };

  const atmospheres = {
    space_adhd: {
      name: 'Stabilna Orbita',
      bg: 'radial-gradient(circle at center, #0A0A14 0%, #1A1A2E 100%)',
      accent: '#7B61FF',
      animation: 'satellites',
      music: 'lofi',
      why: 'Dla osoby z ADHD delikatny ruch obiektów satelitarnych zaspokaja potrzebę stymulacji wizualnej, pozwalając skupić główną uwagę na nauce.',
    },
    nature_calm: {
      name: 'Leśna Cisza',
      bg: 'radial-gradient(circle at center, #051605 0%, #0A0A14 100%)',
      accent: '#39FF14',
      animation: 'clouds',
      music: 'ambient',
      why: 'Organiczne barwy i powolne ruchy redukują poziom kortyzolu, co sprzyja głębokiej koncentracji u osób potrzebujących wyciszenia.',
    },
    tech_motivated: {
      name: 'Cyber-Flow',
      bg: 'radial-gradient(circle at center, #0A0A14 0%, #001220 100%)',
      accent: '#00E5FF',
      animation: 'grid',
      music: 'synth',
      why: 'Wysoki kontrast i dynamiczne linie siatki stymulują dopaminę, wspierając stan "Flow" podczas intensywnej nauki.',
    },
    space_stressed: {
      name: 'Ciemna Mgławica',
      bg: 'radial-gradient(circle at center, #0A0A14 0%, #0D0D2B 100%)',
      accent: '#A594FF',
      animation: 'clouds',
      music: 'ambient',
      why: 'Wolno pulsujące mgławice w ciemnym odcieniu granatu obniżają napięcie nerwowe i sprzyjają skupieniu u osób w stanie stresu.',
    },
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [chatHistory, reducedMotion]);

  // Firebase Auth state listener — persists session across refreshes
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAuthLoading(false);
    }, 6000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user || false);
      setAuthLoading(false);
      clearTimeout(timeout);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  // Flaga blokująca pętlę między efektami route↔state
  const isSyncingRef = useRef(false);

  // Route -> state sync (Only on location change)
  useEffect(() => {
    if (isSyncingRef.current) return;
    const routeState = viewFromPath(location.pathname, !!activeAtmosphere);
    if (!VALID_VIEWS.has(routeState.view)) return;

    isSyncingRef.current = true;
    // Only update if current state differs from what the route dictates
    if (routeState.view !== view) {
      setView(routeState.view);
    }

    if (
      (routeState.view === 'lesson' || routeState.view === 'quiz') &&
      routeState.lessonIndex !== null &&
      routeState.lessonIndex !== currentLessonIndex
    ) {
      setCurrentLessonIndex(routeState.lessonIndex);
    }

    setIsRouteHydrated(true);
    // Reset flagi po mikrotasku, nie synchronicznie
    Promise.resolve().then(() => { isSyncingRef.current = false; });
  // activeAtmosphere celowo pominięte - nie powinno wyzwalać route sync
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // State -> route sync (Only on view change)
  useEffect(() => {
    if (!isRouteHydrated || isSyncingRef.current) return;

    const targetPath = pathFromView(view, currentLessonIndex);
    if (location.pathname !== targetPath) {
      isSyncingRef.current = true;
      navigate(targetPath, { replace: true });
      Promise.resolve().then(() => { isSyncingRef.current = false; });
    }
  }, [view, currentLessonIndex, isRouteHydrated, navigate]);

  // Consistency check: if view is lesson/quiz but no lesson is selected, go back to dashboard
  useEffect(() => {
    if ((view === 'lesson' || view === 'quiz') && currentLessonIndex === null) {
      setView('dashboard');
      return;
    }

    if (currentLessonIndex !== null && (currentLessonIndex < 0 || currentLessonIndex >= lessons.length)) {
      setCurrentLessonIndex(null);
      setView('dashboard');
    }
  }, [view, currentLessonIndex, setCurrentLessonIndex, setView]);

  useEffect(() => {
    localStorage.setItem('tg_completed', JSON.stringify(completedModules));
  }, [completedModules]);

  useEffect(() => {
    if (!authUser?.uid) {
      setIsHydratingProgress(false);
      return;
    }

    let active = true;
    setIsHydratingProgress(true);

    loadUserProgress(authUser.uid)
      .then((data) => {
        if (!active || !data) return;

        if (typeof data.xp === 'number') setXp(data.xp);
        if (typeof data.view === 'string' && VALID_VIEWS.has(data.view)) setView(data.view);
        if (Array.isArray(data.completedModules)) setCompletedModules(data.completedModules);
        if (data.musicConfig) setMusicConfig(data.musicConfig);
        if (data.activeAtmosphere) setActiveAtmosphere(data.activeAtmosphere);
      })
      .catch((error) => {
        console.warn('Nie udało się pobrać postępu z Firestore:', error);
      })
      .finally(() => {
        if (active) setIsHydratingProgress(false);
      });

    return () => {
      active = false;
    };
  }, [authUser?.uid, setXp, setView, setMusicConfig, setActiveAtmosphere]);

  useEffect(() => {
    if (!authUser?.uid || isHydratingProgress) return;

    const timeout = setTimeout(() => {
      const payload = buildProgressPayload({
        xp,
        completedModules,
        view,
        musicConfig,
        activeAtmosphere,
      });

      saveUserProgress(authUser.uid, payload).catch((error) => {
        console.warn('Nie udało się zapisać postępu do Firestore:', error);
      });
    }, 900);

    return () => clearTimeout(timeout);
  }, [authUser?.uid, isHydratingProgress, xp, completedModules, view, musicConfig, activeAtmosphere]);

  const addXp = (amount, achievement = null) => {
    setXp((prev) => prev + amount);

    if (achievement) {
      setShowAchievement(achievement);
      setTimeout(() => setShowAchievement(null), 3500);
    }
  };

  const handleReset = () => {
    resetSessionState();
    setCompletedModules([]);
    setCurrentQuizIndex(0);
    setAnswers({});
    setIsPlaying(false);
    localStorage.removeItem('tg_atmosphere');
    localStorage.removeItem('tg_music');
    localStorage.removeItem('tg_view');
    localStorage.removeItem('tg_app_store');
  };

  const handleLessonStart = (index) => {
    setCurrentLessonIndex(index);
    setUnlockedConcepts({});
    setCurrentQuizIndex(0);
    setAnswers({});
    setView('lesson');
  };

  // Helper for chatbot music commands
  const getStreamByText = (text) => {
    if (text.includes('metal') || text.includes('rock') || text.includes('gitar') || text.includes('ciężk'))
      return streams.metal;
    if (text.includes('techno') || text.includes('elektr') || text.includes('synth') || text.includes('cyber'))
      return streams.synth;
    if (text.includes('hip hop') || text.includes('rap') || text.includes('lofi') || text.includes('chill') || text.includes('spok'))
      return streams.lofi;
    return streams.ambient;
  };

  const analyzeProfile = async () => {
    setIsAnalyzing(true);
    await new Promise((r) => setTimeout(r, 2500));

    let profileKey = 'tech_motivated'; // Default

    // Priority-based matching
    if (obForm.neuroProfile === 'calm_needed' || obForm.neuroProfile === 'hsp') {
      profileKey = 'nature_calm';
    } else if (obForm.neuroProfile === 'adhd') {
      profileKey = obForm.interests === 'Kosmos' ? 'space_adhd' : 'space_adhd';
    } else if (obForm.mood === 'stressed') {
      profileKey = 'space_stressed';
    } else if (obForm.interests === 'Cyberpunk' || obForm.interests === 'Technologia') {
      profileKey = 'tech_motivated';
    } else if (obForm.interests === 'Natura' || obForm.interests === 'Minimalizm') {
      profileKey = 'nature_calm';
    } else if (obForm.interests === 'Kosmos') {
      profileKey = obForm.mood === 'fatigued' ? 'space_stressed' : 'space_adhd';
    }

    const selectedAtmos = atmospheres[profileKey];
    setActiveAtmosphere(selectedAtmos);
    setMusicConfig(streams[selectedAtmos.music]);

    setIsAnalyzing(false);
    setView('dashboard');
    setIsPlaying(true);

    setChatHistory((prev) => [
      ...prev,
      {
        role: 'assistant',
        text: `Zainicjowano profil: ${selectedAtmos.name}.\n\nDlaczego to działa: ${selectedAtmos.why}`,
      },
    ]);

    addXp(150, 'Atmosfera Dostrojona');
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted, musicConfig]);

  useEffect(() => {
    if (audioRef.current && musicConfig) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => {
          console.error('Autoplay blocked:', e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, musicConfig]);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (isMuted || volume === 0) {
      setIsMuted(false);
      if (volume === 0) setVolume(45);
    } else {
      setIsMuted(true);
    }
  };

  // Chatbot Logic
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || mentorLoading) return;

    const userText = chatInput.trim();
    const userMessage = { role: 'user', text: userText };
    const nextHistory = [...chatHistory, userMessage];

    setChatHistory(nextHistory);
    setChatInput('');

    const lowerText = userText.toLowerCase();
    const musicKeywords = ['zmień', 'włącz', 'muzyk', 'radio', 'rock', 'lofi', 'metal', 'synth', 'ambient', 'rok'];
    const hasMusicIntent = musicKeywords.some((kw) => lowerText.includes(kw));

    let responseText = 'Analizuję polecenie... Jeżeli potrzebujesz pomocy, wpisz /help lub /pomoc.';

    if (lowerText === '/help' || lowerText === '/pomoc' || lowerText === 'pomoc') {
      responseText =
        "Dostępne komendy:\n- 'zmień muzykę na [gatunek]' (np. rock, lofi, synthwave)\n- 'ciszej' / 'głośniej'\n- Możesz pytać o: LLM, Qwen, React, automatyzacje.";
    } else if (hasMusicIntent && !lowerText.includes('ciszej') && !lowerText.includes('głośniej')) {
      const newStream = getStreamByText(lowerText);
      setMusicConfig(newStream);
      setIsPlaying(true);
      responseText = `Odtwarzacz przeprogramowany. Słuchasz teraz: ${newStream.title}.`;
    } else if (lowerText.includes('ciszej') || lowerText.includes('przycisz')) {
      setVolume(15);
      responseText = 'Zmniejszyłem głośność strumienia.';
    } else if (lowerText.includes('głośniej') || lowerText.includes('podgłośń')) {
      setVolume(85);
      responseText = 'Głośność zwiększona.';
    } else {
      setMentorLoading(true);
      try {
        responseText = await getMentorResponse({
          input: userText,
          chatHistory: nextHistory,
          lessons,
        });
      } catch (error) {
        console.warn('Błąd mentora AI:', error);
        responseText = 'Wystąpił błąd podczas generowania odpowiedzi. Spróbuj ponownie za chwilę.';
      } finally {
        setMentorLoading(false);
      }
    }

    setChatHistory((prev) => [...prev, { role: 'assistant', text: responseText }]);
  };

  const currentLesson = currentLessonIndex !== null ? lessons[currentLessonIndex] : null;

  // Trigger Supernova on correct answer
  useEffect(() => {
    if (!currentLesson || Object.keys(answers).length === 0) return;
    const quiz = currentLesson.quizzes?.[currentQuizIndex];
    if (quiz && answers[currentQuizIndex] === quiz.correct) {
      setShowSupernova(true);
      const timer = setTimeout(() => setShowSupernova(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [answers, currentQuizIndex, currentLesson]);

  const renderIcon = (iconName, className) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className={className} />;
      case 'Clock':
        return <Clock className={className} />;
      case 'Shield':
        return <Shield className={className} />;
      case 'Database':
        return <Database className={className} />;
      case 'Brain':
        return <Brain className={className} />;
      case 'Workflow':
        return <Workflow className={className} />;
      case 'Rocket':
        return <Rocket className={className} />;
      default:
        return <Terminal className={className} />;
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    try {
      await signInWithGoogle();
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Zamknięto okno logowania.');
      } else if (err.code === 'auth/popup-blocked') {
        setAuthError('Przeglądarka zablokowała popup. Zezwól na wyskakujące okna dla tej strony.');
      } else {
        setAuthError(`Błąd: ${err.message}`);
      }
      setTimeout(() => setAuthError(''), 5000);
    }
  };

  const handleLogout = async () => {
    await logout();
    resetSessionState();
    setCompletedModules([]);
    navigate('/onboarding', { replace: true });
  };

  if (authLoading) {
    return (
      <div className="flex h-screen w-full bg-white text-black items-center justify-center flex-col gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="font-bold animate-pulse text-sm">TRWA INICJALIZACJA SYSTEMU...</p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="flex h-screen w-full bg-void text-ghost font-sora items-center justify-center selection:bg-plasma selection:text-white relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{ background: 'radial-gradient(circle at center, rgba(100,220,255,0.04) 0%, transparent 60%)' }}
        />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-plasma/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px]" />

        {authError && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg animate-fade-in border border-red-400/30 whitespace-nowrap">
            {authError}
          </div>
        )}

        <div className="max-w-md w-full px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-plasma rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-[0_20px_50px_rgba(123,97,255,0.3)]">
              <Terminal className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">
              TECH GRILL <span className="text-plasma">ACADEMY</span>
            </h1>
            <p className="text-ghost/40 text-sm font-medium uppercase tracking-[0.2em]">Universe Initialization</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full group relative bg-white text-gray-800 font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 active:scale-[0.98] transition-all shadow-lg"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Kontynuuj z Google
          </button>

          <p className="text-center text-white/20 text-xs mt-8 leading-relaxed">
            Weryfikacja przez prawdziwe konto Google.
            <br />
            Żadnych danych nie przechowujemy bez Twojej zgody.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen bg-void text-ghost font-sora selection:bg-plasma selection:text-white overflow-hidden transition-all duration-1000 relative"
      style={{
        background: activeAtmosphere ? activeAtmosphere.bg : 'var(--color-void)',
        '--color-plasma': activeAtmosphere ? activeAtmosphere.accent : '#7B61FF',
      }}
      onClick={() => setFocusedPlanet(null)}
    >
      {/* Supernova Effect Overlay */}
      {showSupernova && (
        <div className="fixed inset-0 z-[1000] pointer-events-none flex items-center justify-center">
          <div className="supernova-core w-1 h-1 bg-white rounded-full shadow-[0_0_100px_50px_#fff,0_0_200px_100px_var(--color-plasma)] animate-ping" />
        </div>
      )}

      {/* Universe 3D Background */}
      <Universe3D
        active={true}
        reducedMotion={reducedMotion}
        onPlanetClick={(p) => {
          setFocusedPlanet(p);
          setXp((prev) => prev + 1);
        }}
        focusedPlanet={focusedPlanet}
      />

      {/* Planet Info Panel */}
      {focusedPlanet && CELESTIAL_INFO[focusedPlanet] && (
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-full max-w-md animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="glass-dark p-8 rounded-[2.5rem] border border-plasma/50 shadow-plasma-glow relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button onClick={() => setFocusedPlanet(null)} className="text-white/30 hover:text-white transition-colors">
                <Zap className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="text-plasma text-xs font-black tracking-[0.3em] uppercase mb-2">Celestial Object</div>
            <h2 className="text-5xl font-serif italic mb-6">{CELESTIAL_INFO[focusedPlanet].name}</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[10px] text-plasma font-bold uppercase mb-1">Wiek</div>
                  <div className="font-bold">{CELESTIAL_INFO[focusedPlanet].age}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[10px] text-plasma font-bold uppercase mb-1">Skład</div>
                  <div className="font-bold text-xs">{CELESTIAL_INFO[focusedPlanet].comp}</div>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-[10px] text-plasma font-bold uppercase mb-1">Ciekawostka</div>
                <div className="text-sm leading-relaxed">{CELESTIAL_INFO[focusedPlanet].fact}</div>
              </div>

              <div className="p-4 bg-plasma/10 rounded-2xl border border-plasma/20">
                <div className="text-[10px] text-plasma font-bold uppercase mb-1">Przewidywana długość życia</div>
                <div className="text-sm font-medium">{CELESTIAL_INFO[focusedPlanet].life}</div>
              </div>
            </div>

            <button
              onClick={() => setFocusedPlanet(null)}
              className="w-full mt-8 bg-white text-void font-bold py-4 rounded-xl hover:bg-plasma hover:text-white transition-all uppercase tracking-widest text-xs"
            >
              Powrót do eksploracji
            </button>
          </div>
        </div>
      )}

      {/* Achievement Popups */}
      <AchievementPop achievement={showAchievement} />

      {/* Global Audio Control */}
      <GlobalAudio
        ref={audioRef}
        musicConfig={musicConfig}
        isPlaying={isPlaying}
        isMuted={isMuted}
        volume={volume}
        onToggleMusic={toggleMusic}
        onToggleMute={toggleMute}
        onVolumeChange={setVolume}
      />

      {/* Sidebar Layout */}
      {view !== 'onboarding' && (
        <Sidebar
          authUser={authUser}
          xp={xp}
          completedModules={completedModules}
          lessons={lessons}
          view={view}
          setView={setView}
          handleLogout={handleLogout}
          chatHistory={chatHistory}
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleSendMessage={handleSendMessage}
          mentorLoading={mentorLoading}
          chatEndRef={chatEndRef}
          handleReset={handleReset}
        />
      )}

      {/* Main Content Area */}
      <main
        className={`flex-1 overflow-y-auto relative z-10 pointer-events-none ${
          view === 'onboarding' ? 'flex items-center justify-center px-6 bg-[url("noise.png")]' : 'pb-32 px-6 lg:px-12 pt-12'
        }`}
      >
        {view === 'onboarding' && (
          <Onboarding
            obForm={obForm}
            setObForm={setObForm}
            isAnalyzing={isAnalyzing}
            analyzeProfile={analyzeProfile}
          />
        )}

        {view === 'dashboard' && (
          <Dashboard
            lessons={lessons}
            handleLessonStart={handleLessonStart}
            renderIcon={renderIcon}
          />
        )}

        {view === 'knowledge' && <Knowledge lessons={lessons} setView={setView} />}

        {(view === 'favorites' || view === 'history') && (
          <div className="animate-fade-in max-w-3xl mx-auto mt-20 text-center space-y-6 pointer-events-auto">
            <div className="w-24 h-24 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8">
              {view === 'favorites' && <Star className="w-10 h-10 text-ghost/50" />}
              {view === 'history' && <History className="w-10 h-10 text-ghost/50" />}
            </div>
            <h2 className="text-3xl font-bold">{view === 'favorites' ? 'Ulubione Koncepty' : 'Historia Aktywności'}</h2>
            <p className="text-ghost/50 text-lg max-w-lg mx-auto">
              Ta sekcja jest w trakcie konstrukcji. Wróć do{' '}
              <span className="text-plasma cursor-pointer hover:underline" onClick={() => setView('dashboard')}>
                Dashboardu
              </span>
              , aby kontynuować naukę.
            </p>
          </div>
        )}

        {view === 'lesson' && currentLesson && (
          <Lesson
            currentLesson={currentLesson}
            setView={setView}
            unlockedConcepts={unlockedConcepts}
            setUnlockedConcepts={setUnlockedConcepts}
            renderIcon={renderIcon}
          />
        )}

        {view === 'quiz' && currentLesson && (
          <Quiz
            currentLesson={currentLesson}
            currentQuizIndex={currentQuizIndex}
            setCurrentQuizIndex={setCurrentQuizIndex}
            answers={answers}
            setAnswers={setAnswers}
            setView={setView}
            addXp={addXp}
            setCompletedModules={setCompletedModules}
            completedModules={completedModules}
          />
        )}
      </main>

      {/* Footer Status Overlay */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-white/5 text-[10px] font-black tracking-[0.2em] uppercase text-ghost/20">
          <span className="w-1.5 h-1.5 bg-green-neon rounded-full animate-pulse"></span>
          System Operational: Tech Grill v2.1.0
        </div>
      </footer>
    </div>
  );
};

export default App;
