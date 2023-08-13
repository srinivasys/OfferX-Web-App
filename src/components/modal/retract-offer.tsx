import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { offerService } from '../../lib/api/offer';
import { GetAllRetractReasonsListType, OfferDataType } from '../../types/offer';
import { spaceRegexp } from '../../lib/utils/validation';
import PageLoader from '../loader';
import Context from '../../context/update';
import Success from '../success-modal';

type Props = {
    setRetractModal: (value: boolean) => void;
    retractModal: boolean;
    id: string;
    type: 'retract' | '';
};

const reasonTextLength = 250;

const RetractOfferModal: React.FC<Props> = ({ setRetractModal, retractModal, id, type }) => {
    const [data, setData] = useState<GetAllRetractReasonsListType[]>([]);
    const [selectedReasons, setSelectedReasons] = useState<GetAllRetractReasonsListType[]>([]);
    const [reasonText, setReasonText] = useState('');
    const [loading, setLoading] = useState<boolean>();
    const [retractLoading, setRetractLoading] = useState<boolean>();
    const [successShow, setSuccessShow] = useState<boolean>(false);
    const { updateOffersList } = useContext(Context);
    const { updateOffersCount } = useContext(Context);

    const submitForm = async () => {
        if (!selectedReasons.length) return;

        try {
            setRetractLoading(true);
            await offerService.retractOffer({
                offerId: id,
                retractReasonList: selectedReasons.map((item) => item.id),
                reasonText: includesAnyReasonItem(selectedReasons) ? reasonText : null,
            });
            updateOffersList && (await updateOffersList());
            updateOffersCount && (await updateOffersCount());
            setRetractModal(false);
            setSuccessShow(true);
            setSelectedReasons([]);
            setReasonText('');
            setSuccessShow(true);
        } catch (error) {
        } finally {
            setRetractLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const {
                    resultObject: { items },
                } = await offerService.getAllRetractReasonsList();
                setData(items);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <>
            <Modal
                show={retractModal}
                onHide={() => (setRetractModal(false), setReasonText(''), setSelectedReasons([]))}
                centered
            >
                <div className="lt-modal-content">
                    <Modal.Header className="lt-modal-header">
                        <Modal.Title className="text-center w-100 fw-700 fs-20">Retract offer</Modal.Title>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            title="Close"
                            onClick={() => (setRetractModal(false), setSelectedReasons([]), setReasonText(''))}
                        ></button>
                    </Modal.Header>

                    <Modal.Body className="lt-modal-body">
                        <p className="fs-14 fw-600 my-3">Select reasons to retract this offer: </p>
                        <div className='retract-modal'>
                            {loading ? (
                                <PageLoader />
                            ) : (
                                data.map((item) => {
                                    const selectedThisItem = !!selectedReasons.find(
                                        (selectedItem) => selectedItem.id === item.id
                                    );

                                    return (
                                        <>
                                            <div className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    onClick={() =>
                                                        setSelectedReasons(
                                                            selectedThisItem
                                                                ? selectedReasons.filter(
                                                                    (selectedItem) => selectedItem.id !== item.id
                                                                )
                                                                : [...selectedReasons, item]
                                                        )
                                                    }
                                                    value=""
                                                    id={item.id}
                                                />
                                                <label className="form-check-label fs-13" htmlFor={item.id}>
                                                    {item.reason}
                                                </label>
                                            </div>
                                            {!!selectedReasons.length &&
                                                includesAnyReasonItem(selectedReasons) &&
                                                isAnyReasonItem(item.reason) && (
                                                    <>
                                                    <div className="position-relative">
                                                        <textarea
                                                            value={reasonText}
                                                            className="form-control mb-1"
                                                            onChange={({ target }) =>
                                                                setReasonText(target.value.replace(spaceRegexp, ''))
                                                            }
                                                            maxLength={reasonTextLength}
                                                            rows={8}
                                                        />
                                                        <div className='d-flex justify-content-end'>
                                                            <span className="mt-2 fs-14">
                                                                {reasonText.length}/{reasonTextLength}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    </>
                                                )}
                                        </>
                                    );
                                })
                            )}
                        </div>
                    </Modal.Body>

                    <Modal.Footer className="lt-modal-footer">
                        <div className="d-flex w-100 m-0 pt-3">
                            <div className="col pe-2">
                                <button
                                    className="btn btn-outline-danger outline-d-hover w-100"
                                    onClick={() => (setRetractModal(false), setSelectedReasons([]), setReasonText(''))}
                                >
                                    Cancel
                                </button>
                            </div>
                            <div className="col ps-2">
                                {retractLoading && <div className='new-spinner p-absolute'><div><span className="spinner-border spinner-border-sm custom-spinner-border" /></div><p className='fs-14 custom-loading-text'>Loading</p></div>}
                                <button
                                    onClick={submitForm}
                                    className="btn btn-danger w-100 cursor-notallowed"
                                    disabled={!selectedReasons.length || retractLoading}
                                >
                                    Retract offer
                                </button>
                            </div>
                        </div>
                    </Modal.Footer>
                </div>
            </Modal>
            <Success
                message="Offer retracted successfully"
                title="Success"
                successShow={successShow}
                setSuccessShow={setSuccessShow}
            />
        </>
    );
};

export default RetractOfferModal;

const includesAnyReasonItem = (selectedReasons: GetAllRetractReasonsListType[]) =>
    !!selectedReasons.find((item) => isAnyReasonItem(item.reason));

const isAnyReasonItem = (text: string) => text.indexOf('Other reason') >= 0;

