const CACHE_NAME = 'tech-grill-academy-v2';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/logo.png',
  '/icons.svg'
];

const ASSET_TYPES = ['script', 'style', 'font', 'image'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  // Navigation: Network first, fallback to index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html')),
    );
    return;
  }

  // Assets (Scripts, Styles, Images)
  if (ASSET_TYPES.includes(request.destination) || url.origin !== self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networked = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const cloned = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
            }
            return response;
          })
          .catch(() => cached);

        return cached || networked;
      })
    );
    return;
  }

  // Generic fallback
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
