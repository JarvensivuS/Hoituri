import React, { useState } from "react";


// TODO GET doctor data from database
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "hoituri" && password === "1234") {
      onLogin();
    } else {
      alert("Virheelliset tunnukset");
    }
  };

  return (
    <div className="login-container">
      <h2>Kirjaudu</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Käyttäjänimi"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Salasana"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Kirjaudu</button>
      </form>
    </div>
  );
}

export default Login;