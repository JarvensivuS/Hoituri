import { useState } from "react";
import useMedicationData from "../hooks/useMedicationData";
import MedicationForm from "./MedicationForm";
import MedicationList from "./MedicationList";
import "../styles/MedicationSchedule.css";

const MedicationSchedule = ({ userId }) => {
  const {
    reminders,
    patients,
    loading,
    error,
    addReminder,
    deleteReminder
  } = useMedicationData(userId);
  
  const [actionInProgress, setActionInProgress] = useState(false);

  const handleAddReminder = async (prescriptionData) => {
    try {
      setActionInProgress(true);
      await addReminder(prescriptionData);
    } catch (err) {
      throw err;
    } finally {
      setActionInProgress(false);
    }
  };

  const handleDeleteReminder = async (prescriptionId) => {
    try {
      setActionInProgress(true);
      return await deleteReminder(prescriptionId);
    } catch (err) {
      throw err;
    } finally {
      setActionInProgress(false);
    }
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
          patients={patients}
          onAddSuccess={handleAddReminder} 
          isLoading={actionInProgress}
        />

        {/* List of existing prescriptions */}
        <MedicationList 
          reminders={reminders} 
          userId={userId}
          onDeletePrescription={handleDeleteReminder}
        />
      </div>
    </div>
  );
};

export default MedicationSchedule;