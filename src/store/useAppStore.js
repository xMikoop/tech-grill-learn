import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { saveUserProgress, buildProgressPayload, loadUserProgress } from '../services/progressService';
import { VALID_VIEWS } from '../lib/viewRouting';

function createDefaultSessionState() {
  return {
    userId: null,
    isHydrating: false,
    xp: 0,
    view: 'onboarding',
    currentLessonIndex: null,
    activeAtmosphere: null,
    musicConfig: null,
    streak: 0,
    lastVisitDate: null,
    completedLessons: [],
    achievements: [],
    favorites: [],
    history: [],
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
      setActiveAtmosphere: (activeAtmosphere) => {
        console.log("Setting Atmosphere:", activeAtmosphere.name);
        set({ activeAtmosphere });
      },
      setMusicConfig: (musicConfig) => set({ musicConfig }),

      toggleFavorite: (lessonId) => set((state) => {
        const favorites = state.favorites.includes(lessonId)
          ? state.favorites.filter(id => id !== lessonId)
          : [...state.favorites, lessonId];
        return { favorites };
      }),

      addToHistory: (lessonId) => set((state) => {
        const history = [lessonId, ...state.history.filter(id => id !== lessonId)].slice(0, 10);
        return { history };
      }),

      unlockAchievement: (achievementId) => set((state) => {
        if (state.achievements.includes(achievementId)) return {};
        return { achievements: [...state.achievements, achievementId] };
      }),

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
            ...(Array.isArray(progress.achievements) ? { achievements: progress.achievements } : {}),
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

      initializeUser: async (userId) => {
        if (!userId) {
          set({ userId: null, isHydrating: false });
          return;
        }
        
        // Anti-loop protection: don't hydrate if already done for this user
        if (get().userId === userId && !get().isHydrating) return;

        set({ isHydrating: true });
        
        try {
          // Timeout protection for Firebase (Max 3s)
          const dataPromise = loadUserProgress(userId);
          const timeoutPromise = new Promise((_, r) => setTimeout(() => r(new Error('Timeout')), 3000));
          
          const data = await Promise.race([dataPromise, timeoutPromise]);
          
          if (data) {
            get().hydrateProgress({
              ...data,
              view: typeof data.view === 'string' && VALID_VIEWS.has(data.view) ? data.view : undefined,
            });
          }
        } catch (err) {
          console.error("Hydration failed or timed out", err);
        } finally {
          set({ userId, isHydrating: false });
        }
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
        achievements: state.achievements,
      }),
    },
  ),
);

// Persistence Side-Effect Engine (Internal to Module)
let saveTimeout = null;
let lastBaselineState = useAppStore.getState();

useAppStore.subscribe((state) => {
  // Check if relevant data changed compared to baseline
  const hasDataChanged = 
    state.xp !== lastBaselineState.xp ||
    state.completedLessons !== lastBaselineState.completedLessons ||
    state.achievements !== lastBaselineState.achievements ||
    state.view !== lastBaselineState.view ||
    state.musicConfig !== lastBaselineState.musicConfig ||
    state.activeAtmosphere !== lastBaselineState.activeAtmosphere ||
    state.favorites !== lastBaselineState.favorites ||
    state.history !== lastBaselineState.history;

  // We only trigger save if there's a user AND data actually changed
  if (hasDataChanged && state.userId && !state.isHydrating) {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      saveUserProgress(state.userId, buildProgressPayload({
        xp: state.xp,
        completedModules: state.completedLessons,
        achievements: state.achievements,
        view: state.view,
        musicConfig: state.musicConfig,
        activeAtmosphere: state.activeAtmosphere,
        favorites: state.favorites,
        history: state.history
      }));
    }, 1000);
  }
  
  // Always update baseline to current state after check
  lastBaselineState = state;
});
