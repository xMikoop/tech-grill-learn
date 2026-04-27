import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

function todayStr() {
  return new Date().toISOString().slice(0, 10); // "2025-04-27"
}

export const useAppStore = create(
  persist(
    (set, get) => ({
      xp: 0,
      view: 'onboarding',
      currentLessonIndex: null,
      activeAtmosphere: null,
      musicConfig: null,

      // Streak
      streak: 0,
      lastVisitDate: null,
      completedLessons: [], // array of lesson ids

      setView: (view) => set({ view }),
      setCurrentLessonIndex: (currentLessonIndex) => set({ currentLessonIndex }),
      setActiveAtmosphere: (activeAtmosphere) => set({ activeAtmosphere }),
      setMusicConfig: (musicConfig) => set({ musicConfig }),

      setXp: (valueOrUpdater) =>
        set((state) => ({
          xp: typeof valueOrUpdater === 'function' ? valueOrUpdater(state.xp) : valueOrUpdater,
        })),

      // Called on app load — increments streak if new day, resets if >1 day gap
      checkAndUpdateStreak: () => {
        const today = todayStr();
        const { lastVisitDate, streak } = get();
        if (lastVisitDate === today) return; // already counted today

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().slice(0, 10);

        const newStreak = lastVisitDate === yesterdayStr ? streak + 1 : 1;
        set({ streak: newStreak, lastVisitDate: today });
      },

      markLessonCompleted: (lessonId) =>
        set((state) => ({
          completedLessons: state.completedLessons.includes(lessonId)
            ? state.completedLessons
            : [...state.completedLessons, lessonId],
        })),

      resetSessionState: () =>
        set({
          view: 'onboarding',
          currentLessonIndex: null,
          activeAtmosphere: null,
          musicConfig: null,
          streak: 0,
          lastVisitDate: null,
          completedLessons: [],
        }),
    }),
    {
      name: 'tg_app_store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        xp: state.xp,
        view: state.view,
        currentLessonIndex: state.currentLessonIndex,
        activeAtmosphere: state.activeAtmosphere,
        musicConfig: state.musicConfig,
        streak: state.streak,
        lastVisitDate: state.lastVisitDate,
        completedLessons: state.completedLessons,
      }),
    },
  ),
);
