import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useImmersionStore = create(
  persist(
    (set) => ({
      // Audio State
      isPlaying: false,
      isMuted: false,
      volume: 45,
      
      // VFX State
      showSupernova: false,
      focusedPlanet: null,

      // Actions
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setIsMuted: (isMuted) => set({ isMuted }),
      setVolume: (volume) => set({ volume }),
      setFocusedPlanet: (focusedPlanet) => set({ focusedPlanet }),
      
      toggleMusic: () => set((state) => ({ isPlaying: !state.isPlaying })),
      
      toggleMute: () => set((state) => {
        if (state.isMuted || state.volume === 0) {
          return { isMuted: false, volume: state.volume === 0 ? 45 : state.volume };
        }
        return { isMuted: true };
      }),

      triggerSupernova: () => {
        set({ showSupernova: true });
        setTimeout(() => set({ showSupernova: false }), 2500);
      },
    }),
    {
      name: 'tg_immersion_store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        volume: state.volume,
        isMuted: state.isMuted,
      }),
    },
  ),
);
