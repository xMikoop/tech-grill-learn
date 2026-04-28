import { useState } from 'react';

export function useAchievements() {
  const [showAchievement, setShowAchievement] = useState(null);

  const triggerAchievement = (achievement) => {
    setShowAchievement(achievement);
    setTimeout(() => setShowAchievement(null), 3500);
  };

  return {
    showAchievement,
    triggerAchievement,
  };
}
