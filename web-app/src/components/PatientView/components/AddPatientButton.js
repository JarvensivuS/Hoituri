import "../styles/AddPatientButton.css";

const AddPatientButton = ({ onClick, disabled }) => {
  return (
    <button className="add-patient-button"
      onClick={onClick}
      disabled={disabled}
    >
      Lisää potilas
    </button>
  );
};

export default AddPatientButton;