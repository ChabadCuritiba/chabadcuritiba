// Firebase Cloud Messaging Service Worker for Beit Chabad Curitiba
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  projectId: "chabadcuritiba",
  appId: "1:943793109445:web:bde4d5bc46c0ce9c9a33ac",
  storageBucket: "chabadcuritiba.firebasestorage.app",
  apiKey: "AIzaSyAhMuU1SRxAk7KmuRZTb2wJNQrF9uSHYP4",
  authDomain: "chabadcuritiba.firebaseapp.com",
  messagingSenderId: "943793109445"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || payload.data?.title || '🕯️ Beit Chabad Curitiba';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'Horários de Shabat e avisos comunitários.',
    icon: '/icons/icon-192.png',
    badge: '/favicon.png',
    vibrate: [200, 100, 200, 100, 200],
    data: {
      url: payload.data?.url || '/#home'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

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
