import "../styles/AddDoctorButton.css";

const AddDoctorButton = ({ onClick, disabled }) => {
  return (
    <button
      className="add-doctor-button"
      onClick={onClick}
      disabled={disabled}
    >
      Lisää lääkäri
    </button>
  );
};

export default AddDoctorButton;