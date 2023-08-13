import React from 'react';
import candidateAvatar from '../../../assets/img/avatar-grey.png';
import companyLogo from '../../../assets/img/logo.svg';
import moment from 'moment';

type Props = {
    avatar: string | null;
    candidatePage?: boolean;
    date?: Date;
    replys?: reply[];
    candidateName?: string;
    hasCandidate?: boolean;
    isMyProfile?: boolean;
};

type reply = {
    id?: string;
    companyReviewId?: string | null;
    candidateFirstName?: string;
    candidateId?: string | null;
    candidateLastName?: Date;
    replyText?: string;
    companyName?: string | null;
    date?: Date;
    offerId?: string | null;
};

const ReplyTypeList: React.FC<Props> = ({ replys, avatar, candidatePage, candidateName, isMyProfile }) => {
    return (
        <div>
            {replys?.map((item) => (
                <div className=" reply-div d-flex align-items-center" id="postedDiv">
                    <i className='bi bi-arrow-return-right lt-text-secondary fs-28'></i>
                    <div className="my-3 ms-3 review-card border-radius-8 w-100">
                        <div className='review-card-body'>
                            <div className="d-flex align-items-center">
                                <img
                                    src={avatar || (candidatePage ? companyLogo : candidateAvatar)}
                                    alt=""
                                    className="avatar avatar--xxss me-3"
                                />
                                <div className="flex-column">
                                    {!isMyProfile && <h3 className="lt-text-primary fs-14 fw-600 mb-0">{candidateName}</h3>}

                                    {isMyProfile && <h3 className="lt-text-primary fs-14 fw-600 mb-0">You</h3>}
                                    <span className="lt-text-secondary fs-12 fw-400">
                                        Replied {moment(item.date).fromNow()}
                                    </span>
                                </div>
                            </div>
                            <div className="w-100 mt-2 custom-padding-left">
                                <p className="fs-12">{item.replyText}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReplyTypeList;
