import React, { Suspense, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { Universe3D, CELESTIAL_INFO } from '../Universe/Universe3D';
import Sidebar from '../Sidebar/Sidebar';
import AchievementPop from './AchievementPop';
import GlobalAudio from '../Audio/GlobalAudio';
import Supernova from './Supernova';
import { GlobalChatInput } from '../Social/GlobalChatInput';
import { useAppStore } from '../../store/useAppStore';
import { useImmersionStore } from '../../store/useImmersionStore';
import { useAchievements } from '../../hooks/useAchievements';
import { useChat } from '../../hooks/useChat';
import { useLobby } from '../../hooks/useLobby';
import { lessons } from '../../data';
import { renderIcon } from '../../lib/icons';

const MainLayout = ({ children, identity, lessonMgmt }) => {
  const {
    view, setView, xp, activeAtmosphere, streak, completedLessons, 
    resetSessionState 
  } = useAppStore();

  const chat = useChat();
  const { focusedPlanet, setFocusedPlanet, setIsPlaying } = useImmersionStore();
  const { showAchievement } = useAchievements();
  const { broadcastPosition } = useLobby();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const authUser = identity.user;

  const handleReset = () => {
    resetSessionState();
    lessonMgmt.setCurrentQuizIndex(0);
    lessonMgmt.setAnswers({});
    setIsPlaying(false);
    localStorage.clear();
  };

  const handlePlanetClick = useCallback((p) => {
    setFocusedPlanet(p);
  }, [setFocusedPlanet]);

  return (
    <div 
      className="flex h-screen bg-void text-ghost font-sora overflow-hidden relative transition-colors duration-1000"
      style={{ 
        background: activeAtmosphere?.bg || 'radial-gradient(circle at center, #0A0A14 0%, #121212 100%)', 
        '--color-plasma': activeAtmosphere?.accent || '#7B61FF' 
      }}
      onClick={() => setFocusedPlanet(null)}
    >
      <Supernova />
      
      {/* Persistent Universe Layer */}
      <Universe3D
        active={true}
        onPlanetClick={handlePlanetClick}
        focusedPlanet={focusedPlanet}
        onPositionChange={broadcastPosition}
        atmosphere={activeAtmosphere}
      />
      
      <AchievementPop achievement={showAchievement} />
      <GlobalAudio />
      <GlobalChatInput />

      {/* Mobile Header Overlay */}
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

      {/* Planet Info Panel */}
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
          handleReset={handleReset}
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
          {...chat}
        />
      )}

      <main className={`flex-1 overflow-y-auto relative z-10 pointer-events-none ${view === 'onboarding' ? 'flex items-center justify-center' : 'pb-32 px-6 lg:px-12 pt-24 lg:pt-12'}`}>
        <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-plasma" /></div>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
};

export default MainLayout;
