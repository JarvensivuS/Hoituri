import React, { useState } from "react";
import { loginUser } from "../services/api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError("");
    
    if (!email || !password) {
      setError("Sähköposti ja salasana vaaditaan");
      return;
    }
    
    setLoading(true);
    
    try {
      const userData = await loginUser(email, password, 'web');
      
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userRole', userData.role);
      
      onLogin(userData);
    } catch (err) {
      console.error("Login failed:", err);
      if (err.message === 'Only doctors can log in to the web application') {
        setError("Vain lääkärit voivat kirjautua tähän sovellukseen");
      } else {
        setError("Virheelliset tunnukset");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Kirjaudu - Lääkärin näkymä</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Sähköposti"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
        <input
          type="password"
          placeholder="Salasana"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Kirjaudutaan..." : "Kirjaudu"}
        </button>
      </form>
    </div>
  );
}

export default Login;