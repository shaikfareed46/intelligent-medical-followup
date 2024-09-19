// src/services/dataExtraction.js

import { formatDate } from "./dateUtils";

export const parsePrescription = async (prescriptionText) => {
    const lines = prescriptionText.trim().split('\n');

    if (lines.length < 4) {
        throw new Error('Insufficient information in prescription');
    }

    const [medication, dosage, frequency, duration] = lines;

    return {
        medication: medication.trim(),
        dosage: parseDosage(dosage),
        frequency: parseFrequency(frequency),
        duration: parseDuration(duration)
    };
};

const parseDosage = (dosageString) => {
    // Example: "10 mg" or "5 ml"
    const match = dosageString.match(/(\d+)\s*(\w+)/);
    if (!match) {
        throw new Error('Invalid dosage format');
    }
    return {
        amount: parseInt(match[1]),
        unit: match[2]
    };
};

const parseFrequency = (frequencyString) => {
    // Example: "2 times a day" or "Every 8 hours"
    if (frequencyString.includes('times a day')) {
        const times = parseInt(frequencyString);
        return { timesPerDay: times, intervalHours: 24 / times };
    } else if (frequencyString.includes('Every')) {
        const hours = parseInt(frequencyString.match(/\d+/)[0]);
        return { timesPerDay: 24 / hours, intervalHours: hours };
    }
    throw new Error('Invalid frequency format');
};

const parseDuration = (durationString) => {
    // Example: "7 days" or "2 weeks"
    const match = durationString.match(/(\d+)\s*(\w+)/);
    if (!match) {
        throw new Error('Invalid duration format');
    }
    const amount = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    return { amount, unit };
};

export const generateRemindersFromPrescription = (prescriptionList = [], startTime = new Date()) => {
    const reminders = [];

    prescriptionList.forEach((parsedPrescription) => {
        const { medication, frequency, duration } = parsedPrescription;
        
        // Calculate the total duration in days (handle weeks or days)
        const durationDays = duration.unit === 'weeks' ? duration.amount * 7 : duration.amount;
        
        // Calculate the total number of reminders (times per day * duration in days)
        const totalReminders = durationDays * frequency.timesPerDay;

        // Set the start time for reminders
        const startDate = new Date(startTime);
        startDate.setHours(8, 0, 0, 0);  // Set default start time to 8:00 AM for the first dose

        for (let i = 0; i < totalReminders; i++) {
            // Calculate the interval in hours between reminders
            const intervalHours = frequency.intervalHours;
            
            // Calculate when the reminder should happen (adjust day and time)
            const reminderTime = new Date(startDate);
            const reminderDayOffset = Math.floor(i / frequency.timesPerDay); // Calculate the day offset
            const reminderHourOffset = (i % frequency.timesPerDay) * intervalHours; // Calculate the hour offset within the day
            
            // Adjust the reminder date based on the offsets
            reminderTime.setDate(startDate.getDate() + reminderDayOffset);  // Add day offset
            reminderTime.setHours(startDate.getHours() + reminderHourOffset); // Add hour offset

            // Format the reminder time (as 'dd/mm/yyyy hh:mm')
            const formattedTime = formatDate(reminderTime);

            // Add the reminder to the list
            reminders.push({
                medication,
                time: formattedTime,
            });
        }
    });

    return reminders;
};