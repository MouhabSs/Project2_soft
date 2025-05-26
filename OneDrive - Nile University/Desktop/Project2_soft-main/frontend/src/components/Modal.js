import React from "react";

export default function Modal({ open, onClose, title, children, ariaLabel, actions }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" tabIndex={-1} aria-modal="true" role="dialog" aria-label={ariaLabel || title}>
      <div className="modal-content slide-up" role="document">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">&times;</button>
        </div>
        <div className="modal-body">{children}</div>
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </div>
  );
}