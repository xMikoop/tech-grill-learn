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
      // FIX: user object from useIdentity uses 'id', not 'uid'
      const uid = user.id;
      
      engine.join('global-universe', {
        uid: uid,
        displayName: user.displayName || 'Anonimowy Odkrywca'
      }).then(() => {
        console.log('Successfully joined lobby as:', uid);
      }).catch(err => {
        console.error('Failed to join lobby:', err);
      });
      
      engineRef.current = engine;
    }
  }, [isLoaded, user, engine]);

  return useMemo(() => ({
    broadcastPosition: (pos) => {
      if (engineRef.current) {
        engineRef.current.broadcastLocalPosition(pos);
      }
    },
    sendMessage: (text) => {
      if (engineRef.current) {
        engineRef.current.broadcastChatMessage(text);
      }
    }
  }), []);
};
