import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';

type Props = {
    headerText: string;
    text: string;
    handleCloseModal: () => void;
};
const ShowPopUp: React.FC<Props> = ({ headerText, text, handleCloseModal }) => {
    return (
        <>
            <div className="modal-header lt-modal-header">
                <h5 className="modal-title text-center fs-18 fw-700 w-100">
                    <span className="d-none">header</span>
                </h5>
                {/* <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          title='Close'
          aria-label="Close"
          onClick={()=> handleCloseModal(false)}
          style={{ top: '-11px' }}
        /> */}
            </div>
            <div className="modal-body lt-modal-body text-center">
                <i className="bi bi-check-circle lt-text-success-alt fs-68" />
                <br />
                <h1 className="fs-20 fw-700">{headerText}</h1>
                <p className="fs-14 fw-400 mb-3">{text}</p>
                <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn btn-primary w-50"
                    data-bs-dismiss="modal"
                >
                    OK
                </button>
            </div>
        </>
    );
};

export default ShowPopUp;
