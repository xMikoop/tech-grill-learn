import React, { useEffect, useCallback, Suspense, lazy, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { lessons } from './data';
import { useIdentity } from './hooks/useIdentity';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useAppStore } from './store/useAppStore';
import { useImmersionStore } from './store/useImmersionStore';
import { useChat } from './hooks/useChat';
import { useOnboarding } from './hooks/useOnboarding';
import { useLobby } from './hooks/useLobby';
import { useLessonManagement } from './hooks/useLessonManagement';
import { useAchievements } from './hooks/useAchievements';
import { pathFromView } from './lib/viewRouting';
import { renderIcon } from './lib/icons';

// Components
import { Universe3D, CELESTIAL_INFO } from './components/Universe/Universe3D';
import Sidebar from './components/Sidebar/Sidebar';
import Onboarding from './components/Onboarding/Onboarding';
import AchievementPop from './components/Common/AchievementPop';
import GlobalAudio from './components/Audio/GlobalAudio';
import Supernova from './components/Common/Supernova';
import { GlobalChatInput } from './components/Social/GlobalChatInput';

// Pages - Lazy loaded
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Knowledge = lazy(() => import('./pages/Knowledge'));
const Lesson = lazy(() => import('./pages/Lesson'));
const Quiz = lazy(() => import('./pages/Quiz'));

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const identity = useIdentity();
  
  // Store state
  const {
    view, setView, currentLessonIndex, xp, setXp, activeAtmosphere,
    streak, completedLessons, checkAndUpdateStreak, resetSessionState, initializeUser, isHydrating
  } = useAppStore();
  
  const { setIsPlaying, focusedPlanet, setFocusedPlanet } = useImmersionStore();

  // Specialized Hooks (Deep Modules)
  const { showAchievement, triggerAchievement } = useAchievements();
  const chat = useChat();
  const onboarding = useOnboarding();
  const { broadcastPosition } = useLobby();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentLesson = currentLessonIndex !== null ? lessons[currentLessonIndex] : null;
  const lessonMgmt = useLessonManagement(currentLesson);

  const authUser = identity.user;
  const authLoading = identity.isLoading;

  // Streak & Auth Initialization
  useEffect(() => {
    if (identity.isAuthenticated) {
      checkAndUpdateStreak();
      initializeUser(authUser?.id);
    } else if (!authLoading) {
      initializeUser(null);
    }
  }, [identity.isAuthenticated, authLoading, authUser?.id, checkAndUpdateStreak, initializeUser]);

  // Route reflection (State -> URL)
  useEffect(() => {
    const targetPath = pathFromView(view, currentLessonIndex);
    if (location.pathname !== targetPath) navigate(targetPath, { replace: true });
  }, [view, currentLessonIndex, navigate, location.pathname]);

  const handleReset = () => {
    resetSessionState();
    lessonMgmt.setCurrentQuizIndex(0);
    lessonMgmt.setAnswers({});
    setIsPlaying(false);
    localStorage.clear();
  };

  const handlePlanetClick = useCallback((p) => {
    setFocusedPlanet(p);
    setXp(x => x + 1);
  }, [setFocusedPlanet, setXp]);

  if (authLoading || isHydrating) return (
    <div className="flex h-screen w-full bg-white text-black items-center justify-center flex-col gap-4">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="font-bold animate-pulse text-sm">TRWA INICJALIZACJA SYSTEMU...</p>
    </div>
  );

  if (!authUser) return (
    <div className="flex h-screen w-full bg-void text-ghost font-sora items-center justify-center selection:bg-plasma selection:text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(circle at center, rgba(100,220,255,0.04) 0%, transparent 60%)' }} />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-plasma/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px]" />

      <div className="max-w-md w-full px-6 relative z-10 text-center">
        <h1 className="text-4xl font-black mb-8">TECH GRILL <span className="text-plasma">ACADEMY</span></h1>
        <button onClick={identity.signIn} className="w-full bg-white text-gray-800 font-bold py-4 rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-3">
          Kontynuuj z Google
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-void text-ghost font-sora overflow-hidden relative"
         style={{ background: activeAtmosphere?.bg || 'radial-gradient(circle at center, #0A0A14 0%, #121212 100%)', '--color-plasma': activeAtmosphere?.accent || '#7B61FF' }}
         onClick={() => setFocusedPlanet(null)}>
      <Supernova />
      <Universe3D
        active={true}
        reducedMotion={reducedMotion}
        onPlanetClick={handlePlanetClick}
        focusedPlanet={focusedPlanet}
        onPositionChange={broadcastPosition}
      />
      <AchievementPop achievement={showAchievement} />
      <GlobalAudio />
      <GlobalChatInput />

      {/* Mobile Header */}
      {view !== 'onboarding' && (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-[100] p-4 flex items-center justify-between bg-void/80 backdrop-blur-md border-b border-white/5 pointer-events-auto">
          <div className="font-black text-sm tracking-tighter">TECH GRILL ACADEMY</div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg bg-plasma/10 text-plasma border border-plasma/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      )}

      {/* Planet Info Panel Overlay */}
      {focusedPlanet && CELESTIAL_INFO[focusedPlanet] && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5000] w-[90%] max-w-lg pointer-events-auto animate-fade-in">
          <div className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-plasma text-xs font-black tracking-widest uppercase mb-1">{CELESTIAL_INFO[focusedPlanet].type}</div>
                <h3 className="text-3xl font-serif italic">{CELESTIAL_INFO[focusedPlanet].name}</h3>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                {renderIcon(CELESTIAL_INFO[focusedPlanet].icon, "w-6 h-6 text-plasma")}
              </div>
            </div>
            <p className="text-ghost/70 leading-relaxed">{CELESTIAL_INFO[focusedPlanet].description}</p>
            <button onClick={() => setFocusedPlanet(null)} className="w-full mt-8 bg-white text-void font-bold py-4 rounded-xl hover:bg-plasma hover:text-white transition-all uppercase tracking-widest text-xs">
              Powrót do eksploracji
            </button>
          </div>
        </div>
      )}

      {view !== 'onboarding' && (
        <Sidebar
          authUser={authUser} xp={xp} streak={streak} completedModules={completedLessons}
          lessons={lessons} view={view} setView={(v) => { setView(v); setIsMobileMenuOpen(false); }} 
          handleLogout={identity.signOut}
          {...chat} handleReset={handleReset}
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
        />
      )}

      <main className={`flex-1 overflow-y-auto relative z-10 pointer-events-none ${view === 'onboarding' ? 'flex items-center justify-center' : 'pb-32 px-6 lg:px-12 pt-24 lg:pt-12'}`}>
        <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-plasma" /></div>}>
          {view === 'onboarding' && <Onboarding {...onboarding} />}
          {view === 'dashboard' && <Dashboard lessons={lessons} handleLessonStart={lessonMgmt.handleLessonStart} renderIcon={renderIcon} completedLessons={completedLessons} streak={streak} xp={xp} />}
          {view === 'knowledge' && <Knowledge lessons={lessons} setView={setView} />}
          {view === 'lesson' && currentLesson && <Lesson currentLesson={currentLesson} setView={setView} unlockedConcepts={lessonMgmt.unlockedConcepts} setUnlockedConcepts={lessonMgmt.setUnlockedConcepts} renderIcon={renderIcon} />}
          {view === 'quiz' && currentLesson && <Quiz currentLesson={currentLesson} currentQuizIndex={lessonMgmt.currentQuizIndex} setCurrentQuizIndex={lessonMgmt.setCurrentQuizIndex} answers={lessonMgmt.answers} setAnswers={lessonMgmt.setAnswers} setView={setView} onCompleteLesson={(l) => lessonMgmt.completeCurrentLesson(l, triggerAchievement)} />}
        </Suspense>
      </main>
    </div>
  );
};

export default App;
