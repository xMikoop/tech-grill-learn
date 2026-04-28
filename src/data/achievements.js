import { Trophy, Star, Zap, Flame, Target, Award } from 'lucide-react';

export const ACHIEVEMENTS = {
  FIRST_STEPS: {
    id: 'FIRST_STEPS',
    title: 'Pierwsze Kroki',
    description: 'Ukończono pierwszą lekcję w akademii.',
    icon: 'Trophy',
    color: '#FFD700',
  },
  STREAK_3: {
    id: 'STREAK_3',
    title: 'Potrójne Uderzenie',
    description: 'Zachowano serię przez 3 dni.',
    icon: 'Flame',
    color: '#FF4500',
  },
  QUIZ_MASTER: {
    id: 'QUIZ_MASTER',
    title: 'Mistrz Weryfikacji',
    description: 'Ukończono quiz bez żadnego błędu.',
    icon: 'Target',
    color: '#00FF7F',
  },
  EXPLORER: {
    id: 'EXPLORER',
    title: 'Odkrywca Układu',
    description: 'Kliknięto we wszystkie ciała niebieskie.',
    icon: 'Star',
    color: '#7B61FF',
  },
  FAST_LEARNER: {
    id: 'FAST_LEARNER',
    title: 'Szybki Umysł',
    description: 'Odblokowano wszystkie koncepty w jednej lekcji w mniej niż minutę.',
    icon: 'Zap',
    color: '#00BFFF',
  }
};
