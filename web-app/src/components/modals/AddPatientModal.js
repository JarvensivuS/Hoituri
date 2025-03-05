import ModalContainer from './ModalContainer';

const AddPatientModal = ({ 
  isOpen, 
  onClose, 
  patientName,
  onPatientNameChange,
  patientEmail,
  onPatientEmailChange,
  onSubmit,
  isLoading,
  title = "Lisää uusi potilas",
  submitButtonText = "Lisää potilas"
}) => {
  return (
    <ModalContainer 
      isOpen={isOpen} 
      title={title} 
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
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button 
          onClick={onClose}
          style={{ padding: '8px 16px' }}
          disabled={isLoading}
        >
          Peruuta
        </button>
        <button 
          onClick={onSubmit}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
          disabled={isLoading}
        >
          {isLoading ? "Lisätään..." : submitButtonText}
        </button>
      </div>
    </ModalContainer>
  );
};

export default AddPatientModal;