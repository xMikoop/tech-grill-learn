/**
 * LobbyEngine
 * Orkiestrator logiki real-time. Łączy SocialProvider z useLobbyStore.
 */
export class LobbyEngine {
  constructor(provider, store) {
    this.provider = provider;
    this.store = store;
    this.lastBroadcastTime = 0;
    this.throttleMs = 100; // 10Hz
    this.init();
  }

  init() {
    this.provider.onPlayerJoined((player) => {
      this.store.actions.upsertPlayer(player);
    });

    this.provider.onPlayerLeft((uid) => {
      this.store.actions.removePlayer(uid);
    });

    this.provider.onPositionChanged((uid, position) => {
      this.store.actions.updateGhostPosition(uid, position);
    });
  }

  // Umożliwia wysyłanie własnej pozycji z throttlingiem
  broadcastLocalPosition(position) {
    const now = Date.now();
    if (now - this.lastBroadcastTime >= this.throttleMs) {
      this.provider.broadcastPosition(position);
      this.lastBroadcastTime = now;
    }
  }
}
