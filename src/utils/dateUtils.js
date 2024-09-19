export const formatDate = (time) => {
    return time
        ? time.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
        : null;
}

export const parseReminderTime = (reminderTime) => {
    const [datePart, timePart] = reminderTime.split(', ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes] = timePart.split(':');
  
    return new Date(year, month - 1, day, hours, minutes); // month is 0-based
  };

export const isToday = (reminderTime) => {
    const today = new Date();
    const reminderDate = parseReminderTime(reminderTime);
  
    return (
      today.getFullYear() === reminderDate.getFullYear() &&
      today.getMonth() === reminderDate.getMonth() &&
      today.getDate() === reminderDate.getDate()
    );
  };

  export const isExpired = (reminderTime) => {
    const today = new Date();
    const reminderDate = parseReminderTime(reminderTime);

    // Define cutoff times for morning, afternoon, and night sessions
    const morningCutoff = new Date(today);
    morningCutoff.setHours(12, 0, 0, 0); // 12:00 PM is the morning cutoff

    const afternoonCutoff = new Date(today);
    afternoonCutoff.setHours(18, 0, 0, 0); // 6:00 PM is the afternoon cutoff

    const nightCutoff = new Date(today);
    nightCutoff.setHours(0, 0, 0, 0); // 12:00 AM (midnight) is the night cutoff

    // If the reminder is from a previous day, mark it as expired
    if (reminderDate < today.setHours(0, 0, 0, 0)) {
        return true;
    }

    // Check if the reminder is today and falls in one of the sessions
    if (
        reminderDate.getDate() === today.getDate() &&
        reminderDate.getMonth() === today.getMonth() &&
        reminderDate.getFullYear() === today.getFullYear()
    ) {
        // Check if the reminder is in the morning session
        if (reminderDate < morningCutoff) {
            // If current time is after the afternoon session (6 PM), mark as expired
            return today >= afternoonCutoff;
        }

        // Check if the reminder is in the afternoon session
        if (reminderDate >= morningCutoff && reminderDate < afternoonCutoff) {
            // If current time is after the night session (12 AM), mark as expired
            return today >= nightCutoff;
        }

        // Check if the reminder is in the night session
        if (reminderDate >= afternoonCutoff && reminderDate < nightCutoff) {
            // If current time is after midnight, mark as expired
            return today >= new Date(today.setHours(24, 0, 0, 0)); // Midnight of next day
        }
    }

    // Otherwise, it's not expired
    return false;
};