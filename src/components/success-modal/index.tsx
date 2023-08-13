import React from 'react';
import { Modal } from 'react-bootstrap';

type Props = {
    successShow: boolean;
    setSuccessShow: (value: boolean) => void;
    message?: string;
    title?: string;
};

const Success: React.FC<Props> = ({ successShow, setSuccessShow, message, title }) => {
    return (
        <Modal show={successShow} centered>
            <Modal.Body className="text-center">
                <i className="bi bi-check-circle lt-text-success-alt fs-68" />
                <br />
                {title && <h1 className="fs-20 fw-700">{title}</h1>}
                <p className="fs-14 fw-400"> {message}</p>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-center'>
                <button type="button" className="btn btn-primary w-50" onClick={() => setSuccessShow(false)}>
                    OK
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default Success;
