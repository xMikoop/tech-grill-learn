import React from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const Lesson = ({ currentLesson, setView, unlockedConcepts, setUnlockedConcepts, renderIcon }) => {
  if (!currentLesson) return null;

  return (
    <div className="animate-slide-up space-y-8 max-w-4xl mx-auto pb-20 pointer-events-auto">
      <button
        onClick={() => setView('dashboard')}
        className="flex items-center gap-2 text-ghost/50 hover:text-plasma transition-colors mb-8 bg-white/5 px-4 py-2 rounded-full font-medium text-sm w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Wróć do modułów
      </button>

      <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/10 relative overflow-hidden">
        <div className="text-xs font-bold uppercase tracking-widest text-plasma mb-4 flex items-center gap-2">
          {renderIcon(currentLesson.icon, 'w-4 h-4')} {currentLesson.category}
        </div>
        <h2 className="text-4xl font-serif italic mb-8 leading-tight">{currentLesson.title}</h2>

        <div className="text-ghost/70 mb-8 font-medium text-lg border-l-2 border-plasma pl-4 bg-plasma/5 p-4 rounded-r-xl">
          W tym module zgłębimy: {currentLesson.concepts.map((c) => c.term).join(', ')}
        </div>

        <div className="space-y-12">
          {currentLesson.concepts.map((concept, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-[2rem] border transition-all duration-500 ${
                unlockedConcepts[idx]
                  ? 'bg-plasma/5 border-plasma/30 shadow-[0_0_30px_rgba(123,97,255,0.1)]'
                  : 'bg-white/5 border-white/10 opacity-70 grayscale'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-plasma-light">{concept.term}</h3>
                {unlockedConcepts[idx] ? (
                  <div className="flex items-center gap-2 text-green-neon text-[10px] font-black uppercase tracking-widest bg-green-neon/10 px-3 py-1 rounded-full border border-green-neon/20">
                    <CheckCircle className="w-3 h-3" /> Przyswojone
                  </div>
                ) : (
                  <button
                    onClick={() => setUnlockedConcepts((prev) => ({ ...prev, [idx]: true }))}
                    className="text-[10px] font-black uppercase tracking-widest bg-white text-void px-4 py-2 rounded-full hover:bg-plasma hover:text-white transition-all shadow-xl"
                  >
                    Odblokuj Koncept
                  </button>
                )}
              </div>

              <div
                className="prose-lesson space-y-4 text-ghost/80 text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: concept.explanation.replace(/\n/g, '<br/>') }}
              ></div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setView('quiz');
            window.scrollTo(0, 0);
          }}
          className="mt-16 w-full bg-plasma text-void font-black py-6 rounded-2xl flex items-center justify-center gap-4 hover:bg-plasma-light hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(123,97,255,0.3)] uppercase tracking-[0.2em]"
        >
          Przejdź do Weryfikacji Wiedzy <CheckCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Lesson;
