import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FirebaseSocialProvider } from '../FirebaseSocialProvider';

// Mockowanie Firebase Database
const mockOnDisconnect = {
  remove: vi.fn().mockReturnValue(Promise.resolve())
};

const mockRef = {
  key: 'test-uid',
  onDisconnect: vi.fn().mockReturnValue(mockOnDisconnect)
};

vi.mock('firebase/database', () => ({
  getDatabase: vi.fn(),
  ref: vi.fn(() => mockRef),
  onChildAdded: vi.fn(),
  onChildRemoved: vi.fn(),
  onChildChanged: vi.fn(),
  set: vi.fn().mockReturnValue(Promise.resolve()),
  onDisconnect: vi.fn(() => mockDisconnectApi)
}));

// Mock dla API onDisconnect wywoływanego jako funkcja w nowym SDK
const mockDisconnectApi = {
  remove: vi.fn()
};

describe('FirebaseSocialProvider (Infrastructure)', () => {
  let provider;
  const mockDb = {};

  beforeEach(() => {
    vi.clearAllMocks();
    provider = new FirebaseSocialProvider(mockDb);
  });

  it('powinien ustawić dane użytkownika i skonfigurować onDisconnect przy join() (RED STEP)', async () => {
    const { set, onDisconnect } = await import('firebase/database');
    const userData = { uid: 'user-1', displayName: 'Tester' };

    await provider.join('lobby-1', userData);

    // Sprawdzenie czy ustawiono dane w RTDB
    expect(set).toHaveBeenCalled();
    // Sprawdzenie czy skonfigurowano automatyczne usuwanie po rozłączeniu
    expect(onDisconnect).toHaveBeenCalledWith(mockRef);
  });

  it('powinien zarejestrować listenery zdarzeń RTDB (child_added, child_removed)', async () => {
    const { onChildAdded, onChildRemoved } = await import('firebase/database');
    
    await provider.join('lobby-1', { uid: 'u1' });

    expect(onChildAdded).toHaveBeenCalled();
    expect(onChildRemoved).toHaveBeenCalled();
  });
});
