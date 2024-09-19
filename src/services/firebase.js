import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging'; // Import messaging functions

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const messaging = getMessaging(app);


export const requestPermission = async () => {
  try {
    const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY });
    if (token) {
      console.log('FCM Token:', token);
      // You can send this token to your server for push notification delivery
    } else {
      console.log('No registration token available.');
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

export default app;
