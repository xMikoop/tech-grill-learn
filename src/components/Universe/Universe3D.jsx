import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { GhostsContainer } from './GhostsContainer';

export const CELESTIAL_INFO = {
  sun: {
    name: 'Słońce',
    type: 'Gwiazda typu G2V',
    description: 'Centralna gwiazda Układu Słonecznego, stanowiąca 99,8% jego masy. To gigantyczny reaktor termojądrowy, który zasila życie na Ziemi.',
    age: '4.6 mld lat',
    comp: 'Wodór (73%), Hel (25%)',
    fact: 'Masa Słońca to 99.86% masy całego Układu Słonecznego.',
    life: 'Ok. 5 mld lat do fazy Czerwonego Olbrzyma.',
    icon: 'Sun'
  },
  saturn: {
    name: 'Saturn',
    type: 'Gazowy Olbrzym',
    description: 'Druga co do wielkości planeta, znana ze swojego spektakularnego systemu pierścieni złożonych z lodu i pyłu.',
    age: '4.5 mld lat',
    comp: 'Wodór, Hel',
    fact: 'Gęstość Saturna jest mniejsza od gęstości wody – mógłby pływać w ogromnym basenie.',
    life: 'Stabilna przez miliardy lat.',
    icon: 'Disc'
  },
  jupiter: {
    name: 'Jowisz',
    type: 'Gazowy Olbrzym',
    description: 'Największa planeta układu, posiadająca silne pole magnetyczne i dziesiątki księżyców. Jej Wielka Czerwona Plama to gigantyczny antycyklon.',
    age: '4.5 mld lat',
    comp: 'Głównie Wodór i Hel',
    fact: 'Wielka Czerwona Plama wieje od co najmniej 350 lat.',
    life: 'Stabilna przez miliardy lat.',
    icon: 'CircleDot'
  },
  earth: {
    name: 'Ziemia',
    type: 'Planeta Skalista',
    description: 'Nasz dom. Jedyna znana planeta, na której występuje życie i woda w stanie ciekłym na powierzchni.',
    age: '4.54 mld lat',
    comp: 'Żelazo, Tlen, Krzem',
    fact: 'Jedyna planeta, której nazwa nie pochodzi od greckich lub rzymskich bóstw.',
    life: 'Ok. 1-2 mld lat.',
    icon: 'Globe'
  },
  black_hole: {
    name: 'Czarna Dziura',
    type: 'Osobliwość',
    description: 'Obszar czasoprzestrzeni, którego grawitacja jest tak silna, że nic, nawet światło, nie może go opuścić.',
    age: 'Różny',
    comp: 'Zapadnięta Masa',
    fact: 'Czas zwalnia w pobliżu horyzontu zdarzeń z powodu ogromnej grawitacji.',
    life: 'Paruje przez miliardy lat (Promieniowanie Hawkinga).',
    icon: 'Target'
  },
};

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
      {STATIC_STARS.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            '--duration': star.duration,
          }}
        />
      ))}
    </div>
  );
});

