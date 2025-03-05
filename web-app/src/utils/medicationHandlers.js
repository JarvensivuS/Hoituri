import { createPrescription, deletePrescription } from '../services/api';

export const handleAddReminder = async (userId, prescriptionData) => {
  try {
    return await createPrescription(userId, prescriptionData);
  } catch (error) {
    console.error("Failed to add prescription:", error);
    throw error;
  }
};

export const handleDeletePrescription = async (userId, prescriptionId) => {
  try {
    if (!window.confirm("Haluatko varmasti poistaa tämän lääkemuistutuksen?")) {
      return false;
    }
    
    return await deletePrescription(userId, prescriptionId);
  } catch (error) {
    console.error("Failed to delete prescription:", error);
    throw error;
  }
};

export const formatTimeString = (time) => {
  // Allow only numbers
  if (!/^\d{0,2}:?\d{0,2}$/.test(time)) {
    return time;
  }

  // Automatically add : to time
  if (time.length === 2 && !time.includes(":")) {
    time = time + ":";
  }

  // Time split hh:MM
  const timeParts = time.split(":");

  if (timeParts.length === 2) {
    let hours = parseInt(timeParts[0], 10);
    let minutes = parseInt(timeParts[1], 10);

    // Hours not over 23 and minutes not over 59
    if ((timeParts[0] && (isNaN(hours) || hours > 23)) || 
        (timeParts[1] && (isNaN(minutes) || minutes > 59))) {
      return time;
    }
  }

  return time;
};