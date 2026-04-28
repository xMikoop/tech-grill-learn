import React, { useEffect, useRef } from 'react';
import { Music, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useImmersionStore } from '../../store/useImmersionStore';

const GlobalAudio = () => {
  const audioRef = useRef(null);
  
  const musicConfig = useAppStore((state) => state.musicConfig);
  
  const isPlaying = useImmersionStore((state) => state.isPlaying);
  const isMuted = useImmersionStore((state) => state.isMuted);
  const volume = useImmersionStore((state) => state.volume);
  
  const setIsPlaying = useImmersionStore((state) => state.setIsPlaying);
  const setVolume = useImmersionStore((state) => state.setVolume);
  const toggleMusic = useImmersionStore((state) => state.toggleMusic);
  const toggleMute = useImmersionStore((state) => state.toggleMute);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Sync playback
  useEffect(() => {
    if (audioRef.current && musicConfig) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => {
          console.error('Autoplay blocked:', e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, musicConfig, setIsPlaying]);

  if (!musicConfig) return null;

  return (
    <>
      <audio
        key={musicConfig.url}
        ref={audioRef}
        src={musicConfig.url}
        loop
        crossOrigin="anonymous"
        preload="auto"
        autoPlay={isPlaying}
      />

      <div className="fixed bottom-6 right-6 z-[9000] glass-dark p-3 rounded-full flex items-center gap-3 border border-plasma/30 shadow-plasma-glow transition-all hover:scale-105 pointer-events-auto">
        <div className="w-8 h-8 rounded-full bg-plasma/20 flex items-center justify-center">
          {isPlaying ? (
            <Music className="w-4 h-4 text-plasma animate-pulse" />
          ) : (
            <Music className="w-4 h-4 text-graphite" />
          )}
        </div>

        <div className="flex items-center gap-2 pr-2">
          <button
            onClick={toggleMusic}
            className="p-1.5 rounded-lg text-ghost hover:bg-white/10 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg text-ghost hover:bg-white/10 transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-plasma"
          />

          <div className="text-[9px] font-bold text-plasma w-24 truncate ml-2">
            {musicConfig.title}
          </div>
        </div>
      </div>
    </>
  );
};

export default GlobalAudio;
