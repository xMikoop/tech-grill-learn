const DEFAULT_SYSTEM_PROMPT = `Jesteś Mentorem Tech Grill Academy. Odpowiadasz po polsku, konkretnie i merytorycznie.
Gdy to możliwe, nawiązuj do materiałów kursu.
Jeśli czegoś nie wiesz, przyznaj to i zaproponuj następny krok.`;

export function findConceptInLessons(input, lessons) {
  const lowered = input.toLowerCase();
  const searchTerms = lowered
    .replace(/wyjaśnij|wytłumacz|co to jest|mi|proszę|prosze/g, '')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2);

  if (searchTerms.length === 0) return null;

  for (const lesson of lessons) {
    for (const concept of lesson.concepts ?? []) {
      const conceptTerm = concept.term?.toLowerCase() ?? '';
      const match = searchTerms.some((term) => conceptTerm.includes(term));
      if (!match) continue;

      const textOnly = (concept.explanation ?? '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      return {
        term: concept.term,
        lessonTitle: lesson.title,
        snippet: `${textOnly.substring(0, 320)}${textOnly.length > 320 ? '…' : ''}`,
      };
    }
  }

  return null;
}

function fallbackMentorResponse(input, lessons) {
  const lowered = input.toLowerCase();

  if (lowered.includes('llm') || lowered.includes('qwen') || lowered.includes('model') || lowered.includes('ai')) {
    return 'SLM/LLM dobieraj do zadania: lokalne modele (np. Qwen Coder) świetnie działają do inferencji edge i obniżania kosztów, a większe modele zostaw do złożonego reasoning-u.';
  }

  const concept = findConceptInLessons(input, lessons);
  if (concept) {
    return `Z bazy wiedzy (${concept.term}):\n\n${concept.snippet}\n\nPełny kontekst znajdziesz w module „${concept.lessonTitle}”.`;
  }

  return 'Nie mam jeszcze precyzyjnej odpowiedzi dla tego pytania. Spróbuj doprecyzować temat (np. „wyjaśnij LCP w React”).';
}

export async function getMentorResponse({
  input,
  chatHistory,
  lessons,
  endpoint = import.meta.env.VITE_MENTOR_API_URL,
  apiKey = import.meta.env.VITE_MENTOR_API_KEY,
  model = import.meta.env.VITE_MENTOR_MODEL,
}) {
  if (!endpoint) {
    return fallbackMentorResponse(input, lessons);
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model,
        systemPrompt: DEFAULT_SYSTEM_PROMPT,
        message: input,
        history: chatHistory.slice(-12),
      }),
    });

    if (!response.ok) {
      throw new Error(`Mentor API error: ${response.status}`);
    }

    const payload = await response.json();
    const text = payload?.response ?? payload?.message ?? payload?.text;

    if (!text || typeof text !== 'string') {
      throw new Error('Mentor API returned empty response');
    }

    return text.trim();
  } catch (error) {
    console.warn('Mentor API unavailable, fallback engaged:', error);
    return fallbackMentorResponse(input, lessons);
  }
}
