import React, { forwardRef } from 'react';
import { Music, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const GlobalAudio = forwardRef(
  ({ musicConfig, isPlaying, isMuted, volume, onToggleMusic, onToggleMute, onVolumeChange }, ref) => {
    if (!musicConfig) return null;

    return (
      <>
        <audio
          key={musicConfig.url}
          ref={ref}
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
              onClick={onToggleMusic}
              className="p-1.5 rounded-lg text-ghost hover:bg-white/10 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={onToggleMute}
              className="p-1.5 rounded-lg text-ghost hover:bg-white/10 transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseInt(e.target.value))}
              className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-plasma"
            />

            <div className="text-[9px] font-bold text-plasma w-24 truncate ml-2">
              {musicConfig.title}
            </div>
          </div>
        </div>
      </>
    );
  },
);

export default GlobalAudio;
