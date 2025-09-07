// Service Worker for Perspective Paint & Design
const CACHE_NAME = 'perspective-paint-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/script.js',
  '/optimize.js',
  '/media/perspective-logo-old.png',
  '/pages/offline.html'
];

// Install event - cache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Cache install error:', err))
  );
  // Force immediate activation
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control immediately
  return self.clients.claim();
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests
  if (url.origin !== location.origin && !url.href.includes('fonts.googleapis.com') && !url.href.includes('cdnjs.cloudflare.com')) {
    return;
  }

  event.respondWith(
    caches.match(request).then(response => {
      // Cache hit - return response
      if (response) {
        // Update cache in background for HTML files
        if (request.headers.get('accept').includes('text/html')) {
          event.waitUntil(updateCache(request));
        }
        return response;
      }

      // Clone the request
      const fetchRequest = request.clone();

      return fetch(fetchRequest).then(response => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Cache the response for specific file types
        if (shouldCache(request)) {
          event.waitUntil(
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            })
          );
        }

        return response;
      }).catch(() => {
        // Offline fallback for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/pages/offline.html');
        }
        // Return offline image for image requests
        if (request.headers.get('accept').includes('image')) {
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#ccc"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Offline</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }
      });
    })
  );
});

// Helper function to determine if request should be cached
function shouldCache(request) {
  const url = request.url;
  const cacheableExtensions = ['.html', '.css', '.js', '.json', '.png', '.jpg', '.jpeg', '.svg', '.woff', '.woff2'];
  return cacheableExtensions.some(ext => url.includes(ext));
}

// Helper function to update cache in background
function updateCache(request) {
  return caches.open(CACHE_NAME).then(cache => {
    return fetch(request).then(response => {
      if (response.status === 200) {
        return cache.put(request, response);
      }
    });
  });
}

// Listen for messages from clients
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  if (event.data.action === 'clearCache') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        console.log('Cache cleared');
      })
    );
  }
});