const RemoveButton = ({ onClick, disabled, size = 'normal', text = 'X' }) => {
  const styles = {
    small: {
      marginLeft: '10px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '2px 5px',
      fontSize: '12px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.7 : 1
    },
    normal: {
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '5px 10px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.7 : 1
    }
  };

  return (
    <button
      onClick={onClick}
      style={styles[size]}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default RemoveButton;