import React from "react";
import MedicationSchedule from "./components/MedicationSchedule";

function App() {
  return (
    <div>
      <div>
        <div class="container">
          <h1>SeniiliSaver Web Interface</h1>
          <div class="nav-placeholder">Navigation Placeholder</div>
          <div class="content-placeholder">
            <div class="card">
              <h2>Patient Overview</h2>
              <p>This section will show patient monitoring data.</p>
            </div>
            <div class="card">
              <h2>Location Tracking</h2>
              <p>This section will integrate with OpenStreetMap.</p>
            </div>
            <div class="card">
              <MedicationSchedule />
            </div>
            <div class="card">
              <h2>Alerts & Notifications</h2>
              <p>
                This section will display important alerts and notifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
