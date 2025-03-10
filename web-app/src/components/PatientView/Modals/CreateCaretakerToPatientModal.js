import ModalContainer from './ModalContainer';
import '../styles/Modals.css'; 

const CaretakerCreateModal = ({ 
  isOpen, 
  onClose, 
  caretakerName,
  onCaretakerNameChange,
  caretakerEmail,
  onCaretakerEmailChange,
  caretakerPhone,
  onCaretakerPhoneChange,
  patientName,
  onSubmit,
  isLoading
}) => {
  return (
    <ModalContainer 
      isOpen={isOpen} 
      title={`Lisää uusi omainen potilaalle ${patientName}`} 
      onClose={onClose}
    >
      <div className="modal-form">
        <div>
          <label htmlFor="caretakerName">Nimi:</label>
          <input 
            id="caretakerName"
            type="text"
            value={caretakerName}
            onChange={(e) => onCaretakerNameChange(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="caretakerEmail">Sähköposti:</label>
          <input 
            id="caretakerEmail"
            type="email"
            value={caretakerEmail}
            onChange={(e) => onCaretakerEmailChange(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="caretakerPhone">Puhelinnumero:</label>
          <input 
            id="caretakerPhone"
            type="tel"
            value={caretakerPhone}
            onChange={(e) => onCaretakerPhoneChange(e.target.value)}
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
            {isLoading ? "Lisätään..." : "Lisää omainen"}
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default CaretakerCreateModal;