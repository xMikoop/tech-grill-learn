import React from 'react';
import { Trophy } from 'lucide-react';

const AchievementPop = ({ achievement }) => {
  if (!achievement) return null;

  return (
    <div className="achievement-pop fixed top-8 right-8 z-[10000] glass-dark p-4 rounded-2xl flex items-center gap-4 border border-plasma shadow-lg animate-slide-up">
      <div className="bg-plasma/20 p-3 rounded-full">
        <Trophy className="text-plasma w-6 h-6" />
      </div>
      <div>
        <div className="text-xs text-plasma-light uppercase font-bold tracking-widest">
          Achievement Unlocked
        </div>
        <div className="font-bold text-lg">{achievement}</div>
      </div>
    </div>
  );
};

export default AchievementPop;
