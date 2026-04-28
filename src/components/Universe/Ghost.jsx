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
      style={{ transformStyle: 'preserve-3d', transition: 'opacity 0.5s' }}
    >
      {/* Ghost Core - Neonowy sześcian w CSS */}
      <div className="relative w-8 h-8">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-plasma/30 blur-xl rounded-full animate-pulse" />
        
        {/* Core cube face */}
        <div className="w-full h-full bg-void border border-plasma/50 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,255,0.3)]">
           <div className="w-2 h-2 bg-plasma rounded-full animate-ping" />
        </div>

        {/* Label */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-mono text-plasma uppercase tracking-tighter bg-void/80 px-1 py-0.5 border border-plasma/20 whitespace-nowrap">
          GHOST_{uid.slice(0, 4)}
        </div>
      </div>
    </div>
  );
};
