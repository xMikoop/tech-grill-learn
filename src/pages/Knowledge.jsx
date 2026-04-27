import React from 'react';

const Knowledge = ({ lessons, setView }) => {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto pointer-events-auto">
      <header className="mb-12">
        <h2 className="text-4xl font-serif italic mb-4">Twoja Baza Wiedzy</h2>
        <p className="text-ghost/50 text-lg">Skumulowane koncepty, które udało Ci się odblokować.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="glass p-8 rounded-[2rem] border border-white/5">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-2 h-2 bg-plasma rounded-full"></span>
              {lesson.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lesson.concepts.map((concept, cIdx) => (
                <div
                  key={cIdx}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-plasma/30 transition-all group"
                >
                  <div className="font-bold text-plasma mb-1 group-hover:text-plasma-light">
                    {concept.term}
                  </div>
                  <div
                    className="text-xs text-ghost/50 leading-relaxed line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: concept.explanation }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 rounded-[2rem] bg-plasma/5 border border-plasma/20 text-center">
        <p className="text-ghost/70 mb-6">Chcesz pogłębić swoją wiedzę w konkretnym obszarze?</p>
        <button
          onClick={() => setView('dashboard')}
          className="bg-white text-void px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-plasma hover:text-white transition-all"
        >
          Wróć do lekcji
        </button>
      </div>
    </div>
  );
};

export default Knowledge;
