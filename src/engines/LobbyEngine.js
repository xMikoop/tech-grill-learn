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
      console.log('🌐 Player joined:', player.displayName, player.uid);
      this.store.actions.upsertPlayer(player);
      // Kluczowe: Zapisujemy pozycję startową od razu
      if (player.position) {
        this.store.actions.updateGhostPosition(player.uid, player.position);
      }
    });

    this.provider.onPlayerLeft((uid) => {
      console.log('🚪 Player left:', uid);
      this.store.actions.removePlayer(uid);
    });

    this.provider.onPositionChanged((uid, position) => {
      this.store.actions.updateGhostPosition(uid, position);
    });

    this.provider.onMessageReceived((uid, text) => {
      console.log('💬 Message from', uid, ':', text);
      this.store.actions.updatePlayerMessage(uid, text);
    });
  }

  async join(lobbyId, user) {
    // Oznaczamy lokalnego gracza w store
    this.store.actions.upsertPlayer({ ...user, isMe: true });
    return this.provider.join(lobbyId, user);
  }

  // Umożliwia wysyłanie własnej pozycji z throttlingiem
  broadcastLocalPosition(position) {
    const now = Date.now();
    if (now - this.lastBroadcastTime >= this.throttleMs) {
      this.provider.broadcastPosition(position);
      this.lastBroadcastTime = now;
    }
  }

  // Wysyła wiadomość czatu
  broadcastChatMessage(text) {
    if (!text.trim()) return;
    this.provider.broadcastMessage(text);
    
    // Kluczowe: Aktualizujemy lokalny stan natychmiast dla pętli feedbacku
    const localPlayer = this.store.players.find(p => p.isMe);
    if (localPlayer) {
      this.store.actions.updatePlayerMessage(localPlayer.uid, text);
    }
  }
}
