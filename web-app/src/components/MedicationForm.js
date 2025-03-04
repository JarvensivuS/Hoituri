import { useState, useEffect } from "react";
import { getPatients } from "../services/api";
import { handleAddReminder, formatTimeString } from "../utils/medicationHandlers";

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
    <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #eee", borderRadius: "5px" }}>
      <h3>Lisää uusi lääke</h3>
      
      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
      
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Potilas:</label>
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
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
      
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Lääke:</label>
        <input
          type="text"
          placeholder="Lääkkeen nimi"
          value={newMedicine}
          onChange={(e) => setNewMedicine(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          disabled={loading}
        />
      </div>
      
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Annostus:</label>
        <input
          type="text"
          placeholder="esim. 1 tabletti"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          disabled={loading}
        />
      </div>
      
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Päivä:</label>
        <select
          value={newDay}
          onChange={(e) => setNewDay(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
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
      
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Aika:</label>
        <input
          type="text"
          value={newTime}
          onChange={handleTimeChange}
          placeholder="00:00"
          maxLength={5}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          disabled={loading}
        />
      </div>
      
      <div style={{ marginBottom: "15px", textAlign: "left" }}>
        <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={notifyCaretaker}
            onChange={(e) => setNotifyCaretaker(e.target.checked)}
            style={{ marginRight: "10px" }}
            disabled={loading}
          />
          <span>Jaa tieto hoitajalle (potilaan luvalla)</span>
        </label>
      </div>
      
      <button 
        onClick={addReminder} 
        style={{ 
          padding: "10px 20px", 
          backgroundColor: "#007bff", 
          color: "white", 
          border: "none", 
          borderRadius: "4px", 
          cursor: "pointer",
          width: "100%"
        }}
        disabled={loading || !selectedPatient || patients.length === 0}
      >
        {loading ? "Lisätään..." : "Lisää lääkemuistutus"}
      </button>
    </div>
  );
};

export default MedicationForm;