import { afterEach, describe, expect, it, vi } from 'vitest';
import { findConceptInLessons, getMentorResponse } from './mentorService';

const mockLessons = [
  {
    title: 'React Performance',
    concepts: [
      {
        term: 'LCP',
        explanation: '<p>Largest Contentful Paint mierzy render największego elementu.</p>',
      },
    ],
  },
];

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe('mentorService', () => {
  it('znajduje koncept w lessonach', () => {
    const concept = findConceptInLessons('wyjaśnij LCP', mockLessons);

    expect(concept).toBeTruthy();
    expect(concept?.term).toBe('LCP');
  });

  it('używa fallbacku, gdy klucz API nie jest ustawiony', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');

    const response = await getMentorResponse({
      input: 'wyjaśnij LCP',
      chatHistory: [],
      lessons: mockLessons,
      endpoint: '',
    });

    expect(response).toContain('Z bazy wiedzy');
    expect(response).toContain('LCP');
  });

  it('używa odpowiedzi z API, gdy klucz Gemini jest dostępny', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'test-key');

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: 'To jest odpowiedź modelu.' }],
            },
          },
        ],
      }),
    });

    vi.stubGlobal('fetch', fetchMock);

    const response = await getMentorResponse({
      input: 'Co to jest hydration?',
      chatHistory: [],
      lessons: mockLessons,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(response).toBe('To jest odpowiedź modelu.');
  });
});
