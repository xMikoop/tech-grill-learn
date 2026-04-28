import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useImmersionStore } from '../store/useImmersionStore';

export function useLessonManagement(currentLesson) {
  const [unlockedConcepts, setUnlockedConcepts] = useState({});
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  
  const setView = useAppStore((state) => state.setView);
  const setCurrentLessonIndex = useAppStore((state) => state.setCurrentLessonIndex);
  const completeLessonWithReward = useAppStore((state) => state.completeLessonWithReward);
  const triggerSupernova = useImmersionStore((state) => state.triggerSupernova);

  const handleLessonStart = (index) => {
    setCurrentLessonIndex(index);
    setUnlockedConcepts({});
    setCurrentQuizIndex(0);
    setAnswers({});
    setView('lesson');
  };

  const completeCurrentLesson = (lesson, onShowAchievement) => {
    const awarded = completeLessonWithReward(lesson.id, 50);
    if (awarded && onShowAchievement) {
      onShowAchievement(`Ukończono: ${lesson.title}`);
    }
    setView('dashboard');
  };

  // Sync supernova
  useEffect(() => {
    if (!currentLesson || Object.keys(answers).length === 0) return;
    const quiz = currentLesson.quizzes?.[currentQuizIndex];
    if (quiz && answers[currentQuizIndex] === quiz.correct) {
      triggerSupernova();
    }
  }, [answers, currentQuizIndex, currentLesson, triggerSupernova]);

  return {
    unlockedConcepts,
    setUnlockedConcepts,
    currentQuizIndex,
    setCurrentQuizIndex,
    answers,
    setAnswers,
    handleLessonStart,
    completeCurrentLesson,
  };
}
