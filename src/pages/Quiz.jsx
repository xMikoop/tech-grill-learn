import React from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const Quiz = ({
  currentLesson,
  currentQuizIndex,
  setCurrentQuizIndex,
  answers,
  setAnswers,
  setView,
  addXp,
  setCompletedModules,
  completedModules,
}) => {
  if (!currentLesson || !currentLesson.quizzes) return null;
  const quiz = currentLesson.quizzes[currentQuizIndex];
  if (!quiz) return null;

  return (
    <div className="animate-slide-up space-y-8 max-w-2xl mx-auto pb-20 pointer-events-auto">
      <button
        onClick={() => setView('lesson')}
        className="flex items-center gap-2 text-ghost/50 hover:text-plasma transition-colors mb-8 bg-white/5 px-4 py-2 rounded-full font-medium text-sm w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Wróć do teorii
      </button>

      <div className="text-center space-y-4 mb-12">
        <div className="text-plasma text-xs font-black tracking-[0.3em] uppercase">Weryfikacja Modułu</div>
        <h2 className="text-4xl font-serif italic">{currentLesson.title}</h2>
        <div className="flex justify-center gap-2">
          {currentLesson.quizzes.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full transition-all duration-500 ${
                i === currentQuizIndex ? 'bg-plasma w-12' : i < currentQuizIndex ? 'bg-green-neon' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="glass p-8 md:p-12 rounded-[3.5rem] border border-white/10 space-y-10 shadow-2xl relative overflow-hidden">
        <p className="text-2xl font-bold text-center leading-relaxed">{quiz.question}</p>

        <div className="space-y-4">
          {quiz.options.map((option, i) => {
            const isAnswered = answers[currentQuizIndex] !== undefined;
            const isCorrect = i === quiz.correct;
            const isSelected = answers[currentQuizIndex] === i;

            return (
              <div
                key={i}
                onClick={() => !isAnswered && setAnswers({ ...answers, [currentQuizIndex]: i })}
                className={`
                        quiz-option p-6 rounded-[1.5rem] border-2 text-lg font-bold flex justify-between items-center transition-all cursor-pointer
                        ${
                          !isAnswered
                            ? 'border-white/5 bg-white/5 hover:border-plasma/50 hover:bg-plasma/5'
                            : isCorrect
                            ? 'border-green-neon bg-green-neon/10 text-green-neon shadow-[0_0_20px_rgba(57,255,20,0.2)]'
                            : isSelected
                            ? 'border-red-500 bg-red-500/10 text-red-500'
                            : 'border-white/5 opacity-30'
                        }
                      `}
              >
                {option}
                {isAnswered && isCorrect && <CheckCircle className="w-6 h-6" />}
              </div>
            );
          })}
        </div>

        {answers[currentQuizIndex] !== undefined && (
          <div className="animate-fade-in pt-8 border-t border-white/5">
            {answers[currentQuizIndex] === quiz.correct ? (
              <div className="text-center space-y-8">
                <div className="space-y-2">
                  <div className="text-green-neon text-3xl font-black italic uppercase tracking-tighter">
                    Doskonale!
                  </div>
                  <div className="text-ghost/50 font-bold text-sm">+50 XP zasiliło Twój rdzeń</div>
                </div>

                {currentQuizIndex < currentLesson.quizzes.length - 1 ? (
                  <button
                    onClick={() => {
                      addXp(50);
                      setCurrentQuizIndex(currentQuizIndex + 1);
                      setAnswers({});
                    }}
                    className="w-full bg-white text-void font-black py-5 rounded-2xl shadow-xl hover:bg-plasma hover:text-white transition-all uppercase tracking-widest text-xs"
                  >
                    Kolejne Pytanie
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      addXp(50, `Ukończono: ${currentLesson.title}`);
                      if (!completedModules.includes(currentLesson.id)) {
                        setCompletedModules([...completedModules, currentLesson.id]);
                      }
                      setView('dashboard');
                    }}
                    className="w-full bg-green-neon text-void font-black py-5 rounded-2xl shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:scale-[1.02] transition-all uppercase tracking-widest text-xs"
                  >
                    Zakończ Moduł i Odbierz Nagrodę
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="text-red-400 text-xl font-bold">Wykryto anomalię w odpowiedzi.</div>
                <button
                  onClick={() => setAnswers({ ...answers, [currentQuizIndex]: undefined })}
                  className="w-full border-2 border-white/10 text-ghost font-black py-5 rounded-2xl hover:border-white/30 transition-all uppercase tracking-widest text-xs"
                >
                  Zrestartuj Sekwencję
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
