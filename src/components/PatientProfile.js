// src/components/PatientProfile.js

import React, { useState, useEffect } from 'react';
import { Paper, Typography, CircularProgress, Button } from '@material-ui/core';
import { auth, firestore } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const PatientProfile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        getDoc(doc(firestore, 'patients', user.uid))
          .then((docSnap) => {
            if (docSnap.exists()) {
              setProfile(docSnap.data());
            }
          })
          .catch((error) => console.error("Error fetching profile:", error));
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        console.log("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  if (!user) {
    return <Typography>Please log in to view your profile.</Typography>;
  }

  if (!profile) {
    return <CircularProgress />;
  }

  return (
    <Paper style={{ padding: 16, position: 'relative' }}>
      {/* Logout Button  */}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        style={{ position: 'absolute', top: 16, right: 16 }}
      >
        Logout
      </Button>
      
      <Typography variant="h6">Patient Profile</Typography>
      <Typography>Name: {profile.name}</Typography>
      <Typography>Email: {user.email}</Typography>
      <Typography>Age: {profile.age}</Typography>
      <Typography>Medical History: {profile.medicalHistory}</Typography>
    </Paper>
  );
};

export default PatientProfile;
