import React, { useState } from "react";

const MedicationSchedule = () => {
  const [reminder, setReminder] = useState([]);
  const [newMedicine, setNewMedicine] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newDay, setNewDay] = useState("Maanantai");

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

  // FUnction to add reminder
  const addReminder = () => {
    // Check that the fields aren't empty
    if (
      newMedicine.trim() === "" ||
      newTime.trim() === "" ||
      newDay.trim() === ""
    )
      return;

    // Add new reminder to list
    setReminder((prev) => [
      ...prev,
      { medicine: newMedicine, time: newTime, day: newDay },
    ]);

    // Empty all input fields
    setNewMedicine("");
    setNewTime("");
    setNewDay("Maanantai"); //Monday as a starting point
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
  

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div>
        <h2>Lääkemuistutukset</h2>

        {/* Input for medicine */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Lisää lääke"
            value={newMedicine}
            onChange={(e) => setNewMedicine(e.target.value)}
            style={{ margin: "5px", padding: "5px" }}
          />
          <input
            type="text"
            value={newTime}
            onChange={handleTimeChange}
            placeholder="00:00"
            maxLength={5} // No more than five numbers as in hh:MM
            style={{ margin: "5px", padding: "5px" }}
          />
          <select
            value={newDay}
            onChange={(e) => setNewDay(e.target.value)}
            style={{ margin: "5px", padding: "5px" }}
          >
            {/* A list of weekdays*/}
            {weekdays.map((day, index) => (
              <option key={index} value={day}>
                {day}
              </option>
            ))}
          </select>
          <button onClick={addReminder} style={{ padding: "5px 10px" }}>
            Lisää
          </button>
        </div>
      </div>

      {/* Show existing reminders */}
      <div>
        <h3>Muistutukset:</h3>
        {reminder.length > 0 ? (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {reminder.map((item, idreminder) => (
              <li
                key={idreminder}
                style={{
                  background: "#dff0d8",
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "5px",
                }}
              >
                {/* Reminder info day,medicine and time */}
                <span>
                  Päivä: {item.day}, Lääke: {item.medicine}, Aika: {item.time}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Ei muistutuksia</p>
        )}
      </div>
    </div>
  );
};

export default MedicationSchedule;
