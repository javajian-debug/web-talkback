const CACHE_NAME = 'web-talkback-cache-v2';

// List of assets to cache for offline use (Tailwind CDN removed to prevent CORS error)
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap'
];

// 1. Install Event: Caches the initial assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache v2');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    // Forces the waiting service worker to become the active service worker
    self.skipWaiting(); 
});

// 2. Activate Event: Cleans up old, outdated caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Ensure the service worker takes control of the page immediately
    self.clients.claim();
});

// 3. Fetch Event: Serves files from the cache if available, otherwise goes to the network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return the cached response if found
                if (response) {
                    return response;
                }
                // Otherwise, fetch from the network
                return fetch(event.request).catch(() => {
                    console.log('Network request failed and no cache available.');
                });
            })
    );
});
