import React, { useState, useEffect, useCallback } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Button } from '@material-ui/core';
import { generateRemindersFromPrescription } from '../utils/dataExtraction';
import { isExpired, isToday } from '../utils/dateUtils';

const ReminderGenerator = ({ prescriptionData }) => {
  const [reminders, setReminders] = useState([]);

  const generateReminders = useCallback(() => {
    if (!prescriptionData) return;
    const reminders = generateRemindersFromPrescription(prescriptionData);
    setReminders(reminders);
  }, [prescriptionData]);

  useEffect(() => {
    if (prescriptionData) {
      generateReminders();
    }
  }, [generateReminders, prescriptionData]);

  // Filter reminders for today
  const todaysReminders = reminders.filter((reminder) => isToday(reminder.time) && !isExpired(reminder.time));


  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h6">Reminders for Today</Typography>
      {todaysReminders.length > 0 ? (
        <List>
          {todaysReminders.map((reminder, index) => (
            <ListItem key={index}>
              <ListItemText primary={`Take ${reminder.medication} at ${reminder.time}`} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No reminders generated yet.</Typography>
      )}
      <Button variant="contained" color="secondary" onClick={generateReminders}>
        Regenerate Reminders
      </Button>
    </Paper>
  );
};

export default ReminderGenerator;
