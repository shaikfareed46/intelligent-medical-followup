// src/App.js

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@material-ui/core';
import PrescriptionParser from './components/PrescriptionParser';
import ReminderGenerator from './components/ReminderGenerator';
import PatientFeedback from './components/PatientFeedback';
import PatientProfile from './components/PatientProfile';
import Login from './components/Login'; // Import the Login component
import { auth, messaging, requestPermission } from './services/firebase'; // Import Firebase auth
import { onAuthStateChanged } from 'firebase/auth';
import { onMessage } from 'firebase/messaging';
import NotificationHandler from './components/NotificationHandler';

function App() {
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [user, setUser] = useState(null); // Track the authenticated user
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Stop loading once the auth state is determined
    });

    return () => unsubscribe();
  }, []);

  // If the app is still loading the user's auth state, show a spinner
  if (loading) {
    return <CircularProgress />;
  }

  // If no user is logged in, show the Login component
  if (!user) {
    return <Login />;
  }

  // If the user is logged in, show the main content
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Intelligent Medical Follow-up System
        </Typography>
        <NotificationHandler />
        <PatientProfile />
        <PrescriptionParser userId={user.uid}  onParsed={setPrescriptionData} />
        <ReminderGenerator prescriptionData={prescriptionData} />
        <PatientFeedback userId={user.uid} /> {/* Pass the authenticated user ID */}
      </Box>
    </Container>
  );
}

export default App;
