export const STATIC_VIEW_PATHS = {
  onboarding: '/onboarding',
  dashboard: '/dashboard',
  knowledge: '/knowledge',
  favorites: '/favorites',
  history: '/history',
};

export const VALID_VIEWS = new Set([
  'onboarding',
  'dashboard',
  'knowledge',
  'favorites',
  'history',
  'lesson',
  'quiz',
]);

export function pathFromView(view, lessonIndex = null) {
  if (view === 'lesson') {
    return lessonIndex !== null ? `/lesson/${lessonIndex}` : STATIC_VIEW_PATHS.dashboard;
  }

  if (view === 'quiz') {
    return lessonIndex !== null ? `/lesson/${lessonIndex}/quiz` : STATIC_VIEW_PATHS.dashboard;
  }

  return STATIC_VIEW_PATHS[view] ?? STATIC_VIEW_PATHS.dashboard;
}

export function viewFromPath(pathname = '/') {
  if (pathname === '/' || pathname === '') {
    return { view: 'onboarding', lessonIndex: null };
  }

  const quizMatch = pathname.match(/^\/lesson\/(\d+)\/quiz\/?$/);
  if (quizMatch) {
    return {
      view: 'quiz',
      lessonIndex: Number(quizMatch[1]),
    };
  }

  const lessonMatch = pathname.match(/^\/lesson\/(\d+)\/?$/);
  if (lessonMatch) {
    return {
      view: 'lesson',
      lessonIndex: Number(lessonMatch[1]),
    };
  }

  const normalized = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const match = Object.entries(STATIC_VIEW_PATHS).find(([, path]) => path === normalized);

  if (match) {
    return { view: match[0], lessonIndex: null };
  }

  return { view: 'dashboard', lessonIndex: null };
}
