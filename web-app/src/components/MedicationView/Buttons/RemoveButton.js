import "../styles/RemoveButton.css";

const RemoveButton = ({ onClick, disabled, size = 'normal', text = 'X' }) => {
  const className = `remove-button-${size}`;

  return (
    <button
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default RemoveButton;
