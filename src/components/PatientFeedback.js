// src/components/PatientFeedback.js

import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, FormControlLabel, Checkbox, List, ListItem, ListItemText, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { fetchFeedback, submitFeedback, deleteFeedback } from '../services/feedbackService';

const PatientFeedback = ({ userId }) => {
  const [medicationTaken, setMedicationTaken] = useState(false);
  const [sideEffects, setSideEffects] = useState('');
  const [feedbacks, setFeedbacks] = useState([]); // State to hold all feedbacks
  const [loading, setLoading] = useState(false);

  const submitFeedbackClick = async () => {
    await submitFeedback(userId, medicationTaken, sideEffects);
    alert('Feedback submitted successfully!');
    setMedicationTaken(false);
    setSideEffects('');

    // Fetch fresh list of feedbacks
    retrieveFeedbackList();
  };

  const retrieveFeedbackList = async () => {
    setLoading(true);
    const feedbackList = await fetchFeedback(userId); // Fetch updated feedback after submitting
    setFeedbacks(feedbackList);
    setLoading(false);
  };

  // Function to delete a specific feedback
  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await deleteFeedback(feedbackId); // Call the delete function from the service
      setFeedbacks(feedbacks.filter((feedback) => feedback.id !== feedbackId)); // Update UI after deletion
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  // Fetch feedbacks when the component mounts
  useEffect(() => {
    async function fetchFeedbacks() {
      if (!userId) return;
      const feedbackList = await fetchFeedback(userId); // Fetch updated feedback after submitting
      setFeedbacks(feedbackList);
    }
    fetchFeedbacks();
  }, [userId]);

  return (
    <Paper style={{ padding: 16, marginTop: 16 }}>
      <Typography variant="h6">Patient Feedback</Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={medicationTaken}
            onChange={(e) => setMedicationTaken(e.target.checked)}
            color="primary"
          />
        }
        label="Medication taken"
      />

      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        value={sideEffects}
        onChange={(e) => setSideEffects(e.target.value)}
        placeholder="Any side effects?"
        style={{ marginTop: 16, marginBottom: 16 }}
      />

      <Button variant="contained" color="primary" onClick={submitFeedbackClick} disabled={loading}>
        Submit Feedback
      </Button>

      {/* Display feedback history */}
      <Paper style={{ marginTop: 32, padding: 16 }}>
        <Typography variant="h6">Previous Feedback</Typography>
        {loading ? (
          <Typography>Loading feedback...</Typography>
        ) : feedbacks.length > 0 ? (
          <List>
            {feedbacks.map((feedback) => (
              <ListItem key={feedback.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <ListItemText
                  primary={`Medication Taken: ${feedback.medicationTaken ? 'Yes' : 'No'}`}
                  secondary={`Side Effects: ${feedback.sideEffects || 'None'} | Date: ${feedback.timestamp}`}
                />
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteFeedback(feedback.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No feedback submitted yet.</Typography>
        )}
      </Paper>
    </Paper>
  );
};

export default PatientFeedback;
