import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// =====================================================================
// KONFIGURACJA FIREBASE
// =====================================================================
// Jak ustawić (jednorazowo, ~3 minuty):
// 1. Wejdź na https://console.firebase.google.com
// 2. Kliknij "Dodaj projekt" -> wpisz "tech-grill-academy" -> kontynuuj
// 3. W panelu projektu kliknij ikonę Web (</>)
// 4. Zarejestruj aplikację (np. "tech-grill-web")
// 5. Skopiuj obiekt firebaseConfig i wklej poniżej
// 6. Przejdź do Authentication -> Sign-in method -> Włącz Google
// 7. Dodaj domenę: localhost (dla dev) i swój domain (dla prod)
// =====================================================================

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);
