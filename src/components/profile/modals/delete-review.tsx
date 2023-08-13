import React, { useContext, useState } from 'react';
import Context from '../../../context/update';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import { UserRoleEnum, UserType } from '../../../types/auth';
import { reviewService } from '../../../lib/api/review';
import { closeModal } from '../../../lib/utils/close-modal';
import Success from '../../success-modal';
import PageLoader from '../../loader';
import ShowPopUp from '../../custom-popup-alert';

type Props = {
    reviewId: string;
};

const DeleteReview: React.FC<Props> = ({ reviewId }) => {
    const { user } = useSelector((state: RootState) => state.user);
    const hasUser = user as UserType;
    const { updateProfile } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [successShow, setSuccessShow] = useState<boolean>(false);
    const [success, setSuccess] = useState(false);

    function handleCloseModal() {
        setTimeout(() => {
            success && setSuccess(false);
        }, 500);
    }

    async function handleClick() {
        try {
            setLoading(true);
            if (hasUser.role === UserRoleEnum.candidate) {
                await reviewService.deleteCompany(reviewId);
            } else {
                await reviewService.deleteCandidate(reviewId);
            }
            updateProfile && updateProfile();
            setSuccess(true);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div
                className="modal fade"
                id="DeleteReview"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex={-1}
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered lt-modal-dialog-md">
                    <div className="modal-content lt-modal-content">
                        {loading ? (
                            <PageLoader />
                        ) : success ? (
                            <ShowPopUp
                                handleCloseModal={handleCloseModal}
                                headerText="Review"
                                text="Review deleted successfully"
                            />
                        ) : (
                            <>
                                <div className="modal-header lt-modal-header">
                                    <div className="w-100 text-center">
                                        <i className="bi bi-trash lt-text-error fs-42" />
                                    </div>
                                </div>
                                <div className="modal-body lt-modal-body mt-2">
                                    <div className="w-100 text-center">
                                        <h1 className="fw-700 fs-18">Delete review</h1>
                                        <p>Are you sure you want to delete this review?</p>
                                    </div>
                                </div>
                                <div className="modal-footer lt-modal-footer">
                                    <div className="d-flex w-100 m-0 pt-3">
                                        <div className="col pe-2">
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger outline-d-hover w-100"
                                                data-bs-dismiss="modal"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                        <div className="col ps-2">
                                            <button
                                                type="button"
                                                onClick={handleClick}
                                                className="btn btn-danger w-100"
                                            >
                                                {loading && <span className="spinner-border spinner-border-sm" />}
                                                Yes, delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeleteReview;
