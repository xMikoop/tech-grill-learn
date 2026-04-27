import { describe, expect, it } from 'vitest';
import { buildProgressPayload } from './progressService';

describe('progressService.buildProgressPayload', () => {
  it('normalizuje dane użytkownika', () => {
    const payload = buildProgressPayload({
      xp: 120,
      completedModules: ['a', 'b'],
      view: 'dashboard',
      musicConfig: { title: 'Ambient' },
      activeAtmosphere: { name: 'Space' },
    });

    expect(payload).toEqual({
      xp: 120,
      completedModules: ['a', 'b'],
      view: 'dashboard',
      musicConfig: { title: 'Ambient' },
      activeAtmosphere: { name: 'Space' },
    });
  });

  it('ustawia wartości domyślne dla niepoprawnych danych', () => {
    const payload = buildProgressPayload({
      xp: Number.NaN,
      completedModules: null,
      view: null,
      musicConfig: undefined,
      activeAtmosphere: undefined,
    });

    expect(payload).toEqual({
      xp: 0,
      completedModules: [],
      view: 'dashboard',
      musicConfig: null,
      activeAtmosphere: null,
    });
  });
});
