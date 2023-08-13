import React, { useState } from 'react';
import { candidateService } from '../../../lib/api/candidate';

type Props = {
    deleteSuccessful: () => void;
};

const DeleteResume: React.FC<Props> = ({ deleteSuccessful }) => {
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        try {
            setLoading(true);
            await candidateService.deleteResume();
            deleteSuccessful();
            const container = document.getElementById('DeleteResume');
            if (container) {
                const close = container.querySelector('[data-bs-target="#EditProfile"]') as HTMLButtonElement;
                close.click();
            }
        } catch (err) {
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="modal fade"
            id="DeleteResume"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered lt-modal-dialog-md">
                <div className="modal-content lt-modal-content">
                    <div className="modal-header lt-modal-header">
                        <div className="w-100 text-center">
                            <i className="bi bi-trash lt-text-error fs-42 me-0 ms-0" />
                        </div>
                    </div>
                    <div className="modal-body lt-modal-body mt-2">
                        <div className="w-100 text-center">
                            <h1 className="fw-700 fs-18">Delete Resume</h1>
                            <p>Are you sure you want to delete your resume?</p>
                        </div>
                    </div>
                    <div className="modal-footer lt-modal-footer">
                        <div className="d-flex w-100 m-0 pt-3">
                            <div className="col pe-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger outline-d-hover w-100"
                                    data-bs-toggle="modal"
                                    data-bs-target="#EditProfile"
                                >
                                    Cancel
                                </button>
                            </div>
                            <div className="col ps-2">
                                <button type="button" onClick={handleClick} className="btn btn-danger w-100">
                                    {loading && <span className="spinner-border spinner-border-sm" />}
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteResume;
