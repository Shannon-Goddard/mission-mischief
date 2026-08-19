const CACHE_NAME = 'mission-mischief-v2';
const API_BASE = 'https://4q1ybupwm0.execute-api.us-east-1.amazonaws.com';

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/unlock.html',
  '/core-game-files/app.html',
  '/core-game-files/bounty-hunter.html',
  '/core-game-files/funny-tos.html',
  '/core-game-files/badge-overlay.html',
  '/pages/dashboard/',
  '/pages/dashboard/index.html',
  '/pages/dashboard/dashboard.js',
  '/pages/missions/',
  '/pages/missions/index.html',
  '/pages/missions/missions-page.js',
  '/pages/jail/',
  '/pages/jail/index.html',
  '/pages/jail/jail.js',
  '/assets/css/base.css',
  '/assets/css/main.css',
  '/assets/css/components.css',
  '/assets/css/sticky.css',
  '/assets/css/mugshot.css',
  '/assets/css/overlay.css',
  '/assets/css/hero-styles.css',
  '/assets/js/storage.js',
  '/assets/js/missions.js',
  '/assets/js/main.js',
  '/assets/js/direct-submission.js',
  '/assets/js/beer-justice.js',
  '/assets/js/beer-justice-aws-sync.js',
  '/assets/js/aws-submission-sync.js',
  '/assets/js/camera.js',
  '/assets/js/camera-capture.js',
  '/assets/js/social.js',
  '/assets/js/storage.js',
  '/assets/js/toast.js',
  '/assets/js/cheater.js',
  '/assets/js/upload.js',
  '/assets/js/usa-states-cities.json',
  '/assets/images/mascot/mayhem-excited.png',
  '/assets/images/mascot/mayhem-drunk.png',
  '/assets/images/ui/favicon.png',
  '/manifest.json'
];

// Install — cache shell assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate — clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch — cache-first for assets, network-first for API
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Network-first for API calls
  if (url.origin === new URL(API_BASE).origin) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Network-first for Lemon Squeezy
  if (url.hostname.includes('lemonsqueezy.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first for everything else
  event.respondWith(cacheFirst(event.request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Offline fallback for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/pages/dashboard/');
    }
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response(
      JSON.stringify({ success: false, error: 'Offline' }),
      { headers: { 'Content-Type': 'application/json' }, status: 503 }
    );
  }
}

// Background sync — queue mission submissions when offline
self.addEventListener('sync', event => {
  if (event.tag === 'sync-missions') {
    event.waitUntil(syncQueuedSubmissions());
  }
});

async function syncQueuedSubmissions() {
  const queue = await getSubmissionQueue();
  if (!queue.length) return;

  const results = await Promise.allSettled(
    queue.map(submission =>
      fetch(`${API_BASE}/prod/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      })
    )
  );

  // Remove successful submissions from queue
  const failed = queue.filter((_, i) => results[i].status === 'rejected');
  await saveSubmissionQueue(failed);
}

async function getSubmissionQueue() {
  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match('/offline-queue');
  if (!response) return [];
  return response.json();
}

async function saveSubmissionQueue(queue) {
  const cache = await caches.open(CACHE_NAME);
  await cache.put('/offline-queue', new Response(JSON.stringify(queue)));
}
