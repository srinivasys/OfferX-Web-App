import React, { useState } from 'react';
import { EmployeeType } from '../../../types/employee';
import { employeeService } from '../../../lib/api/employee';
import { closeModal } from '../../../lib/utils/close-modal';
import ShowPopUp from '../../../components/custom-popup-alert';

type Props = {
    activeEmployee: EmployeeType | null;
    getList: () => Promise<void>;
};

const DeleteEmployee: React.FC<Props> = ({ getList, activeEmployee }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    function handleCloseModal() {
        setTimeout(() => {
            success && setSuccess(false);
        }, 500);
    }

    async function handleDelete() {
        if (!activeEmployee) return;
        try {
            setLoading(true);
            await employeeService.delete(activeEmployee.id);
            await getList();
            setSuccess(true);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="modal fade"
            id="deleteOffer"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-labelledby="RetractOfferLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered lt-modal-dialog-md">
                <div className="modal-content lt-modal-content">
                    {success ? (
                        <ShowPopUp
                            handleCloseModal={handleCloseModal}
                            headerText="Delete Employee"
                            text="Employee deleted successfully"
                        />
                    ) : (
                        <>
                            <div className="modal-header lt-modal-header">
                                <div className="w-100 text-center">
                                    <i className="bi bi-x-square lt-text-error fs-42 me-0 ms-3" />
                                </div>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    title="Close"
                                />
                            </div>
                            <div className="modal-body lt-modal-body mt-4">
                                <div className="w-100 text-center">
                                    <h1 className="fw-700 fs-18">Delete Employee</h1>
                                    <p>Are you sure? You won’t be able to undo this.</p>
                                </div>
                            </div>
                            <div className="modal-footer lt-modal-footer">
                                <div className="d-flex w-100 m-0 pt-3">
                                    <div className="col pe-2">
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger outline-d-hover w-100"
                                            data-bs-dismiss="modal"
                                            title="Close"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    <div className="col ps-2">
                                        {loading && <div className='new-spinner p-absolute'><div><span className="spinner-border spinner-border-sm custom-spinner-border" /></div><p className='fs-14 custom-loading-text'>Loading</p></div>}
                                        <button type="button" onClick={handleDelete} className="btn btn-danger w-100">
                                            Yes, Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeleteEmployee;
