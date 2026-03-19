import React, { useEffect } from 'react';

export default function Toast({ alert, onClose }) {
  useEffect(() => {
    if (!alert) return;
    const t = setTimeout(() => onClose && onClose(), 4000);
    return () => clearTimeout(t);
  }, [alert, onClose]);

  if (!alert) return null;

  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1050 }}>
      <div className={`toast show text-bg-${alert.type}`} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="d-flex">
          <div className="toast-body">{alert.message}</div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={onClose}></button>
        </div>
      </div>
    </div>
  );
}
