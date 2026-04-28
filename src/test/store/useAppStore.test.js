import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../../store/useAppStore';

describe('ProgressionSystem (useAppStore)', () => {
  const initialState = useAppStore.getState();

  beforeEach(() => {
    // Reset store before each test
    useAppStore.setState({
      ...initialState,
      xp: 0,
      completedLessons: [],
    });
  });

  it('should add XP and mark lesson as completed when completeLessonWithReward is called for a new lesson', () => {
    const { completeLessonWithReward } = useAppStore.getState();
    
    expect(useAppStore.getState().xp).toBe(0);
    expect(useAppStore.getState().completedLessons).not.toContain('lesson-1');

    const awarded = completeLessonWithReward('lesson-1', 100);

    expect(awarded).toBe(true);
    expect(useAppStore.getState().xp).toBe(100);
    expect(useAppStore.getState().completedLessons).toContain('lesson-1');
  });

  it('should NOT add XP if the lesson was already completed', () => {
    // Setup initial state: lesson already completed
    useAppStore.setState({
      completedLessons: ['lesson-2'],
      xp: 50
    });

    const { completeLessonWithReward } = useAppStore.getState();

    const awarded = completeLessonWithReward('lesson-2', 100);

    expect(awarded).toBe(false);
    expect(useAppStore.getState().xp).toBe(50);
    // completedLessons shouldn't duplicate
    expect(useAppStore.getState().completedLessons.length).toBe(1);
  });
});
