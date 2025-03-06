import "../styles/AddCaretakerButton.css";

const AddCaretakerButton = ({ onClick, disabled, hasCaretaker }) => {
  return (
    <button
      className="add-caretaker-button"
      onClick={onClick}
      disabled={disabled}
    >
      {hasCaretaker ? 'Vaihda hoitaja' : 'Lisää hoitaja'}
    </button>
  );
};

export default AddCaretakerButton;