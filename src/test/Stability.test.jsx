import { render, screen, act } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import React, { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

const { UniverseMockFn } = vi.hoisted(() => ({
  UniverseMockFn: vi.fn(() => <div data-testid="universe-3d">Universe</div>)
}));

// Setup variables for dynamic mocking
let currentView = 'dashboard';
const stableHydrate = vi.fn();
const stableCheckStreak = vi.fn();
const stableSetXp = vi.fn();
const stableSetIsPlaying = vi.fn();
const stableTriggerSupernova = vi.fn();
const stableSetFocusedPlanet = vi.fn();
const stableBroadcast = vi.fn();
const STABLE_ATMOSPHERE = { bg: 'black', accent: 'blue' };
const STABLE_MUSIC = {};

vi.mock('../hooks/useIdentity', () => ({
  useIdentity: () => ({
    user: { id: 'test-user', displayName: 'Tester' },
    isAuthenticated: true,
    isLoading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
  }),
}));

vi.mock('../hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

vi.mock('../hooks/useAchievements', () => ({
  useAchievements: () => ({
    showAchievement: null,
    triggerAchievement: vi.fn(),
  }),
}));

vi.mock('../hooks/useChat', () => ({
  useChat: () => ({
    messages: [],
    sendMessage: vi.fn(),
  }),
}));

vi.mock('../hooks/useOnboarding', () => ({
  useOnboarding: () => ({
    step: 0,
    completeStep: vi.fn(),
  }),
}));

vi.mock('../hooks/useLessonManagement', () => ({
  useLessonManagement: () => ({
    currentQuizIndex: 0,
    setCurrentQuizIndex: vi.fn(),
    answers: {},
    setAnswers: vi.fn(),
    handleLessonStart: vi.fn(),
    completeCurrentLesson: vi.fn(),
    unlockedConcepts: [],
    setUnlockedConcepts: vi.fn(),
  }),
}));

vi.mock('../store/useAppStore', () => ({
  useAppStore: () => ({
    view: currentView,
    setView: (v) => { currentView = v; },
    currentLessonIndex: null,
    xp: 100,
    setXp: stableSetXp,
    activeAtmosphere: STABLE_ATMOSPHERE,
    musicConfig: STABLE_MUSIC,
    streak: 5,
    completedLessons: [],
    hydrateProgress: stableHydrate,
    checkAndUpdateStreak: stableCheckStreak,
    resetSessionState: vi.fn(),
    initializeUser: vi.fn(),
    isHydrating: false,
  }),
}));

vi.mock('../store/useImmersionStore', () => ({
  useImmersionStore: () => ({
    setIsPlaying: stableSetIsPlaying,
    triggerSupernova: stableTriggerSupernova,
    focusedPlanet: null,
    setFocusedPlanet: stableSetFocusedPlanet,
  }),
}));

vi.mock('../hooks/useLobby', () => ({
  useLobby: () => ({
    broadcastPosition: stableBroadcast,
    sendMessage: vi.fn(),
  }),
}));

vi.mock('../services/progressService', () => ({
  loadUserProgress: vi.fn(() => Promise.resolve(null)),
  saveUserProgress: vi.fn(() => Promise.resolve()),
  buildProgressPayload: vi.fn(() => ({})),
}));

vi.mock('../lib/viewRouting', () => ({
  VALID_VIEWS: new Set(['dashboard', 'knowledge', 'lesson', 'quiz', 'onboarding']),
  pathFromView: vi.fn((view) => `/${view}`),
}));

vi.mock('../components/Universe/Universe3D', () => ({
  Universe3D: React.memo(UniverseMockFn),
  CELESTIAL_INFO: {}
}));

vi.mock('../components/Audio/GlobalAudio', () => ({
  default: () => <div data-testid="global-audio">Audio</div>
}));

vi.mock('../components/Sidebar/Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>
}));

vi.mock('../components/Common/AchievementPop', () => ({
  default: () => <div data-testid="achievement-pop">Achievement Pop</div>
}));

vi.mock('../components/Common/Supernova', () => ({
  default: () => <div data-testid="supernova">Supernova</div>
}));

test('Universe3D remains mounted and stable when switching views', async () => {
  let rendered;
  await act(async () => {
    rendered = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );
  });
  
  // Wait for the lazy component to appear
  expect(await screen.findByTestId('dashboard-page', {}, { timeout: 3000 })).toBeInTheDocument();
  
  const initialCallCount = UniverseMockFn.mock.calls.length;

  // Switch view
  await act(async () => {
    currentView = 'knowledge';
    rendered.rerender(
      <MemoryRouter initialEntries={['/knowledge']}>
        <App />
      </MemoryRouter>
    );
  });

  expect(await screen.findByTestId('knowledge-page', {}, { timeout: 3000 })).toBeInTheDocument();
  
  // Universe3D should not have been re-called if memoization works
  expect(UniverseMockFn.mock.calls.length).toBe(initialCallCount);
});
