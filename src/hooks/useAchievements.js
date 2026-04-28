import { useState, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ACHIEVEMENTS } from '../data/achievements';

export function useAchievements() {
  const [showAchievement, setShowAchievement] = useState(null);
  const { unlockAchievement, achievements } = useAppStore();

  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  const triggerAchievement = useCallback(async (achievementKey) => {
    const achievement = ACHIEVEMENTS[achievementKey];
    if (!achievement) return;

    // Check if already unlocked in store
    if (achievements.includes(achievement.id)) return;

    // Unlock in store
    unlockAchievement(achievement.id);

    // Show in-app UI
    setShowAchievement(achievement);
    
    // Notification Fallback / Parallel
    if (Notification.permission === 'granted') {
      new Notification(`Osiągnięcie: ${achievement.title}`, {
        body: achievement.description,
        icon: '/logo.png'
      });
    }

    setTimeout(() => setShowAchievement(null), 5000);
  }, [achievements, unlockAchievement]);

  return {
    showAchievement,
    triggerAchievement,
    requestNotificationPermission,
  };
}
