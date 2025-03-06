import { useState, useEffect } from "react";
import { formatTimeString } from "../hooks/medicationHandlers";
import AddMedicationButton from "../Buttons/AddMedicationButton";
import "../styles/MedicationForm.css";

const MedicationForm = ({ userId, patients, onAddSuccess, isLoading }) => {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [newMedicine, setNewMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [newDay, setNewDay] = useState("Maanantai");
  const [newTime, setNewTime] = useState("");
  const [notifyCaretaker, setNotifyCaretaker] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);

  // Weekdays for drop menu
  const weekdays = [
    "Maanantai",
    "Tiistai",
    "Keskiviikko",
    "Torstai",
    "Perjantai",
    "Lauantai",
    "Sunnuntai",
  ];

  useEffect(() => {
    if (patients.length > 0 && !selectedPatient) {
      setSelectedPatient(patients[0].id);
    }
  }, [patients, selectedPatient]);

  // Function to convert day to frequency
  const getFrequencyFromDay = (day) => {
    if (day === "Joka päivä") {
      return "2 kertaa päivässä";
    }
    return `${day}na`;
  };

  const handleTimeChange = (e) => {
    setNewTime(formatTimeString(e.target.value));
  };

  const addReminder = async () => {
    // Check that the fields aren't empty
    if (
      newMedicine.trim() === "" ||
      newTime.trim() === "" ||
      !selectedPatient ||
      dosage.trim() === ""
    ) {
      alert("Kaikki kentät ovat pakollisia");
      return;
    }

    try {
      setFormLoading(true);
      setError(null);
      
      // Calculate dates
      const startDate = new Date().toISOString().split("T")[0]; // Today
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]; // 30 days from now

      // Create the prescription object according to your database schema
      const prescriptionData = {
        doctorId: userId,
        patientId: selectedPatient,
        medication: newMedicine,
        dosage: dosage,
        frequency: getFrequencyFromDay(newDay),
        startDate: startDate,
        endDate: endDate,
        notes: "Lääkärin määräämä",
        reminderSettings: {
          times: [newTime],
          notifyCaretaker: notifyCaretaker
        }
      };

      // Call the onAddSuccess callback with the prescription data
      await onAddSuccess(prescriptionData);

      // Reset input fields
      setNewMedicine("");
      setNewTime("");
      setDosage("");
      setNewDay("Maanantai");
      setNotifyCaretaker(true);
    } catch (err) {
      setError("Lääkemuistutuksen lisääminen epäonnistui: " + (err.message || ""));
    } finally {
      setFormLoading(false);
    }
  };

  const isSubmitDisabled = formLoading || isLoading || !selectedPatient || patients.length === 0;

  return (
    <div className="medication-form">
      <h3>Lisää uusi lääke</h3>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Potilas:</label>
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          disabled={patients.length === 0 || formLoading}
        >
          {patients.length === 0 ? (
            <option value="">Ei potilaita</option>
          ) : (
            patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="form-group">
        <label>Lääke:</label>
        <input
          type="text"
          placeholder="Lääkkeen nimi"
          value={newMedicine}
          onChange={(e) => setNewMedicine(e.target.value)}
          disabled={formLoading}
        />
      </div>

      <div className="form-group">
        <label>Annostus:</label>
        <input
          type="text"
          placeholder="esim. 1 tabletti"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          disabled={formLoading}
        />
      </div>

      <div className="form-group">
        <label>Päivä:</label>
        <select
          value={newDay}
          onChange={(e) => setNewDay(e.target.value)}
          disabled={formLoading}
        >
          {weekdays.map((day, index) => (
            <option key={index} value={day}>
              {day}
            </option>
          ))}
          <option value="Joka päivä">Joka päivä</option>
        </select>
      </div>

      <div className="form-group">
        <label>Aika:</label>
        <input
          type="text"
          value={newTime}
          onChange={handleTimeChange}
          placeholder="00:00"
          maxLength={5}
          disabled={formLoading}
        />
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={notifyCaretaker}
            onChange={(e) => setNotifyCaretaker(e.target.checked)}
            disabled={formLoading}
          />
          Jaa tieto hoitajalle (potilaan luvalla)
        </label>
      </div>

      <AddMedicationButton 
        onClick={addReminder} 
        disabled={isSubmitDisabled}
        text={formLoading ? "Lisätään..." : "Lisää lääkemuistutus"}
      />
    </div>
  );
};

export default MedicationForm;