import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { object as objectYup, string as stringYup, number as numberYup, boolean as boolYup } from 'yup';
import { ContractComplianceStateEnum, ExistingReviewType, ReviewRequestType, ReviewType } from '../../types/review';
import useInitialErrors from '../../hooks/formik-initial-errors';
import getValue from 'lodash/get';
import { reviewService } from '../../lib/api/review';
import Context from '../../context/update';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { UserRoleEnum, UserType } from '../../types/auth';
import PageLoader from '../loader';
import ShowPopUp from '../custom-popup-alert';
import { getCandidateReviewTypeText, getReviewTypeText } from '../../lib/utils/dictionary';
import { Messages } from '../../lib/constants/messages';
import candidateReviewIcon from '../../assets/icons/candidate-review.svg';
import companyReviewIcon from '../../assets/icons/company-review.svg';
import exitReviewIcon from '../../assets/icons/exit-review.svg';
import onboardingReviewIcon from '../../assets/icons/onboarding-review.svg';
import { isExitReviewEnabled, isProgressReviewEnabled } from '../../lib/utils/reviews-config';
import { ReviewOfferType } from '../../types/offer';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { routes } from '../../containers/routes/routes-names';
import { Rating } from 'react-simple-star-rating';
import { toast } from 'react-toastify';

type Props = {
    offerId?: string;
    reviewId: string | null;
    reviewTypeList?: number[] | null;
    reviewTypeProfile?: number | undefined;
    candidate?: string;
    userId?: string;
    editModeModal?: boolean;
    reviewOffers?: ReviewOfferType[];
    isJobOfferdisabled: boolean;
    jobRole?: string;
    jobStartDate?: Date;
};

