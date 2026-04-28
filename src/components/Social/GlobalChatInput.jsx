import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useLobby } from '../../hooks/useLobby';

/**
 * GlobalChatInput
 * Umożliwia wysyłanie wiadomości do wszystkich graczy w lobby.
 */
export const GlobalChatInput = () => {
  const [text, setText] = useState('');
  const { sendMessage } = useLobby();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    sendMessage(text.trim());
    setText('');
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] w-full max-w-md px-6 pointer-events-auto">
      <form 
        onSubmit={handleSubmit}
        className="glass rounded-2xl border border-plasma/30 shadow-[0_0_30px_rgba(123,97,255,0.2)] overflow-hidden flex items-center p-1"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Wyślij wiadomość do lobby..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 py-2 text-ghost placeholder:text-ghost/30"
          maxLength={50}
        />
        <button
          type="submit"
          className="bg-plasma text-void p-2 rounded-xl hover:scale-105 active:scale-95 transition-transform"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
