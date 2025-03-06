import RemoveButton from '../../MedicationView/Buttons/RemoveButton';
import AddDoctorButton from '../Buttons/AddDoctorButton';
import AddCaretakerButton from '../Buttons/AddCaretakerButton';
import "../styles/PatientListItem.css";

const PatientListItem = ({ 
  patient, 
  doctors, 
  caretakers, 
  currentUserId,
  actionLoading,
  onRemoveDoctor,
  onRemoveCaretaker,
  onAddDoctor,
  onAddCaretaker
}) => {
  const patientCaretakerId = patient.relationships?.caretakerId;
  const caretaker = patientCaretakerId 
    ? caretakers.find(c => c.id === patientCaretakerId) 
    : null;
  
  const patientDoctorIds = patient.relationships?.doctorIds || [];
  const patientDoctors = patientDoctorIds
    .map(id => doctors.find(d => d.id === id))
    .filter(Boolean);
  
  const hasAvailableDoctors = doctors.some(doctor => 
    !patientDoctorIds.includes(doctor.id) && doctor.id !== currentUserId
  );

  return (
    <tr className="patient-list-item">
      <td>{patient.name}</td>
      <td>{patient.email || 'Ei sähköpostia'}</td>
      
      {/* Doctor column */}
      <td>
        {patientDoctors.length > 0 ? (
          <div className="patient-list-item-doctors">
            {patientDoctors.map(doctor => (
              <div key={doctor.id} className="patient-list-item-doctor">
                {doctor.name}
                {doctor.id !== currentUserId && (
                  <RemoveButton 
                    size="small"
                    onClick={() => onRemoveDoctor(patient.id, doctor.id)}
                    disabled={actionLoading}
                  />
                )}
              </div>
            ))}
          </div>
        ) : 'Ei lääkäriä'}
      </td>
      
      {/* Caretaker column */}
      <td>
        {caretaker 
          ? (
            <div className="patient-list-item-caretaker">
              {caretaker.name}
              <RemoveButton 
                size="small"
                onClick={() => onRemoveCaretaker(patient.id, patientCaretakerId)}
                disabled={actionLoading}
              />
            </div>
          ) 
          : 'Ei hoitajaa'
        }
      </td>
      
      {/* Actions column */}
      <td>
        {hasAvailableDoctors && (
          <AddDoctorButton
            onClick={() => onAddDoctor(patient)}
            disabled={actionLoading}
          />
        )}
        
        <AddCaretakerButton
          onClick={() => onAddCaretaker(patient)}
          disabled={actionLoading}
          hasCaretaker={!!patientCaretakerId}
        />
      </td>
    </tr>
  );
};

export default PatientListItem;