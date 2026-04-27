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
});

describe('mentorService', () => {
  it('znajduje koncept w lessonach', () => {
    const concept = findConceptInLessons('wyjaśnij LCP', mockLessons);

    expect(concept).toBeTruthy();
    expect(concept?.term).toBe('LCP');
  });

  it('używa fallbacku, gdy endpoint AI nie jest ustawiony', async () => {
    const response = await getMentorResponse({
      input: 'wyjaśnij LCP',
      chatHistory: [],
      lessons: mockLessons,
      endpoint: '',
    });

    expect(response).toContain('Z bazy wiedzy');
    expect(response).toContain('LCP');
  });

  it('używa odpowiedzi z API, gdy endpoint jest dostępny', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ response: 'To jest odpowiedź modelu.' }),
    });

    vi.stubGlobal('fetch', fetchMock);

    const response = await getMentorResponse({
      input: 'Co to jest hydration?',
      chatHistory: [],
      lessons: mockLessons,
      endpoint: 'https://example.com/api/mentor',
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(response).toBe('To jest odpowiedź modelu.');
  });
});
