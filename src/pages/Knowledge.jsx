import React, { useState } from 'react';
import { Star, History as HistoryIcon, Book, LayoutDashboard } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const Knowledge = ({ lessons, setView }) => {
  const { view, favorites, history, toggleFavorite } = useAppStore();
  const [activeTab, setActiveTab] = useState(
    view === 'favorites' ? 'favorites' : view === 'history' ? 'history' : 'all'
  );

  const filteredLessons = activeTab === 'favorites' 
    ? lessons.filter(l => favorites.includes(l.id))
    : activeTab === 'history'
    ? lessons.filter(l => history.includes(l.id))
    : lessons;

  return (
    <div data-testid="knowledge-page" className="animate-fade-in max-w-4xl mx-auto pointer-events-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif italic mb-4">Twoja Baza Wiedzy</h2>
          <p className="text-ghost/50 text-lg">Skumulowane koncepty, które udało Ci się odblokować.</p>
        </div>
        
        <div className="flex bg-void p-1 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'all' ? 'bg-plasma text-void' : 'text-ghost/50 hover:text-ghost'}`}
          >
            <Book className="w-4 h-4" /> Wszystkie
          </button>
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'favorites' ? 'bg-plasma text-void' : 'text-ghost/50 hover:text-ghost'}`}
          >
            <Star className="w-4 h-4" /> Ulubione
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'history' ? 'bg-plasma text-void' : 'text-ghost/50 hover:text-ghost'}`}
          >
            <HistoryIcon className="w-4 h-4" /> Historia
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {filteredLessons.length === 0 ? (
          <div className="glass p-20 rounded-[2rem] border border-white/5 text-center">
            <div className="text-ghost/30 mb-4 font-bold uppercase tracking-widest text-sm">Brak wpisów w tej kategorii</div>
            <p className="text-ghost/50">Zacznij naukę, aby zapełnić swoją bazę wiedzy.</p>
          </div>
        ) : filteredLessons.map((lesson) => (
          <div key={lesson.id} className="glass p-8 rounded-[2rem] border border-white/5 relative group">
            <button 
              onClick={() => toggleFavorite(lesson.id)}
              className={`absolute top-8 right-8 p-3 rounded-full transition-all border ${favorites.includes(lesson.id) ? 'bg-plasma text-void border-plasma' : 'bg-white/5 text-white/30 border-white/5 hover:border-plasma/30'}`}
            >
              <Star className={`w-4 h-4 ${favorites.includes(lesson.id) ? 'fill-void' : ''}`} />
            </button>

            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-2 h-2 bg-plasma rounded-full"></span>
              {lesson.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lesson.concepts.map((concept, cIdx) => (
                <div
                  key={cIdx}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-plasma/30 transition-all group/item"
                >
                  <div className="font-bold text-plasma mb-1 group-hover/item:text-plasma-light">
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
          className="bg-white text-void px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-plasma hover:text-white transition-all flex items-center gap-3 mx-auto"
        >
          <LayoutDashboard className="w-4 h-4" /> Wróć do lekcji
        </button>
      </div>
    </div>
  );
};

export default Knowledge;
