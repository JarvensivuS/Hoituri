import { useState, useEffect } from "react";
import { getPatients, getUsers, removeDoctorFromPatient, addCaretakerToPatient, removeCaretakerFromPatient } from "../services/api";

const PatientView = ({ userId }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [patients, setPatients] = useState([]);
    const [caretakers, setCaretakers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newPatient, setNewPatient] = useState("");
    const [showCaretakerModal, setShowCaretakerModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedCaretaker, setSelectedCaretaker] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch patients for this doctor
                const patientsData = await getPatients(userId);
                setPatients(patientsData);
                
                // Fetch available caretakers
                const allUsers = await getUsers(userId);
                const caretakersData = allUsers.filter(user => user.role === 'caretaker');
                setCaretakers(caretakersData);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Tietojen lataaminen epäonnistui");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchData();
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

    const handleRemoveDoctor = async (patientId) => {
        if (!confirm("Haluatko varmasti poistaa potilaan?")) {
            return;
        }
        
        try {
            setActionLoading(true);
            await removeDoctorFromPatient(userId, patientId);
            
            // Remove patient from local state
            setPatients(patients.filter(patient => patient.id !== patientId));
        } catch (err) {
            console.error("Failed to remove patient:", err);
            setError("Potilaan poistaminen epäonnistui");
        } finally {
            setActionLoading(false);
        }
    };

    const openCaretakerModal = (patient) => {
        setSelectedPatient(patient);
        // Set default selected caretaker if there are any
        if (caretakers.length > 0) {
            setSelectedCaretaker(caretakers[0].id);
        }
        setShowCaretakerModal(true);
    };

    const handleAddCaretaker = async () => {
        if (!selectedPatient || !selectedCaretaker) {
            return;
        }
        
        try {
            setActionLoading(true);
            await addCaretakerToPatient(userId, selectedPatient.id, selectedCaretaker);
            
            // Update the patient in local state to show they have a caretaker
            const updatedPatients = patients.map(patient => {
                if (patient.id === selectedPatient.id) {
                    return {
                        ...patient,
                        relationships: {
                            ...patient.relationships,
                            caretakerId: selectedCaretaker
                        }
                    };
                }
                return patient;
            });
            
            setPatients(updatedPatients);
            setShowCaretakerModal(false);
        } catch (err) {
            console.error("Failed to add caretaker:", err);
            setError("Hoitajan lisääminen epäonnistui");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveCaretaker = async (patientId, caretakerId) => {
        if (!confirm("Haluatko varmasti poistaa hoitajan?")) {
            return;
        }
        
        try {
            setActionLoading(true);
            await removeCaretakerFromPatient(userId, patientId, caretakerId);
            
            // Update the patient in local state to remove caretaker
            const updatedPatients = patients.map(patient => {
                if (patient.id === patientId) {
                    const updatedRelationships = { ...patient.relationships };
                    delete updatedRelationships.caretakerId;
                    
                    return {
                        ...patient,
                        relationships: updatedRelationships
                    };
                }
                return patient;
            });
            
            setPatients(updatedPatients);
        } catch (err) {
            console.error("Failed to remove caretaker:", err);
            setError("Hoitajan poistaminen epäonnistui");
        } finally {
            setActionLoading(false);
        }
    };

    // Modal for caretaker management
    const CaretakerModal = () => {
        if (!showCaretakerModal || !selectedPatient) return null;
        
        return (
            <div className="modal" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}>
                <div className="modal-content" style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '5px',
                    width: '400px'
                }}>
                    <h3>Lisää hoitaja potilaalle {selectedPatient.name}</h3>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Valitse hoitaja:</label>
                        <select 
                            value={selectedCaretaker}
                            onChange={(e) => setSelectedCaretaker(e.target.value)}
                            style={{ width: '100%', padding: '8px' }}
                            disabled={caretakers.length === 0 || actionLoading}
                        >
                            {caretakers.length === 0 ? (
                                <option value="">Ei hoitajia saatavilla</option>
                            ) : (
                                caretakers.map(caretaker => (
                                    <option key={caretaker.id} value={caretaker.id}>
                                        {caretaker.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button 
                            onClick={() => setShowCaretakerModal(false)}
                            style={{ padding: '8px 16px' }}
                            disabled={actionLoading}
                        >
                            Peruuta
                        </button>
                        <button 
                            onClick={handleAddCaretaker}
                            style={{ 
                                padding: '8px 16px', 
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                            disabled={!selectedCaretaker || caretakers.length === 0 || actionLoading}
                        >
                            {actionLoading ? "Lisätään..." : "Lisää hoitaja"}
                        </button>
                    </div>
                </div>
            </div>
        );
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
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Nimi</th>
                                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Sähköposti</th>
                                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Hoitaja</th>
                                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Toiminnot</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient) => {
                                // Find caretaker name if patient has one
                                const patientCaretakerId = patient.relationships?.caretakerId;
                                const caretaker = patientCaretakerId 
                                    ? caretakers.find(c => c.id === patientCaretakerId) 
                                    : null;
                                
                                return (
                                    <tr key={patient.id}>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{patient.name}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{patient.email || 'Ei sähköpostia'}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                            {caretaker 
                                                ? (
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        {caretaker.name}
                                                        <button 
                                                            onClick={() => handleRemoveCaretaker(patient.id, patientCaretakerId)}
                                                            style={{
                                                                marginLeft: '10px',
                                                                backgroundColor: '#dc3545',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                padding: '2px 5px',
                                                                fontSize: '12px'
                                                            }}
                                                            disabled={actionLoading}
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                ) 
                                                : 'Ei hoitajaa'
                                            }
                                        </td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                            <button
                                                onClick={() => openCaretakerModal(patient)}
                                                style={{
                                                    marginRight: '10px',
                                                    backgroundColor: '#007bff',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    padding: '5px 10px'
                                                }}
                                                disabled={actionLoading}
                                            >
                                                {patientCaretakerId ? 'Vaihda hoitaja' : 'Lisää hoitaja'}
                                            </button>
                                            
                                            <button
                                                onClick={() => handleRemoveDoctor(patient.id)}
                                                style={{
                                                    backgroundColor: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    padding: '5px 10px'
                                                }}
                                                disabled={actionLoading}
                                            >
                                                Poista potilas
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            
            <CaretakerModal />
        </div>
    );
};

export default PatientView;