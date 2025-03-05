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
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Nimi:</label>
        <input 
          type="text"
          value={patientName}
          onChange={(e) => onPatientNameChange(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
          disabled={isLoading}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Sähköposti:</label>
        <input 
          type="email"
          value={patientEmail}
          onChange={(e) => onPatientEmailChange(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
          disabled={isLoading}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Salasana:</label>
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
          disabled={isLoading}
        />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button 
          onClick={onClose}
          style={{ padding: '8px 16px' }}
          disabled={isLoading}
        >
          Peruuta
        </button>
        <button 
          onClick={handleSubmit}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
          disabled={isLoading}
        >
          {isLoading ? "Lisätään..." : "Lisää potilas"}
        </button>
      </div>
    </ModalContainer>
  );
};

export default PatientCreateModal;