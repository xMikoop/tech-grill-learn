import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Shield, Clock, Terminal, CheckCircle, ChevronRight, Trophy, ArrowLeft, 
  Database, Brain, Workflow, Rocket, Music, Play, Pause, Volume2, VolumeX, 
  Loader2, Send, MessageSquare, BookOpen, Star, History, LayoutDashboard, 
  LogOut, Lock, Unlock 
} from 'lucide-react';
import { lessons } from './data';
import { auth, signInWithGoogle, logout } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import gsap from 'gsap';

const CELESTIAL_INFO = {
  sun: { name: 'Słońce', age: '4.6 mld lat', comp: 'Wodór (73%), Hel (25%)', fact: 'Masa Słońca to 99.86% masy całego Układu Słonecznego.', life: 'Ok. 5 mld lat do fazy Czerwonego Olbrzyma.' },
  saturn: { name: 'Saturn', age: '4.5 mld lat', comp: 'Wodór, Hel', fact: 'Gęstość Saturna jest mniejsza od gęstości wody – mógłby pływać w ogromnym basenie.', life: 'Stabilna przez miliardy lat.' },
  jupiter: { name: 'Jowisz', age: '4.5 mld lat', comp: 'Głównie Wodór i Hel (Gazowy Gigant)', fact: 'Wielka Czerwona Plama to antycyklon wiejący od co najmniej 350 lat.', life: 'Stabilna przez miliardy lat.' },
  earth: { name: 'Ziemia', age: '4.54 mld lat', comp: 'Żelazo, Tlen, Krzem, Magnez', fact: 'Jedyna planeta w Układzie Słonecznym, która nie ma nazwy pochodzącej od rzymskiego lub greckiego bóstwa.', life: 'Ok. 1-2 mld lat (zanim Słońce stanie się zbyt gorące).' },
  black_hole: { name: 'Czarna Dziura', age: 'Różny', comp: 'Zapadnięta Masa (Osobliwość)', fact: 'Czas zwalnia w pobliżu czarnej dziury z powodu ogromnej grawitacji (dylatacja czasu).', life: 'Paruje przez miliardy lat (Promieniowanie Hawkinga).' }
};

// Stałe pozycje gwiazd generowane raz poza komponentem, aby uniknąć skakania przy re-renderach
const STATIC_STARS = Array.from({ length: 200 }).map((_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: `${Math.random() * 2 + 1}px`,
  duration: `${Math.random() * 3 + 2}s`,
}));

const StarField = React.memo(() => {
  return (
    <div className="star-field pointer-events-none">
      {STATIC_STARS.map(star => (
        <div 
          key={star.id} 
          className="star" 
          style={{ 
            top: star.top, 
            left: star.left, 
            width: star.size, 
            height: star.size, 
            '--duration': star.duration 
          }} 
        />
      ))}
    </div>
  );
});

