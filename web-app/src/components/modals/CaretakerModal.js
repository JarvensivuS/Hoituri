import ModalContainer from './ModalContainer';

const CaretakerModal = ({ 
  isOpen, 
  patient,
  caretakers,
  selectedCaretaker,
  onCaretakerChange,
  onAddCaretaker,
  onClose,
  isLoading
}) => {
  return (
    <ModalContainer 
      isOpen={isOpen && patient} 
      title={patient ? `Hoitajan hallinta - ${patient.name}` : 'Hoitajan hallinta'} 
      onClose={onClose}
    >
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Valitse hoitaja:</label>
        <select 
          value={selectedCaretaker}
          onChange={(e) => onCaretakerChange(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
          disabled={caretakers.length === 0 || isLoading}
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
          onClick={onClose}
          style={{ padding: '8px 16px' }}
          disabled={isLoading}
        >
          Peruuta
        </button>
        <button 
          onClick={onAddCaretaker}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
          disabled={!selectedCaretaker || caretakers.length === 0 || isLoading}
        >
          {isLoading ? "Lisätään..." : "Lisää hoitaja"}
        </button>
      </div>
    </ModalContainer>
  );
};

export default CaretakerModal;