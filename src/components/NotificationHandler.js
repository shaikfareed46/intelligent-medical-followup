import React, { useEffect } from 'react';
import {  getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../services/firebase'; // Import your firebase messaging instance

const NotificationHandler = () => {

  useEffect(() => {
    const requestPermission = async () => {
      try {
        console.log('Requesting permission...');
        const currentToken = await getToken(messaging, {
          vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY, // Your VAPID key
        });

        if (currentToken) {
          console.log('Token received:', currentToken);
          // Send this token to your server to send notifications later
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      } catch (error) {
        console.error('An error occurred while retrieving token.', error);
      }
    };

    requestPermission();

    // Handle foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);

      const { title, body, icon } = payload.notification;

      // Display notification in the foreground
      new Notification(title, {
        body,
        icon,
      });
    });

    return () => unsubscribe();
  }, []);

  return null;
};

export default NotificationHandler;
