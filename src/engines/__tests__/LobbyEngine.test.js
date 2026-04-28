import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LobbyEngine } from '../LobbyEngine';
import { useLobbyStore } from '../../store/useLobbyStore';

// Prosty EventEmitter jako Mock SocialProvider
class MockSocialProvider {
  constructor() {
    this.handlers = {};
  }

  onPlayerJoined(cb) { this.handlers.joined = cb; }
  onPlayerLeft(cb) { this.handlers.left = cb; }
  onPositionChanged(cb) { this.handlers.pos = cb; }
  onMessageReceived(cb) { this.handlers.message = cb; }
  
  // Metody do symulacji zdarzeń sieciowych w testach
  simulateJoin(player) { this.handlers.joined?.(player); }
  simulateMessage(uid, text) { this.handlers.message?.(uid, text); }
}

describe('LobbyEngine (Social Learning)', () => {
  let provider;
  let engine;

  beforeEach(() => {
    // Reset store before each test
    useLobbyStore.setState({ players: [], ghosts: new Map() });
    provider = new MockSocialProvider();
    engine = new LobbyEngine(provider, useLobbyStore.getState());
  });

  it('powinien throttlować wysyłanie pozycji do 100ms (Test RED)', async () => {
    const broadcastSpy = vi.fn();
    provider.broadcastPosition = broadcastSpy;

    // Symulujemy serię szybkich aktualizacji pozycji
    engine.broadcastLocalPosition([1, 1, 1]);
    engine.broadcastLocalPosition([2, 2, 2]);
    engine.broadcastLocalPosition([3, 3, 3]);

    // Powinno zostać wysłane natychmiast lub raz, a kolejne zablokowane
    expect(broadcastSpy).toHaveBeenCalledTimes(1);
    expect(broadcastSpy).toHaveBeenCalledWith([1, 1, 1]);
  });

  it('powinien aktualizować stan gracza w store po otrzymaniu wiadomości (Test RED)', () => {
    const player = { uid: 'user-1', displayName: 'Tester' };
    provider.simulateJoin(player);
    
    // Testowany event
    provider.simulateMessage('user-1', 'Hello World!');

    const updatedPlayer = useLobbyStore.getState().players.find(p => p.uid === 'user-1');
    expect(updatedPlayer.lastMessage).toBe('Hello World!');
  });
});
