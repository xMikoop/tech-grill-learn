# 📥 HANDOVER BRIEF: Tech Grill Academy (Rescue Mission)
> **Session Status**: 100% Stable, 40/40 Green Tests, Build: OK.

## 🎯 Shared Design Concept: State-Driven Immersive SPA
Projekt to imersyjna platforma edukacyjna, gdzie **Świat 3D (Universe3D)** jest sercem (Persistent Layer), a UI jest nakładką (Contextual Overlay). 
**Zasada**: Jedno źródło prawdy w Zustand, a nie w adresie URL.

## 🏗️ Architektura Deep Modules (4 Silniki)

1. **Identity Engine (`useIdentity.js`)**:
   - *Public Interface*: `user`, `isAuthenticated`, `isLoading`, `signIn`, `signOut`.
   - *Responsibility*: Mapowanie Google Auth do modelu domenowego (z obsługą `avatarUrl`).

2. **Progression Engine (`useAppStore.js`)**:
   - *Public Interface*: `xp`, `completedLessons`, `streak`, `favorites`, `history`, `toggleFavorite()`, `initializeUser()`.
   - *Side-effects*: Posiada wbudowany silnik autozapisu (debounced 1s) do Firestore.

3. **Immersion Engine (`useImmersionStore.js` & `Universe3D.jsx`)**:
   - *Public Interface*: `activeAtmosphere`, `focusedPlanet`, `setFocusedPlanet()`.
   - *Visuals*: Obsługuje procedurale: `AtmosphereBubbles`, `GalaxySpiral`, `CyberGrid` oraz `Supernova 2.0`.

4. **View Coordinator (`MainLayout.jsx` & `viewRouting.js`)**:
   - *Responsibility*: Utrzymuje świat 3D zamontowany podczas nawigacji.

## 🚦 Specyfika Routing-u (KRYTYCZNE!)
**URL jest wyłącznie efektem ubocznym stanu (Read-Only Side-effect).**
- Kierunek: `Zustand State -> URL`.
- Nigdy nie implementuj synchronizacji dwustronnej `URL <-> State`, bo to prowadzi do pętli re-renderów. 
- Zmiana `view` w store automatycznie wyzwala `navigate()` w `App.jsx`, ale URL nie ma prawa zmieniać stanu aplikacji (poza inicjalnym ładowaniem).

## 📊 Stan TODO.md (DAG)
- **DONE**: Naprawa buildu, Stabilizacja 3D (useCallback/memo), Sync Avatara, Widok Settings, System Atmosfer, Opisy Planet, Fix Inicjalizacji (< 2.5s).
- **NEXT**: **[D] TRACER BULLET: Global Chat**. Cel: Widoczne bąbelki wiadomości nad "Duchami" graczy w 3D.

---
*Przygotowane przez: Senior Software Architect (Antigravity)*
