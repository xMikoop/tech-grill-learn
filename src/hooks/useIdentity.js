import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { auth, logout, signInWithGoogle } from '../firebase';

const LOADING_IDENTITY = Object.freeze({
  status: 'loading',
  isLoading: true,
  isAuthenticated: false,
  user: null,
});

const ANONYMOUS_IDENTITY = Object.freeze({
  status: 'anonymous',
  isLoading: false,
  isAuthenticated: false,
  user: null,
});

function mapFirebaseUser(firebaseUser) {
  if (!firebaseUser) return null;

  return {
    id: firebaseUser.uid ?? '',
    displayName: firebaseUser.displayName ?? '',
    email: firebaseUser.email ?? '',
    avatarUrl: firebaseUser.photoURL ?? '', // Mapowanie poprawne
  };
}

function toIdentity(firebaseUser) {
  const user = mapFirebaseUser(firebaseUser);
  if (!user) return ANONYMOUS_IDENTITY;

  return {
    status: 'authenticated',
    isLoading: false,
    isAuthenticated: true,
    user,
  };
}

export function useIdentity() {
  const [identity, setIdentity] = useState(LOADING_IDENTITY);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setIdentity(toIdentity(firebaseUser));
    });

    return unsubscribe;
  }, []);

  return useMemo(
    () => ({
      ...identity,
      signIn: signInWithGoogle,
      signOut: logout,
    }),
    [identity],
  );
}
