import "../styles/AddMedicationButton.css";

const AddMedicationButton = ({ onClick, disabled, text = "Lisää lääkemuistutus" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: "#007bff",
        color: "white",
        padding: "0.75rem",
        border: "none",
        borderRadius: "8px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: "bold",
        opacity: disabled ? 0.7 : 1
      }}
    >
      {disabled ? "Lisätään..." : text}
    </button>
  );
};

export default AddMedicationButton;