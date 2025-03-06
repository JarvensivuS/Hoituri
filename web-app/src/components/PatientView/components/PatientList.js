import PatientListItem from "./PatientListItem";
import "../styles/PatientList.css";

const PatientList = ({ 
  patients, 
  doctors, 
  caretakers, 
  currentUserId,
  actionLoading,
  onRemoveDoctor,
  onRemoveCaretaker,
  onAddDoctor,
  onAddCaretaker
}) => {
  if (patients.length === 0) {
    return <p className="patient-list-empty">Ei potilaita. Lisää uusi potilas aloittaaksesi.</p>;
  }

  return (
    <div className="patient-list-container">
      <table className="patient-table">
        <thead>
          <tr>
            <th>Nimi</th>
            <th>Sähköposti</th>
            <th>Lääkärit</th>
            <th>Hoitaja</th>
            <th>Toiminnot</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <PatientListItem
              key={patient.id}
              patient={patient}
              doctors={doctors}
              caretakers={caretakers}
              currentUserId={currentUserId}
              actionLoading={actionLoading}
              onRemoveDoctor={onRemoveDoctor}
              onRemoveCaretaker={onRemoveCaretaker}
              onAddDoctor={onAddDoctor}
              onAddCaretaker={onAddCaretaker}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;