import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LobbyEngine } from '../LobbyEngine';
import { useLobbyStore } from '../../store/useLobbyStore';

class MockSocialProvider {
  broadcastPosition(pos) {}
  broadcastMessage(text) {}
  onPlayerJoined() {}
  onPlayerLeft() {}
  onPositionChanged() {}
  onMessageReceived() {}
}

describe('LobbyEngine Throttling (Stress Test)', () => {
  let provider;
  let engine;

  beforeEach(() => {
    vi.useFakeTimers();
    provider = new MockSocialProvider();
    // Inicjalizujemy silnik z zerowym stanem
    engine = new LobbyEngine(provider, useLobbyStore.getState());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('przy 50 wywołaniach w ciągu 1s, powinien wyemitować dokładnie 10 paczek (RED STEP)', () => {
    const broadcastSpy = vi.spyOn(provider, 'broadcastPosition');
    
    // Symulacja 50 aktualizacji co 20ms (łącznie 1000ms)
    for (let i = 0; i < 50; i++) {
      engine.broadcastLocalPosition([i, 0, 0]);
      vi.advanceTimersByTime(20);
    }

    // Oczekujemy 10 wywołań (1000ms / 100ms = 10)
    // Jeśli throttling nie działa, otrzymamy 50.
    expect(broadcastSpy).toHaveBeenCalledTimes(10);
  });
});
