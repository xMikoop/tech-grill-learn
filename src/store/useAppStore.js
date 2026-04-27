import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      xp: 0,
      view: 'onboarding',
      currentLessonIndex: null,
      activeAtmosphere: null,
      musicConfig: null,

      setView: (view) => set({ view }),
      setCurrentLessonIndex: (currentLessonIndex) => set({ currentLessonIndex }),
      setActiveAtmosphere: (activeAtmosphere) => set({ activeAtmosphere }),
      setMusicConfig: (musicConfig) => set({ musicConfig }),

      setXp: (valueOrUpdater) =>
        set((state) => ({
          xp: typeof valueOrUpdater === 'function' ? valueOrUpdater(state.xp) : valueOrUpdater,
        })),

      resetSessionState: () =>
        set({
          view: 'onboarding',
          currentLessonIndex: null,
          activeAtmosphere: null,
          musicConfig: null,
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
      }),
    },
  ),
);
