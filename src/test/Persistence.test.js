import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAppStore } from '../store/useAppStore';
import { act } from '@testing-library/react';

// We will mock progressService
vi.mock('../services/progressService', () => ({
  saveUserProgress: vi.fn(() => Promise.resolve()),
  loadUserProgress: vi.fn(() => Promise.resolve({ xp: 500 })),
  buildProgressPayload: vi.fn((state) => state),
}));

import { saveUserProgress } from '../services/progressService';

describe('Self-Persistent Progression Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it('should automatically trigger saveUserProgress when XP changes and userId is present', async () => {
    const state = useAppStore.getState();
    
    // 1. Set userId first - MUST wait for async initialization
    await act(async () => {
        await state.initializeUser('test-user-123');
    });

    // 2. Change XP to a NEW value (must be different from mocked 500)
    act(() => {
        state.setXp(600);
    });

    // Fast-forward debounce time (1000ms)
    act(() => {
        vi.advanceTimersByTime(1500);
    });

    expect(saveUserProgress).toHaveBeenCalledWith('test-user-123', expect.objectContaining({ xp: 600 }));
  });

  it('should NOT trigger saveUserProgress if userId is missing', async () => {
    const state = useAppStore.getState();
    
    act(() => {
        state.initializeUser(null);
        state.setXp(999);
    });

    act(() => {
        vi.advanceTimersByTime(1500);
    });

    expect(saveUserProgress).not.toHaveBeenCalled();
  });
});
