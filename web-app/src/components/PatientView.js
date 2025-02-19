import { useState } from "react";

const PatientView = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [patients, setPatients] = useState([
        "Matti Meikäläinen",
        "Maija Mehiläinen",
        "Kalle Kääriäinen",
        "Testi Mies",
        "Kalevi Keihänen",
    ]);
    const [newPatient, setNewPatient] = useState("");

    const filteredPatients = patients.filter((patient) =>
        patient.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addPatient = () => {
        if (newPatient.trim() !== "") {
            setPatients([...patients, newPatient]);
            setNewPatient("");
        }
    };

    return (
        <div className="container">
            <div className="nav-buttons">
                <button onClick={() => window.history.back()}>&#8592; Back</button>
                <button onClick={() => (window.location.href = "/")}>Home</button>
            </div>
            <h1>Asiakkaat</h1>
            <div className="control">
                <input
                    type="text"
                    value={newPatient}
                    onChange={(e) => setNewPatient(e.target.value)}
                    placeholder="Lisää uusi asiakas"
                />
                <button onClick={addPatient}>Lisää</button>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Etsi..."
                />
            </div>
            <ul className="patient-list">
                {filteredPatients.map((patient, index) => (
                    <li key={index}>{patient}</li>
                ))}
            </ul>
        </div>
    );
};

export default PatientView;