import { useState, useEffect } from "react";
import { 
  getPatients, 
  getUsers, 
  removeDoctorFromPatient, 
  addCaretakerToPatient, 
  removeCaretakerFromPatient,
  addDoctorToPatient,
  createUser
} from "../services/api";
import RemoveButton from './ui/RemoveButton';
import AddDoctorModal from './modals/AddDoctorModal';
import CaretakerModal from './modals/CaretakerModal';
import PatientCreateModal from './modals/PatientCreateModal';
import CaretakerCreateModal from './modals/CaretakerCreateModal';

const PatientView = ({ userId }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [patients, setPatients] = useState([]);
    const [caretakers, setCaretakers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [showAddPatientModal, setShowAddPatientModal] = useState(false);
    const [newPatientName, setNewPatientName] = useState("");
    const [newPatientEmail, setNewPatientEmail] = useState("");
    
    const [showAddCaretakerModal, setShowAddCaretakerModal] = useState(false);
    const [newCaretakerName, setNewCaretakerName] = useState("");
    const [newCaretakerEmail, setNewCaretakerEmail] = useState("");
    
    const [showDoctorModal, setShowDoctorModal] = useState(false);
    const [showCaretakerSelectionModal, setShowCaretakerSelectionModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedCaretaker, setSelectedCaretaker] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const [patientsData, allUsers] = await Promise.all([
                    getPatients(userId),
                    getUsers(userId)
                ]);
                
                setPatients(patientsData);
                
                const caretakersData = allUsers.filter(user => user.role === 'caretaker');
                setCaretakers(caretakersData);
                
                const doctorsData = allUsers.filter(user => user.role === 'doctor');
                setDoctors(doctorsData);
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

    const openAddPatientModal = () => {
        setNewPatientName("");
        setNewPatientEmail("");
        setShowAddPatientModal(true);
    };

    const handleCreatePatient = async (password = "Patient123") => {
        if (!newPatientName || !newPatientEmail) {
          alert("Potilaan nimi ja sähköposti ovat pakollisia kenttiä");
          return;
        }
    
        try {
        setActionLoading(true);
        
        const patientData = {
            role: "patient",
            name: newPatientName,
            email: newPatientEmail,
            password: password
        };
        
        console.log("Creating patient with data:", {
            ...patientData,
            password: '[REDACTED]'
        });
        
        const newPatientResponse = await createUser(userId, patientData);
        
        console.log("Patient created successfully:", newPatientResponse);
        
        if (newPatientResponse && newPatientResponse.id) {
            try {
            await addDoctorToPatient(userId, newPatientResponse.id);
            
            const updatedPatient = {
                ...newPatientResponse,
                relationships: {
                doctorIds: [userId]
                }
            };
            
            setPatients([...patients, updatedPatient]);
            setShowAddPatientModal(false);
            
            alert("Potilas lisätty onnistuneesti!");
            } catch (relationError) {
            console.error("Failed to add doctor relationship:", relationError);
            alert("Potilas luotiin, mutta lääkärisuhdetta ei voitu asettaa.");
            }
        }
        } catch (err) {
        console.error("Failed to create patient:", err);
        alert(`Potilaan lisääminen epäonnistui: ${err.message || 'Tuntematon virhe'}`);
        } finally {
        setActionLoading(false);
        }
    };
      
    const handleCreateCaretaker = async () => {
        if (!newCaretakerName || !newCaretakerEmail) {
        alert("Hoitajan nimi ja sähköposti ovat pakollisia kenttiä");
        return;
        }
    
        try {
        setActionLoading(true);
        
        const caretakerData = {
            role: "caretaker",
            name: newCaretakerName,
            email: newCaretakerEmail,
            password: "password123"
        };
        
        console.log("Creating caretaker with data:", {
            ...caretakerData,
            password: '[REDACTED]'
        });
        
        const newCaretakerResponse = await createUser(userId, caretakerData);
        
        console.log("Caretaker created successfully:", newCaretakerResponse);
        
        setCaretakers([...caretakers, newCaretakerResponse]);
        setShowAddCaretakerModal(false);
        
        alert("Hoitaja lisätty onnistuneesti!");
        } catch (err) {
        console.error("Failed to create caretaker:", err);
        alert(`Hoitajan lisääminen epäonnistui: ${err.message || 'Tuntematon virhe'}`);
        } finally {
        setActionLoading(false);
        }
    };

    const openAddCaretakerModal = () => {
        setNewCaretakerName("");
        setNewCaretakerEmail("");
        setShowAddCaretakerModal(true);
    };

    const openDoctorModal = (patient) => {
        setSelectedPatient(patient);
        
        const patientDoctorIds = patient.relationships?.doctorIds || [];
        const availableDoctors = doctors.filter(doctor => 
            !patientDoctorIds.includes(doctor.id)
        );
        
        if (availableDoctors.length > 0) {
            setSelectedDoctor(availableDoctors[0].id);
            setShowDoctorModal(true);
        } else {
            alert("Kaikki lääkärit on jo lisätty tälle potilaalle.");
        }
    };

    const handleAddDoctor = async () => {
        if (!selectedPatient || !selectedDoctor) {
            return;
        }
        
        try {
            setActionLoading(true);
            await addDoctorToPatient(selectedDoctor, selectedPatient.id);
            
            const updatedPatients = patients.map(patient => {
                if (patient.id === selectedPatient.id) {
                    const updatedRelationships = { ...patient.relationships || {} };
                    if (!updatedRelationships.doctorIds) {
                        updatedRelationships.doctorIds = [];
                    }
                    if (!updatedRelationships.doctorIds.includes(selectedDoctor)) {
                        updatedRelationships.doctorIds.push(selectedDoctor);
                    }
                    
                    return {
                        ...patient,
                        relationships: updatedRelationships
                    };
                }
                return patient;
            });
            
            setPatients(updatedPatients);
            setShowDoctorModal(false);
        } catch (err) {
            console.error("Failed to add doctor:", err);
            alert(`Lääkärin lisääminen epäonnistui: ${err.message || 'Tuntematon virhe'}`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveDoctor = async (patientId, doctorId) => {
        if (!confirm("Haluatko varmasti poistaa lääkärin?")) {
            return;
        }
        
        try {
            setActionLoading(true);
            await removeDoctorFromPatient(doctorId, patientId);
            
            const updatedPatients = patients.map(patient => {
                if (patient.id === patientId) {
                    const updatedRelationships = { ...patient.relationships || {} };
                    if (updatedRelationships.doctorIds) {
                        updatedRelationships.doctorIds = updatedRelationships.doctorIds.filter(
                            id => id !== doctorId
                        );
                    }
                    
                    return {
                        ...patient,
                        relationships: updatedRelationships
                    };
                }
                return patient;
            });
            
            setPatients(updatedPatients);
        } catch (err) {
            console.error("Failed to remove doctor:", err);
            alert(`Lääkärin poistaminen epäonnistui: ${err.message || 'Tuntematon virhe'}`);
        } finally {
            setActionLoading(false);
        }
    };

    const openCaretakerSelectionModal = (patient) => {
        setSelectedPatient(patient);
        
        const assignedCaretakerIds = patients
            .filter(p => p.id !== patient.id && p.relationships?.caretakerId)
            .map(p => p.relationships.caretakerId);
        
        const availableCaretakers = caretakers.filter(caretaker => 
            !assignedCaretakerIds.includes(caretaker.id)
        );
        
        if (availableCaretakers.length > 0) {
            setSelectedCaretaker(availableCaretakers[0].id);
            setShowCaretakerSelectionModal(true);
        } else {
            alert("Ei saatavilla olevia hoitajia. Lisää ensin uusi hoitaja.");
        }
    };

    const handleAddCaretaker = async () => {
        if (!selectedPatient || !selectedCaretaker) {
            return;
        }
        
        try {
            setActionLoading(true);
            
            console.log('Adding caretaker:', {
                doctorId: userId,
                patientId: selectedPatient.id,
                caretakerId: selectedCaretaker
            });
            
            await addCaretakerToPatient(userId, selectedPatient.id, selectedCaretaker);
            
            const updatedPatients = patients.map(patient => {
                if (patient.id === selectedPatient.id) {
                    return {
                        ...patient,
                        relationships: {
                            ...patient.relationships || {},
                            caretakerId: selectedCaretaker
                        }
                    };
                }
                return patient;
            });
            
            setPatients(updatedPatients);
            setShowCaretakerSelectionModal(false);
        } catch (err) {
            console.error("Failed to add caretaker:", err);
            alert(`Hoitajan lisääminen epäonnistui: ${err.message || 'Tuntematon virhe'}`);
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
            
            const updatedPatients = patients.map(patient => {
                if (patient.id === patientId) {
                    const updatedRelationships = { ...patient.relationships || {} };
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
            alert(`Hoitajan poistaminen epäonnistui: ${err.message || 'Tuntematon virhe'}`);
        } finally {
            setActionLoading(false);
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
            <h2>Potilaat</h2>
            <div className="control" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div>
                    <button 
                        onClick={openAddPatientModal}
                        style={{
                            marginRight: '10px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '8px 16px'
                        }}
                        disabled={actionLoading}
                    >
                        Lisää uusi potilas
                    </button>
                    <button 
                        onClick={openAddCaretakerModal}
                        style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '8px 16px'
                        }}
                        disabled={actionLoading}
                    >
                        Lisää uusi hoitaja
                    </button>
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Etsi..."
                    style={{ padding: '8px', width: '250px' }}
                />
            </div>
            
            {filteredPatients.length === 0 ? (
                <p>Ei potilaita. Lisää uusi potilas aloittaaksesi.</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Nimi</th>
                                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Sähköposti</th>
                                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Lääkärit</th>
                                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Hoitaja</th>
                                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Toiminnot</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient) => {
                                const patientCaretakerId = patient.relationships?.caretakerId;
                                const caretaker = patientCaretakerId 
                                    ? caretakers.find(c => c.id === patientCaretakerId) 
                                    : null;
                                
                                const patientDoctorIds = patient.relationships?.doctorIds || [];
                                const patientDoctors = patientDoctorIds
                                    .map(id => doctors.find(d => d.id === id))
                                    .filter(Boolean);
                                
                                const hasAvailableDoctors = doctors.some(doctor => 
                                    !patientDoctorIds.includes(doctor.id) && doctor.id !== userId
                                );
                                
                                return (
                                    <tr key={patient.id}>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{patient.name}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{patient.email || 'Ei sähköpostia'}</td>
                                        
                                        {/* Doctor column */}
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                            {patientDoctors.length > 0 ? (
                                                <div>
                                                    {patientDoctors.map(doctor => (
                                                        <div key={doctor.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                                            {doctor.name}
                                                            {doctor.id !== userId && (
                                                                <RemoveButton 
                                                                    size="small"
                                                                    onClick={() => handleRemoveDoctor(patient.id, doctor.id)}
                                                                    disabled={actionLoading}
                                                                />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : 'Ei lääkäriä'}
                                        </td>
                                        
                                        {/* Caretaker column */}
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                            {caretaker 
                                                ? (
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        {caretaker.name}
                                                        <RemoveButton 
                                                            size="small"
                                                            onClick={() => handleRemoveCaretaker(patient.id, patientCaretakerId)}
                                                            disabled={actionLoading}
                                                        />
                                                    </div>
                                                ) 
                                                : 'Ei hoitajaa'
                                            }
                                        </td>
                                        
                                        {/* Actions column */}
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                            {hasAvailableDoctors && (
                                                <button
                                                    onClick={() => openDoctorModal(patient)}
                                                    style={{
                                                        marginRight: '10px',
                                                        marginBottom: '5px',
                                                        backgroundColor: '#28a745',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        padding: '5px 10px'
                                                    }}
                                                    disabled={actionLoading}
                                                >
                                                    Lisää lääkäri
                                                </button>
                                            )}
                                            
                                            <button
                                                onClick={() => openCaretakerSelectionModal(patient)}
                                                style={{
                                                    marginRight: '10px',
                                                    marginBottom: '5px',
                                                    backgroundColor: '#007bff',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    padding: '5px 10px'
                                                }}
                                                disabled={actionLoading || caretakers.length === 0}
                                            >
                                                {patientCaretakerId ? 'Vaihda hoitaja' : 'Lisää hoitaja'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            
            {/* Modals */}
            <PatientCreateModal 
            isOpen={showAddPatientModal} 
            onClose={() => setShowAddPatientModal(false)} 
            patientName={newPatientName}
            onPatientNameChange={setNewPatientName}
            patientEmail={newPatientEmail}
            onPatientEmailChange={setNewPatientEmail}
            onSubmit={handleCreatePatient}
            isLoading={actionLoading}
            />
            
            <CaretakerCreateModal 
            isOpen={showAddCaretakerModal} 
            onClose={() => setShowAddCaretakerModal(false)} 
            caretakerName={newCaretakerName}
            onCaretakerNameChange={setNewCaretakerName}
            caretakerEmail={newCaretakerEmail}
            onCaretakerEmailChange={setNewCaretakerEmail}
            onSubmit={handleCreateCaretaker}
            isLoading={actionLoading}
            />
            
            {/* Doctor Selection Modal */}
            <AddDoctorModal 
            isOpen={showDoctorModal}
            patient={selectedPatient}
            doctors={doctors.filter(doctor => {
                if (!selectedPatient) return false;
                const patientDoctorIds = selectedPatient.relationships?.doctorIds || [];
                return !patientDoctorIds.includes(doctor.id);
            })}
            selectedDoctor={selectedDoctor}
            onDoctorChange={setSelectedDoctor}
            onSubmit={handleAddDoctor}
            onClose={() => {
                setShowDoctorModal(false);
                setSelectedPatient(null);
            }}
            isLoading={actionLoading}
            />
            
            {/* Caretaker Selection Modal */}
            <CaretakerModal 
            isOpen={showCaretakerSelectionModal}
            patient={selectedPatient}
            caretakers={caretakers.filter(caretaker => {
                const isAssignedToOtherPatient = patients.some(p => 
                p.id !== selectedPatient?.id && 
                p.relationships?.caretakerId === caretaker.id
                );
                return !isAssignedToOtherPatient;
            })}
            selectedCaretaker={selectedCaretaker}
            onCaretakerChange={setSelectedCaretaker}
            onAddCaretaker={handleAddCaretaker}
            onClose={() => {
                setShowCaretakerSelectionModal(false);
                setSelectedPatient(null);
            }}
            isLoading={actionLoading}
            />
        </div>
        );
};

export default PatientView;