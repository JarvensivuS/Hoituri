const AddDoctorButton = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      style={{
        marginRight: '10px',
        marginBottom: '5px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '5px 10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1
      }}
      disabled={disabled}
    >
      Lisää lääkäri
    </button>
  );
};

export default AddDoctorButton;