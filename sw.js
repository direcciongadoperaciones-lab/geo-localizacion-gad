const CACHE_NAME = 'gad-v2';
const urlsToCache = [ '/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png', '/BASES_GAD_2026.kml', '/PARTIDOS_PBA.kml' ];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache))));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(res => res || fetch(e.request))));