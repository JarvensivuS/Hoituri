import { useState, useEffect } from "react";
import { getPrescriptions, getPatients } from "../../../services/api";
import { handleDeletePrescription, handleAddReminder } from "./medicationHandlers";

export default function useMedicationData(userId) {
  const [reminders, setReminders] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const prescriptionsData = await getPrescriptions(userId, { doctorId: userId });
      
      const remindersList = prescriptionsData.map(prescription => {
        return {
          id: prescription.id,
          medicine: prescription.medication,
          patientId: prescription.patientId,
          patientName: prescription.patientName || "Tuntematon", 
          dosage: prescription.dosage,
          day: getDayFromFrequency(prescription.frequency),
          time: prescription.reminderSettings?.times[0] || "08:00",
          frequency: prescription.frequency,
          notifyCaretaker: prescription.reminderSettings?.notifyCaretaker || false
        };
      });
      
      setReminders(remindersList);
      return remindersList;
    } catch (err) {
      console.error("Failed to load prescriptions:", err);
      setError("Lääkemuistutuksien lataaminen epäonnistui");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const patientsData = await getPatients(userId);
      setPatients(patientsData);
      return patientsData;
    } catch (err) {
      console.error("Failed to load patients:", err);
      setError("Potilaiden lataaminen epäonnistui");
      throw err;
    }
  };

  useEffect(() => {
    if (userId) {
      const loadData = async () => {
        try {
          setLoading(true);
          await Promise.all([fetchReminders(), fetchPatients()]);
        } catch (err) {
          // Error already set in the individual fetch functions
        } finally {
          setLoading(false);
        }
      };
      
      loadData();
    }
  }, [userId]);

  const addReminder = async (reminderData) => {
    try {
      const result = await handleAddReminder(userId, reminderData);
      await fetchReminders(); // Refresh the list
      return result;
    } catch (err) {
      console.error("Failed to add reminder:", err);
      throw err;
    }
  };

  const deleteReminder = async (prescriptionId) => {
    try {
      const success = await handleDeletePrescription(userId, prescriptionId);
      if (success) {
        setReminders(reminders.filter(reminder => reminder.id !== prescriptionId));
      }
      return success;
    } catch (err) {
      console.error("Failed to delete reminder:", err);
      throw err;
    }
  };

  const getDayFromFrequency = (frequency) => {
    if (frequency.includes("kertaa päivässä")) {
      return "Joka päivä";
    }
    
    const dayMap = {
      "maanantai": "Maanantai",
      "tiistai": "Tiistai", 
      "keskiviikko": "Keskiviikko",
      "torstai": "Torstai",
      "perjantai": "Perjantai",
      "lauantai": "Lauantai",
      "sunnuntai": "Sunnuntai"
    };
    
    for (const [key, value] of Object.entries(dayMap)) {
      if (frequency.toLowerCase().includes(key)) {
        return value;
      }
    }
    
    return "Maanantai";
  };

  return {
    reminders,
    patients,
    loading,
    error,
    fetchReminders,
    fetchPatients,
    addReminder,
    deleteReminder
  };
}