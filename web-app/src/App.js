import React from "react";
import MedicationSchedule from "./components/MedicationSchedule";
import PatientView from "./components/PatientView";

function App() {
  return (
    <div className="container">
      <h1>Hoituri - Lääkärin näkymä</h1>
      <div className="nav-placeholder">Navigation Placeholder</div>

      {/* Cards layout using CSS Grid */}
      <div className="content-placeholder">
        <div className="card">
          <PatientView />
        </div>
        <div className="card">
          <h2>Location Tracking</h2>
          <p>This section will integrate with OpenStreetMap.</p>
        </div>
        <div className="card">
          <MedicationSchedule />
        </div>
        <div className="card">
          <h2>Alerts & Notifications</h2>
          <p>This section will display important alerts and notifications.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
