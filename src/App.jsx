import React, { useState, useEffect, useRef } from 'react';
import { Zap, Shield, Clock, Terminal, CheckCircle, ChevronRight, Trophy, ArrowLeft, Database, Brain, Workflow, Rocket, Unlock, Lock, Music, Play, Pause, Volume2, VolumeX, Loader2, Send, MessageSquare, BookOpen, Star, History, LayoutDashboard } from 'lucide-react';
import { lessons } from './data';

const App = () => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(null);
  const [xp, setXp] = useState(0);
  const [view, setView] = useState('onboarding'); // 'onboarding', 'dashboard', 'lesson', 'quiz', 'knowledge', 'favorites', 'history'
  
  // Lesson state
  const [unlockedConcepts, setUnlockedConcepts] = useState({});
  const [completedModules, setCompletedModules] = useState([]); 
  
  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showAchievement, setShowAchievement] = useState(null);
  const [savedLinks, setSavedLinks] = useState([]);
  const [linkInput, setLinkInput] = useState('');
  const [linkTitle, setLinkTitle] = useState('');

  // Onboarding & Music state
  const [obForm, setObForm] = useState({ calm: '', energy: '', joy: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [musicConfig, setMusicConfig] = useState(null); 
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const addXp = (amount, achievement) => {
    setXp(prev => prev + amount);
    if (achievement) {
      setShowAchievement(achievement);
      setTimeout(() => setShowAchievement(null), 4000);
    }
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

  const getStreamByText = (text) => {
    if (text.includes('metal') || text.includes('rock') || text.includes('gitar') || text.includes('ciężk')) return streams.metal;
    if (text.includes('techno') || text.includes('elektr') || text.includes('synth') || text.includes('cyber')) return streams.synth;
    if (text.includes('hip hop') || text.includes('rap') || text.includes('lofi') || text.includes('chill') || text.includes('spok')) return streams.lofi;
    return streams.ambient;
  };

  const analyzeProfile = async () => {
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    
    const text = (obForm.calm + ' ' + obForm.energy + ' ' + obForm.joy).toLowerCase();
    const config = getStreamByText(text);

    setMusicConfig(config);
    setIsAnalyzing(false);
    setView('dashboard');
    setIsPlaying(true);
    addXp(100, 'Zainicjowano profil AI');
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

      setChatHistory(prev => [...prev, { role: 'assistant', text: responseText }]);
    }, 800);
  };

  const currentLesson = currentLessonIndex !== null ? lessons[currentLessonIndex] : null;
  const isLessonCompleted = currentLesson && Object.keys(unlockedConcepts).length === currentLesson.concepts.length;

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

  return (
    <div className="flex h-screen bg-void text-ghost font-sora selection:bg-plasma selection:text-white overflow-hidden">
      
      {/* HTML5 Audio Player */}
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
        <aside className="w-80 bg-void border-r border-white/5 flex flex-col h-full sticky top-0 hidden lg:flex shrink-0">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 bg-plasma rounded-xl flex items-center justify-center shadow-plasma-glow">
              <Terminal className="w-6 h-6 text-void" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tighter leading-none">TECH GRILL</h1>
              <h2 className="text-plasma text-sm font-bold tracking-widest uppercase">Academy</h2>
            </div>
          </div>

          <div className="p-6 border-b border-white/5">
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

          <div className="p-4 space-y-1">
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

          <div className="flex-1 border-t border-white/5 mt-auto flex flex-col overflow-hidden bg-plasma/5">
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
          </div>
        </aside>
      )}

      {/* Scrollable Content Area */}
      <main className={`flex-1 overflow-y-auto ${view === 'onboarding' ? 'flex items-center justify-center px-6 bg-[url("noise.png")]' : 'pb-32 px-6 lg:px-12 pt-12 relative'}`}>
        
        {view === 'onboarding' && (
          <div className="max-w-2xl w-full animate-fade-in relative z-10">
            <div className="glass-dark p-8 md:p-12 rounded-[3rem] border border-plasma/30 shadow-plasma-glow">
              <div className="w-16 h-16 bg-plasma/10 rounded-2xl border border-plasma/50 flex items-center justify-center mb-8 mx-auto">
                <Brain className="w-8 h-8 text-plasma" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Inicjalizacja Profilu</h1>
              <p className="text-graphite text-center mb-10 text-lg">
                Jestem Twoim cyfrowym mentorem. Zanim zaczniemy, muszę dostroić środowisko edukacyjne do Twoich częstotliwości kognitywnych.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold tracking-widest text-plasma mb-2 uppercase">1. Co Cię uspokaja?</label>
                  <input 
                    type="text" 
                    placeholder="np. Klasyka, Szum deszczu, Ambient..."
                    className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-ghost focus:outline-none focus:border-plasma transition-colors"
                    value={obForm.calm}
                    onChange={e => setObForm({...obForm, calm: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold tracking-widest text-plasma mb-2 uppercase">2. Co daje Ci energię?</label>
                  <input 
                    type="text" 
                    placeholder="np. Techno, Metal, Synthwave..."
                    className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-ghost focus:outline-none focus:border-plasma transition-colors"
                    value={obForm.energy}
                    onChange={e => setObForm({...obForm, energy: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold tracking-widest text-plasma mb-2 uppercase">3. Co sprawia Ci największą radość?</label>
                  <input 
                    type="text" 
                    placeholder="np. Programowanie nocą, Koty, Gry retro..."
                    className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-ghost focus:outline-none focus:border-plasma transition-colors"
                    value={obForm.joy}
                    onChange={e => setObForm({...obForm, joy: e.target.value})}
                  />
                </div>

                <button 
                  onClick={analyzeProfile}
                  disabled={isAnalyzing || !obForm.calm || !obForm.energy || !obForm.joy}
                  className="w-full mt-8 bg-plasma text-void font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-plasmaLight transition-all magnetic-btn disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      ANALIZOWANIE WZORCÓW PRZEZ AI...
                    </>
                  ) : (
                    <>
                      DOSTRÓJ ŚRODOWISKO <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="space-y-12 animate-fade-in max-w-5xl mx-auto">
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
           <div className="animate-fade-in max-w-4xl mx-auto mt-12 space-y-8 pb-20">
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
           <div className="animate-fade-in max-w-3xl mx-auto mt-20 text-center space-y-6">
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
          <div className="animate-slide-up space-y-8 max-w-4xl mx-auto pb-20">
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
          <div className="animate-slide-up space-y-8 max-w-3xl mx-auto pb-20">
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