const ReviewModal: React.FC<Props> = ({
    offerId,
    reviewId,
    reviewTypeList,
    reviewTypeProfile,
    userId,
    editModeModal,
    reviewOffers,
    isJobOfferdisabled,
    jobRole,
    jobStartDate,
}) => {
    const { user } = useSelector((state: RootState) => state.user);
    const hasUser = user as UserType;
    const { updateOffersList, updateProfile, updateOffersCount } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [existingReview, setExistingReview] = useState<ExistingReviewType | undefined>();
    const [reviewType, setReviewType] = useState<ReviewType | undefined>(reviewTypeProfile);
    const [isViolate, setIsViolate] = useState<number>(0);
    const [rating, setRating] = useState(0);
    const [showReview, setShowReview] = useState<boolean>(false);
    const [success, setSuccess] = useState(false);
    const [reviewOfferId, setReviewOfferId] = useState<string | undefined>(
        reviewOffers != undefined && reviewOffers.length > 0 ? reviewOffers[0].offerId : undefined
    );
    useMemo(() => {
        editModeModal === true ? setShowReview(true) : setShowReview(false);
    }, [reviewTypeProfile, editModeModal]);

    const initialValues = useMemo(
        () => ({
            reviewText: (reviewId && existingReview?.reviewText) || '',
            stars: (reviewId && existingReview?.stars.value) || 0,
            contractComplianceState:
                (reviewId && existingReview?.contractComplianceState) || ContractComplianceStateEnum.ContractCompliance,
            contractViolationReason: (reviewId && existingReview?.contractViolationReason) || '',
            reviewType: (reviewId && existingReview?.reviewType) || 0,
            isTermsChecked: false,
            isUntruthfulChecked: false,
        }),
        [existingReview, reviewId, rating, isViolate]
    );

    const initialErrors = useInitialErrors(initialValues, getValidationSchema());

    function handleCloseModal() {
        setReviewType(undefined);
        setTimeout(() => {
            setSuccess(false);
            setRating(0);
            setIsViolate(0);
            setShowReview(!showReview);
        }, 400);
    }

    const submitForm = useCallback(
        async (values: ReviewRequestType) => {
            if (!user) return;
            let profanityresponse = await reviewService.checkProfanityFilter(
                values.contractViolationReason + ' ' + values.reviewText
            );

            if (profanityresponse.status === false) {
                try {
                    if (user.role === UserRoleEnum.manager) {
                        if (reviewId) {
                            await reviewService.editCandidate({
                                ...values,
                                candidateReviewId: reviewId,
                                reviewType: Number(reviewTypeProfile),
                            });
                        } else if (reviewOffers != undefined && reviewOffers.length > 0 && reviewOfferId != undefined) {
                            await reviewService.createCandidate({
                                ...values,
                                offerId: reviewOfferId,
                                reviewType: Number(reviewType) || Number(ReviewType.OnboardingReview),
                            });
                        } else if (offerId) {
                            await reviewService.createCandidate({
                                ...values,
                                offerId,
                                reviewType: Number(reviewType) || Number(ReviewType.OnboardingReview),
                            });
                        }
                    } else {
                        if (reviewId) {
                            await reviewService.editCompany({
                                ...values,
                                companyReviewId: reviewId,
                                reviewType: Number(reviewTypeProfile),
                            });
                        } else if (reviewOffers != undefined && reviewOffers.length > 0 && reviewOfferId != undefined) {
                            await reviewService.createCompany({
                                ...values,
                                offerId: reviewOfferId,
                                reviewType: Number(reviewType) || Number(ReviewType.OnboardingReview),
                            });
                        } else if (offerId) {
                            await reviewService.createCompany({
                                ...values,
                                offerId,
                                reviewType: Number(reviewType) || Number(ReviewType.OnboardingReview),
                            });
                        }
                    }
                    if (reviewId) {
                        setExistingReview({
                            ...values,
                            stars: { value: values.stars },
                            id: reviewId,
                            reviewType: reviewType || 0,
                        });
                    }
                    updateOffersList && updateOffersList();
                    updateProfile && updateProfile();
                    updateOffersCount && (await updateOffersCount());
                    setSuccess(true);
                    setIsViolate(0);
                    setRating(0);
                } catch (err: any) {
                }
            } else {
                setSuccess(false);
                toast.error('Use of foul/offensive words not allowed. Please rephrase your statement.');
            }
        },
        [updateOffersList, updateProfile, user, reviewId, offerId, reviewType, reviewOfferId]
    );

    useEffect(() => {
        reviewOffers != undefined && reviewOffers.length > 0
            ? setReviewOfferId(reviewOffers[0].offerId)
            : setReviewOfferId(undefined);

        if (!reviewId || !user) {
            setIsViolate(0);
            setRating(0);
            return;
        }
        (async function () {
            try {
                setLoading(true);
                if (user.role === UserRoleEnum.manager) {
                    const { resultObject } = await reviewService.getCandidate(reviewId);
                    setExistingReview(resultObject);
                    setIsViolate(resultObject?.contractComplianceState || 0);
                    setRating(resultObject?.stars.value || 0);
                } else {
                    const { resultObject } = await reviewService.getCompany(reviewId);
                    setExistingReview(resultObject);
                    setIsViolate(resultObject?.contractComplianceState || 0);
                    setRating(resultObject?.stars.value || 0);
                }
            } catch (err: any) {
            } finally {
                setLoading(false);
            }
        })();
    }, [reviewId, user, userId, reviewOffers, showReview]);

    const selectReview = (review: number) => {
        setReviewType(review);
    };
    const pendingRiview =
        (reviewType !== ReviewType.ProgressReview && reviewTypeProfile === undefined) ||
        (reviewTypeProfile !== ReviewType.ProgressReview && reviewTypeProfile !== undefined);
    const isOnboardReviewGiven = reviewTypeList?.includes(ReviewType.OnboardingReview);
    const isExitReviewGiven = reviewTypeList?.includes(ReviewType.ExitReview);

    return (
        <div
            className="modal fade"
            id="WriteReview"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-labelledby="WriteReviewLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered lt-modal-dialog-md lt-modal-lg-low">
                <div className="modal-content lt-modal-content">
                    {!success ? (
                        (isExitReviewEnabled || isProgressReviewEnabled) && !editModeModal && !showReview ? (
                            <>
                                <div className="modal-header lt-modal-header">
                                    <h5 className="modal-title text-center w-100 fw-700 fs-20" id="WriteReviewLabel">
                                        {reviewId ? 'Edit Your review ' : 'Select a review'}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        title="Close"
                                        onClick={() => handleCloseModal()}
                                    ></button>
                                </div>
                                <div className="modal-body lt-modal-body mt-4">
                                    <div className="alert alert-warning lt-text-warning mb-0 px-3 py-2">
                                        <span className="fs-12 fw-400">Note:</span>
                                        <ol className="mb-0 ps-2">
                                            <li className="fs-12 fw-400">
                                                Unparliamentary language and false accusations are prohibited.
                                            </li>
                                            <li className="fs-12 fw-400">
                                                Confidential information in reviews is prohibited.
                                            </li>
                                            <li className="fs-12 fw-400">
                                                Review cannot be edited and deleted once published.
                                            </li>
                                        </ol>
                                    </div>
                                    <ul className="list-group d-flex flex-column">
                                        <li className="d-flex align-items-center mb-3">
                                            <button
                                                className="ox-review-radio"
                                                onClick={() => selectReview(ReviewType.OnboardingReview)}
                                                disabled={isOnboardReviewGiven || isExitReviewGiven}
                                            >
                                                <i
                                                    className={`bi me-3 ${
                                                        reviewType === ReviewType.OnboardingReview
                                                            ? 'bi-record-circle lt-text-primary-alt'
                                                            : 'bi-circle'
                                                    }`}
                                                ></i>
                                            </button>
                                            <button
                                                className={`btn p-3 w-100 text-start ${
                                                    reviewType === ReviewType.OnboardingReview
                                                        ? 'btn-outline-primary'
                                                        : 'btn-outline-secondary'
                                                } ox-review-button`}
                                                onClick={() => selectReview(ReviewType.OnboardingReview)}
                                                disabled={isOnboardReviewGiven || isExitReviewGiven}
                                            >
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <div className="me-2">
                                                            <img src={onboardingReviewIcon} alt="" />
                                                        </div>
                                                        <div>
                                                            Onboarding review
                                                            <p className="fs-12 fw-400">
                                                                You can write onboarding review only once
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <i className="bi bi-info-circle lt-tooltip">
                                                            <span className="lt-tooltiptext lt-shadow-md fw-400 fs-14 bottom-tip">
                                                                {hasUser.role === UserRoleEnum.manager
                                                                    ? `Feedback on candidate's conduct during the onboarding process.`
                                                                    : `Feedback on your experience with the employer during the onboarding process.`}
                                                            </span>
                                                        </i>
                                                    </div>
                                                </div>
                                            </button>
                                        </li>
                                        {isProgressReviewEnabled && (
                                            <li className="d-flex align-items-center mb-3">
                                                <button
                                                    className="ox-review-radio"
                                                    onClick={() => selectReview(ReviewType.ProgressReview)}
                                                    disabled={isExitReviewGiven}
                                                >
                                                    <i
                                                        className={`bi me-3 ${
                                                            reviewType === ReviewType.ProgressReview
                                                                ? 'bi-record-circle lt-text-primary-alt'
                                                                : 'bi-circle'
                                                        }`}
                                                    ></i>
                                                </button>
                                                <button
                                                    className={`btn w-100 p-3 text-start ${
                                                        reviewType === ReviewType.ProgressReview
                                                            ? 'btn-outline-primary'
                                                            : 'btn-outline-secondary'
                                                    } ox-review-button`}
                                                    onClick={() => selectReview(ReviewType.ProgressReview)}
                                                    disabled={isExitReviewGiven}
                                                >
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center">
                                                            <div className="me-2">
                                                                <img
                                                                    src={
                                                                        hasUser.role === UserRoleEnum.manager
                                                                            ? candidateReviewIcon
                                                                            : companyReviewIcon
                                                                    }
                                                                    alt=""
                                                                />
                                                            </div>
                                                            <div>
                                                                {hasUser.role === UserRoleEnum.manager
                                                                    ? 'Performance'
                                                                    : 'Employment'}{' '}
                                                                review{' '}
                                                                {/* <p className='fs-14 fw-400'>{hasUser.role === UserRoleEnum.manager ? 'Share your candidate&apos;s progress till now.' : 'Share your experience with employer till now.'} </p> */}
                                                                <p className="fs-12 fw-400">
                                                                    You can write{' '}
                                                                    {hasUser.role === UserRoleEnum.manager
                                                                        ? 'performance'
                                                                        : 'employment'}{' '}
                                                                    review multiple times
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <i className="bi bi-info-circle lt-tooltip">
                                                                <span className="lt-tooltiptext lt-shadow-md fw-400 fs-14 bottom-tip">
                                                                    {hasUser.role === UserRoleEnum.manager
                                                                        ? `Feedback on candidate's performance during their employment tenure.`
                                                                        : `Feedback on your experience with the employer during your tenure.`}
                                                                </span>
                                                            </i>
                                                        </div>
                                                    </div>
                                                </button>
                                            </li>
                                        )}
                                        {isExitReviewEnabled && (
                                            <li className="d-flex align-items-center mb-3">
                                                <button
                                                    className="ox-review-radio"
                                                    onClick={() => selectReview(ReviewType.ExitReview)}
                                                    disabled={isExitReviewGiven}
                                                >
                                                    <i
                                                        className={`bi me-3 ${
                                                            reviewType === ReviewType.ExitReview
                                                                ? 'bi-record-circle lt-text-primary-alt'
                                                                : 'bi-circle'
                                                        }`}
                                                    ></i>
                                                </button>
                                                <button
                                                    className={`btn w-100 p-3 text-start ${
                                                        reviewType === ReviewType.ExitReview
                                                            ? 'btn-outline-primary'
                                                            : 'btn-outline-secondary'
                                                    } ox-review-button`}
                                                    onClick={() => selectReview(ReviewType.ExitReview)}
                                                    disabled={isExitReviewGiven}
                                                >
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center">
                                                            <div className="me-2">
                                                                <img src={exitReviewIcon} alt="" />
                                                            </div>
                                                            <div>
                                                                Exit review{' '}
                                                                {/* <p className='fs-14 fw-400'>Share your last words about {hasUser.role === UserRoleEnum.manager ? 'candidate' : 'employer'} before you leave.</p> */}
                                                                <p className="fs-12 fw-400 text">
                                                                    {isOnboardReviewGiven || isExitReviewGiven
                                                                        ? 'You can write exit review only once.'
                                                                        : `Onboarding and ${
                                                                              hasUser.role === UserRoleEnum.manager
                                                                                  ? 'performance'
                                                                                  : 'employment'
                                                                          } reviews can't be written when exit review has been written.`}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <i className="bi bi-info-circle lt-tooltip">
                                                                <span className="lt-tooltiptext lt-shadow-md fw-400 fs-14 bottom-tip">
                                                                    {hasUser.role === UserRoleEnum.manager
                                                                        ? `Feedback on candidate's conduct during the exit process.`
                                                                        : `Feedback on your experience with the employer during the exit process.`}
                                                                </span>
                                                            </i>
                                                        </div>
                                                    </div>
                                                </button>
                                            </li>
                                        )}
                                        {/* {reviewType === ReviewType.ExitReview && <span className="alert alert-info lt-text-info mb-3 px-3 py-2 ox-review-info">
                                        <span className='fs-12 fw-400'><i className='bi bi-info-circle'></i> {(onboardDisabled === ReviewType.OnboardingReview || exitDisabled === ReviewType.ExitReview) ? 'You can write exit review only once.' : 'Once you write exit review, onboarding & performance reviews cannot be written.'} </span>
                                    </span> } */}
                                    </ul>
                                </div>
                                <div className="modal-footer lt-modal-footer">
                                    <div className="d-flex w-100 m-0 pt-3">
                                        <div className="col pe-2">
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary outline-p-hover w-100"
                                                data-bs-dismiss="modal"
                                                onClick={() => (setReviewType(undefined), setIsViolate(0))}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                        <div className="col ps-2">
                                            <button
                                                disabled={
                                                    reviewType || reviewType === ReviewType.OnboardingReview
                                                        ? false
                                                        : true
                                                }
                                                onClick={() => setShowReview(!showReview)}
                                                className="btn btn-primary w-100"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Formik
                                onSubmit={submitForm}
                                enableReinitialize
                                initialValues={initialValues}
                                validationSchema={getValidationSchema()}
                                initialErrors={initialErrors}
                            >
                                {(formikProps: FormikProps<ReviewRequestType>) => {
                                    const { handleSubmit, isSubmitting, setFieldTouched, setFieldValue, resetForm } =
                                        formikProps;

                                    return (
                                        <form onSubmit={handleSubmit}>
                                            <div className="modal-header lt-modal-header">
                                                <h5
                                                    className="modal-title text-center w-100 fw-700 fs-20"
                                                    id="WriteReviewLabel"
                                                >
                                                    {reviewId !== null
                                                        ? `Edit ${
                                                              hasUser.role === UserRoleEnum.manager
                                                                  ? getReviewTypeText(reviewTypeProfile || 0)
                                                                  : getCandidateReviewTypeText(reviewTypeProfile || 0)
                                                          }`
                                                        : hasUser.role === UserRoleEnum.manager
                                                        ? getReviewTypeText(reviewType || 0)
                                                        : getCandidateReviewTypeText(reviewType || 0)}
                                                </h5>
                                                <button
                                                    type="button"
                                                    onClick={() => (handleCloseModal(), resetForm())}
                                                    className="btn-close"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close"
                                                />
                                            </div>
                                            {loading ? (
                                                <PageLoader />
                                            ) : (
                                                <div className="modal-body lt-modal-body my-3 review-modal">
                                                    {!isProgressReviewEnabled && !isExitReviewEnabled && (
                                                        <div className="alert alert-warning lt-text-warning mb-3 px-3 py-2">
                                                            <span className="fs-12 fw-400">Note:</span>
                                                            <ol className="mb-0 ps-2">
                                                                <li className="fs-12 fw-400">
                                                                    Unparliamentary language and false accusations are
                                                                    prohibited.
                                                                </li>
                                                                <li className="fs-12 fw-400">
                                                                    Confidential information in reviews is prohibited.
                                                                </li>
                                                                <li className="fs-12 fw-400">
                                                                    Review cannot be edited and deleted once published.
                                                                </li>
                                                                <li className="fs-12 fw-400">
                                                                    Your account will be suspended if OfferX found your
                                                                    review untruthful.
                                                                </li>
                                                            </ol>
                                                        </div>
                                                    )}
                                                    {pendingRiview ? (
                                                        <>
                                                            <div className="mb-3">
                                                                <p className="my-2 fs-14 fw-600">
                                                                    Job offer
                                                                    <small className="text-danger"> *</small>
                                                                </p>
                                                                {reviewOffers != undefined &&
                                                                    reviewOffers?.length > 0 &&
                                                                    (reviewOffers?.length == 1 ? (
                                                                        <label className="form">
                                                                            {reviewOffers[0].jobRole +
                                                                                ' (Start date:  ' +
                                                                                moment(
                                                                                    reviewOffers[0].jobStartDate
                                                                                ).format('DD MMM YYYY') +
                                                                                ')'}
                                                                        </label>
                                                                    ) : (
                                                                        <select
                                                                            className="form-select"
                                                                            onChange={(event) => {
                                                                                setReviewOfferId(event.target.value);
                                                                            }}
                                                                        >
                                                                            {reviewOffers.map((offer, index) => (
                                                                                <option
                                                                                    key={offer.offerId}
                                                                                    value={offer.offerId}
                                                                                    selected={
                                                                                        index == 0 ? true : undefined
                                                                                    }
                                                                                >
                                                                                    {offer.jobRole +
                                                                                        ' (Start date: ' +
                                                                                        moment(
                                                                                            offer.jobStartDate
                                                                                        ).format('DD MMM YYYY') +
                                                                                        ')'}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    ))}

                                                                {isJobOfferdisabled && (
                                                                    <label className="form">
                                                                        <option key={offerId} value={offerId}>
                                                                            {jobRole +
                                                                                ' (Start date: ' +
                                                                                moment(jobStartDate).format(
                                                                                    'DD MMM YYYY'
                                                                                ) +
                                                                                ')'}
                                                                        </option>
                                                                    </label>
                                                                )}
                                                            </div>
                                                            {hasUser.role === UserRoleEnum.manager ? (
                                                                <p className="my-2 fs-14 fw-600">
                                                                    What is the candidate's onboarding status post
                                                                    accepting the job offer?
                                                                </p>
                                                            ) : (
                                                                <p className="my-2 fs-14 fw-600">
                                                                    Did the employer violate the offer terms?
                                                                </p>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <p className="my-1 fs-14 fw-600">
                                                            {hasUser.role === UserRoleEnum.manager ? (
                                                                <>
                                                                    {' '}
                                                                    Rate your working experience with candidate during
                                                                    their tenure?{' '}
                                                                    <small className="text-danger">*</small>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Rate your experience with employer during your
                                                                    tenure? <small className="text-danger">*</small>
                                                                </>
                                                            )}
                                                        </p>
                                                    )}
                                                    {pendingRiview && (
                                                        <Field name="contractComplianceState">
                                                            {(fieldProps: FieldProps) => {
                                                                const { field } = fieldProps;
                                                                return (
                                                                    <>
                                                                        <div className="form-check form-check-inline mb-0">
                                                                            <input
                                                                                className="form-check-input review-input"
                                                                                type="radio"
                                                                                name="inlineRadioOptions"
                                                                                id="YesRadio"
                                                                                checked={
                                                                                    field.value ===
                                                                                    ContractComplianceStateEnum.ContractViolation
                                                                                }
                                                                                onChange={() => {
                                                                                    setFieldTouched(field.name);
                                                                                    setIsViolate(1);
                                                                                    setFieldValue(
                                                                                        field.name,
                                                                                        ContractComplianceStateEnum.ContractViolation
                                                                                    );
                                                                                }}
                                                                            />
                                                                            <label
                                                                                className="form-check-label"
                                                                                htmlFor="YesRadio"
                                                                            >
                                                                                {hasUser.role === UserRoleEnum.manager
                                                                                    ? 'Ghosted'
                                                                                    : 'Yes'}
                                                                            </label>
                                                                        </div>
                                                                        <div className="form-check form-check-inline mb-0">
                                                                            <input
                                                                                className="form-check-input review-input"
                                                                                type="radio"
                                                                                name="inlineRadioOptions"
                                                                                id="NoRadio"
                                                                                checked={
                                                                                    field.value ===
                                                                                    ContractComplianceStateEnum.ContractCompliance
                                                                                }
                                                                                onChange={() => {
                                                                                    setFieldTouched(field.name);
                                                                                    setFieldValue(
                                                                                        field.name,
                                                                                        ContractComplianceStateEnum.ContractCompliance
                                                                                    );
                                                                                    setFieldValue(
                                                                                        'contractViolationReason',
                                                                                        ''
                                                                                    );
                                                                                    setIsViolate(0);
                                                                                }}
                                                                            />
                                                                            <label
                                                                                className="form-check-label"
                                                                                htmlFor="NoRadio"
                                                                            >
                                                                                {hasUser.role === UserRoleEnum.manager
                                                                                    ? 'Onboarded'
                                                                                    : 'No'}
                                                                            </label>
                                                                        </div>
                                                                        {/* {field.value !==
                                                                            ContractComplianceStateEnum.ContractCompliance && (
                                                                            <Field name="contractViolationReason">
                                                                                {(fieldProps: FieldProps) => {
                                                                                    const { field, form } = fieldProps;
                                                                                    const error =
                                                                                        getValue(
                                                                                            form.touched,
                                                                                            field.name
                                                                                        ) &&
                                                                                        getValue(
                                                                                            form.errors,
                                                                                            field.name
                                                                                        );
                                                                                    return (
                                                                                        <>
                                                                                            <div className="position-relative">
                                                                                                <textarea
                                                                                                    rows={6}
                                                                                                    maxLength={250}
                                                                                                    value={field.value}
                                                                                                    onChange={(ev) => {
                                                                                                        setFieldTouched(
                                                                                                            field.name
                                                                                                        );
                                                                                                        setFieldValue(
                                                                                                            field.name,
                                                                                                            ev.target
                                                                                                                .value
                                                                                                        );
                                                                                                    }}
                                                                                                    className="form-control mt-2 mb-0"
                                                                                                    placeholder={`If yes please describe your experience as it will help others to know about the ${
                                                                                                        hasUser.role ===
                                                                                                        UserRoleEnum.manager
                                                                                                            ? 'candidate'
                                                                                                            : 'employer'
                                                                                                    }.`}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="d-flex justify-content-between">
                                                                                                <small className="text-danger mt-2">
                                                                                                    {error}
                                                                                                </small>
                                                                                                <span className="mt-2 fs-14">
                                                                                                    {field.value.length}
                                                                                                    /250
                                                                                                </span>
                                                                                            </div>
                                                                                        </>
                                                                                    );
                                                                                }}
                                                                            </Field>
                                                                        )} */}
                                                                    </>
                                                                );
                                                            }}
                                                        </Field>
                                                    )}

                                                    {/* {pendingRiview && <p className="my-2 fs-14 fw-600 ">
                                                    How was the overall experience with {hasUser.role === UserRoleEnum.manager ? 'candidate' : 'employer'} throughout the offer process? <small className="text-danger">*</small>
                                                </p>}  */}
                                                    {((reviewType === ReviewType.OnboardingReview &&
                                                        reviewTypeProfile === undefined) ||
                                                        (reviewTypeProfile === ReviewType.OnboardingReview &&
                                                            reviewTypeProfile !== undefined)) && (
                                                        <p className="mb-1 fs-14 fw-600 mt-3">
                                                            Rate your experience with the{' '}
                                                            {hasUser.role === UserRoleEnum.manager
                                                                ? 'candidate'
                                                                : 'employer'}{' '}
                                                            during the onboarding process{' '}
                                                            <small className="text-danger">*</small>
                                                        </p>
                                                    )}
                                                    {((reviewType === ReviewType.ExitReview &&
                                                        reviewTypeProfile === undefined) ||
                                                        (reviewTypeProfile === ReviewType.ExitReview &&
                                                            reviewTypeProfile !== undefined)) && (
                                                        <p className="mb-1 fs-14 fw-600 mt-3">
                                                            Rate your experience with{' '}
                                                            {hasUser.role === UserRoleEnum.manager
                                                                ? 'candidate'
                                                                : 'employer'}{' '}
                                                            during the offboarding process?{' '}
                                                            <small className="text-danger">*</small>
                                                        </p>
                                                    )}
                                                    <Field name="stars">
                                                        {(fieldProps: FieldProps) => {
                                                            const { field, form } = fieldProps;
                                                            const error =
                                                                getValue(form.touched, field.name) &&
                                                                getValue(form.errors, field.name);
                                                            return (
                                                                <div className="mb-1">
                                                                    <Rating
                                                                        onClick={(rate) =>
                                                                            setTimeout(() => {
                                                                                setRating(rate);
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(field.name, rate);
                                                                            }, 200)
                                                                        }
                                                                        allowFraction={true}
                                                                        size={25}
                                                                        fillColor="#4EB6FF"
                                                                        initialValue={rating}
                                                                        transition={true}
                                                                        emptyColor="transparent"
                                                                        SVGstrokeColor="#4EB6FF"
                                                                        SVGstorkeWidth="1"
                                                                    />
                                                                    <div>
                                                                        <small className="text-danger">{error}</small>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }}
                                                    </Field>

                                                    {((isViolate === ContractComplianceStateEnum.ContractViolation &&
                                                        reviewType !== ReviewType.ProgressReview &&
                                                        rating > 3) ||
                                                        (isViolate === ContractComplianceStateEnum.ContractCompliance &&
                                                            rating >= 1 &&
                                                            rating <= 2)) && (
                                                        <div className="my-1 py-2 warning-text">
                                                            <span className="fs-12 fw-400 d-flex">
                                                                <i className="bi bi-info-circle"></i>
                                                                <span>{Messages.ReviewWarning}</span>
                                                            </span>
                                                        </div>
                                                    )}
                                                    <Field name="reviewText">
                                                        {(fieldProps: FieldProps) => {
                                                            const { field, form } = fieldProps;
                                                            const error =
                                                                getValue(form.touched, field.name) &&
                                                                getValue(form.errors, field.name);
                                                            return (
                                                                <>
                                                                    <div className="position-relative">
                                                                        <textarea
                                                                            className={`${
                                                                                pendingRiview ? '' : 'mt-2'
                                                                            } form-control mt-2`}
                                                                            rows={6}
                                                                            maxLength={250}
                                                                            value={field.value}
                                                                            onChange={(ev) => {
                                                                                setFieldTouched(field.name);
                                                                                setFieldValue(
                                                                                    field.name,
                                                                                    ev.target.value
                                                                                );
                                                                            }}
                                                                            placeholder={
                                                                                reviewType ===
                                                                                    ReviewType.OnboardingReview ||
                                                                                reviewTypeProfile ===
                                                                                    ReviewType.OnboardingReview
                                                                                    ? `Share your feedback on the ${
                                                                                          hasUser.role ===
                                                                                          UserRoleEnum.manager
                                                                                              ? 'candidate'
                                                                                              : 'employer'
                                                                                      }`
                                                                                    : reviewType ===
                                                                                          ReviewType.ProgressReview ||
                                                                                      reviewTypeProfile ===
                                                                                          ReviewType.ProgressReview
                                                                                    ? `Describe your experience with the ${
                                                                                          hasUser.role ===
                                                                                          UserRoleEnum.manager
                                                                                              ? 'candidate'
                                                                                              : 'employer'
                                                                                      } during their tenure`
                                                                                    : `Describe your experience with the ${
                                                                                          hasUser.role ===
                                                                                          UserRoleEnum.manager
                                                                                              ? 'candidate'
                                                                                              : 'employer'
                                                                                      } during the offboarding process`
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div className="d-flex justify-content-between">
                                                                        <small className="text-danger mt-2">
                                                                            {error}
                                                                        </small>
                                                                        <span className="mt-2 fs-14">
                                                                            {field.value.length}/250
                                                                        </span>
                                                                    </div>
                                                                </>
                                                            );
                                                        }}
                                                    </Field>

                                                    <div className="w-100 m-auto mt-0">
                                                        {/* <div className="form-check mb-2">
                                                            <Field
                                                                className="form-check-input"
                                                                name="isTermsChecked"
                                                                type="checkbox"
                                                                id="check"
                                                            ></Field>
                                                            <label className="form-check-label fs-13 mt-1">
                                                            I confirm that the following review is truthful and accurate to the best of my knowledge.
                                                                <Link
                                                                    className="text-decoration-none"
                                                                    target="_blank"
                                                                    to={`${routes.terms}#Item-18`}
                                                                >
                                                                    Terms & Conditions.
                                                                </Link>{' '}
                                                            </label>
                                                            <Field name="isTermsChecked">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <div>
                                                                            <small className="text-danger">
                                                                                {error}
                                                                            </small>
                                                                        </div>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div> */}

                                                        <div className="form-check mb-2">
                                                            <Field
                                                                className="form-check-input"
                                                                name="isUntruthfulChecked"
                                                                type="checkbox"
                                                                id="check"
                                                            ></Field>
                                                            <label className="form-check-label fs-13 mt-1">
                                                                I confirm that the following review is truthful and
                                                                accurate to the best of my knowledge.
                                                            </label>
                                                            <Field name="isUntruthfulChecked">
                                                                {(fieldProps: FieldProps) => {
                                                                    const { field, form } = fieldProps;
                                                                    const error =
                                                                        getValue(form.touched, field.name) &&
                                                                        getValue(form.errors, field.name);
                                                                    return (
                                                                        <>
                                                                            <div>
                                                                                <small className="text-danger">
                                                                                    {error}
                                                                                </small>
                                                                            </div>
                                                                        </>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="modal-footer lt-modal-footer">
                                                <div className="d-flex w-100 m-0 pt-0">
                                                    <div className="col pe-2">
                                                        {reviewTypeProfile !== undefined ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => (handleCloseModal(), resetForm())}
                                                                className="btn btn-outline-primary outline-p-hover w-100"
                                                                data-bs-dismiss="modal"
                                                                aria-label="Close"
                                                            >
                                                                Close{' '}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-primary outline-p-hover w-100"
                                                                onClick={() => (
                                                                    resetForm(),
                                                                    setShowReview(!showReview),
                                                                    setIsViolate(0)
                                                                )}
                                                            >
                                                                Back
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="col ps-2">
                                                        {isSubmitting && (
                                                            <div className="new-spinner p-absolute">
                                                                <div>
                                                                    <span className="spinner-border spinner-border-sm custom-spinner-border" />
                                                                </div>
                                                                <p className="fs-14 custom-loading-text">Loading</p>
                                                            </div>
                                                        )}
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary w-100"
                                                            disabled={isSubmitting}
                                                        >
                                                            {reviewId ? 'Update' : 'Submit'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    );
                                }}
                            </Formik>
                        )
                    ) : (
                        <ShowPopUp
                            handleCloseModal={handleCloseModal}
                            headerText="Success"
                            text={reviewId ? 'Your review has been updated.' : 'Your review has been submitted.'}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;

const getValidationSchema = () =>
    objectYup().shape({
        reviewText: stringYup()
            .required('Feedback is required and must be at least 3 characters.')
            .min(3, 'Description should be at least 3 characters.'),
        stars: numberYup().min(1, 'Rating is required.'),
        // contractViolationReason: stringYup().when('contractComplianceState', {
        //     is: (contractComplianceState: any) =>
        //         contractComplianceState === ContractComplianceStateEnum.ContractViolation,
        //     then: stringYup().required('Required field.').min(3, 'Description should be atleast 3 characters.'),
        // }),
        // isTermsChecked: boolYup().oneOf([true], 'Required field.'),
        isUntruthfulChecked: boolYup().oneOf([true], 'Please select this checkbox to submit the review.'),
    });
