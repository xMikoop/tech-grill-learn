import { create } from 'zustand';

export const useImmersionStore = create((set) => ({
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
}));
