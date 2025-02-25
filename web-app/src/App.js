import React, { useState } from "react";
import MedicationSchedule from "./components/MedicationSchedule";
import PatientView from "./components/PatientView";
import AlertsNotifications from "./components/AlertsNotifications";
import LocationTracking from "./components/LocationTracking";
import Login from "./components/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className="container">
      {!isLoggedIn ? (
        <Login onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <>
          <h1>Hoituri - Lääkärin näkymä</h1>
          <button onClick={() => setIsLoggedIn(false)}>Kirjaudu ulos</button>
          <div className="content-placeholder">
            <div className="card"><PatientView /></div>
            <div className="card"><LocationTracking /></div>
            <div className="card"><MedicationSchedule /></div>
            <div className="card"><AlertsNotifications /></div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
