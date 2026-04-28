# Tech Grill Academy - Dependency Graph TODO

## Status: RECOVERING (Build Fixed, 39/40 Tests Green)

[ROOT]
  |
  +-- [A] Fix Foundation (Build & Stability) [DONE]
  |
  +-- [B] Fix Persistence (Async Hydration in Tests) [IN_PROGRESS]
  |     |
  |     +-- [C] LobbyEngine & SocialProvider Robustness [NEXT]
  |           |
  |           +-- [D] TRACER BULLET: Global Chat implementation
  |
  +-- [E] Shared Design Concept Refinement (3D + Learning Overlay)

---

## Task Details

### [B] Fix Persistence
- [ ] Fix `Persistence.test.js` (Handle async `initializeUser`)
- [ ] Ensure `lastBaselineState` in `useAppStore` handles `userId` handover correctly

### [C] Social Engine Robustness
- [ ] Implement `onMessageReceived` in `FirebaseSocialProvider` (Done in code, need validation)
- [ ] Add error boundaries to `LobbyEngine` event listeners

### [D] TRACER BULLET: Global Chat
- [ ] 12.1: SocialProvider: Add Chat broadcast & Update logic
- [ ] 12.2: LobbyEngine: Integrate message handling
- [ ] 12.3: UI: Ghost Message Bubbles (The "Wow" effect in 3D)

### [E] Architecture Refactor
- [ ] Extract `Universe3D` to a Persistent Layout (avoiding `App.jsx` bloat)
- [ ] Move Routing logic from `useEffect` to `createBrowserRouter` (Standardization)
