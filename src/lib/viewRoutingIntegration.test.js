import { describe, expect, it } from 'vitest';
import { pathFromView, viewFromPath } from './viewRouting';

describe('State-driven route reflection', () => {
  it('reflects dashboard state as /dashboard', () => {
    expect(pathFromView('dashboard')).toBe('/dashboard');
  });

  it('reflects lesson state with selected lesson index', () => {
    expect(pathFromView('lesson', 2)).toBe('/lesson/2');
  });

  it('reflects quiz state with selected lesson index', () => {
    expect(pathFromView('quiz', 0)).toBe('/lesson/0/quiz');
  });

  it('falls back to dashboard path when lesson-like state has no selected lesson', () => {
    expect(pathFromView('lesson')).toBe('/dashboard');
    expect(pathFromView('quiz')).toBe('/dashboard');
  });

  it('keeps route parsing as a passive parser, not an access-control mechanism', () => {
    expect(viewFromPath('/dashboard', false)).toEqual({ view: 'dashboard', lessonIndex: null });
    expect(viewFromPath('/onboarding', true)).toEqual({ view: 'onboarding', lessonIndex: null });
    expect(viewFromPath('/lesson/1', false)).toEqual({ view: 'lesson', lessonIndex: 1 });
  });

  it('only root path uses atmosphere as a startup fallback heuristic', () => {
    expect(viewFromPath('/', false)).toEqual({ view: 'onboarding', lessonIndex: null });
    expect(viewFromPath('/', true)).toEqual({ view: 'dashboard', lessonIndex: null });
  });

  const parseCases = [
    { path: '/dashboard', expected: { view: 'dashboard', lessonIndex: null } },
    { path: '/dashboard/', expected: { view: 'dashboard', lessonIndex: null } },
    { path: '/knowledge', expected: { view: 'knowledge', lessonIndex: null } },
    { path: '/favorites', expected: { view: 'favorites', lessonIndex: null } },
    { path: '/history', expected: { view: 'history', lessonIndex: null } },
    { path: '/lesson/5', expected: { view: 'lesson', lessonIndex: 5 } },
    { path: '/lesson/99/quiz', expected: { view: 'quiz', lessonIndex: 99 } },
    { path: '/unknown', expected: { view: 'dashboard', lessonIndex: null } },
  ];

  parseCases.forEach(({ path, expected }) => {
    it(`passively parses ${path}`, () => {
      expect(viewFromPath(path, false)).toEqual(expected);
    });
  });
});
