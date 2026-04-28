import React, { useEffect, useRef } from 'react';
import { useLobbyStore } from '../../store/useLobbyStore';

/**
 * Ghost - Imperatywny komponent Ducha w CSS 3D.
 * Nie re-renderuje się przy zmianie pozycji.
 * Wykorzystuje Lerp do płynnego ruchu.
 */
export const Ghost = ({ uid }) => {
  const meshRef = useRef(null);
  // Śledzimy aktualną wyinterpolowaną pozycję
  const currentPos = useRef({ x: 0, y: 0, z: 0 });

  // Subskrypcja do danych tekstowych (rzadkie zmiany - OK dla Reacta)
  const player = useLobbyStore(state => state.players.find(p => p.uid === uid));

  useEffect(() => {
    let animId;

    const updateLoop = () => {
      // Pobieramy cel z mapy imperatywnej (bez subskrypcji Reacta!)
      const target = useLobbyStore.getState().ghosts.get(uid);
      
      if (target && target.position && meshRef.current) {
        const [tx, ty, tz] = target.position;
        
        // Interpolacja Liniowa (Lerp)
        // Pozwala na płynne dociąganie nawet przy 10Hz danych wejściowych
        currentPos.current.x += (tx - currentPos.current.x) * 0.1;
        currentPos.current.y += (ty - currentPos.current.y) * 0.1;
        currentPos.current.z += (tz - currentPos.current.z) * 0.1;

        // Bezpośrednia aplikacja do styli DOM (Performance King)
        meshRef.current.style.transform = 
          `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, ${currentPos.current.z}px)`;
      }
      
      animId = requestAnimationFrame(updateLoop);
    };

    animId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animId);
  }, [uid]);

  return (
    <div 
      ref={meshRef}
      className="absolute pointer-events-none"
      style={{ 
        transformStyle: 'preserve-3d', 
        transition: 'opacity 0.5s',
        top: '50%',
        left: '50%',
        width: '0',
        height: '0'
      }}
    >
      {/* Ghost Core - Neonowy sześcian w CSS */}
      <div className="relative w-16 h-16">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-plasma/40 blur-2xl rounded-full animate-pulse" />
        
        {/* Core cube face */}
        <div className="w-full h-full bg-void border-2 border-plasma flex items-center justify-center shadow-[0_0_30px_rgba(123,97,255,0.6)]">
           <div className="w-4 h-4 bg-plasma rounded-full animate-ping" />
        </div>

        {/* Chat Bubble */}
        {player?.lastMessage && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-plasma text-void text-xs px-3 py-1.5 rounded-lg font-black whitespace-nowrap shadow-[0_0_20px_rgba(123,97,255,0.4)] animate-in fade-in slide-in-from-bottom-4 duration-300">
            {player.lastMessage}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-plasma rotate-45" />
          </div>
        )}

        {/* Label */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-black font-mono text-plasma uppercase tracking-widest bg-void/90 px-2 py-1 border border-plasma/40 whitespace-nowrap shadow-lg">
          {player?.displayName || `GHOST_${uid.slice(0, 4)}`}
        </div>
      </div>
    </div>
  );
};
