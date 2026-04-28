import React from 'react';
import { useLobbyStore } from '../../store/useLobbyStore';
import { Ghost } from './Ghost';
import { useShallow } from 'zustand/react/shallow';

/**
 * GhostsContainer - Głęboki Moduł zarządzający instancjami Duchów.
 * Subskrybuje się wyłącznie do listy UID-ów.
 */
export const GhostsContainer = () => {
  // Selektywne pobranie UID-ów z shallow comparison
  const uids = useLobbyStore(useShallow((state) => state.players.map(p => p.uid)));

  if (uids.length === 0) return null;

  return (
    <div className="ghosts-layer" style={{ transformStyle: 'preserve-3d' }}>
      {uids.map(uid => (
        <Ghost key={uid} uid={uid} />
      ))}
    </div>
  );
};
