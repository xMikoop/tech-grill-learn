import { describe, expect, it } from 'vitest';
import { useAppStore } from './useAppStore';

describe('useAppStore - Logika Widoków', () => {
  it('inicjalizuje się domyślnymi wartościami', () => {
    const state = useAppStore.getState();
    expect(state.view).toBe('onboarding');
    expect(state.currentLessonIndex).toBeNull();
  });

  it('poprawnie zmienia widok i go zapamiętuje', () => {
    const { setView } = useAppStore.getState();
    setView('dashboard');
    expect(useAppStore.getState().view).toBe('dashboard');
  });

  it('resetSessionState przywraca onboarding', () => {
    const { setView, setCurrentLessonIndex, resetSessionState } = useAppStore.getState();
    setView('lesson');
    setCurrentLessonIndex(1);
    
    resetSessionState();
    
    const state = useAppStore.getState();
    expect(state.view).toBe('onboarding');
    expect(state.currentLessonIndex).toBeNull();
  });
});
