import { useEffect, useMemo, useRef } from 'react';
import { rtdb } from '../firebase';
import { FirebaseSocialProvider } from '../services/FirebaseSocialProvider';
import { LobbyEngine } from '../engines/LobbyEngine';
import { useLobbyStore } from '../store/useLobbyStore';
import { useIdentity } from './useIdentity';

/**
 * useLobby
 * Hook integrujący system Social Learning.
 * Zarządza cyklem życia LobbyEngine.
 */
export const useLobby = () => {
  const { user, isLoaded } = useIdentity();
  const engineRef = useRef(null);

  // Inicjalizacja Providera i Engine (tylko raz)
  const engine = useMemo(() => {
    if (!rtdb) return null;
    const provider = new FirebaseSocialProvider(rtdb);
    return new LobbyEngine(provider, useLobbyStore.getState());
  }, []);

  useEffect(() => {
    if (isLoaded && user && engine) {
      // Dołączamy do domyślnego lobby (np. 'global-universe')
      engine.join('global-universe', {
        uid: user.uid,
        displayName: user.displayName || 'Anonimowy Odkrywca'
      }).catch(err => {
        console.error('Failed to join lobby:', err);
      });
      
      engineRef.current = engine;
    }
  }, [isLoaded, user, engine]);

  return {
    broadcastPosition: (pos) => {
      if (engineRef.current) {
        engineRef.current.broadcastLocalPosition(pos);
      }
    }
  };
};
