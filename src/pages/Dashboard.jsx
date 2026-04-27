import React from 'react';
import { ChevronRight } from 'lucide-react';

const Dashboard = ({ lessons, handleLessonStart, renderIcon }) => {
  return (
    <div className="space-y-16 animate-fade-in pointer-events-auto">
      <header className="space-y-6 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plasma/10 border border-plasma/20 text-plasma text-[10px] font-black uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-plasma animate-pulse"></span>
          System Gotowy do Nauki
        </div>
        <h1 className="text-6xl md:text-8xl font-serif italic leading-[0.85] tracking-tighter">
          Mistrzostwo <br />
          <span className="text-plasma">Wydajności</span>
        </h1>
        <p className="text-ghost/50 text-xl leading-relaxed">
          Przekształć swoją wiedzę w instynkt. Interaktywne lekcje Next.js, AI API i optymalizacji.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {lessons.map((lesson, idx) => (
          <div
            key={lesson.id}
            onClick={() => handleLessonStart(idx)}
            className="group relative glass p-10 rounded-[3.5rem] border border-white/5 hover:border-plasma/50 cursor-pointer transition-all duration-500 hover:translate-y-[-8px] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
              {renderIcon(lesson.icon, 'w-32 h-32')}
            </div>

            <div className="relative z-10">
              <div className="mb-8 w-16 h-16 rounded-3xl bg-void border border-white/10 flex items-center justify-center group-hover:bg-plasma group-hover:border-plasma transition-all duration-500 shadow-xl">
                {renderIcon(lesson.icon, 'text-plasma group-hover:text-white w-8 h-8')}
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-plasma mb-3">
                {lesson.category}
              </div>
              <h3 className="text-3xl font-bold leading-tight mb-6 group-hover:text-white transition-colors">
                {lesson.title}
              </h3>
            </div>

            <div className="relative z-10 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-ghost/30 group-hover:text-plasma transition-colors">
              ROZPOCZNIJ MODUŁ <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
