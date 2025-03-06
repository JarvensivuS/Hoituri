import '../styles/Modals.css'; 

const ModalContainer = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;