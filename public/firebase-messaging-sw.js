importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC2HopnRhInTnJNe-kjP17ULpWsLOsVyNE",
  authDomain: "intelligent-medical-follow-up.firebaseapp.com",
  projectId: "intelligent-medical-follow-up",
  storageBucket: "intelligent-medical-follow-up.appspot.com",
  messagingSenderId: "35067265706",
  appId: "1:35067265706:web:c8e5bf81921280191c86d3",
  measurementId: "YTT9022343",
};



firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background Message received:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
