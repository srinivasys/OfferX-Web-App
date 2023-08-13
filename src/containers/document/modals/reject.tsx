import React, { Fragment, useContext, useEffect, useState } from 'react';
import { offerService } from '../../../lib/api/offer';
import history from '../../../history';
import { routes } from '../../routes/routes-names';
import Context from '../../../context/update';
import PageLoader from '../../../components/loader';
import { RejectionReasonType } from '../../../types/offer';
import { closeModal } from '../../../lib/utils/close-modal';

type Props = {
    id: string;
    modal?: boolean;
};
const reasonTextLength = 250;

const RejectOffer: React.FC<Props> = ({ id, modal }) => {
    const [loadingRejectionReason, setLoadingRejectionReason] = useState(true);
    const [loadingReject, setLoadingReject] = useState(false);
    const [reasonList, setReasonList] = useState<RejectionReasonType[]>([]);
    const [selectedReasons, setSelectedReasons] = useState<RejectionReasonType[]>([]);
    const [reasonText, setReasonText] = useState('');
    const { updateOffersList } = useContext(Context);
    const { updateOffersCount } = useContext(Context);

    async function reject() {
        if (!selectedReasons.length) return;
        try {
            setLoadingReject(true);
            await offerService.reject({
                offerId: id,
                rejectionReasonList: selectedReasons.map((item) => item.id),
                reasonText: includesAnyReasonItem(selectedReasons) ? reasonText : null,
            });
            closeModal('RejectOffer');
            if (modal) {
                updateOffersList && (await updateOffersList());
                updateOffersCount && (await updateOffersCount());
                setLoadingReject(false);
            } else {
                history.push(routes.pendingOffers);
            }
        } catch (err: any) {
            setLoadingReject(false);
        }
    }

    useEffect(() => {
        (async function () {
            try {
                const {
                    resultObject: { items },
                } = await offerService.getRejectionReason();
                setReasonList(items);
                setLoadingRejectionReason(false);
            } catch (err) {
            }
        })();
    }, []);

    return (
        <div
            className="modal fade"
            id="RejectOffer"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-labelledby="RejectOfferLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered lt-modal-dialog-md">
                <div className="modal-content lt-modal-content">
                    <div className="modal-header lt-modal-header">
                        <h1 className="fw-700 fs-18 w-100 text-center mb-0">Decline offer</h1>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => (setSelectedReasons([]), setReasonText(''))}
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            title="Close"
                        />
                    </div>
                    <div className="modal-body lt-modal-body">
                        <div className="w-100">
                            <p className="fs-14 fw-700 mt-3 mb-2">
                                Select reasons to decline this offer:
                            </p>
                            <div className='decline-modal'>
                                {loadingRejectionReason ? (
                                    <PageLoader />
                                ) : (
                                    <>
                                        {reasonList.map((item) => {
                                            const selectedThisItem = !!selectedReasons.find(
                                                (selectedItem) => selectedItem.id === item.id
                                            );
                                            return (
                                                <Fragment key={item.id}>
                                                    <div className="form-check mb-2">
                                                        <input
                                                            onClick={() => {
                                                                setSelectedReasons(
                                                                    selectedThisItem
                                                                        ? selectedReasons.filter(
                                                                            (selectedItem) => selectedItem.id !== item.id
                                                                        )
                                                                        : [...selectedReasons, item]
                                                                );
                                                            }}
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={item.id}
                                                            checked={selectedThisItem}
                                                        />
                                                        <label className="form-check-label fs-13" htmlFor={item.id}>
                                                            {item.reason}
                                                        </label>
                                                    </div>
                                                    {!!selectedReasons.length &&
                                                        includesAnyReasonItem(selectedReasons) &&
                                                        isAnyReasonItem(item.reason) && (
                                                            <div className="position-relative">
                                                                <textarea
                                                                    value={reasonText}
                                                                    className="form-control mb-1"
                                                                    onChange={({ target }) => setReasonText(target.value)}
                                                                    maxLength={reasonTextLength}
                                                                    rows={8}
                                                                />
                                                                <div className='d-flex justify-content-end'>
                                                                    <span className="mt-2 fs-14">
                                                                        {reasonText.length}/{reasonTextLength}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                </Fragment>
                                            );
                                        })}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer lt-modal-footer">
                        <div className="d-flex w-100 m-0 pt-3">
                            <div className="col pe-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger outline-d-hover w-100"
                                    data-bs-dismiss={!modal && 'modal'}
                                    data-bs-toggle={modal && 'modal'}
                                    data-bs-target={modal && '#RejectPreview'}
                                    onClick={() => (setSelectedReasons([]), setReasonText(''))}
                                >
                                    Cancel
                                </button>
                            </div>
                            <div className="col ps-2">
                                {loadingReject && <div className='new-spinner p-absolute'><div><span className="spinner-border spinner-border-sm custom-spinner-border" /></div><p className='fs-14 custom-loading-text'>Loading</p></div>}
                                <button
                                    type="button"
                                    onClick={reject}
                                    className="btn btn-danger w-100"
                                    disabled={loadingReject || loadingRejectionReason || !selectedReasons.length}
                                >
                                    Yes, Decline
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RejectOffer;

const includesAnyReasonItem = (selectedReasons: RejectionReasonType[]) =>
    !!selectedReasons.find((item) => isAnyReasonItem(item.reason));

const isAnyReasonItem = (text: string) => text.indexOf('Other reason') >= 0;
