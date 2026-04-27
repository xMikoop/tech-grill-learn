import React, { useState, useEffect } from 'react';
import { Zap, Shield, Clock, Terminal, CheckCircle, ChevronRight, Trophy, ArrowLeft, Database, Brain, Workflow, Rocket, Unlock, Lock } from 'lucide-react';
import { lessons } from './data';

const App = () => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(null);
  const [xp, setXp] = useState(0);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'lesson', 'quiz'
  
  // Lesson state
  const [unlockedConcepts, setUnlockedConcepts] = useState({}); // { 0: true, 1: true }
  
  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showAchievement, setShowAchievement] = useState(null);

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
    window.scrollTo(0, 0);
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
    <div className="min-h-screen bg-void text-ghost font-sora selection:bg-plasma selection:text-white pb-20">
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

      {/* Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
        <div className="glass-dark px-6 py-4 rounded-full flex items-center justify-between border border-white/10 shadow-2xl">
          <div className="flex items-center gap-2 font-black text-xl tracking-tighter cursor-pointer hover:text-plasma transition-colors" onClick={() => setView('dashboard')}>
            <div className="w-8 h-8 bg-plasma rounded-lg flex items-center justify-center">
              <Terminal className="w-5 h-5 text-void" />
            </div>
            <span className="hidden sm:inline">TECH GRILL <span className="text-plasma">ACADEMY</span></span>
            <span className="sm:hidden text-plasma">TGA</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full border border-plasma/30">
              <Zap className="w-4 h-4 text-plasma fill-plasma" />
              <span className="font-bold text-sm">{xp} XP</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 px-6 max-w-5xl mx-auto">
        {view === 'dashboard' && (
          <div className="space-y-12 animate-fade-in">
            <header className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Wybierz Ścieżkę Nauki
              </h1>
              <p className="text-graphite text-lg max-w-2xl">
                Zdobądź praktyczną wiedzę na temat ekosystemu Next.js, automatyzacji z użyciem AI oraz tworzenia realnego wpływu na biznes.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson, idx) => (
                <div 
                  key={lesson.id}
                  onClick={() => handleLessonStart(idx)}
                  className="magnetic-btn glass p-8 rounded-[2.5rem] border border-white/5 hover:border-plasma/50 group cursor-pointer h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-6 w-12 h-12 rounded-2xl bg-void border border-white/10 flex items-center justify-center group-hover:bg-plasma transition-colors">
                      {renderIcon(lesson.icon, "text-plasma group-hover:text-void")}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest text-plasma mb-2">{lesson.category}</div>
                    <h3 className="text-2xl font-bold mb-4">{lesson.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold opacity-50 group-hover:opacity-100 transition-opacity">
                    START LESSON <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'lesson' && currentLesson && (
          <div className="animate-slide-up space-y-8 max-w-3xl mx-auto">
            <button 
              onClick={() => setView('dashboard')}
              className="flex items-center gap-2 text-graphite hover:text-plasma transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Wróć do modułów
            </button>

            <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/10 relative overflow-hidden">
              <div className="text-xs font-bold uppercase tracking-widest text-plasma mb-4 flex items-center gap-2">
                {renderIcon(currentLesson.icon, "w-4 h-4")} {currentLesson.category}
              </div>
              <h2 className="text-4xl font-serif italic mb-8">{currentLesson.title}</h2>
              
              <div className="text-graphite mb-8 font-medium">
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
                        ${isUnlocked ? 'border-plasma/30 bg-plasma/5' : 'border-white/10 bg-void hover:border-plasma/50'}
                      `}
                    >
                      <div className="p-6 flex items-center justify-between">
                        <h3 className={`${isUnlocked ? 'text-plasmaLight font-bold' : 'text-ghost font-medium'} text-xl`}>
                          {concept.term}
                        </h3>
                        {isUnlocked ? <Unlock className="w-5 h-5 text-plasma" /> : <Lock className="w-5 h-5 text-graphite" />}
                      </div>
                      
                      {isUnlocked && (
                        <div className="px-6 pb-6 pt-2 animate-fade-in border-t border-plasma/10 mt-2">
                          <div className="prose-lesson space-y-4 text-ghost/80" dangerouslySetInnerHTML={{ __html: concept.explanation.replace(/\n/g, '<br/>') }}></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center justify-center space-y-4">
                {!isLessonCompleted ? (
                  <p className="text-graphite text-sm">Odkryj wszystkie koncepty ({Object.keys(unlockedConcepts).length}/{currentLesson.concepts.length}), aby odblokować test wiedzy.</p>
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
          <div className="animate-slide-up space-y-8 max-w-2xl mx-auto">
             <div className="flex justify-between items-center mb-8">
               <button 
                onClick={() => setView('lesson')}
                className="flex items-center gap-2 text-graphite hover:text-plasma transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Wróć do teorii
              </button>
              <div className="text-plasma font-mono text-sm tracking-widest font-bold">
                PYTANIE {currentQuizIndex + 1} / {currentLesson.quizzes.length}
              </div>
             </div>

            <div className="glass p-10 rounded-[3rem] border border-white/10 space-y-8 relative overflow-hidden">
              {/* Progress bar */}
              <div className="absolute top-0 left-0 h-1 bg-plasma transition-all duration-300" style={{ width: `${((currentQuizIndex) / currentLesson.quizzes.length) * 100}%` }}></div>
              
              <p className="text-2xl font-bold text-center mb-8">{currentLesson.quizzes[currentQuizIndex].question}</p>
              
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
                        quiz-option p-6 rounded-2xl border text-lg font-bold flex justify-between items-center
                        ${!isAnswered ? 'border-white/10' : ''}
                        ${isAnswered && isCorrect ? 'border-green-neon text-green-neon bg-green-neon/10' : ''}
                        ${isAnswered && isSelected && !isCorrect ? 'border-red-500 text-red-500 bg-red-500/10' : ''}
                        ${isAnswered ? 'cursor-default' : ''}
                      `}
                    >
                      {option}
                      {isAnswered && isCorrect && <CheckCircle className="w-6 h-6" />}
                    </div>
                  );
                })}
              </div>

              {answers[currentQuizIndex] !== undefined && (
                <div className="animate-fade-in pt-8">
                  {answers[currentQuizIndex] === currentLesson.quizzes[currentQuizIndex].correct ? (
                    <div className="text-center space-y-6">
                      <div className="text-green-neon text-xl font-bold">Poprawna odpowiedź! +50 XP</div>
                      
                      {currentQuizIndex < currentLesson.quizzes.length - 1 ? (
                        <button 
                          onClick={() => {
                            addXp(50);
                            setCurrentQuizIndex(prev => prev + 1);
                          }}
                          className="w-full bg-plasma text-void font-bold py-5 rounded-2xl magnetic-btn shadow-lg"
                        >
                          NASTĘPNE PYTANIE
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            addXp(50, `Ukończono: ${currentLesson.title}`);
                            setView('dashboard');
                          }}
                          className="w-full bg-plasma text-void font-bold py-5 rounded-2xl magnetic-btn shadow-lg"
                        >
                          ZAKOŃCZ MODUŁ
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center space-y-6">
                      <div className="text-red-400 text-xl font-bold">Błędna odpowiedź!</div>
                      <button 
                        onClick={() => setAnswers({...answers, [currentQuizIndex]: undefined})}
                        className="w-full border border-white/20 text-ghost font-bold py-5 rounded-2xl hover:bg-white/5 transition-colors"
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

      {/* Footer Status */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 glass-dark px-4 py-2 rounded-full border border-white/5 text-[10px] font-mono tracking-widest uppercase text-graphite shadow-xl">
          <span className="w-2 h-2 bg-green-neon rounded-full animate-pulse-slow"></span>
          System Operational: Tech Grill Academy v2.0
        </div>
      </footer>
    </div>
  );
};

export default App;
