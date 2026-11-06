import { initializeApp } from 'firebase/app';
import { getMessaging, isSupported, type Messaging } from 'firebase/messaging';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
} as Record<string, string>;

export const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string;

const app = initializeApp(firebaseConfig);

export const getMessagingInstance = async (): Promise<Messaging | null> =>
  (await isSupported()) ? getMessaging(app) : null;

export const registerServiceWorker = () =>
  navigator.serviceWorker.register(
    `/js/firebase-messaging-sw.js?${new URLSearchParams(firebaseConfig)}`
  );
