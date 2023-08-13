import React, { useCallback, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { routes } from '../routes/routes-names';
import emoji1 from '../../assets/img/emoji-1.png';
import emoji2 from '../../assets/img/emoji-2.png';
import emoji3 from '../../assets/img/emoji-3.png';
import emoji4 from '../../assets/img/emoji-4.png';
import emoji5 from '../../assets/img/emoji-5.png';
import mail from '../../assets/img/email.gif';
import { FeedbackExperienceEnum } from '../../types/offer';
import { arrayFromEnum } from '../../lib/utils/emun';
import { offerService } from '../../lib/api/offer';
import { OfferFormDataType } from './document';
import ShowPopUp from '../../components/custom-popup-alert';
import { RootState } from '../../redux';
import { useSelector } from 'react-redux';
import { UserType } from '../../types/auth';
import ApplicationFeedBackModal from '../room/components/AppFeedbackModal';
import { Button } from 'react-bootstrap';

type Props = {
    createdId: string;
    candidateName?: string;
    docValues: OfferFormDataType;
};

const ReleaseOfferSuccess: React.FC<Props> = ({ createdId, candidateName, docValues }) => {
    const { user } = useSelector((state: RootState) => state.user);
    const hasUser = user as UserType;
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const history = useHistory();
    const [feedbackOpen, setFeedbackOPen] = useState<boolean>();

    function handleCloseModal() {
        setFeedbackOPen(true)
        history.push(routes.pendingOffers)
           
        
    }

    return (
        <>
            <div className="congratulations-content">
                <div className="gif-background" />
                <div className="my-2 w-100">
                    <div className="m-auto">
                        <div className="card mt-3">
                            <div className="text-center">
                                <div className="lt-congratulation-bg2 mx-auto">
                                    <i className="bi bi-check-circle fs-68 lt-text-success-alt"></i>
                                </div>
                                <h1 className="fs-32 lt-text-primary-alt fw-700">Congratulations!</h1>
                                <div className="fs-28 fw-600">Offer letter has been released to {candidateName}</div>
                                <div className="fs-16 lt-text-secondary">
                                    for the position of <span className="lt-text-primary">{docValues.jobTitle}</span>,
                                    starting from
                                    <span className="lt-text-primary">
                                        {' '}
                                        {docValues.jobStartDate?.toLocaleString('en-in', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>

                                <hr className="my-4" />
                                <div className="row">
                                    <div className="col-lg-6 mx-auto">
                                        <div className="smile-rating">
                                            {hasUser.offerCount != 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleCloseModal()}
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#appFeedback"
                                                    className="btn btn-outline-primary outline-p-hover mt-3 me-3"
                                                    disabled={hasUser.offerCount == 0}
                                                  
                                                >
                                                    Provide Feedback
                                                </button>
                                            )}

                                            {hasUser.offerCount != 0 && (
                                                 <Button
                                                 type="button"
                                                 className="btn btn-primary mt-3"
                                                 onClick={() =>  history.push(routes.pendingOffers)}
                                             >
                                                 Return to home
                                             </Button>
                                            )}
                                             {hasUser.offerCount == 0 && (
                                                 <Button
                                                 type="button"
                                                 className="btn btn-primary mt-3"
                                                 data-bs-toggle="modal"
                                                 data-bs-target="#appFeedback"
                                                 onClick={() =>  history.push(routes.pendingOffers)}
                                             >
                                                 Return to home
                                             </Button>
                                            )}

                                          
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {feedbackOpen ? <ApplicationFeedBackModal /> : ''}
        </>
    );
};

export default ReleaseOfferSuccess;