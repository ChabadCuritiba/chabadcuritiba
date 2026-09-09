const CACHE_NAME = 'chabad-curitiba-cache-v3';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/assets/logo.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .catch((err) => {
        console.warn('[SW] Pre-cache non-fatal error:', err);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Network-first with cache fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/')))
  );
});

// Web Push Notifications & Background Alerts
self.addEventListener('push', (event) => {
  let data = {
    title: '🕯️ Beit Chabad Curitiba',
    body: 'Horários de Shabat e avisos da comunidade.',
    url: '/#home',
    icon: '/icons/icon-192.png'
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192.png',
    badge: '/favicon.png',
    vibrate: [400, 150, 400, 150, 400],
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'open', title: 'Abrir App' }
    ],
    tag: 'chabad-notice-' + Date.now(),
    renotify: true,
    requireInteraction: true
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle clicking on notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          if (client.url.includes(self.origin)) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Direct message handler for notifications
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, url } = event.data;
    self.registration.showNotification(title || 'Beit Chabad Curitiba', {
      body: body || '',
      icon: '/icons/icon-192.png',
      badge: '/favicon.png',
      data: { url: url || '/' },
      vibrate: [400, 150, 400, 150, 400],
      tag: 'chabad-notice-' + Date.now(),
      renotify: true,
      requireInteraction: true
    });
  }
});
