import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { object as objectYup, string as stringYup, number as numberYup, boolean as boolYup } from 'yup';
import Context from '../../../context/update';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import { UserRoleEnum, UserType } from '../../../types/auth';
import emoji1 from '../../../assets/img/emoji-1.png';
import emoji2 from '../../../assets/img/emoji-2.png';
import emoji3 from '../../../assets/img/emoji-3.png';
import emoji4 from '../../../assets/img/emoji-4.png';
import emoji5 from '../../../assets/img/emoji-5.png';
import { FeedbackExperienceEnum, FeedbackRecommendationEnum } from '../../../types/offer';
import { arrayFromEnum } from '../../../lib/utils/emun';
import { offerService } from '../../../lib/api/offer';
import ShowPopUp from '../../../components/custom-popup-alert';
import { ExperienceLevelEnum } from '../../../lib/constants/constants';

type Props = {};

const ApplicationFeedBackModal: React.FC<Props> = ({}) => {
    const { user } = useSelector((state: RootState) => state.user);
    const [feedbackExperience, setFeedbackExperience] = useState<FeedbackExperienceEnum | null>(null);
    const [feedbackRecommendation, setFeedbackRecommendation] = useState<FeedbackRecommendationEnum | null>(null);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [fireError, setFireError] = useState(false);

    const submit = async () => {
        try {
            setFeedbackLoading(true);
            if ((feedbackExperience === 0 || feedbackExperience === 1) && message === '') {
                setShowError(true);
                setFireError(true);
            } else {
                await offerService.feedback({
                    offerId: null,
                    feedbackExperience: feedbackExperience,
                    FeedbackRecommendation: feedbackRecommendation,
                    text: message,
                });
                setSuccess(true);
                setMessage('');
                setFeedbackExperience(null);
                setFeedbackRecommendation(null);
            }
        } catch (err: any) {
            console.log(err);
        } finally {
            setFeedbackLoading(false);
        }
    };

    function handleCloseModal() {
        setSuccess(false);
        setMessage('');
        setFireError(false);
        setFeedbackExperience(null);
        setFeedbackRecommendation(null);
    }

    const feedbackHandler = (target: any) => {
        setMessage(target.value);

        if (message === '') {
            setShowError(true);
            setFireError(true);
        } else {
            return;
        }
    };

    useEffect(() => {
        if (message.length > 0) {
            setShowError(false);
        } else if (message === '') {
            setShowError(false);
        } else {
            setShowError(true);
        }

        setFeedbackRecommendation(feedbackRecommendation);

        if ((feedbackExperience === 0 || feedbackExperience === 1) && message === '') {
            setShowError(true);
        } else {
            return;
        }
    }, [message, feedbackExperience, feedbackRecommendation]);

    return (
        <div
            className="modal fade"
            id="appFeedback"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-labelledby="appFeedbackLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered feedback-modal-width">
                <div className="modal-content lt-modal-content">
                    {!success ? (
                        <>
                            {feedbackLoading && <div className='new-spinner p-absolute'><div><span className="spinner-border spinner-border-sm custom-spinner-border" /></div><p className='fs-14 custom-loading-text'>Loading</p></div>}
                            <div className="modal-header lt-modal-header">
                                <h5 className="modal-title w-100 fs-20 fw-700 mb-4" id="appFeedbackLabel">
                                    Share your experience
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    title="Close"
                                    aria-label="Close"
                                    onClick={() => handleCloseModal()}
                                    style={{ top: '-30px', right: '-13px' }}
                                />
                            </div>
                            <div className="modal-body lt-modal-body">
                                <div className="smile-rating">
                                    <div className="d-flex justify-content-center lt-rating-icons mb-4">
                                        {arrayFromEnum(FeedbackExperienceEnum).map((item) => (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (feedbackExperience === item) {
                                                        setFeedbackExperience(null);
                                                    } else {
                                                        setFeedbackExperience(item);
                                                    }
                                                }}
                                                key={item}
                                                className={`text-center smile-rating-img ${
                                                    feedbackExperience === item ? 'active' : ''
                                                }`}
                                            >
                                                <img src={getFeedbackItem(item).image} alt="img" />
                                                <div className="fs-12 rating-value">{getFeedbackItem(item).label}</div>
                                            </button>
                                        ))}
                                    </div>
                                    <p className="my-2 fs-12 fw-600">
                                        How likely you recommend OfferX to your friends or colleagues?
                                    </p>
                                    <div className="d-flex justify-content-center lt-rating-icons">
                                        {arrayFromEnum(FeedbackRecommendationEnum).map((item) => (
                                            <div className="form-check form-check-inline mb-0 fs-12">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    checked={feedbackRecommendation === item ? true : false}
                                                    name="inlineRadioOptions"
                                                    id={'#FresherRadio' + item}
                                                    onChange={() => {
                                                        setFeedbackRecommendation(item);
                                                    }}
                                                />
                                                <label className="form-check-label" htmlFor={'#FresherRadio' + item}>
                                                    {getFeedbackReccomendationItem(item).label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="position-relative">
                                        <p className="my-2 fs-12 fw-600">Tell us how we can improve</p>
                                        <textarea
                                            className="form-control lt-form-control mt-2"
                                            onChange={({ target }) => feedbackHandler(target)}
                                            rows={6}
                                            maxLength={250}
                                            placeholder="Share your feedback and suggest us new features"
                                            value={message}
                                        />
                                        <div className="container">
                                            <div className="row">
                                                <div className="col p-0">
                                                    {showError && showError && fireError ? (
                                                        <span className="text-danger fs-13">
                                                            Please describe your experience.
                                                        </span>
                                                    ) : (
                                                        <span>{null}</span>
                                                    )}
                                                </div>
                                                <div className="col">
                                                    {' '}
                                                    <span className="d-flex justify-content-end mt-2 fs-12">
                                                        {message.length}/250
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-primary mt-3 me-3 w-100"
                                        onClick={submit}
                                        disabled={
                                            (feedbackExperience === null &&
                                                feedbackRecommendation === null &&
                                                !message) ||
                                            feedbackLoading
                                        }
                                    >
                                        Submit feedback
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <ShowPopUp
                            handleCloseModal={() => {
                                handleCloseModal();
                                setFeedbackRecommendation(null);
                            }}
                            headerText="Success"
                            text={'Your feedback is submitted'}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationFeedBackModal;

export const getFeedbackReccomendationItem = (value: FeedbackRecommendationEnum) => {
    switch (value) {
        case FeedbackRecommendationEnum.VeryUnlikely:
            return { image: emoji1, label: 'Very Unlikely' };
        case FeedbackRecommendationEnum.SomeWhatUnlikely:
            return { image: emoji2, label: 'Some what unlikely' };
        case FeedbackRecommendationEnum.Neutral:
            return { image: emoji3, label: 'Neutral' };
        case FeedbackRecommendationEnum.SomeWhatlikely:
            return { image: emoji4, label: 'Some What likely' };
        case FeedbackRecommendationEnum.VeryLikely:
            return { image: emoji5, label: 'Very Likely' };
        default:
            return { image: '', label: '' };
    }
};

export const getFeedbackItem = (value: FeedbackExperienceEnum) => {
    switch (value) {
        case FeedbackExperienceEnum.VeryBad:
            return { image: emoji1, label: 'Awful' };
        case FeedbackExperienceEnum.Bad:
            return { image: emoji2, label: 'Bad' };
        case FeedbackExperienceEnum.Average:
            return { image: emoji3, label: 'Average' };
        case FeedbackExperienceEnum.Good:
            return { image: emoji4, label: 'Good' };
        case FeedbackExperienceEnum.Excellent:
            return { image: emoji5, label: 'Excellent' };
        default:
            return { image: '', label: '' };
    }
};
