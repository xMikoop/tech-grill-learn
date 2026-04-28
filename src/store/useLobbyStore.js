import { create } from 'zustand';

/**
 * useLobbyStore
 * Zarządza stanem społecznościowym.
 * 
 * players: Tablica obiektów { uid, displayName, status } - reaktywna dla UI.
 * ghosts: Mapa imperatywna { uid: { position: [x,y,z] } } - dla pętli 60 FPS.
 */
export const useLobbyStore = create((set, get) => ({
  players: [],
  
  // Pomocniczy selektor dla uids (reaktywny)
  playerUids: () => get().players.map(p => p.uid),
  
  // Mapa imperatywna - nie wyzwalająca re-renderów Reacta
  // Dostęp przez store.ghosts.get(uid)
  ghosts: new Map(),

  actions: {
    upsertPlayer: (player) => set((state) => {
      const exists = state.players.find(p => p.uid === player.uid);
      if (exists) {
        return {
          players: state.players.map(p => p.uid === player.uid ? { ...p, ...player } : p)
        };
      }
      return { players: [...state.players, player] };
    }),

    removePlayer: (uid) => set((state) => {
      const { ghosts } = state;
      ghosts.delete(uid);
      return {
        players: state.players.filter(p => p.uid !== uid)
      };
    }),

    // Metoda wywoływana przez LobbyEngine przy zmianie pozycji
    updateGhostPosition: (uid, position) => {
      const { ghosts } = get();
      const ghost = ghosts.get(uid) || {};
      ghosts.set(uid, { ...ghost, position });
    }
  }
}));
