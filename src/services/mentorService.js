const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const STOP_WORDS = new Set(['wyjaśnij', 'wytłumacz', 'co', 'to', 'jest', 'mi', 'proszę', 'jak', 'działa', 'dlaczego', 'czym', 'są', 'system', 'projekt', 'kod']);

// Build a RAG context string from matching lessons with improved scoring
function buildRagContext(input, lessons) {
  const lowered = input.toLowerCase();
  const terms = lowered
    .split(/[\s,.\-?]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  if (terms.length === 0) return '';

  const candidates = [];

  for (const lesson of lessons) {
    for (const concept of lesson.concepts ?? []) {
      const term = concept.term?.toLowerCase() ?? '';
      const explanation = (concept.explanation ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      
      let score = 0;
      terms.forEach(t => {
        if (term.includes(t)) score += 5;
        if (explanation.toLowerCase().includes(t)) score += 1;
      });

      if (score > 0) {
        candidates.push({
          score,
          text: `[${lesson.title}] ${concept.term}: ${explanation.substring(0, 500)}`
        });
      }
    }
  }

  // Sort by score and take top 3
  const bestMatches = candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(c => c.text);

  return bestMatches.length > 0
    ? `Kontekst z bazy wiedzy Tech Grill Academy:\n${bestMatches.join('\n\n')}`
    : '';
}

const SYSTEM_INSTRUCTION = `Jesteś "Tech Grill Mentor" — precyzyjnym, wymagającym mentorem dla Senior Developerów.
Odpowiadasz wyłącznie po polsku. Bądź konkretny i merytoryczny. Unikaj wstępów i fraz takich jak "Oczywiście!".
Gdy masz kontekst z bazy wiedzy, opieraj się na nim. Gdy czegoś nie wiesz — przyznaj to.
Format: używaj krótkich akapitów. Kod wstawiaj w backtickach.`;

export async function getMentorResponse({ input, chatHistory = [], lessons = [] }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const ragContext = buildRagContext(input, lessons);

  const userMessageWithContext = ragContext
    ? `${ragContext}\n\n---\nPytanie użytkownika: ${input}`
    : input;

  // Build conversation history for Gemini
  const geminiHistory = chatHistory
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .slice(-10)
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

  // If no API key, use fallback
  if (!apiKey) {
    return findConceptInLessons(input, lessons)
      ? `Z bazy wiedzy: ${buildRagContext(input, lessons) || 'Brak dopasowania. Spróbuj doprecyzować pytanie.'}`
      : 'Dodaj klucz VITE_GEMINI_API_KEY do .env.local, aby włączyć prawdziwego AI Mentora. Na razie pracuję w trybie offline.';
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [
          ...geminiHistory,
          { role: 'user', parts: [{ text: userMessageWithContext }] },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return "Limit zapytań do mentora AI został osiągnięty. Spróbuj ponownie za minutę lub sprawdź Bazę Wiedzy.";
      }
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error('Empty response from Gemini');
    return text.trim();
  } catch (err) {
    console.warn('Gemini unavailable, fallback:', err.message);
    const ctx = buildRagContext(input, lessons);
    return ctx
      ? `[Tryb offline]\n\n${ctx}`
      : 'Mentor tymczasowo niedostępny. Sprawdź połączenie lub klucz API.';
  }
}

// Keep for direct use if needed
export function findConceptInLessons(input, lessons) {
  const lowered = input.toLowerCase();
  const terms = lowered.split(/\s+/).filter((w) => w.length > 2);
  for (const lesson of lessons) {
    for (const concept of lesson.concepts ?? []) {
      if (terms.some((t) => concept.term?.toLowerCase().includes(t))) {
        return concept;
      }
    }
  }
  return null;
}

