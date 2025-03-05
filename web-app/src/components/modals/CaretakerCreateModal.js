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
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Nimi:</label>
        <input 
          type="text"
          value={caretakerName}
          onChange={(e) => onCaretakerNameChange(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
          disabled={isLoading}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Sähköposti:</label>
        <input 
          type="email"
          value={caretakerEmail}
          onChange={(e) => onCaretakerEmailChange(e.target.value)}
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
          {isLoading ? "Lisätään..." : "Lisää hoitaja"}
        </button>
      </div>
    </ModalContainer>
  );
};

export default CaretakerCreateModal;