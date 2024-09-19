import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";
import { firestore } from "./firebase";

// Function to submit feedback to Firestore
export const submitFeedback = async (userId,
    medicationTaken,
    sideEffects) => {
    try {
        await addDoc(collection(firestore, 'feedback'), {
            userId,
            medicationTaken,
            sideEffects,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error('Error submitting feedback: ', error);
        alert('Error submitting feedback. Please try again.');
    }
};

// Function to fetch feedback from Firestore
export const fetchFeedback = async (userId) => {
    
    try {
        const feedbackCollection = collection(firestore, 'feedback');
        const q = query(feedbackCollection, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        const feedbackList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate().toLocaleString(), // Formatting timestamp
        }));

        return feedbackList;
        
    } catch (error) {
        console.error('Error fetching feedback:', error);
    }
};

export const deleteFeedback = async (feedbackId) => {
    await deleteDoc(doc(firestore, 'feedback', feedbackId));
  };