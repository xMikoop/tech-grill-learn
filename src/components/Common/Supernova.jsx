import React from 'react';
import { useImmersionStore } from '../../store/useImmersionStore';

const Supernova = () => {
  const showSupernova = useImmersionStore((state) => state.showSupernova);

  if (!showSupernova) return null;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none flex items-center justify-center bg-white/10 animate-fade-out" style={{ animationDuration: '2s' }}>
      {/* Central Flash */}
      <div className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_200px_100px_#fff,0_0_400px_200px_var(--color-plasma)] animate-ping" />
      
      {/* Shockwave Rings */}
      <div className="absolute w-10 h-10 border-4 border-white/50 rounded-full animate-shockwave" />
      <div className="absolute w-10 h-10 border-2 border-plasma/30 rounded-full animate-shockwave" style={{ animationDelay: '0.2s' }} />
      <div className="absolute w-10 h-10 border border-white/20 rounded-full animate-shockwave" style={{ animationDelay: '0.4s' }} />

      {/* Light Burst */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent animate-pulse" />
    </div>
  );
};

export default Supernova;
