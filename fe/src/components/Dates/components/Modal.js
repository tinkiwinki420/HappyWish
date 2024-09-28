import React from "react";
import "../../../styles/Dates.css"; // Assuming you have a CSS file for styling the modal

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close">
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