const SpaceShip = React.memo(() => {
  const orbitRef = useRef(null);

  useEffect(() => {
    if (!orbitRef.current) return;
    
    // Majestatyczna orbita w tle
    gsap.to(orbitRef.current, {
      rotationY: 360,
      duration: 60, // Bardzo powolne krążenie
      repeat: -1,
      ease: "none"
    });

    // Delikatne kołysanie góra-dół podczas lotu
    gsap.to(orbitRef.current, {
      rotationX: 10,
      duration: 15,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  return (
    <div ref={orbitRef} className="absolute pointer-events-none" style={{ transformStyle: 'preserve-3d', top: '50%', left: '50%' }}>
       <div style={{ transform: 'translateX(800px) translateZ(-1000px) rotateY(90deg)', transformStyle: 'preserve-3d' }}>
          <div className="relative flex items-center justify-center scale-[0.6]">
             {/* Dynamiczny płomień silnika */}
             <div className="absolute right-full flex items-center" style={{ transform: 'translateX(5px)' }}>
                <div className="w-16 h-4 bg-blue-500/40 blur-md rounded-full animate-pulse" />
                <div className="absolute right-0 w-8 h-2 bg-white/60 blur-[2px] rounded-full animate-pulse" />
             </div>
             
             {/* Kadłub Statku z animowanymi detalami */}
             <div className="relative w-20 h-6 bg-graphite rounded-full border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
                {/* Kokpit z pulsującym światłem */}
                <div className="absolute top-1 left-4 w-6 h-2 bg-cyan-400/20 rounded-full overflow-hidden">
                   <div className="w-full h-full bg-cyan-300/40 animate-pulse" />
                </div>
                
                {/* Linie podziału kadłuba */}
                <div className="absolute inset-0 flex justify-around opacity-20">
                   <div className="w-[1px] h-full bg-white" />
                   <div className="w-[1px] h-full bg-white" />
                   <div className="w-[1px] h-full bg-white" />
                </div>

                {/* Engine Core */}
                <div className="absolute right-0 w-3 h-full bg-gradient-to-l from-orange-600 to-transparent" />
             </div>

             {/* Skrzydła z animowanymi światłami pozycyjnymi */}
             <div className="absolute -top-4 left-6 w-3 h-10 bg-graphite border-r border-white/10 rounded-sm skew-x-[25deg] origin-bottom animate-float-slow">
                <div className="absolute top-0 left-0 w-1 h-1 bg-red-500 shadow-[0_0_5px_red] animate-ping" />
             </div>
             <div className="absolute -bottom-4 left-6 w-3 h-10 bg-graphite border-r border-white/10 rounded-sm -skew-x-[25deg] origin-top animate-float-slow">
                <div className="absolute bottom-0 left-0 w-1 h-1 bg-green-500 shadow-[0_0_5px_green] animate-ping" />
             </div>

             {/* Obracający się element (np. radar/skaner) */}
             <div className="absolute -top-6 left-10 w-4 h-4 border-t border-blue-400 rounded-full animate-spin" style={{ animationDuration: '3s' }} />

             {/* Smuga jonowa */}
             <div className="absolute right-full w-80 h-[1px] bg-gradient-to-r from-transparent via-blue-500/5 to-white/10 blur-[1px]" />
          </div>
       </div>
    </div>
  );
});

const Universe3D = React.memo(({ active, onPlanetClick, focusedPlanet }) => {
  const cameraRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!cameraRef.current || !active) return;
    
    // Zatrzymujemy poprzednie animacje, ale NIE resetujemy wartości kamery
    if (animationRef.current) animationRef.current.kill();

    const targets = {
      sun: { x: 400, y: 300, z: -400, rx: -10, ry: -10 },
      saturn: { x: 300, y: -200, z: 0, rx: 5, ry: 15 },
      jupiter: { x: -400, y: 100, z: 300, rx: 0, ry: -20 },
      black_hole: { x: -400, y: -400, z: -100, rx: 20, ry: -10 },
      earth: { x: 0, y: -400, z: 700, rx: 15, ry: 0 }
    };

    if (focusedPlanet) {
      const t = targets[focusedPlanet];
      animationRef.current = gsap.to(cameraRef.current, {
        x: t.x, y: t.y, z: t.z,
        rotationX: t.rx, rotationY: t.ry,
        duration: 2.5, 
        ease: "power2.inOut",
        overwrite: true // Ważne dla płynności
      });
    } else {
      // Powrót do ruchu jałowego z obecnej pozycji
      animationRef.current = gsap.to(cameraRef.current, {
        rotationY: 8, rotationX: 2, x: 40, z: 50,
        duration: 4, 
        ease: "power2.inOut",
        onComplete: () => {
          // Gdy wróci do bazy, włącz zapętlony ruch
          animationRef.current = gsap.to(cameraRef.current, {
            rotationY: 12, rotationX: 4, x: 60,
            duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut"
          });
        }
      });
    }

    return () => {
      if (animationRef.current) animationRef.current.kill();
    };
  }, [active, focusedPlanet]);

  return (
    <div className={`universe-container ${active ? 'active' : ''}`}>
      <div ref={cameraRef} className="universe-camera">
        <StarField />
        <SpaceShip />
        
        {/* Sun */}
        <div 
          onClick={(e) => { e.stopPropagation(); onPlanetClick('sun'); }}
          className="sun planet" 
          style={{ top: '5%', left: '5%', transform: 'translateZ(-900px)' }} 
        />

        {/* Saturn */}
        <div style={{ position: 'absolute', top: '55%', left: '15%', transform: 'translateZ(-400px)', transformStyle: 'preserve-3d' }}>
          <div 
            onClick={(e) => { e.stopPropagation(); onPlanetClick('saturn'); }}
            className="planet saturn"
          >
            <div className="saturn-rings" />
          </div>
        </div>

        {/* Jupiter */}
        <div style={{ position: 'absolute', top: '25%', right: '10%', transform: 'translateZ(-100px)', transformStyle: 'preserve-3d' }}>
          <div 
            onClick={(e) => { e.stopPropagation(); onPlanetClick('jupiter'); }}
            className="planet jovian animate-spin-slow" 
          />
        </div>

        {/* Black Hole */}
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', transform: 'translateZ(-600px)', transformStyle: 'preserve-3d' }}>
          <div 
            onClick={(e) => { e.stopPropagation(); onPlanetClick('black_hole'); }}
            className="black-hole-core pointer-events-auto cursor-pointer" 
          />
        </div>

        {/* Earth */}
        <div style={{ position: 'absolute', bottom: '15%', left: '40%', transform: 'translateZ(300px)', transformStyle: 'preserve-3d' }}>
          <div 
            onClick={(e) => { e.stopPropagation(); onPlanetClick('earth'); }}
            className="planet earth" 
            style={{ width: '45px', height: '45px', background: 'radial-gradient(circle at 30% 30%, #4b9cd3, #004d99)' }} 
          />
        </div>
      </div>
    </div>
  );
});

const App = () => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(null);
  const [xp, setXp] = useState(() => {
    try { return parseInt(localStorage.getItem('tg_xp') || '0'); } catch(e) { return 0; }
  });
  const [view, setView] = useState(() => localStorage.getItem('tg_view') || 'onboarding');
  
  // Lesson state
  const [unlockedConcepts, setUnlockedConcepts] = useState({});
  const [completedModules, setCompletedModules] = useState(() => {
    try {
      const saved = localStorage.getItem('tg_completed');
      return saved ? JSON.parse(saved) : [];
    } catch(e) { return []; }
  });
  
  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showAchievement, setShowAchievement] = useState(null);
  const [savedLinks, setSavedLinks] = useState([]);
  const [linkInput, setLinkInput] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
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
    joy: '' 
  });
  const [activeAtmosphere, setActiveAtmosphere] = useState(() => {
    try {
      const saved = localStorage.getItem('tg_atmosphere');
      return saved ? JSON.parse(saved) : null;
    } catch(e) { return null; }
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [musicConfig, setMusicConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('tg_music');
      return saved ? JSON.parse(saved) : null;
    } catch(e) { return null; }
  }); 
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(45);

  // Chatbot State
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: 'Witaj. Jestem Twoim Cyfrowym Mentorem. W czym mogę pomóc?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const [focusedPlanet, setFocusedPlanet] = useState(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Firebase Auth state listener — persists session across refreshes
  useEffect(() => {
    console.log("🚀 Inicjalizacja nasłuchiwania Auth...");
    
    // Safety timeout: if Firebase hangs, stop loading after 6s
    const timeout = setTimeout(() => {
      if (authLoading) {
        console.warn("⚠️ Firebase Auth timeout - wymuszam koniec ładowania.");
        setAuthLoading(false);
      }
    }, 6000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("✅ Stan Auth zmieniony:", user ? "Zalogowany" : "Wylogowany");
      setAuthUser(user || false);
      setAuthLoading(false);
      clearTimeout(timeout);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  console.log("🎨 Renderowanie komponentu App. Stan authLoading:", authLoading);

  // Consistency check: if view is lesson/quiz but no lesson is selected, go back to dashboard
  useEffect(() => {
    if ((view === 'lesson' || view === 'quiz') && currentLessonIndex === null) {
      setView('dashboard');
    }
  }, [view, currentLessonIndex]);

  useEffect(() => {
    localStorage.setItem('tg_view', view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem('tg_xp', xp.toString());
    localStorage.setItem('tg_completed', JSON.stringify(completedModules));
  }, [xp, completedModules]);

  useEffect(() => {
    if (musicConfig) {
      localStorage.setItem('tg_music', JSON.stringify(musicConfig));
    }
    if (activeAtmosphere) {
      localStorage.setItem('tg_atmosphere', JSON.stringify(activeAtmosphere));
    }
  }, [musicConfig, activeAtmosphere]);


  const handleReset = () => {
    setView('onboarding');
    setActiveAtmosphere(null);
    setMusicConfig(null);
    setIsPlaying(false);
    localStorage.removeItem('tg_atmosphere');
    localStorage.removeItem('tg_music');
    localStorage.removeItem('tg_view');
  };

  const handleLessonStart = (index) => {
    setCurrentLessonIndex(index);
    setUnlockedConcepts({});
    setCurrentQuizIndex(0);
    setAnswers({});
    setView('lesson');
  };

  // Music Logic
  const streams = {
    metal: { title: 'SomaFM Metal Detector', url: 'https://ice1.somafm.com/metal-128-mp3' },
    ambient: { title: 'SomaFM Groove Salad', url: 'https://ice1.somafm.com/groovesalad-128-mp3' },
    synth: { title: 'SomaFM Deep Space One', url: 'https://ice1.somafm.com/deepspaceone-128-mp3' },
    lofi: { title: 'SomaFM The Trip (Lofi)', url: 'https://ice1.somafm.com/thetrip-128-mp3' }
  };

  const atmospheres = {
    space_adhd: {
      name: 'Stabilna Orbita',
      bg: 'radial-gradient(circle at center, #0A0A14 0%, #1A1A2E 100%)',
      accent: '#7B61FF',
      animation: 'satellites',
      music: 'lofi',
      why: 'Dla osoby z ADHD delikatny ruch obiektów satelitarnych zaspokaja potrzebę stymulacji wizualnej, pozwalając skupić główną uwagę na nauce.'
    },
    nature_calm: {
      name: 'Leśna Cisza',
      bg: 'radial-gradient(circle at center, #051605 0%, #0A0A14 100%)',
      accent: '#39FF14',
      animation: 'clouds',
      music: 'ambient',
      why: 'Organiczne barwy i powolne ruchy redukują poziom kortyzolu, co sprzyja głębokiej koncentracji u osób potrzebujących wyciszenia.'
    },
    tech_motivated: {
      name: 'Cyber-Flow',
      bg: 'radial-gradient(circle at center, #0A0A14 0%, #001220 100%)',
      accent: '#00E5FF',
      animation: 'grid',
      music: 'synth',
      why: 'Wysoki kontrast i dynamiczne linie siatki stymulują dopaminę, wspierając stan "Flow" podczas intensywnej nauki.'
    },
    space_stressed: {
      name: 'Ciemna Mgławica',
      bg: 'radial-gradient(circle at center, #0A0A14 0%, #0D0D2B 100%)',
      accent: '#A594FF',
      animation: 'clouds',
      music: 'ambient',
      why: 'Wolno pulsujące mgławice w ciemnym odcieniu granatu obniżają napięcie nerwowe i sprzyjają skupieniu u osób w stanie stresu.'
    }
  };

  // Helper for chatbot music commands
  const getStreamByText = (text) => {
    if (text.includes('metal') || text.includes('rock') || text.includes('gitar') || text.includes('ciężk')) return streams.metal;
    if (text.includes('techno') || text.includes('elektr') || text.includes('synth') || text.includes('cyber')) return streams.synth;
    if (text.includes('hip hop') || text.includes('rap') || text.includes('lofi') || text.includes('chill') || text.includes('spok')) return streams.lofi;
    return streams.ambient;
  };

  const analyzeProfile = async () => {
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 2500));
    
    let profileKey = 'tech_motivated'; // Default
    
    // Priority-based matching
    if (obForm.neuroProfile === 'calm_needed' || obForm.neuroProfile === 'hsp') {
      profileKey = 'nature_calm';
    } else if (obForm.neuroProfile === 'adhd') {
      profileKey = obForm.interests === 'Kosmos' ? 'space_adhd' : 'space_adhd'; // ADHD always gets subtle motion
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
    
    setChatHistory(prev => [...prev, { 
      role: 'assistant', 
      text: `Zainicjowano profil: ${selectedAtmos.name}.\n\nDlaczego to działa: ${selectedAtmos.why}` 
    }]);

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
        audioRef.current.play().catch(e => {
          console.error("Autoplay blocked:", e);
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
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      const lowerText = userText.toLowerCase();
      let responseText = "Analizuję polecenie... Jeżeli potrzebujesz pomocy, wpisz /help lub /pomoc.";
      
      const musicKeywords = ['zmień', 'włącz', 'muzyk', 'radio', 'rock', 'lofi', 'metal', 'synth', 'ambient', 'rok'];
      const hasMusicIntent = musicKeywords.some(kw => lowerText.includes(kw));

      if (lowerText === '/help' || lowerText === '/pomoc' || lowerText === 'pomoc') {
        responseText = "Dostępne komendy:\n- 'zmień muzykę na [gatunek]' (np. rock, lofi, synthwave)\n- 'ciszej' / 'głośniej'\n- Możesz pytać o: LLM, Qwen, React, automatyzacje.";
      }
      else if (hasMusicIntent && !lowerText.includes('ciszej') && !lowerText.includes('głośniej')) {
        const newStream = getStreamByText(lowerText);
        setMusicConfig(newStream);
        setIsPlaying(true);
        responseText = `Odtwarzacz przeprogramowany. Słuchasz teraz: ${newStream.title}.`;
      } 
      else if (lowerText.includes('ciszej') || lowerText.includes('przycisz')) {
        setVolume(15);
        responseText = "Zmniejszyłem głośność strumienia.";
      }
      else if (lowerText.includes('głośniej') || lowerText.includes('podgłośń')) {
        setVolume(85);
        responseText = "Głośność zwiększona.";
      }
      else if (lowerText.includes('llm') || lowerText.includes('qwen') || lowerText.includes('model') || lowerText.includes('ai')) {
        responseText = "Mniejsze modele (SLM), takie jak Qwen2.5-Coder, są wysoce wyspecjalizowane. Pozwalają na lokalny inference na krawędzi (Edge) i obniżają koszty API, co jest kluczowe w nowoczesnej architekturze 2026 roku.";
      }
      else if (lowerText.includes('wyjaśnij') || lowerText.includes('wytłumacz') || lowerText.includes('co to jest')) {
        const searchTerms = lowerText.replace(/wyjaśnij|wytłumacz|co to jest|mi/g, '').trim().split(' ').filter(w => w.length > 2);
        let found = false;
        
        if (searchTerms.length > 0) {
          for (const lesson of lessons) {
            for (const concept of lesson.concepts) {
              const match = searchTerms.some(term => concept.term.toLowerCase().includes(term));
              if (match) {
                const textOnly = concept.explanation.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                responseText = `Z bazy wiedzy (${concept.term}):\n\n${textOnly.substring(0, 300)}... \n\nPrzejdź do modułu "${lesson.title}", by poznać szczegóły.`;
                found = true;
                break;
              }
            }
            if (found) break;
          }
        }
        
        if (!found) {
          responseText = "Zintegrowane API nie znalazło precyzyjnego dopasowania w lekcjach. Użyj słów kluczowych (np. 'wytłumacz LCP' lub 'wyjaśnij Node').";
        }
      }

      setChatHistory(prev => [...prev, { role: 'assistant', text: responseText }]);
    }, 800);
  };

  const currentLesson = currentLessonIndex !== null ? lessons[currentLessonIndex] : null;
  const isLessonCompleted = currentLesson && Object.keys(unlockedConcepts).length === currentLesson.concepts.length;

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
    switch(iconName) {
      case 'Zap': return <Zap className={className} />;
      case 'Clock': return <Clock className={className} />;
      case 'Shield': return <Shield className={className} />;
      case 'Database': return <Database className={className} />;
      case 'Brain': return <Brain className={className} />;
      case 'Workflow': return <Workflow className={className} />;
      case 'Rocket': return <Rocket className={className} />;
      default: return <Terminal className={className} />;
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    try {
      await signInWithGoogle();
      // onAuthStateChanged fires automatically after success
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
    localStorage.removeItem('tg_view');
  };

  // Show loading spinner while Firebase checks session
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
        <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(circle at center, rgba(100,220,255,0.04) 0%, transparent 60%)' }} />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-plasma/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px]" />

        {authError && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg animate-fade-in border border-red-400/30 whitespace-nowrap">
            {authError}
          </div>
        )}

        <div className="w-full max-w-sm z-10 p-10 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-plasma/40 shadow-plasma-glow">
              <img src="/logo.png" alt="Tech Grill Logo" className="w-full h-full object-cover" />
            </div>
          </div>

          <h1 className="text-4xl font-black text-center tracking-tighter mb-1">TECH GRILL</h1>
          <p className="text-center text-plasma font-bold text-xs tracking-[0.3em] uppercase mb-10">Senior Dev Academy</p>

          <button
            onClick={handleGoogleLogin}
            className="w-full group relative bg-white text-gray-800 font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 active:scale-[0.98] transition-all shadow-lg"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Kontynuuj z Google
          </button>

          <p className="text-center text-white/20 text-xs mt-8 leading-relaxed">
            Weryfikacja przez prawdziwe konto Google.<br/>Żadnych danych nie przechowujemy bez Twojej zgody.
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
        '--color-plasma': activeAtmosphere ? activeAtmosphere.accent : '#7B61FF'
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
        onPlanetClick={(p) => { 
          setFocusedPlanet(p);
          setXp(prev => prev + 1); // Mały XP za odkrycie planety
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
      
      {/* Supernova Effect Overlay */}
      {musicConfig && (
        <audio 
          key={musicConfig.url}
          ref={audioRef} 
          src={musicConfig.url} 
          loop 
          crossOrigin="anonymous"
          preload="auto"
          autoPlay={isPlaying}
        />
      )}

      {/* Globalny widget muzyczny */}
      {musicConfig && view !== 'onboarding' && (
        <div className="fixed bottom-6 right-6 z-[9000] glass-dark p-3 rounded-full flex items-center gap-3 border border-plasma/30 shadow-plasma-glow">
          <div className="w-8 h-8 rounded-full bg-plasma/20 flex items-center justify-center">
            {isPlaying ? (
              <Music className="w-4 h-4 text-plasma animate-pulse" />
            ) : (
              <Music className="w-4 h-4 text-graphite" />
            )}
          </div>
          <div className="hidden md:block text-xs font-bold text-plasmaLight max-w-[140px] truncate">
            {musicConfig.title}
          </div>
          <div className="flex items-center gap-2 border-l border-white/10 pl-3">
            <button onClick={toggleMusic} className="p-2 hover:bg-white/5 rounded-full transition-colors text-ghost">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2 group relative">
              <button onClick={toggleMute} className="p-2 hover:bg-white/5 rounded-full transition-colors text-ghost">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input 
                type="range" min="0" max="100" value={isMuted ? 0 : volume} 
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-20 h-1 bg-void rounded-full appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-plasma [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Achievements Pop */}
      {showAchievement && (
        <div className="achievement-pop fixed top-8 right-8 z-[10000] glass-dark p-4 rounded-2xl flex items-center gap-4 border border-plasma shadow-lg">
          <div className="bg-plasma/20 p-3 rounded-full">
            <Trophy className="text-plasma w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-plasmaLight uppercase font-bold tracking-widest">Achievement Unlocked</div>
            <div className="font-bold text-lg">{showAchievement}</div>
          </div>
        </div>
      )}

      {/* SIDEBAR (Inlined to prevent input focus loss) */}
      {view !== 'onboarding' && (
        <aside className="w-80 bg-void/40 backdrop-blur-xl border-r border-white/5 flex flex-col h-full sticky top-0 hidden lg:flex shrink-0 relative z-10 pointer-events-none">
          <div className="p-5 border-b border-white/5 flex items-center gap-3 pointer-events-auto">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-plasma/30 shrink-0 bg-void">
              {authUser?.photoURL ? (
                <img src={authUser.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <img src="/logo.png" alt="Tech Grill Logo" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-black text-base tracking-tighter leading-none truncate">
                {authUser?.displayName || 'TECH GRILL'}
              </h1>
              <h2 className="text-plasma text-[10px] font-bold tracking-widest uppercase truncate">
                {authUser?.email || 'Academy'}
              </h2>
            </div>
            <button 
              onClick={handleLogout} 
              title="Wyloguj"
              className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 border-b border-white/5 pointer-events-auto">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-ghost/10 rounded-full flex items-center justify-center border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ghost/50"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <div className="text-sm text-ghost/50 uppercase tracking-widest font-bold">Poziom 1</div>
                <div className="font-bold text-lg flex items-center gap-2 text-plasmaLight">
                  <Zap className="w-4 h-4 fill-plasma text-plasma" /> {xp} XP
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs font-bold text-ghost/70 mb-2">
                <span>Ukończone moduły</span>
                <span>{completedModules.length} / {lessons.length}</span>
              </div>
              <div className="h-2 bg-ghost/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-plasma transition-all duration-1000" 
                  style={{ width: `${(completedModules.length / lessons.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-1 pointer-events-auto">
            <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${view === 'dashboard' ? 'bg-plasma text-void shadow-plasma-glow' : 'text-ghost/70 hover:bg-white/5 hover:text-ghost'}`}>
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </button>
            <button onClick={() => setView('knowledge')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${view === 'knowledge' ? 'bg-plasma text-void shadow-plasma-glow' : 'text-ghost/70 hover:bg-white/5 hover:text-ghost'}`}>
              <BookOpen className="w-5 h-5" /> Moja Wiedza
            </button>
            <button onClick={() => setView('favorites')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${view === 'favorites' ? 'bg-plasma text-void shadow-plasma-glow' : 'text-ghost/70 hover:bg-white/5 hover:text-ghost'}`}>
              <Star className="w-5 h-5" /> Ulubione
            </button>
            <button onClick={() => setView('history')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${view === 'history' ? 'bg-plasma text-void shadow-plasma-glow' : 'text-ghost/70 hover:bg-white/5 hover:text-ghost'}`}>
              <History className="w-5 h-5" /> Historia
            </button>
          </div>

          <div className="flex-1 border-t border-white/5 mt-auto flex flex-col overflow-hidden bg-plasma/5 pointer-events-auto">
            <div className="p-4 border-b border-white/5 bg-void text-xs font-bold tracking-widest uppercase text-plasma flex items-center gap-2">
              <Brain className="w-4 h-4" /> AI Mentor
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scrollbar-hide">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-2 rounded-2xl max-w-[90%] whitespace-pre-wrap ${msg.role === 'user' ? 'bg-plasma text-void font-medium rounded-br-sm' : 'bg-ghost/10 text-ghost rounded-bl-sm border border-white/5'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-void shrink-0">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Zapytaj mentora (np. 'zmień muzykę')" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="w-full bg-ghost/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-ghost focus:outline-none focus:border-plasma transition-colors"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-ghost/50 hover:text-plasma transition-colors p-2">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="p-4 bg-void border-t border-white/5">
              <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-red-500/40 hover:text-red-500 hover:bg-red-500/5 transition-all">
                <Zap className="w-3 h-3" /> Resetuj System AI
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Scrollable Content Area */}
      <main className={`flex-1 overflow-y-auto relative z-10 pointer-events-none ${view === 'onboarding' ? 'flex items-center justify-center px-6 bg-[url("noise.png")]' : 'pb-32 px-6 lg:px-12 pt-12'}`}>
        {view === 'onboarding' && (
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
                    <label className="block text-xs font-bold tracking-widest text-plasma mb-3 uppercase">Twój dzisiejszy nastrój</label>
                    <select 
                      className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-ghost focus:outline-none focus:border-plasma transition-colors"
                      value={obForm.mood}
                      onChange={e => setObForm({...obForm, mood: e.target.value})}
                    >
                      <option value="">Wybierz...</option>
                      <option value="motivated">Zmotywowany</option>
                      <option value="fatigued">Zmęczony</option>
                      <option value="stressed">Zestresowany</option>
                      <option value="joyful">Radosny</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest text-plasma mb-3 uppercase">Profil Poznawczy</label>
                    <select 
                      className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-ghost focus:outline-none focus:border-plasma transition-colors"
                      value={obForm.neuroProfile}
                      onChange={e => setObForm({...obForm, neuroProfile: e.target.value})}
                    >
                      <option value="neurotypical">Neurotypowy</option>
                      <option value="adhd">ADHD / Rozproszenie</option>
                      <option value="hsp">Wysoka Wrażliwość</option>
                      <option value="calm_needed">Potrzeba Wyciszenia</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest text-plasma mb-3 uppercase">Twoje Pasje (Temat Atmosfery)</label>
                  <div className="flex flex-wrap gap-2">
                    {['Kosmos', 'Natura', 'Technologia', 'Cyberpunk', 'Minimalizm'].map(interest => (
                      <button
                        key={interest}
                        onClick={() => setObForm({...obForm, interests: interest})}
                        className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${obForm.interests === interest ? 'bg-plasma border-plasma text-void' : 'border-white/10 text-ghost/50 hover:border-plasma/50'}`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-6">
                   <div>
                    <label className="block text-xs font-bold tracking-widest text-plasma mb-2 uppercase">Co Cię teraz najbardziej uspokaja?</label>
                    <input 
                      type="text" 
                      placeholder="np. Szum deszczu, Cisza..."
                      className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-ghost focus:outline-none focus:border-plasma transition-colors"
                      value={obForm.calm}
                      onChange={e => setObForm({...obForm, calm: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  onClick={analyzeProfile}
                  disabled={isAnalyzing || !obForm.mood || !obForm.interests || !obForm.calm}
                  className="w-full mt-8 bg-plasma text-void font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-plasmaLight transition-all magnetic-btn disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      GENEROWANIE PROFILU ATMOSFERY...
                    </>
                  ) : (
                    <>
                      ZAINICJUJ ŚRODOWISKO <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="space-y-12 animate-fade-in max-w-5xl mx-auto pointer-events-auto">
            <header className="space-y-6 text-center mb-16 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-plasma/30 bg-plasma/5 text-plasma text-sm font-bold tracking-widest uppercase">
                <Brain className="w-4 h-4" /> Baza Wiedzy Odblokowana
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Wybierz Wektor Rozwoju
              </h1>
              <p className="text-ghost/70 text-lg max-w-2xl mx-auto leading-relaxed">
                Zdobądź praktyczną wiedzę na temat ekosystemu Next.js, automatyzacji z użyciem AI oraz tworzenia realnego wpływu na biznes. Środowisko zostało dostrojone do Twoich preferencji kognitywnych.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson, idx) => {
                const isCompleted = completedModules.includes(lesson.id);
                return (
                  <div 
                    key={lesson.id}
                    onClick={() => handleLessonStart(idx)}
                    className={`magnetic-btn glass p-8 rounded-[2.5rem] border hover:border-plasma/50 group cursor-pointer h-full flex flex-col justify-between transition-all ${isCompleted ? 'border-plasma/30 bg-plasma/5' : 'border-white/5'}`}
                  >
                    <div>
                      <div className="mb-6 w-12 h-12 rounded-2xl bg-void border border-white/10 flex items-center justify-center group-hover:bg-plasma transition-colors">
                        {renderIcon(lesson.icon, "text-plasma group-hover:text-void")}
                      </div>
                      <div className="text-xs font-bold uppercase tracking-widest text-plasma mb-2 flex items-center justify-between">
                        {lesson.category}
                        {isCompleted && <CheckCircle className="w-4 h-4 text-plasma" />}
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{lesson.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold opacity-50 group-hover:opacity-100 transition-opacity mt-8">
                      START LESSON <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === 'knowledge' && (
           <div className="animate-fade-in max-w-4xl mx-auto mt-12 space-y-8 pb-20 pointer-events-auto">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-16 h-16 rounded-2xl bg-plasma/10 border border-plasma/30 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-plasma" />
                 </div>
                 <div>
                    <h2 className="text-3xl font-bold">Baza Zewnętrzna</h2>
                    <p className="text-ghost/50">Zarządzaj swoimi materiałami referencyjnymi i notatkami.</p>
                 </div>
              </div>
              
              <div className="glass p-6 rounded-[2rem] border border-white/10 flex flex-col md:flex-row gap-4 items-center">
                 <input 
                   type="text" 
                   placeholder="Tytuł (np. Analiza LLM)" 
                   value={linkTitle} 
                   onChange={e => setLinkTitle(e.target.value)}
                   className="w-full md:w-1/3 bg-void border border-white/10 rounded-xl px-4 py-3 text-sm text-ghost focus:outline-none focus:border-plasma transition-colors"
                 />
                 <input 
                   type="url" 
                   placeholder="URL (np. https://...)" 
                   value={linkInput} 
                   onChange={e => setLinkInput(e.target.value)}
                   className="flex-1 w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-sm text-ghost focus:outline-none focus:border-plasma transition-colors"
                 />
                 <button 
                   onClick={() => {
                     if (linkTitle && linkInput) {
                       setSavedLinks([...savedLinks, { title: linkTitle, url: linkInput, id: Date.now() }]);
                       setLinkTitle(''); setLinkInput('');
                     }
                   }}
                   className="w-full md:w-auto bg-plasma text-void font-bold px-8 py-3 rounded-xl hover:bg-plasmaLight transition-colors"
                 >
                   ZAPISZ
                 </button>
              </div>

              <div className="space-y-4">
                 {savedLinks.length === 0 ? (
                    <div className="text-center p-12 border border-dashed border-white/10 rounded-[2rem] text-ghost/50">
                       Brak zapisanych linków. Dodaj swój pierwszy materiał badawczy powyżej.
                    </div>
                 ) : (
                    savedLinks.map(link => (
                       <div key={link.id} className="glass p-4 rounded-xl border border-white/5 flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-void border border-white/5 flex items-center justify-center">
                              <Database className="w-5 h-5 text-plasma" />
                            </div>
                            <a href={link.url} target="_blank" rel="noreferrer" className="font-bold text-lg hover:text-plasma transition-colors">
                               {link.title}
                            </a>
                          </div>
                          <button onClick={() => setSavedLinks(savedLinks.filter(l => l.id !== link.id))} className="px-4 py-2 text-sm font-bold text-ghost/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                             USUŃ
                          </button>
                       </div>
                    ))
                 )}
              </div>
           </div>
        )}

        {(view === 'favorites' || view === 'history') && (
           <div className="animate-fade-in max-w-3xl mx-auto mt-20 text-center space-y-6 pointer-events-auto">
              <div className="w-24 h-24 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                 {view === 'favorites' && <Star className="w-10 h-10 text-ghost/50" />}
                 {view === 'history' && <History className="w-10 h-10 text-ghost/50" />}
              </div>
              <h2 className="text-3xl font-bold">
                 {view === 'favorites' ? 'Ulubione Koncepty' : 'Historia Aktywności'}
              </h2>
              <p className="text-ghost/50 text-lg max-w-lg mx-auto">
                 Ta sekcja jest w trakcie konstruowania przez AI. Wróć do <span className="text-plasma cursor-pointer hover:underline" onClick={() => setView('dashboard')}>Dashboardu</span>, aby kontynuować naukę.
              </p>
           </div>
        )}

        {view === 'lesson' && currentLesson && (
          <div className="animate-slide-up space-y-8 max-w-4xl mx-auto pb-20 pointer-events-auto">
            <button 
              onClick={() => setView('dashboard')}
              className="flex items-center gap-2 text-ghost/50 hover:text-plasma transition-colors mb-8 bg-white/5 px-4 py-2 rounded-full font-medium text-sm w-fit"
            >
              <ArrowLeft className="w-4 h-4" /> Wróć do modułów
            </button>

            <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/10 relative overflow-hidden">
              <div className="text-xs font-bold uppercase tracking-widest text-plasma mb-4 flex items-center gap-2">
                {renderIcon(currentLesson.icon, "w-4 h-4")} {currentLesson.category}
              </div>
              <h2 className="text-4xl font-serif italic mb-8 leading-tight">{currentLesson.title}</h2>
              
              <div className="text-ghost/70 mb-8 font-medium text-lg border-l-2 border-plasma pl-4 bg-plasma/5 p-4 rounded-r-xl">
                Kliknij każdy koncept poniżej, aby odkryć jego dogłębne wyjaśnienie. Odblokuj wszystkie karty, aby podejść do quizu.
              </div>

              <div className="space-y-4">
                {currentLesson.concepts.map((concept, idx) => {
                  const isUnlocked = unlockedConcepts[idx];
                  return (
                    <div 
                      key={idx}
                      onClick={() => {
                        if (!isUnlocked) {
                          setUnlockedConcepts(prev => ({...prev, [idx]: true}));
                          addXp(10);
                        }
                      }}
                      className={`
                        border rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer
                        ${isUnlocked ? 'border-plasma/30 bg-plasma/5' : 'border-white/10 bg-void hover:border-plasma/50 hover:bg-white/5'}
                      `}
                    >
                      <div className="p-6 flex items-center justify-between">
                        <h3 className={`${isUnlocked ? 'text-plasmaLight font-bold' : 'text-ghost font-medium'} text-xl`}>
                          {concept.term}
                        </h3>
                        {isUnlocked ? <Unlock className="w-5 h-5 text-plasma" /> : <Lock className="w-5 h-5 text-ghost/30" />}
                      </div>
                      
                      {isUnlocked && (
                        <div className="px-6 pb-6 pt-2 animate-fade-in border-t border-plasma/10 mt-2">
                          <div className="prose-lesson space-y-4 text-ghost/80 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: concept.explanation.replace(/\n/g, '<br/>') }}></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center justify-center space-y-4">
                {!isLessonCompleted ? (
                  <p className="text-ghost/50 text-sm font-mono tracking-widest uppercase">Postęp: {Object.keys(unlockedConcepts).length}/{currentLesson.concepts.length} odblokowanych</p>
                ) : (
                  <button 
                    onClick={() => { setView('quiz'); window.scrollTo(0, 0); }}
                    className="w-full md:w-auto px-12 bg-plasma text-void font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-plasmaLight transition-all magnetic-btn shadow-plasma-glow"
                  >
                    ROZPOCZNIJ QUIZ <CheckCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'quiz' && currentLesson && (
          <div className="animate-slide-up space-y-8 max-w-3xl mx-auto pb-20 pointer-events-auto">
             <div className="flex justify-between items-center mb-8 bg-white/5 p-4 rounded-2xl border border-white/5">
               <button 
                onClick={() => setView('lesson')}
                className="flex items-center gap-2 text-ghost/70 hover:text-plasma transition-colors text-sm font-bold uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" /> Wróć do teorii
              </button>
              <div className="text-plasma font-mono text-sm tracking-widest font-bold">
                PYTANIE {currentQuizIndex + 1} / {currentLesson.quizzes.length}
              </div>
             </div>

            <div className="glass p-10 rounded-[3rem] border border-white/10 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-1 bg-plasma transition-all duration-300" style={{ width: `${((currentQuizIndex) / currentLesson.quizzes.length) * 100}%` }}></div>
              
              <p className="text-2xl md:text-3xl font-bold text-center mb-10 leading-relaxed">{currentLesson.quizzes[currentQuizIndex].question}</p>
              
              <div className="space-y-4">
                {currentLesson.quizzes[currentQuizIndex].options.map((option, i) => {
                  const isAnswered = answers[currentQuizIndex] !== undefined;
                  const isCorrect = i === currentLesson.quizzes[currentQuizIndex].correct;
                  const isSelected = answers[currentQuizIndex] === i;
                  
                  return (
                    <div 
                      key={i}
                      onClick={() => !isAnswered && setAnswers({...answers, [currentQuizIndex]: i})}
                      className={`
                        p-6 rounded-2xl border text-lg font-medium flex justify-between items-center transition-all
                        ${!isAnswered ? 'border-white/10 hover:border-plasma/50 cursor-pointer bg-void' : ''}
                        ${isAnswered && isCorrect ? 'border-green-neon text-green-neon bg-green-neon/10' : ''}
                        ${isAnswered && isSelected && !isCorrect ? 'border-red-500 text-red-500 bg-red-500/10' : ''}
                        ${isAnswered && !isSelected && !isCorrect ? 'border-white/5 opacity-50 bg-void' : ''}
                      `}
                    >
                      {option}
                      {isAnswered && isCorrect && <CheckCircle className="w-6 h-6 shrink-0 ml-4" />}
                    </div>
                  );
                })}
              </div>

              {answers[currentQuizIndex] !== undefined && (
                <div className="animate-fade-in pt-8 border-t border-white/10 mt-8">
                  {answers[currentQuizIndex] === currentLesson.quizzes[currentQuizIndex].correct ? (
                    <div className="text-center space-y-6">
                      <div className="text-green-neon text-2xl font-bold flex items-center justify-center gap-2">
                        <Trophy className="w-6 h-6" /> Poprawna odpowiedź! +50 XP
                      </div>
                      
                      {currentQuizIndex < currentLesson.quizzes.length - 1 ? (
                        <button 
                          onClick={() => {
                            addXp(50);
                            setCurrentQuizIndex(prev => prev + 1);
                          }}
                          className="w-full bg-plasma text-void font-bold py-5 rounded-2xl magnetic-btn shadow-plasma-glow text-lg"
                        >
                          NASTĘPNE PYTANIE
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            addXp(50, `Ukończono: ${currentLesson.title}`);
                            if (!completedModules.includes(currentLesson.id)) {
                              setCompletedModules(prev => [...prev, currentLesson.id]);
                            }
                            setView('dashboard');
                          }}
                          className="w-full bg-green-neon text-void font-bold py-5 rounded-2xl magnetic-btn shadow-lg text-lg"
                        >
                          ZAKOŃCZ MODUŁ
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center space-y-6">
                      <div className="text-red-400 text-xl font-bold flex items-center justify-center gap-2">
                        <Zap className="w-6 h-6" /> Błędna odpowiedź!
                      </div>
                      <button 
                        onClick={() => setAnswers({...answers, [currentQuizIndex]: undefined})}
                        className="w-full border border-white/20 bg-void text-ghost font-bold py-5 rounded-2xl hover:bg-white/5 transition-colors text-lg"
                      >
                        SPRÓBUJ PONOWNIE
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
