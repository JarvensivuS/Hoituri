import ModalContainer from './ModalContainer';
import '../styles/Modals.css'; 

const AddDoctorModal = ({ 
  isOpen, 
  patient,
  doctors,
  selectedDoctor,
  onDoctorChange,
  onSubmit,
  onClose,
  isLoading
}) => {
  return (
    <ModalContainer 
      isOpen={isOpen && patient} 
      title={patient ? `Lisää lääkäri potilaalle ${patient.name}` : 'Lisää lääkäri'} 
      onClose={onClose}
    >
      <div className="modal-form">
        <div>
          <label>Valitse lääkäri:</label>
          <select 
            value={selectedDoctor}
            onChange={(e) => onDoctorChange(e.target.value)}
            disabled={doctors.length === 0 || isLoading}
          >
            {doctors.length === 0 ? (
              <option value="">Ei lääkäreitä saatavilla</option>
            ) : (
              doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
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
            onClick={onSubmit}
            disabled={!selectedDoctor || doctors.length === 0 || isLoading}
          >
            {isLoading ? "Lisätään..." : "Lisää lääkäri"}
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default AddDoctorModal;