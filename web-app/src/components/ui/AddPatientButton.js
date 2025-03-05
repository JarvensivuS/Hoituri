const AddPatientButton = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        marginRight: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1
      }}
      disabled={disabled}
    >
      Lisää potilas
    </button>
  );
};

export default AddPatientButton;