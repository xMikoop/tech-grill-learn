import React, { useEffect, useCallback, Suspense, lazy, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { lessons } from './data';
import { useIdentity } from './hooks/useIdentity';
import { useAppStore } from './store/useAppStore';
import { useImmersionStore } from './store/useImmersionStore';
import { useOnboarding } from './hooks/useOnboarding';
import { useLessonManagement } from './hooks/useLessonManagement';
import { useAchievements } from './hooks/useAchievements';
import { pathFromView } from './lib/viewRouting';
import { renderIcon } from './lib/icons';
import MainLayout from './components/Common/MainLayout';

// Components
import Onboarding from './components/Onboarding/Onboarding';

// Pages - Lazy loaded
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Knowledge = lazy(() => import('./pages/Knowledge'));
const Lesson = lazy(() => import('./pages/Lesson'));
const Quiz = lazy(() => import('./pages/Quiz'));

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const identity = useIdentity();
  
  // Store state
  const {
    view, setView, currentLessonIndex, xp, completedLessons, streak,
    checkAndUpdateStreak, initializeUser, isHydrating
  } = useAppStore();
  
  const { focusedPlanet } = useImmersionStore();

  // Specialized Hooks (Deep Modules)
  const { triggerAchievement } = useAchievements();
  const onboarding = useOnboarding();
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

  const handlePlanetClick = useCallback((p) => {
    // Moved to store/layout if needed, but keeping for XP reward
    useAppStore.getState().setXp(x => x + 1);
  }, []);

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
    <MainLayout identity={identity} lessonMgmt={lessonMgmt} onboarding={onboarding}>
      {view === 'onboarding' && <Onboarding {...onboarding} />}
      {view === 'dashboard' && <Dashboard lessons={lessons} handleLessonStart={lessonMgmt.handleLessonStart} renderIcon={renderIcon} completedLessons={completedLessons} streak={streak} xp={xp} />}
      {view === 'knowledge' && <Knowledge lessons={lessons} setView={setView} />}
      {view === 'favorites' && <Knowledge lessons={lessons} setView={setView} />}
      {view === 'history' && <Knowledge lessons={lessons} setView={setView} />}
      {view === 'lesson' && currentLesson && <Lesson currentLesson={currentLesson} setView={setView} unlockedConcepts={lessonMgmt.unlockedConcepts} setUnlockedConcepts={lessonMgmt.setUnlockedConcepts} renderIcon={renderIcon} />}
      {view === 'quiz' && currentLesson && <Quiz currentLesson={currentLesson} currentQuizIndex={lessonMgmt.currentQuizIndex} setCurrentQuizIndex={lessonMgmt.setCurrentQuizIndex} answers={lessonMgmt.answers} setAnswers={lessonMgmt.setAnswers} setView={setView} onCompleteLesson={(l) => lessonMgmt.completeCurrentLesson(l, triggerAchievement)} />}
    </MainLayout>
  );
};


export default App;
