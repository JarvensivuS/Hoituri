const ModalContainer = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        width: '400px',
        maxWidth: '90%'
      }}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;