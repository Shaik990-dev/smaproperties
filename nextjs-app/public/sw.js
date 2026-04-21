const CACHE_NAME = 'sma-v1';
const META_CACHE = 'sma-meta';
const OFFLINE_URL = '/offline';

const PRECACHE_URLS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        // Check current deploy version from the server
        const res = await fetch('/api/sw-version', { cache: 'no-store' });
        const { version } = await res.json();

        const meta = await caches.open(META_CACHE);
        const stored = await meta.match('version').then((r) => r?.text()).catch(() => null);

        if (version && version !== stored) {
          // New deploy detected — clear all content caches
          const keys = await caches.keys();
          await Promise.all(keys.filter((k) => k !== META_CACHE).map((k) => caches.delete(k)));
          await meta.put('version', new Response(version));
        }
      } catch {
        // Network unavailable — keep existing caches
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  if (
    event.request.destination === 'image' ||
    event.request.destination === 'style' ||
    event.request.destination === 'script'
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        });
      })
    );
  }
});
