import React, { useCallback, useEffect, useState } from 'react';
import PageLoader from '../../loader';
import { suspensionService } from '../../../lib/api/suspension';
import { CategoryType, mapSuspension } from '../utils/suspension';
import { spaceRegexp } from '../../../lib/utils/validation';

type SelectedReasonsType = {
    category: string;
    reason: string;
};

type Props = {
    id: string;
    candidate?: boolean;
};

const Report: React.FC<Props> = ({ id, candidate }) => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectedReasons, setSelectedReasons] = useState<SelectedReasonsType[]>([]);
    const [textReason, setTextReason] = useState('');

    function handleCloseModal() {
        setTextReason('');
        setSelectedReasons(initialSelectedReasons(categories));
        setTimeout(() => {
            success && setSuccess(false);
        }, 500);
    }

    const submitForm = useCallback(async () => {
        const reasons = selectedReasons.reduce(
            (reasons: string[], item) => (item.reason ? [...reasons, item.reason] : reasons),
            []
        );
        try {
            setLoadingSubmit(true);
            if (candidate) {
                await suspensionService.reportFromCompany({
                    candidateId: id,
                    suspensionReasonList: reasons,
                    otherText: textReason,
                });
            } else {
                await suspensionService.report({
                    companyId: id,
                    suspensionReasonList: reasons,
                    otherText: textReason,
                });
            }
            setSuccess(true);
        } catch (err: any) {
        } finally {
            setLoadingSubmit(false);
        }
    }, [textReason, selectedReasons, id]);

    useEffect(() => {
        (async function () {
            try {
                setLoading(true);
                const {
                    resultObject: { items },
                } = await suspensionService.getList();
                const categories = mapSuspension(items);
                setCategories(categories);
                setSelectedReasons(initialSelectedReasons(categories));
            } catch (err: any) {
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div
            className="modal fade"
            id="Report"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            aria-labelledby="CompanyReportLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered lt-modal-dialog-md">
                <div className="modal-content lt-modal-content pe-3">
                    {loading ? (
                        <PageLoader />
                    ) : success ? (
                        <Success handleCloseModal={handleCloseModal} />
                    ) : (
                        <>
                            <div className="modal-header lt-modal-header">
                                <h5 className="modal-title text-center w-100 fw-700 fs-18" id="CompanyReportLabel">
                                    Report {candidate ? 'candidate' : 'company'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    title="Close"
                                    aria-label="Close"
                                    onClick={handleCloseModal}
                                />
                            </div>
                            <div className="modal-body lt-modal-body report-modal">
                                <p className="fs-14 fw-400 mt-3 mb-1 text-center">
                                    Select reasons for reporting this {candidate ? 'candidate' : 'company'}:
                                </p>
                                <div className="accordion accordion-flush pe-1" id="ReportReasons">
                                    {categories.map((category, i) => (
                                        <div key={category.id} className="accordion-item">
                                            <h2 className="accordion-header" id="flush-headingOne">
                                                <button
                                                    className="accordion-button collapsed fw-600"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target={`#Reason${i}`}
                                                    aria-expanded="false"
                                                    aria-controls={`Reason${i}`}
                                                >
                                                    {category.label}
                                                </button>
                                            </h2>
                                            <div
                                                id={`Reason${i}`}
                                                className="accordion-collapse collapse"
                                                aria-labelledby="flush-headingOne"
                                                data-bs-parent="#ReportReasons"
                                            >
                                                <div className="accordion-body px-2 py-0">
                                                    {category.reasons.map((reason) => (
                                                        <div key={reason.id} className="form-check mb-2">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name={category.id}
                                                                id={reason.id}
                                                                checked={
                                                                    selectedReasons.find(
                                                                        (item) => item.category === category.id
                                                                    )?.reason === reason.id
                                                                }
                                                                onClick={() => {
                                                                    const filteredSelectedReasons =
                                                                        selectedReasons.filter(
                                                                            (item) => item.category !== category.id
                                                                        );
                                                                    const selectedCategory = selectedReasons.find(
                                                                        (item) => item.category === category.id
                                                                    );
                                                                    setSelectedReasons([
                                                                        ...filteredSelectedReasons,
                                                                        {
                                                                            category: category.id,
                                                                            reason:
                                                                                selectedCategory?.reason === reason.id
                                                                                    ? ''
                                                                                    : reason.id,
                                                                        },
                                                                    ]);
                                                                }}
                                                            />
                                                            <label className="form-check-label fs-13" htmlFor={reason.id}>
                                                                {reason.label}
                                                            </label>
                                                            <p className="fs-12">{reason.text}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-headingSix">
                                            <button
                                                className="accordion-button collapsed fw-600"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#Reason6"
                                                aria-expanded="false"
                                                aria-controls="Reason6"
                                            >
                                                Other
                                            </button>
                                        </h2>
                                        <div
                                            id="Reason6"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="flush-headingSix"
                                            data-bs-parent="#ReportReasons"
                                        >
                                            <div className="accordion-body px-0 pt-0 other-reason-height">
                                                <textarea
                                                    value={textReason}
                                                    onChange={({ target }) =>
                                                        setTextReason(target.value.replace(spaceRegexp, ''))
                                                    }
                                                    maxLength={250}
                                                    className="form-control fs-14 other-reason"
                                                    placeholder=""
                                                />
                                                {textReason ? (
                                                    <div className="pt-2 fs-14 text-end">{textReason.length}/250</div>
                                                ) : (
                                                    <div className="pt-2 fs-14 text-end">0/250</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer lt-modal-footer">
                                <div className="d-flex w-100 m-0 pt-3">
                                    <div className="col pe-2">
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary outline-p-hover w-100"
                                            data-bs-dismiss="modal"
                                            onClick={handleCloseModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    <div className="col ps-2">
                                        {loadingSubmit && (
                                            <div className='new-spinner p-absolute'><div><span className="spinner-border spinner-border-sm custom-spinner-border" /></div><p className='fs-14 custom-loading-text'>Loading</p></div>
                                        )}
                                        <button
                                            onClick={submitForm}
                                            disabled={
                                                !selectedReasons.find((item) => item.reason.length) && !textReason
                                            }
                                            type="button"
                                            className="btn btn-primary w-100"
                                        >
                                            Report
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

export default Report;

const initialSelectedReasons = (categories: CategoryType[]) =>
    categories.map((item) => ({ category: item.id, reason: '' }));

const Success = ({ handleCloseModal }: { handleCloseModal: () => void }) => {
    return (
        <>
            <div className="modal-header lt-modal-header">
                <h5 className="modal-title text-center fs-18 fw-700 w-100">
                    <span className="d-none">header</span>
                </h5>
            </div>
            <div className="modal-body lt-modal-body text-center">
                <i className="bi bi-check-circle lt-text-success-alt fs-68" />
                <br />
                <h1 className="fs-20 fw-700">Thank You!</h1>
                <p className="fs-14 fw-400 mb-3">Your feedback has been sent to OfferX.</p>
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
