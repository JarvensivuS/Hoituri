import { useState } from "react";
import usePatientData from "../hooks/usePatientData";
import PatientSearch from "./PatientSearch";
import PatientList from "./PatientList";
import AddDoctorModal from '../Modals/AddDoctorToPatientModal'; 
import PatientCreateModal from '../Modals/PatientCreateModal';
import CaretakerCreateModal from '../Modals/CreateCaretakerToPatientModal';
import "../styles/PatientView.css";

const PatientView = ({ userId }) => {
  const {
    patients,
    caretakers,
    doctors,
    loading,
    error,
    actionLoading,
    createPatient,
    createCaretaker,
    addDoctor,
    removeDoctor,
    removeCaretaker
  } = usePatientData(userId);
  
  const [searchTerm, setSearchTerm] = useState("");
  
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientEmail, setNewPatientEmail] = useState("");

  const [showAddCaretakerModal, setShowAddCaretakerModal] = useState(false);
  const [newCaretakerName, setNewCaretakerName] = useState("");
  const [newCaretakerEmail, setNewCaretakerEmail] = useState("");
  const [newCaretakerPhone, setNewCaretakerPhone] = useState("");

  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddPatientModal = () => {
    setNewPatientName("");
    setNewPatientEmail("");
    setShowAddPatientModal(true);
  };

  const handleCreatePatient = async (password = "password123", phoneNumber = "") => {
    try {
      await createPatient(newPatientName, newPatientEmail, password, phoneNumber);
      setShowAddPatientModal(false);
      alert("Potilas lisätty onnistuneesti!");
    } catch (err) {
      alert(`Potilaan lisääminen epäonnistui: ${err.message || 'Tuntematon virhe'}`);
    }
  };
  
  const openAddCaretakerModal = (patient) => {
    setSelectedPatient(patient);
    setNewCaretakerName("");
    setNewCaretakerEmail("");
    setNewCaretakerPhone("");
    setShowAddCaretakerModal(true);
  };
    
  const handleCreateCaretaker = async () => {
    try {
      await createCaretaker(selectedPatient.id, newCaretakerName, newCaretakerEmail, newCaretakerPhone);
      setShowAddCaretakerModal(false);
      alert("Hoitaja lisätty onnistuneesti!");
    } catch (err) {
      alert(`Hoitajan lisääminen epäonnistui: ${err.message || 'Tuntematon virhe'}`);
    }
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
    try {
      await addDoctor(selectedPatient.id, selectedDoctor);
      setShowDoctorModal(false);
    } catch (err) {
      alert(`Lääkärin lisääminen epäonnistui: ${err.message || 'Tuntematon virhe'}`);
    }
  };

  const handleRemoveDoctor = async (patientId, doctorId) => {
    if (!confirm("Haluatko varmasti poistaa lääkärin?")) {
      return;
    }
      
    try {
      await removeDoctor(patientId, doctorId);
    } catch (err) {
      alert(`Lääkärin poistaminen epäonnistui: ${err.message || 'Tuntematon virhe'}`);
    }
  };

  const handleRemoveCaretaker = async (patientId, caretakerId) => {
    if (!confirm("Haluatko varmasti poistaa omaisen?")) {
      return;
    }
      
    try {
      await removeCaretaker(patientId, caretakerId);
    } catch (err) {
      alert(`Omaisen poistaminen epäonnistui: ${err.message || 'Tuntematon virhe'}`);
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
            className="add-btn" 
            onClick={openAddPatientModal}
            disabled={actionLoading}
          >
            Lisää uusi potilas
          </button>
        </div>
        <PatientSearch 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          disabled={actionLoading}
        />
      </div>
      
      <PatientList 
        patients={filteredPatients}
        doctors={doctors}
        caretakers={caretakers}
        currentUserId={userId}
        actionLoading={actionLoading}
        onRemoveDoctor={handleRemoveDoctor}
        onRemoveCaretaker={handleRemoveCaretaker}
        onAddDoctor={openDoctorModal}
        onAddCaretaker={openAddCaretakerModal}
      />
      
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
        onClose={() => {
          setShowAddCaretakerModal(false);
          setSelectedPatient(null);
        }} 
        caretakerName={newCaretakerName}
        onCaretakerNameChange={setNewCaretakerName}
        caretakerEmail={newCaretakerEmail}
        onCaretakerEmailChange={setNewCaretakerEmail}
        caretakerPhone={newCaretakerPhone}
        onCaretakerPhoneChange={setNewCaretakerPhone}
        patientName={selectedPatient?.name || ""}
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
    </div>
  );
};

export default PatientView;