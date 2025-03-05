import ModalContainer from './ModalContainer';

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
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Valitse lääkäri:</label>
        <select 
          value={selectedDoctor}
          onChange={(e) => onDoctorChange(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
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
          disabled={!selectedDoctor || doctors.length === 0 || isLoading}
        >
          {isLoading ? "Lisätään..." : "Lisää lääkäri"}
        </button>
      </div>
    </ModalContainer>
  );
};

export default AddDoctorModal;