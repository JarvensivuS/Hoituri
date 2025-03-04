// web-app/src/components/PatientView.js
import { useState, useEffect } from "react";
import { getPatients } from "../services/api";

const PatientView = ({ userId }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newPatient, setNewPatient] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                const patientsData = await getPatients(userId);
                setPatients(patientsData);
            } catch (err) {
                console.error("Error fetching patients:", err);
                setError("Potilaiden lataaminen epäonnistui");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchPatients();
        }
    }, [userId]);

    const filteredPatients = patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addPatient = () => {
        // This would eventually call an API to add a patient
        if (newPatient.trim() !== "") {
            // For now, just update local state
            setPatients([...patients, { id: Date.now().toString(), name: newPatient }]);
            setNewPatient("");
        }
    };

    if (loading) {
        return <div>Ladataan potilaita...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="container">
            <h2>Asiakkaat</h2>
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
            {filteredPatients.length === 0 ? (
                <p>Ei potilaita</p>
            ) : (
                <ul className="patient-list">
                    {filteredPatients.map((patient) => (
                        <li key={patient.id}>{patient.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PatientView;