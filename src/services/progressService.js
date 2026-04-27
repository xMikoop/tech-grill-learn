import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const USER_PROGRESS_COLLECTION = 'userProgress';

export function buildProgressPayload({
  xp,
  completedModules,
  view,
  musicConfig,
  activeAtmosphere,
}) {
  return {
    xp: Number.isFinite(xp) ? xp : 0,
    completedModules: Array.isArray(completedModules) ? completedModules : [],
    view: typeof view === 'string' ? view : 'dashboard',
    musicConfig: musicConfig ?? null,
    activeAtmosphere: activeAtmosphere ?? null,
  };
}

export async function loadUserProgress(uid) {
  if (!uid) return null;

  const snapshot = await getDoc(doc(db, USER_PROGRESS_COLLECTION, uid));
  if (!snapshot.exists()) return null;

  return snapshot.data();
}

export async function saveUserProgress(uid, data) {
  if (!uid) return;

  const payload = buildProgressPayload(data);

  await setDoc(
    doc(db, USER_PROGRESS_COLLECTION, uid),
    {
      ...payload,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
