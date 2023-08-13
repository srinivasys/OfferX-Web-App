import React, { useContext, useState } from 'react';
import Context from '../../../context/update';
import { closeModal } from '../../../lib/utils/close-modal';
import { candidateService } from '../../../lib/api/candidate';
import { companyService } from '../../../lib/api/company';
import ShowPopUp from '../../custom-popup-alert';
import PageLoader from '../../loader';

type Props = {
    candidatePage: boolean;
    imageModalType: 'banner' | 'avatar';
    clearCrop: () => void;
};

const DeleteImage: React.FC<Props> = ({ candidatePage, imageModalType, clearCrop }) => {
    const { updateProfile } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    function handleCloseModal() {
        setTimeout(() => {
            success && setSuccess(false);
        }, 500);
    }

    async function handleClick() {
        try {
            setLoading(true);
            clearCrop();
            candidatePage && imageModalType === 'banner' && (await candidateService.deleteBanner());
            candidatePage && imageModalType === 'avatar' && (await candidateService.deleteAvatar());
            !candidatePage && imageModalType === 'banner' && (await companyService.deleteBanner());
            !candidatePage && imageModalType === 'avatar' && (await companyService.deleteAvatar());
            updateProfile && updateProfile();
            setSuccess(true);
        } catch (err: any) {
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="modal fade"
            id="DeleteBannerPic"
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
                            headerText={imageModalType === 'banner' ? 'Delete banner' : 'Delete avatar'}
                            text={
                                imageModalType === 'banner'
                                    ? 'Banner deleted successfully'
                                    : 'Avatar deleted successfully'
                            }
                        />
                    ) : (
                        <>
                            <div className="modal-header lt-modal-header">
                                <div className="w-100 text-center">
                                    <i className="bi bi-exclamation-triangle lt-text-error fs-42 me-0 ms-3" />
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
                                    <h1 className="fw-700 fs-18">
                                        Delete {imageModalType === 'banner' ? 'banner' : 'avatar'}
                                    </h1>
                                    <p>
                                        Are you sure you want to delete{' '}
                                        {imageModalType === 'banner' ? 'banner' : 'avatar'}?
                                    </p>
                                </div>
                            </div>
                            <div className="modal-footer lt-modal-footer">
                                <div className="d-flex w-100 m-0 pt-3">
                                    <div className="col pe-2">
                                        <button
                                            type="button"
                                            data-bs-toggle="modal"
                                            data-bs-target="#BannerPic"
                                            className="btn btn-outline-danger outline-d-hover w-100"
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeleteImage;
