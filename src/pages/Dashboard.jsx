import React, { useEffect, useRef } from 'react';
import { ChevronRight, CheckCircle2, Lock } from 'lucide-react';
import gsap from 'gsap';

// Lesson progression — which lessons unlock after which
// Index in lessons array → array of indexes it unlocks
const UNLOCK_TREE = {
  0: [1, 2],
  1: [3],
  2: [3],
  3: [4],
  4: [5],
};

const SkillNode = ({ lesson, idx, isCompleted, isUnlocked, onClick, renderIcon }) => {
  const nodeRef = useRef(null);

  useEffect(() => {
    if (!nodeRef.current) return;
    gsap.fromTo(nodeRef.current,
      { opacity: 0, y: 20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, delay: idx * 0.08, ease: 'power2.out' }
    );
  }, [idx]);

  return (
    <div
      ref={nodeRef}
      onClick={isUnlocked ? onClick : undefined}
      className={`
        group relative flex flex-col gap-4 p-8 rounded-[2.5rem] border transition-all duration-500
        ${isCompleted
          ? 'border-green-500/40 bg-green-500/5 hover:border-green-400/60'
          : isUnlocked
          ? 'border-white/10 bg-white/[0.02] hover:border-plasma/60 hover:bg-plasma/5 cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(123,97,255,0.15)]'
          : 'border-white/5 bg-white/[0.01] opacity-40 cursor-not-allowed'
        }
      `}
    >
      {/* Status indicator */}
      <div className="absolute top-5 right-5">
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-green-400" />
        ) : !isUnlocked ? (
          <Lock className="w-4 h-4 text-white/20" />
        ) : null}
      </div>

      {/* Completion glow */}
      {isCompleted && (
        <div className="absolute inset-0 rounded-[2.5rem] bg-green-500/5 pointer-events-none" />
      )}

      <div className="w-14 h-14 rounded-2xl bg-void border border-white/10 flex items-center justify-center
                      group-hover:bg-plasma group-hover:border-plasma transition-all duration-500 shrink-0">
        {renderIcon(lesson.icon, 'text-plasma group-hover:text-white w-7 h-7')}
      </div>

      <div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-plasma mb-2">
          {lesson.category}
        </div>
        <h3 className="text-xl font-bold leading-tight mb-3">{lesson.title}</h3>
        <div className="text-xs text-ghost/40 font-mono">
          {lesson.concepts?.length ?? 0} konceptów · {lesson.quizzes?.length ?? 1} quiz
        </div>
      </div>

      <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest mt-auto transition-colors
        ${isCompleted ? 'text-green-400' : isUnlocked ? 'text-ghost/30 group-hover:text-plasma' : 'text-white/20'}`}>
        {isCompleted ? 'UKOŃCZONO' : isUnlocked ? <><span>ROZPOCZNIJ</span><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></> : 'ZABLOKOWANE'}
      </div>
    </div>
  );
};

const Dashboard = ({ lessons, handleLessonStart, renderIcon, completedLessons = [], streak = 0, xp = 0 }) => {
  const level = Math.floor(xp / 500) + 1;
  const xpToNext = 500 - (xp % 500);

  // A lesson is unlocked if: it's the first one, OR any of its prerequisite lessons is completed
  const isLessonUnlocked = (idx) => {
    if (idx === 0) return true;
    return Object.entries(UNLOCK_TREE).some(([prereqIdx, unlocksArr]) =>
      unlocksArr.includes(idx) && completedLessons.includes(lessons[parseInt(prereqIdx)]?.id)
    );
  };

  return (
    <div data-testid="dashboard-page" className="space-y-12 animate-fade-in pointer-events-auto max-w-6xl mx-auto">
      {/* Header Stats Bar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center justify-between text-xs font-bold text-ghost/50 mb-2">
            <span>POZIOM {level}</span>
            <span>{xpToNext} XP do następnego</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-plasma to-plasma-light rounded-full transition-all duration-1000"
              style={{ width: `${((xp % 500) / 500) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <span className="text-lg">🔥</span>
              <span className="font-black text-sm">{streak} dni z rzędu!</span>
            </div>
          )}
          <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-sm">
            ✓ {completedLessons.length}/{lessons.length} ukończone
          </div>
        </div>
      </div>

      {/* Title */}
      <header className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plasma/10 border border-plasma/20 text-plasma text-[10px] font-black uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-plasma animate-pulse"></span>
          Drzewo Umiejętności
        </div>
        <h1 className="text-5xl md:text-7xl font-serif italic leading-[0.85] tracking-tighter">
          Twoja <span className="text-plasma">ścieżka</span>
        </h1>
        <p className="text-ghost/50 text-lg leading-relaxed">
          Ukończ moduły po kolei, aby odblokować bardziej zaawansowane tematy.
        </p>
      </header>

      {/* Skill Tree Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {lessons.map((lesson, idx) => (
          <SkillNode
            key={lesson.id}
            lesson={lesson}
            idx={idx}
            isCompleted={completedLessons.includes(lesson.id)}
            isUnlocked={isLessonUnlocked(idx)}
            renderIcon={renderIcon}
            onClick={() => handleLessonStart(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
