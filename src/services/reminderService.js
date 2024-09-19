// src/services/reminderService.js

import { firestore } from './firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export const createReminders = async (userId, reminders) => {
    try {
      const promises = reminders.map(async (reminder) => {
        const { medication, frequency, duration, time } = reminder;
  
        const docRef = await addDoc(collection(firestore, 'reminders'), {
          userId,
          medication,
          time: Timestamp.fromDate(new Date(time)), // Save reminder time
          created: Timestamp.now(),
        });
  
        console.log('Reminder created successfully with ID:', docRef.id);
        return docRef.id;
      });
  
      // Wait for all reminders to be created
      const result = await Promise.all(promises);
      return result; // Array of document IDs for each reminder created
    } catch (error) {
      console.error('Error creating reminders:', error);
      throw error;
    }
  };

export const getReminders = async (userId) => {
  try {
    const q = query(collection(firestore, 'reminders'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      time: doc.data().time.toDate()
    }));
  } catch (error) {
    console.error('Error fetching reminders:', error);
    throw error;
  }
};

export const updateReminder = async (reminderId, updates) => {
  try {
    const reminderRef = doc(firestore, 'reminders', reminderId);
    await updateDoc(reminderRef, updates);
    console.log('Reminder updated successfully');
  } catch (error) {
    console.error('Error updating reminder:', error);
    throw error;
  }
};

export const deleteReminder = async (reminderId) => {
  try {
    await deleteDoc(doc(firestore, 'reminders', reminderId));
    console.log('Reminder deleted successfully');
  } catch (error) {
    console.error('Error deleting reminder:', error);
    throw error;
  }
};