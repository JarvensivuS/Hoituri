import React, { useState, useEffect } from "react";
import MedicationSchedule from "./components/MedicationSchedule";
import PatientView from "./components/PatientView";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    
    if (userId && userEmail && userName && userRole === 'doctor') {
      setUser({
        id: userId,
        email: userEmail,
        name: userName,
        role: userRole
      });
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    
    // Update state
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Ladataan...</div>;
  }

  return (
    <div className="container">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <div className="header">
            <h1>Hoituri - Lääkärin näkymä</h1>
            <div className="user-info">
              <span>Kirjautunut: {user.name}</span>
              <button onClick={handleLogout} className="logout-btn">Kirjaudu ulos</button>
            </div>
          </div>
          <div className="content-placeholder">
            <div className="card"><PatientView userId={user.id} /></div>
            <div className="card"><MedicationSchedule userId={user.id} /></div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;