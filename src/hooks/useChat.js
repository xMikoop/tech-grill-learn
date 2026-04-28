import { useState, useRef, useEffect } from 'react';
import { getMentorResponse } from '../services/mentorService';
import { lessons } from '../data';
import { useAppStore } from '../store/useAppStore';
import { useImmersionStore } from '../store/useImmersionStore';
import { STREAMS } from '../lib/immersionConfig';

export function useChat() {
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: 'Witaj. Jestem Twoim Cyfrowym Mentorem. W czym mogę pomóc?' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [mentorLoading, setMentorLoading] = useState(false);
  const chatEndRef = useRef(null);
  
  const setMusicConfig = useAppStore((state) => state.setMusicConfig);
  const setIsPlaying = useImmersionStore((state) => state.setIsPlaying);
  const setVolume = useImmersionStore((state) => state.setVolume);

  const getStreamByText = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('metal') || lower.includes('rock') || lower.includes('gitar') || lower.includes('ciężk'))
      return STREAMS.metal;
    if (lower.includes('techno') || lower.includes('elektr') || lower.includes('synth') || lower.includes('cyber'))
      return STREAMS.synth;
    if (lower.includes('hip hop') || lower.includes('rap') || lower.includes('lofi') || lower.includes('chill') || lower.includes('spok'))
      return STREAMS.lofi;
    return STREAMS.ambient;
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || mentorLoading) return;

    const userText = chatInput.trim();
    const userMessage = { role: 'user', text: userText };
    const nextHistory = [...chatHistory, userMessage];

    setChatHistory(nextHistory);
    setChatInput('');

    const lowerText = userText.toLowerCase();
    const musicKeywords = ['zmień', 'włącz', 'muzyk', 'radio', 'rock', 'lofi', 'metal', 'synth', 'ambient', 'rok'];
    const hasMusicIntent = musicKeywords.some((kw) => lowerText.includes(kw));

    let responseText = 'Analizuję polecenie... Jeżeli potrzebujesz pomocy, wpisz /help lub /pomoc.';

    if (lowerText === '/help' || lowerText === '/pomoc' || lowerText === 'pomoc') {
      responseText =
        "Dostępne komendy:\n- 'zmień muzykę na [gatunek]' (np. rock, lofi, synthwave)\n- 'ciszej' / 'głośniej'\n- Możesz pytać o: LLM, Qwen, React, automatyzacje.";
    } else if (hasMusicIntent && !lowerText.includes('ciszej') && !lowerText.includes('głośniej')) {
      const newStream = getStreamByText(lowerText);
      setMusicConfig(newStream);
      setIsPlaying(true);
      responseText = `Odtwarzacz przeprogramowany. Słuchasz teraz: ${newStream.title}.`;
    } else if (lowerText.includes('ciszej') || lowerText.includes('przycisz')) {
      setVolume(15);
      responseText = 'Zmniejszyłem głośność strumienia.';
    } else if (lowerText.includes('głośniej') || lowerText.includes('podgłośń')) {
      setVolume(85);
      responseText = 'Głośność zwiększona.';
    } else {
      setMentorLoading(true);
      try {
        responseText = await getMentorResponse({
          input: userText,
          chatHistory: nextHistory,
          lessons,
        });
      } catch (error) {
        console.warn('Błąd mentora AI:', error);
        responseText = 'Wystąpił błąd podczas generowania odpowiedzi. Spróbuj ponownie za chwilę.';
      } finally {
        setMentorLoading(false);
      }
    }

    setChatHistory((prev) => [...prev, { role: 'assistant', text: responseText }]);
  };

  return {
    chatHistory,
    chatInput,
    setChatInput,
    mentorLoading,
    chatEndRef,
    handleSendMessage,
  };
}
