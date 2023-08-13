import React, { useContext, useState } from 'react';
import { OfferDataType } from '../../../../types/offer';
import { offerService } from '../../../../lib/api/offer';
import Context from '../../../../context/update';
import { closeModal } from '../../../../lib/utils/close-modal';

type Props = {
    activeOffer: OfferDataType | null;
};

const RetractOffer: React.FC<Props> = ({ activeOffer }) => {
    const { updateOffersList } = useContext(Context);
    const { updateOffersCount } = useContext(Context);
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        if (!activeOffer) return;
        try {
            setLoading(true);
            await offerService.retract(activeOffer.id);
            updateOffersList && (await updateOffersList());
            updateOffersCount && (await updateOffersCount());
            closeModal('RetractOffer');
        } catch (err) {
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="modal fade"
            id="RetractOffer"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered lt-modal-dialog-md">
                <div className="modal-content lt-modal-content">
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
                            <h1 className="fw-700 fs-20">Retract offer</h1>
                            <p>Are you sure you want to retract this offer?</p>
                        </div>
                    </div>
                    <div className="modal-footer lt-modal-footer">
                        <div className="row w-100 m-0 pt-3">
                            <div className="col-12 col-sm pe-sm-2 mt-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger outline-d-hover w-100"
                                    data-bs-dismiss="modal"
                                    title="Close"
                                >
                                    Cancel
                                </button>
                            </div>
                            <div className="col-12 col-sm ps-sm-2 mt-2">
                                <button type="button" onClick={handleClick} className="btn btn-danger w-100">
                                    {loading && <span className="spinner-border spinner-border-sm" />}
                                    Yes, Retract
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetractOffer;
