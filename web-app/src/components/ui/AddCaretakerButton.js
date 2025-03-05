const AddCaretakerButton = ({ onClick, disabled, hasCaretaker }) => {
  return (
    <button
      onClick={onClick}
      style={{
        marginRight: '10px',
        marginBottom: '5px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '5px 10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1
      }}
      disabled={disabled}
    >
      {hasCaretaker ? 'Vaihda hoitaja' : 'Lisää hoitaja'}
    </button>
  );
};

export default AddCaretakerButton;