import React from "react";
import MedicationSchedule from "./components/MedicationSchedule";
import PatientView from "./components/PatientView";
import AlertsNotifications from "./components/AlertsNotifications";
import LocationTracking from "./components/LocationTracking";

function App() {
  return (
    <div className="container">
      <h1>Hoituri - Lääkärin näkymä</h1>

      {/* Cards layout using CSS Grid */}
      <div className="content-placeholder">
        <div className="card">
          <PatientView />
        </div>
        <div className="card">
          <LocationTracking/>
        </div>
        <div className="card">
          <MedicationSchedule />
        </div>
        <div className="card">
          <AlertsNotifications/>
        </div>
      </div>
    </div>
  );
}

export default App;
