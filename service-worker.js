// Nama cache versi terbaru
const CACHE_NAME = 'eleventwo-cache-v2';

// File-file yang mau di-cache
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/service-worker.js',
  '/images/icon.jpeg',
  '/images/sampul.jpg',
  '/images/background.jpg'
];

// Install service worker & cache file
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened and files added');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch request: ambil dari cache dulu, kalau ga ada baru fetch online
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// Activate: hapus cache lama kalau ada update
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
});