const AtmosphereBubbles = React.memo(({ config }) => {
  if (!config) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 mix-blend-screen">
      {/* Background Fluctuations */}
      <div 
        className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 animate-drift-slow"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${config.accent}11 0%, transparent 40%),
                       radial-gradient(circle at 70% 60%, ${config.accent}22 0%, transparent 50%),
                       radial-gradient(circle at 40% 80%, ${config.accent}15 0%, transparent 45%)`,
          filter: 'blur(100px)',
        }}
      />
      {/* "Milky Bubbles" */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float-bubble"
          style={{
            width: `${150 + i * 120}px`,
            height: `${150 + i * 120}px`,
            left: `${(i * 25) % 100}%`,
            top: `${(i * 35) % 100}%`,
            background: `radial-gradient(circle at center, ${config.accent}10 0%, transparent 70%)`,
            filter: 'blur(50px)',
            animationDelay: `${i * 3}s`,
            animationDuration: `${20 + i * 7}s`,
          }}
        />
      ))}
    </div>
  );
});

const GalaxySpiral = React.memo(({ config }) => {
  if (!config) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 overflow-hidden">
      <div className={`relative w-[1200px] h-[1200px] ${config.animation === 'grid' ? '' : 'animate-spin-very-slow'}`}>
        {config.animation === 'satellites' && [0, 90, 180, 270].map((angle) => (
          <div 
            key={angle}
            className="absolute top-1/2 left-1/2 w-[700px] h-[250px] origin-left"
            style={{ 
              transform: `rotate(${angle}deg) skewX(20deg)`,
              background: `radial-gradient(ellipse at left, ${config.accent}33 0%, transparent 80%)`,
              filter: 'blur(80px)',
              borderRadius: '50%',
            }}
          />
        ))}

        {config.animation === 'clouds' && (
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-full h-full rounded-full animate-pulse" 
                  style={{ background: `radial-gradient(circle at center, ${config.accent}11 0%, transparent 70%)`, filter: 'blur(120px)' }} />
          </div>
        )}

        {config.animation === 'grid' && (
          <div className="absolute inset-0 opacity-30" 
               style={{ 
                 backgroundImage: `linear-gradient(${config.accent}22 1px, transparent 1px), linear-gradient(90deg, ${config.accent}22 1px, transparent 1px)`,
                 backgroundSize: '100px 100px',
                 transform: 'rotateX(60deg) translateZ(-200px)',
                 maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
               }} />
        )}
      </div>
    </div>
  );
});

const SpaceShip = React.memo(({ reducedMotion = false }) => {
  const orbitRef = useRef(null);

  useEffect(() => {
    if (!orbitRef.current || reducedMotion) return;

    const orbitTween = gsap.to(orbitRef.current, {
      rotationY: 360,
      duration: 60,
      repeat: -1,
      ease: 'none',
    });

    const swayTween = gsap.to(orbitRef.current, {
      rotationX: 10,
      duration: 15,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      orbitTween.kill();
      swayTween.kill();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={orbitRef}
      className="absolute pointer-events-none"
      style={{ transformStyle: 'preserve-3d', top: '50%', left: '50%' }}
    >
      <div style={{ transform: 'translateX(800px) translateZ(-1000px) rotateY(90deg)', transformStyle: 'preserve-3d' }}>
        <div className="relative flex items-center justify-center scale-[0.6]">
          <div className="absolute right-full flex items-center" style={{ transform: 'translateX(5px)' }}>
            <div className="w-16 h-4 bg-blue-500/40 blur-md rounded-full animate-pulse" />
            <div className="absolute right-0 w-8 h-2 bg-white/60 blur-[2px] rounded-full animate-pulse" />
          </div>

          <div className="relative w-20 h-6 bg-graphite rounded-full border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
            <div className="absolute top-1 left-4 w-6 h-2 bg-cyan-400/20 rounded-full overflow-hidden">
              <div className="w-full h-full bg-cyan-300/40 animate-pulse" />
            </div>
            <div className="absolute inset-0 flex justify-around opacity-20">
              <div className="w-[1px] h-full bg-white" />
              <div className="w-[1px] h-full bg-white" />
              <div className="w-[1px] h-full bg-white" />
            </div>
            <div className="absolute right-0 w-3 h-full bg-gradient-to-l from-orange-600 to-transparent" />
          </div>

          <div className="absolute -top-4 left-6 w-3 h-10 bg-graphite border-r border-white/10 rounded-sm skew-x-[25deg] origin-bottom animate-float-slow">
            <div className="absolute top-0 left-0 w-1 h-1 bg-red-500 shadow-[0_0_5px_red] animate-ping" />
          </div>
          <div className="absolute -bottom-4 left-6 w-3 h-10 bg-graphite border-r border-white/10 rounded-sm -skew-x-[25deg] origin-top animate-float-slow">
            <div className="absolute bottom-0 left-0 w-1 h-1 bg-green-500 shadow-[0_0_5px_green] animate-ping" />
          </div>

          <div
            className="absolute -top-6 left-10 w-4 h-4 border-t border-blue-400 rounded-full animate-spin"
            style={{ animationDuration: '3s' }}
          />

          <div className="absolute right-full w-80 h-[1px] bg-gradient-to-r from-transparent via-blue-500/5 to-white/10 blur-[1px]" />
        </div>
      </div>
    </div>
  );
});

export const Universe3D = React.memo(({ active, onPlanetClick, focusedPlanet, reducedMotion = false, onPositionChange, atmosphere }) => {
  const cameraRef = useRef(null);
  const animationRef = useRef(null);
  const touchRef = useRef({ x: 0, y: 0, active: false });
  const rotationRef = useRef({ x: 4, y: 12 }); // Initial rotation matching the idle animation

  useEffect(() => {
    if (reducedMotion) return;

    const updateParallax = () => {
      if (!cameraRef.current) return;
      
      let rotY, rotX;

      if (touchRef.current.active) {
        rotY = rotationRef.current.y;
        rotX = rotationRef.current.x;
        // Apply manual rotation
        cameraRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${gsap.getProperty(cameraRef.current, 'z') || 0}px)`;
      } else {
        rotY = gsap.getProperty(cameraRef.current, 'rotationY') || 0;
        rotX = gsap.getProperty(cameraRef.current, 'rotationX') || 0;
      }

      // Sync position to LobbyEngine (Full X, Y, Z coordinates)
      if (onPositionChange) {
        const camX = gsap.getProperty(cameraRef.current, 'x') || 0;
        const camY = gsap.getProperty(cameraRef.current, 'y') || 0;
        const camZ = gsap.getProperty(cameraRef.current, 'z') || 0;
        onPositionChange([camX, camY, camZ]);
      }

      const radY = (rotY * Math.PI) / 180;
      const radX = (rotX * Math.PI) / 180;

      const offsetX = Math.sin(radY) * 20;
      const offsetY = -Math.sin(radX) * 20;

      const planets = document.querySelectorAll('.planet-surface');
      planets.forEach((p) => {
        p.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
        p.parentElement.style.setProperty('--light-x', `${35 + rotY}%`);
        p.parentElement.style.setProperty('--light-y', `${35 + rotX}%`);
      });

      requestAnimationFrame(updateParallax);
    };
    const animId = requestAnimationFrame(updateParallax);
    return () => cancelAnimationFrame(animId);
  }, [reducedMotion]);

  useEffect(() => {
    if (!cameraRef.current || !active || reducedMotion) return;

    if (animationRef.current) animationRef.current.kill();

    const targets = {
      sun: { x: 400, y: 300, z: -400, rx: -10, ry: -10 },
      saturn: { x: 300, y: -200, z: 0, rx: 5, ry: 15 },
      jupiter: { x: -400, y: 100, z: 300, rx: 0, ry: -20 },
      black_hole: { x: -400, y: -400, z: -100, rx: 20, ry: -10 },
      earth: { x: 0, y: -400, z: 700, rx: 15, ry: 0 },
    };

    if (focusedPlanet) {
      const t = targets[focusedPlanet];
      animationRef.current = gsap.to(cameraRef.current, {
        x: t.x,
        y: t.y,
        z: t.z,
        rotationX: t.rx,
        rotationY: t.ry,
        duration: 2.5,
        ease: 'power2.inOut',
        overwrite: 'auto',
      });
    } else {
      animationRef.current = gsap.to(cameraRef.current, {
        rotationY: 8,
        rotationX: 2,
        x: 40,
        z: 50,
        duration: 4,
        ease: 'power2.inOut',
        onComplete: () => {
          animationRef.current = gsap.to(cameraRef.current, {
            rotationY: 12,
            rotationX: 4,
            x: 60,
            duration: 25,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        },
      });
    }

    return () => {
      if (animationRef.current) animationRef.current.kill();
    };
  }, [active, focusedPlanet, reducedMotion]);

  const handleTouchStart = (e) => {
    if (reducedMotion) return;
    touchRef.current.active = true;
    touchRef.current.x = e.touches[0].clientX;
    touchRef.current.y = e.touches[0].clientY;
    if (animationRef.current) animationRef.current.pause();
  };

  const handleTouchMove = (e) => {
    if (!touchRef.current.active || reducedMotion) return;
    
    const deltaX = e.touches[0].clientX - touchRef.current.x;
    const deltaY = e.touches[0].clientY - touchRef.current.y;

    rotationRef.current.y += deltaX * 0.2;
    rotationRef.current.x -= deltaY * 0.2;

    // Limit X rotation to avoid flipping
    rotationRef.current.x = Math.max(-30, Math.min(30, rotationRef.current.x));

    // Direct DOM update for immediate feedback
    if (cameraRef.current) {
      cameraRef.current.style.transform = `rotateX(${rotationRef.current.x}deg) rotateY(${rotationRef.current.y}deg) translateZ(${gsap.getProperty(cameraRef.current, 'z') || 0}px)`;
    }

    touchRef.current.x = e.touches[0].clientX;
    touchRef.current.y = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    touchRef.current.active = false;
    if (animationRef.current && !focusedPlanet) {
      // Smoothly resume idle animation from current manual rotation
      gsap.to(cameraRef.current, {
        rotationY: rotationRef.current.y,
        rotationX: rotationRef.current.x,
        duration: 0,
      });
      animationRef.current.play();
    }
  };

  return (
    <div 
      className={`universe-container ${active ? 'active' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AtmosphereBubbles config={atmosphere} />
      <GalaxySpiral config={atmosphere} />
      <div ref={cameraRef} className="universe-camera">
        <StarField />
        <SpaceShip reducedMotion={reducedMotion} />
        
        {/* Social Ghosts Layer */}
        <GhostsContainer />

        <div
          onClick={(e) => {
            e.stopPropagation();
            onPlanetClick('sun');
          }}
          className="sun planet"
          style={{ top: '5%', left: '5%', transform: 'translateZ(-900px)' }}
        >
          <div className="planet-surface sun" />
        </div>

        <div
          style={{
            position: 'absolute',
            top: '55%',
            left: '15%',
            transform: 'translateZ(-400px)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              onPlanetClick('saturn');
            }}
            className="planet saturn"
          >
            <div className="planet-surface saturn" />
            <div className="saturn-rings" />
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: '25%',
            right: '10%',
            transform: 'translateZ(-100px)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              onPlanetClick('jupiter');
            }}
            className="planet jovian"
          >
            <div className="planet-surface jovian" />
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            transform: 'translateZ(-600px)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              onPlanetClick('black_hole');
            }}
            className="black-hole-core pointer-events-auto cursor-pointer"
          />
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '40%',
            transform: 'translateZ(300px)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              onPlanetClick('earth');
            }}
            className="planet earth"
          >
            <div className="planet-surface earth" />
          </div>
        </div>
      </div>
    </div>
  );
});
