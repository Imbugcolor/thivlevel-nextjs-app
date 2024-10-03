import React from 'react';

interface ConfirmModalProps {
  show: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const Confirm: React.FC<ConfirmModalProps> = ({
  show,
  title,
  message,
  onClose,
  onConfirm,
}) => {
  return (
    <div
      className={`modal fade ${show ? 'show d-block' : ''}`}
      tabIndex={-1}
      role="dialog"
      aria-labelledby="confirmModalLabel"
      aria-hidden={!show}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="confirmModalLabel">
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">{message}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirm;