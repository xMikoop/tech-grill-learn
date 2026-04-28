import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { onAuthStateChanged } from 'firebase/auth';

import { useIdentity } from '../../hooks/useIdentity';

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
}));

vi.mock('../../firebase', () => ({
  auth: { app: { name: 'mock-firebase-app' } },
  signInWithGoogle: vi.fn(),
  logout: vi.fn(),
}));

describe('useIdentity', () => {
  let authStateListener;
  let unsubscribe;

  beforeEach(() => {
    authStateListener = undefined;
    unsubscribe = vi.fn();

    onAuthStateChanged.mockImplementation((_auth, listener) => {
      authStateListener = listener;
      return unsubscribe;
    });
  });

  it('starts in loading state and hides Firebase User shape behind a stable app identity object', async () => {
    const { result } = renderHook(() => useIdentity());

    expect(result.current.status).toBe('loading');
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();

    const firebaseUserWithVolatileShape = {
      uid: 'firebase-uid-123',
      displayName: 'Ada Lovelace',
      email: 'ada@example.com',
      photoURL: 'https://cdn.example.com/ada.png',
      providerData: [{ providerId: 'google.com' }],
      stsTokenManager: { accessToken: 'secret-token-that-must-not-leak' },
      reload: vi.fn(),
      getIdToken: vi.fn(),
    };

    act(() => {
      authStateListener(firebaseUserWithVolatileShape);
    });

    await waitFor(() => expect(result.current.status).toBe('authenticated'));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({
      id: 'firebase-uid-123',
      displayName: 'Ada Lovelace',
      email: 'ada@example.com',
      avatarUrl: 'https://cdn.example.com/ada.png',
    });

    // The façade must not leak Firebase-specific fields or methods into App.jsx.
    expect(result.current.user.uid).toBeUndefined();
    expect(result.current.user.photoURL).toBeUndefined();
    expect(result.current.user.providerData).toBeUndefined();
    expect(result.current.user.stsTokenManager).toBeUndefined();
    expect(result.current.user.getIdToken).toBeUndefined();
  });

  it('maps signed-out Firebase state to anonymous app identity', async () => {
    const { result } = renderHook(() => useIdentity());

    act(() => {
      authStateListener(null);
    });

    await waitFor(() => expect(result.current.status).toBe('anonymous'));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('unsubscribes from Firebase Auth when the hook unmounts', () => {
    const { unmount } = renderHook(() => useIdentity());

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
