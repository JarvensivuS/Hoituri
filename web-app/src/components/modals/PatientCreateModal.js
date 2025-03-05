import { useState } from 'react';
import ModalContainer from './ModalContainer';

const PatientCreateModal = ({ 
  isOpen, 
  onClose, 
  patientName,
  onPatientNameChange,
  patientEmail,
  onPatientEmailChange,
  onSubmit,
  isLoading
}) => {
  const [password, setPassword] = useState("password123");
  
  const handleSubmit = () => {
    onSubmit(password);
  };
  
  return (
    <ModalContainer 
    isOpen={isOpen} 
    title="Lisää uusi potilas" 
    onClose={onClose}
>
    <div className="modal-form">
        <div>
            <label>Nimi:</label>
            <input 
                type="text"
                value={patientName}
                onChange={(e) => onPatientNameChange(e.target.value)}
                disabled={isLoading}
            />
        </div>
        
        <div>
            <label>Sähköposti:</label>
            <input 
                type="email"
                value={patientEmail}
                onChange={(e) => onPatientEmailChange(e.target.value)}
                disabled={isLoading}
            />
        </div>
        
        <div>
            <label>Salasana:</label>
            <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
            />
        </div>
        
        <div className="modal-form-buttons">
            <button 
                onClick={onClose}
                disabled={isLoading}
            >
                Peruuta
            </button>
            <button 
                onClick={handleSubmit}
                style={{ 
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 16px'
                }}
                disabled={isLoading}
            >
                {isLoading ? "Lisätään..." : "Lisää potilas"}
            </button>
        </div>
    </div>
    </ModalContainer>
  );
};

export default PatientCreateModal;