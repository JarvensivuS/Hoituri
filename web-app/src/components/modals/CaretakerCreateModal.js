import ModalContainer from './ModalContainer';

const CaretakerCreateModal = ({ 
  isOpen, 
  onClose, 
  caretakerName,
  onCaretakerNameChange,
  caretakerEmail,
  onCaretakerEmailChange,
  onSubmit,
  isLoading
}) => {
  return (
    <ModalContainer 
    isOpen={isOpen} 
    title="Lisää uusi hoitaja" 
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
      
      <div className="modal-form-buttons">
        <button 
          onClick={onClose}
          disabled={isLoading}
        >
          Peruuta
        </button>
        <button 
          onClick={onSubmit}
          style={{ 
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px'
        }}
          disabled={isLoading}
        >
          {isLoading ? "Lisätään..." : "Lisää hoitaja"}
        </button>
      </div>
    </div>
    </ModalContainer>
  );
};

export default CaretakerCreateModal;