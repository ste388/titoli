const CACHE_NAME = 'Portafoglio-v2'; // Modificato per forzare l'aggiornamento sui telefoni
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/192.png',
  './icons/512.png'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

// Pulisce le vecchie memorie incastrate nel telefono quando aggiorni l'app
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
});

self.addEventListener('fetch', (evt) => {
  // REGOLA D'ORO: Ignora le chiamate a Firebase (lasciale passare verso internet)
  if (evt.request.method !== 'GET' || !evt.request.url.startsWith(self.location.origin)) {
      return; 
  }
  
  evt.respondWith(
    caches.match(evt.request).then((res) => res || fetch(evt.request))
  );
});