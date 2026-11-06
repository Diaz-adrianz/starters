importScripts(
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js'
);

const p = new URL(self.location).searchParams;

firebase.initializeApp({
  apiKey: p.get('apiKey'),
  authDomain: p.get('authDomain'),
  projectId: p.get('projectId'),
  storageBucket: p.get('storageBucket'),
  messagingSenderId: p.get('messagingSenderId'),
  appId: p.get('appId'),
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  if (payload.notification) return;
  self.registration.showNotification(payload.data?.title ?? 'Notification', {
    body: payload.data?.body,
    icon: '/images/icon-192.png',
  });
});
