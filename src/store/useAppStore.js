import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

function createDefaultSessionState() {
  return {
    xp: 0,
    view: 'onboarding',
    currentLessonIndex: null,
    activeAtmosphere: null,
    musicConfig: null,
    streak: 0,
    lastVisitDate: null,
    completedLessons: [],
  };
}

function todayStr() {
  return new Date().toISOString().slice(0, 10); // "2026-04-27"
}

function normalizeCompletedLessons(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter(Boolean).map(String))];
}

function normalizeRewardXp(value) {
  const reward = Number(value);
  return Number.isFinite(reward) && reward > 0 ? reward : 0;
}

export function awardLessonCompletion(state, lessonId, rewardXp) {
  const id = String(lessonId ?? '').trim();
  if (!id || state.completedLessons.includes(id)) {
    return { awarded: false, patch: {} };
  }

  return {
    awarded: true,
    patch: {
      completedLessons: [...state.completedLessons, id],
      xp: state.xp + normalizeRewardXp(rewardXp),
    },
  };
}

export const useAppStore = create(
  persist(
    (set, get) => ({
      ...createDefaultSessionState(),

      setView: (view) => set({ view }),
      setCurrentLessonIndex: (currentLessonIndex) => set({ currentLessonIndex }),
      setActiveAtmosphere: (activeAtmosphere) => set({ activeAtmosphere }),
      setMusicConfig: (musicConfig) => set({ musicConfig }),

      setXp: (valueOrUpdater) =>
        set((state) => ({
          xp: typeof valueOrUpdater === 'function' ? valueOrUpdater(state.xp) : valueOrUpdater,
        })),

      hydrateProgress: (progress) =>
        set(() => {
          if (!progress) return {};

          const completedLessons = progress.completedLessons ?? progress.completedModules;

          return {
            ...(typeof progress.xp === 'number' ? { xp: progress.xp } : {}),
            ...(typeof progress.view === 'string' ? { view: progress.view } : {}),
            ...(Array.isArray(completedLessons)
              ? { completedLessons: normalizeCompletedLessons(completedLessons) }
              : {}),
            ...(progress.musicConfig ? { musicConfig: progress.musicConfig } : {}),
            ...(progress.activeAtmosphere ? { activeAtmosphere: progress.activeAtmosphere } : {}),
          };
        }),

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
        set((state) => {
          const id = String(lessonId ?? '').trim();
          if (!id || state.completedLessons.includes(id)) return {};
          return { completedLessons: [...state.completedLessons, id] };
        }),

      completeLessonWithReward: (lessonId, rewardXp) => {
        let awarded = false;
        set((state) => {
          const result = awardLessonCompletion(state, lessonId, rewardXp);
          awarded = result.awarded;
          return result.patch;
        });
        return awarded;
      },

      resetSessionState: () => set(createDefaultSessionState()),
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
