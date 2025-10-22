import React from "react";
import { LogIn, X } from "lucide-react";

const MessageModal = ({ message, type, onClose }) => {
  if (!message) return null;

  const modalClass = type === "success" ? "modal-success" : "modal-error";
  const Icon = type === "success" ? LogIn : X;

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${modalClass}`}>
        <div className="modal-text">
          <Icon className="modal-icon" />
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Fechar mensagem"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageModal;
