import React, { useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import gsap from 'gsap';

const AchievementPop = ({ achievement }) => {
  const containerRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    if (!achievement || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.fromTo(containerRef.current,
        { x: 400, opacity: 0, scale: 0.8 },
        { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
      );

      // Continuous glow animation
      gsap.to(glowRef.current, {
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.2, 1],
        duration: 2,
        repeat: -1,
        ease: 'sine.inOut'
      });
    });

    return () => ctx.revert();
  }, [achievement]);

  if (!achievement) return null;

  const IconComponent = Icons[achievement.icon] || Icons.Trophy;

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-8 right-8 z-[10000] glass-dark p-1 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden min-w-[320px]"
    >
      <div ref={glowRef} className="absolute inset-0 opacity-20 blur-xl pointer-events-none" style={{ backgroundColor: achievement.color }} />
      
      <div className="relative flex items-center gap-5 p-5 bg-void/40 rounded-[1.9rem] backdrop-blur-xl">
        <div className="relative shrink-0">
          <div className="absolute inset-0 blur-md opacity-50" style={{ backgroundColor: achievement.color }} />
          <div 
            className="relative w-16 h-16 rounded-2xl flex items-center justify-center border border-white/20"
            style={{ background: `linear-gradient(135deg, ${achievement.color}44, ${achievement.color}11)` }}
          >
            <IconComponent className="w-8 h-8" style={{ color: achievement.color }} />
          </div>
        </div>

        <div className="flex-1">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-50">
            Nowe Osiągnięcie
          </div>
          <div className="font-bold text-xl leading-tight mb-1">{achievement.title}</div>
          <div className="text-xs text-ghost/60 leading-snug">{achievement.description}</div>
        </div>
      </div>
    </div>
  );
};

export default AchievementPop;
