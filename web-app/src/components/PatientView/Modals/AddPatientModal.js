import ModalContainer from './ModalContainer';
import '../styles/Modals.css'; 

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
        
        <div className="modal-form-buttons">
          <button 
            className="modal-cancel-button"
            onClick={onClose}
            disabled={isLoading}
          >
            Peruuta
          </button>
          <button 
            className="modal-submit-button"
            onClick={onSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Lisätään..." : submitButtonText}
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default AddPatientModal;