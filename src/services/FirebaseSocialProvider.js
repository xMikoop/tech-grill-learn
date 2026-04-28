import { ref, set, onChildAdded, onChildRemoved, onChildChanged, onDisconnect } from 'firebase/database';

/**
 * FirebaseSocialProvider
 * Implementacja SocialProvider dla Firebase Realtime Database.
 * Izoluje SDK Firebase od logiki biznesowej LobbyEngine.
 */
export class FirebaseSocialProvider {
  constructor(db) {
    this.db = db;
    this.lobbyRef = null;
    this.userRef = null;
    this.callbacks = {
      joined: () => {},
      left: () => {},
      moved: () => {}
    };
  }

  async join(lobbyId, user) {
    this.lobbyRef = ref(this.db, `lobby/${lobbyId}/players`);
    this.userRef = ref(this.db, `lobby/${lobbyId}/players/${user.uid}`);

    // 1. Konfiguracja onDisconnect (Zombie Prevention)
    const presenceRef = onDisconnect(this.userRef);
    await presenceRef.remove();

    // 2. Ustawienie danych początkowych (Presence)
    await set(this.userRef, {
      displayName: user.displayName,
      status: 'online',
      position: [0, 0, 0],
      lastSeen: Date.now()
    });

    // 3. Rejestracja listenerów RTDB
    onChildAdded(this.lobbyRef, (snapshot) => {
      if (snapshot.key === user.uid) return; // Ignorujemy siebie
      this.callbacks.joined(this._mapSnapshot(snapshot));
    });

    onChildRemoved(this.lobbyRef, (snapshot) => {
      this.callbacks.left(snapshot.key);
    });

    onChildChanged(this.lobbyRef, (snapshot) => {
      if (snapshot.key === user.uid) return;
      const data = snapshot.val();
      if (data.position) {
        this.callbacks.moved(snapshot.key, data.position);
      }
    });
  }

  broadcastPosition(position) {
    if (!this.userRef) return;
    // Aktualizujemy tylko pozycję i timestamp
    set(this.userRef, {
      position,
      lastSeen: Date.now()
    });
  }

  onPlayerJoined(cb) { this.callbacks.joined = cb; }
  onPlayerLeft(cb) { this.callbacks.left = cb; }
  onPositionChanged(cb) { this.callbacks.moved = cb; }

  /**
   * Prywatny Adapter mapujący Snapshot Firebase na obiekt SocialPlayer.
   */
  _mapSnapshot(snapshot) {
    return {
      uid: snapshot.key,
      ...snapshot.val()
    };
  }
}
