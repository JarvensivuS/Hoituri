import "../styles/AddMedicationButton.css";

const AddMedicationButton = ({ onClick, disabled, text = "Lisää lääkemuistutus" }) => {
  return (
    <button className="add-medication-button"
      onClick={onClick}
      disabled={disabled}
    >
      {disabled ? "Lisätään..." : text}
    </button>
  );
};

export default AddMedicationButton;