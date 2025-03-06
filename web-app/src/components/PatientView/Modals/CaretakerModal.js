import ModalContainer from './ModalContainer';
import '../styles/Modals.css'; 

const CaretakerModal = ({ 
  isOpen, 
  patient,
  caretakers = [], 
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
      <div className="modal-form">
        <div>
          <label>Valitse hoitaja:</label>
          <select 
            value={selectedCaretaker}
            onChange={(e) => onCaretakerChange(e.target.value)}
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
            onClick={onAddCaretaker}
            disabled={!selectedCaretaker || caretakers.length === 0 || isLoading}
          >
            {isLoading ? "Lisätään..." : "Lisää hoitaja"}
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default CaretakerModal;