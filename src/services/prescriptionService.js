// src/services/prescriptionService.js

import { formatDate } from '../utils/dateUtils';
import { firestore } from './firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';

export const createPrescription = async ( userId, data) => {
  try {

    const {medication, dosage, frequency, duration} = data;

    const docRef = await addDoc(collection(firestore, 'prescription'), {
        userId,  medication, dosage, frequency, duration, time: Timestamp.fromDate(new Date()),
    });
    console.log('Prescription created successfully with ID:', docRef.id);
    return { id: docRef.id , ...data};
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw error;
  }
};

export const getPrescription = async (userId) => {
  try {
    const q = query(collection(firestore, 'prescription'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const time = doc.data()?.time?.toDate();
      
      // Format the time in 'dd/mm/yyyy hh:mm' format
      const formattedTime = formatDate(time);

      return {
        id: doc.id,
        ...doc.data(),
        time: formattedTime,
      };
    });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    throw error;
  }
};


export const updatePrescription = async (prescriptionId, updates) => {
  try {
    const prescriptionRef = doc(firestore, 'prescription', prescriptionId);
    await updateDoc(prescriptionRef, updates);
    console.log('Prescription updated successfully');
  } catch (error) {
    console.error('Error updating prescription:', error);
    throw error;
  }
};

export const deletePrescription = async (prescriptionId) => {
  try {
    await deleteDoc(doc(firestore, 'prescription', prescriptionId));
    console.log('Prescription deleted successfully');
  } catch (error) {
    console.error('Error deleting prescription:', error);
    throw error;
  }
};