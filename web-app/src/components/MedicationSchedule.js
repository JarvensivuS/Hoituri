// web-app/src/components/MedicationSchedule.js
import React, { useState, useEffect } from "react";
import { getPrescriptions, createPrescription, deletePrescription } from "../services/api";

const MedicationSchedule = ({ userId }) => {
  const [reminders, setReminders] = useState([]);
  const [newMedicine, setNewMedicine] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newDay, setNewDay] = useState("Maanantai");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [dosage, setDosage] = useState("");
  const [notifyCaretaker, setNotifyCaretaker] = useState(true); // Default to true

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
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch prescriptions where the logged-in doctor is the doctor
        const prescriptionsData = await getPrescriptions(userId, { doctorId: userId });
        
        // Fetch patients for this doctor to populate the dropdown
        const patientsResponse = await fetch(`http://localhost:3001/api/users?role=patient`, {
          headers: {
            'user-id': userId
          }
        });
        
        if (!patientsResponse.ok) {
          throw new Error('Failed to fetch patients');
        }
        
        const patientsData = await patientsResponse.json();
        setPatients(patientsData);
        
        if (patientsData.length > 0) {
          setSelectedPatient(patientsData[0].id);
        }
        
        // Transform prescriptions to reminders format
        const remindersList = prescriptionsData.map(prescription => {
          return {
            id: prescription.id,
            medicine: prescription.medication,
            patientId: prescription.patientId,
            patientName: patientsData.find(p => p.id === prescription.patientId)?.name || "Tuntematon",
            dosage: prescription.dosage,
            day: getDayFromFrequency(prescription.frequency),
            time: prescription.reminderSettings?.times[0] || "08:00",
            frequency: prescription.frequency,
            notifyCaretaker: prescription.reminderSettings?.notifyCaretaker || false
          };
        });
        
        setReminders(remindersList);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Tietojen lataaminen epäonnistui");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const handleDeletePrescription = async (prescriptionId) => {
    if (!window.confirm("Haluatko varmasti poistaa tämän lääkemuistutuksen?")) {
      return;
    }
    
    try {
      await deletePrescription(userId, prescriptionId);
      // Remove the prescription from the local state
      setReminders(reminders.filter(reminder => reminder.id !== prescriptionId));
    } catch (err) {
      console.error("Failed to delete prescription:", err);
      alert("Lääkemuistutuksen poistaminen epäonnistui: " + err.message);
    }
  };

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

  // Function to convert day to frequency
  const getFrequencyFromDay = (day) => {
    if (day === "Joka päivä") {
      return "2 kertaa päivässä";
    }
    return `${day}na`;
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
      // Calculate dates
      const startDate = new Date().toISOString().split('T')[0]; // Today
      const endDate = new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]; // 30 days from now
      
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
      const newPrescription = await createPrescription(userId, prescriptionData);
      
      // Find the patient name from the patients list
      const patientName = patients.find(p => p.id === selectedPatient)?.name || "Tuntematon";
      
      // Add the new reminder to the local state
      setReminders((prev) => [
        ...prev,
        {
          id: newPrescription.id,
          medicine: newMedicine,
          patientId: selectedPatient,
          patientName: patientName,
          dosage: dosage,
          day: newDay,
          time: newTime,
          frequency: prescriptionData.frequency,
          notifyCaretaker: notifyCaretaker
        },
      ]);

      // Reset input fields
      setNewMedicine("");
      setNewTime("");
      setDosage("");
      setNewDay("Maanantai");
      setNotifyCaretaker(true);
    } catch (err) {
      console.error("Failed to add prescription:", err);
      alert("Lääkemuistutuksen lisääminen epäonnistui: " + err.message);
    }
  };

  const handleTimeChange = (e) => {
    let time = e.target.value;
  
    // Allow only numbers
    if (!/^\d{0,2}:?\d{0,2}$/.test(time)) {
      return;
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
        return;
      }
    }
  
    setNewTime(time);
  };

  if (loading) {
    return <div style={{textAlign: "center", padding: "20px"}}>Ladataan lääkemuistutuksia...</div>;
  }

  if (error) {
    return <div style={{textAlign: "center", padding: "20px", color: "red"}}>{error}</div>;
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div>
        <h2>Lääkemuistutukset</h2>

        {/* Input form for new prescription */}
        <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #eee", borderRadius: "5px" }}>
          <h3>Lisää uusi lääke</h3>
          
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Potilas:</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              disabled={patients.length === 0}
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
            />
          </div>
          
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Päivä:</label>
            <select
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
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
            />
          </div>
          
          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={notifyCaretaker}
                onChange={(e) => setNotifyCaretaker(e.target.checked)}
                style={{ marginRight: "10px" }}
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
            disabled={!selectedPatient || patients.length === 0}
          >
            Lisää lääkemuistutus
          </button>
        </div>
      </div>

      {/* Show existing prescriptions */}
      <div>
        <h3>Olemassa olevat muistutukset:</h3>
        {reminders.length > 0 ? (
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f2f2f2" }}>
                  <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Potilas</th>
                  <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Lääke</th>
                  <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Annostus</th>
                  <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Päivä</th>
                  <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Aika</th>
                  <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Jaettu hoitajalle</th>
                  <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Toiminnot</th>
                </tr>
              </thead>
              <tbody>
              {reminders.map((item, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{item.patientName}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{item.medicine}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{item.dosage}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{item.day}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{item.time}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    {item.notifyCaretaker ? "Kyllä" : "Ei"}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    <button 
                      onClick={() => handleDeletePrescription(item.id)}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "5px 10px",
                        cursor: "pointer"
                      }}
                    >
                      Poista
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Ei muistutuksia</p>
        )}
      </div>
    </div>
  );
};

export default MedicationSchedule;