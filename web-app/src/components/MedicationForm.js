import { useState, useEffect } from "react";
import { getPatients } from "../services/api";
import { handleAddReminder, formatTimeString } from "../utils/medicationHandlers";
import "../styles.css";

const MedicationForm = ({ userId, onAddSuccess }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [newMedicine, setNewMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [newDay, setNewDay] = useState("Maanantai");
  const [newTime, setNewTime] = useState("");
  const [notifyCaretaker, setNotifyCaretaker] = useState(true);
  const [loading, setLoading] = useState(false);
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
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const patientsData = await getPatients(userId);
        setPatients(patientsData);
        if (patientsData.length > 0) {
          setSelectedPatient(patientsData[0].id);
        }
      } catch (err) {
        console.error("Failed to load patients:", err);
        setError("Potilaiden lataaminen epäonnistui");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPatients();
    }
  }, [userId]);

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
      setLoading(true);
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

      // Send the prescription to the API
      await handleAddReminder(userId, prescriptionData);

      // Reset input fields
      setNewMedicine("");
      setNewTime("");
      setDosage("");
      setNewDay("Maanantai");
      setNotifyCaretaker(true);

      // Notify parent component to refresh data
      if (onAddSuccess) {
        onAddSuccess();
      }
    } catch (err) {
      setError("Lääkemuistutuksen lisääminen epäonnistui: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medication-form">
      <h3>Lisää uusi lääke</h3>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Potilas:</label>
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          disabled={patients.length === 0 || loading}
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
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Annostus:</label>
        <input
          type="text"
          placeholder="esim. 1 tabletti"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Päivä:</label>
        <select
          value={newDay}
          onChange={(e) => setNewDay(e.target.value)}
          disabled={loading}
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
          disabled={loading}
        />
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={notifyCaretaker}
            onChange={(e) => setNotifyCaretaker(e.target.checked)}
            disabled={loading}
          />
          Jaa tieto hoitajalle (potilaan luvalla)
        </label>
      </div>

      <button
        onClick={addReminder}
        disabled={loading || !selectedPatient || patients.length === 0}
      >
        {loading ? "Lisätään..." : "Lisää lääkemuistutus"}
      </button>
    </div>
  );
};

export default MedicationForm;