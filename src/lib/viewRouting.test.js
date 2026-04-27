import { describe, expect, it } from 'vitest';
import { pathFromView, viewFromPath } from './viewRouting';

describe('viewRouting', () => {
  it('buduje poprawne ścieżki dla widoków statycznych', () => {
    expect(pathFromView('dashboard')).toBe('/dashboard');
    expect(pathFromView('knowledge')).toBe('/knowledge');
  });

  it('buduje poprawne ścieżki dla lekcji i quizu', () => {
    expect(pathFromView('lesson', 2)).toBe('/lesson/2');
    expect(pathFromView('quiz', 3)).toBe('/lesson/3/quiz');
  });

  it('parsuje ścieżki na widok i indeks lekcji', () => {
    expect(viewFromPath('/lesson/4')).toEqual({ view: 'lesson', lessonIndex: 4 });
    expect(viewFromPath('/lesson/1/quiz')).toEqual({ view: 'quiz', lessonIndex: 1 });
    expect(viewFromPath('/dashboard')).toEqual({ view: 'dashboard', lessonIndex: null });
  });

  it('obsługuje root path w zależności od atmosfery', () => {
    expect(viewFromPath('/', false)).toEqual({ view: 'onboarding', lessonIndex: null });
    expect(viewFromPath('/', true)).toEqual({ view: 'dashboard', lessonIndex: null });
  });
});
