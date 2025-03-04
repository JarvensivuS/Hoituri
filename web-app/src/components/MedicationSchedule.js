import { useState, useEffect } from "react";
import { getPrescriptions } from "../services/api";
import MedicationForm from "./MedicationForm";
import MedicationList from "./MedicationList";

const MedicationSchedule = ({ userId }) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      // Fetch prescriptions where the logged-in doctor is the doctor
      const prescriptionsData = await getPrescriptions(userId, { doctorId: userId });
      
      // Transform data for the component
      const remindersList = prescriptionsData.map(prescription => {
        return {
          id: prescription.id,
          medicine: prescription.medication,
          patientId: prescription.patientId,
          patientName: prescription.patientName || "Tuntematon", // This may need to be fetched separately
          dosage: prescription.dosage,
          day: getDayFromFrequency(prescription.frequency),
          time: prescription.reminderSettings?.times[0] || "08:00",
          frequency: prescription.frequency,
          notifyCaretaker: prescription.reminderSettings?.notifyCaretaker || false
        };
      });
      
      setReminders(remindersList);
    } catch (err) {
      console.error("Failed to load prescriptions:", err);
      setError("Lääkemuistutuksien lataaminen epäonnistui");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchReminders();
    }
  }, [userId]);

  // Helper function to extract day from frequency
  const getDayFromFrequency = (frequency) => {
    // Simple implementation - in a real app, you'd have more complex logic
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

  const handlePrescriptionDeleted = (prescriptionId) => {
    setReminders(reminders.filter(reminder => reminder.id !== prescriptionId));
  };

  if (loading && reminders.length === 0) {
    return <div style={{textAlign: "center", padding: "20px"}}>Ladataan lääkemuistutuksia...</div>;
  }

  if (error) {
    return <div style={{textAlign: "center", padding: "20px", color: "red"}}>{error}</div>;
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div>
        <h2>Lääkemuistutukset</h2>

        {/* Form for adding new prescriptions */}
        <MedicationForm 
          userId={userId} 
          onAddSuccess={fetchReminders} 
        />

        {/* List of existing prescriptions */}
        <MedicationList 
          reminders={reminders} 
          userId={userId}
          onDeletePrescription={handlePrescriptionDeleted}
        />
      </div>
    </div>
  );
};

export default MedicationSchedule;