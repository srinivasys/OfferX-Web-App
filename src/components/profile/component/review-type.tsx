import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { RootState } from '../../../redux';
import { UserRoleEnum, UserType } from '../../../types/auth';
import { ContractComplianceStateEnum, ReviewType } from '../../../types/review';
import { Rating } from 'react-simple-star-rating';

type Props = {
    contractComplianceState: ContractComplianceStateEnum | undefined;
    reviewType?: ReviewType | null;
    date?: Date;
    contractViolationReason?: string;
    rating?: number | null;
    reviewText?: string;
    text?: string | null;
    creatorId?: string | null;
    setActiveReviewId: (value: string) => void;
    setActiveJobTitle: (value: string) => void;
    setActiveJobStartDate: (value: Date | undefined) => void;
    setReviewTypeProfile: (value: number) => void;
    setEditMode: (value: boolean) => void;
    id?: string | null;
    jobTitle?: string | null;
    jobStartDate?: Date;
    title?: string;
    progressReview?: boolean;
    candidatePage?: boolean;
};

const ReviewTypeList: React.FC<Props> = ({
    contractComplianceState,
    progressReview,
    id,
    jobTitle,
    jobStartDate,
    title,
    setReviewTypeProfile,
    setEditMode,
    reviewType,
    date,
    contractViolationReason,
    rating,
    reviewText,
    text,
    creatorId,
    setActiveReviewId,
    setActiveJobTitle,
    setActiveJobStartDate,
    candidatePage,
}) => {
    const { user } = useSelector((state: RootState) => state.user);
    const hasUser = user as UserType;
    const hasCandidate = hasUser.role === UserRoleEnum.candidate;
    const [isEditReviewEnabled, setisEditReviewEnabled] = useState(false);

    return (
        <div>
            <div className="d-flex align-items-center justify-content-between mb-0">
                {!progressReview && (
                    <div className="w-100">
                        <div className='d-flex justify-content-between '>
                            <div>
                                {jobTitle && 
                                    <div className="fs-14 me-3 mb-1">Job title - <span className='fw-600'>{jobTitle}</span></div>                            
                                }

                                <div className="d-flex align-items-center mb-2">
                                    <div className="fs-14 fw-600 me-1 lt-text-primary-alt ox-review-value1">
                                        {Number(rating)}
                                    </div>
                                    <div className="fs-14 mb-1 lt-text-primary-alt">
                                        <Rating
                                            allowFraction={true}
                                            size={15}
                                            readonly={true}
                                            allowTitleTag={false}
                                            fillColor="#4EB6FF"
                                            initialValue={Number(rating)}
                                            transition={true}
                                            emptyColor="transparent"
                                            SVGstrokeColor="#4EB6FF"
                                            SVGstorkeWidth="1"
                                        />
                                    </div>
                                    <p className="fs-12 lt-text-secondary ms-2 mt-1">{moment(date).fromNow()}</p>
                                </div>
                            </div>
                            <div>
                                {contractComplianceState === ContractComplianceStateEnum.ContractViolation || (!progressReview && (
                                    <div className="lt-status lt-status-success lt-status-pill fs-12 px-2 py-1 mb-3">
                                        <i className="bi-check-circle"></i>{' '}
                                        {candidatePage ? 'Onboarded' : 'Offer Compliant'}
                                    </div>
                                ))}
                                {(contractComplianceState === ContractComplianceStateEnum.ContractCompliance && reviewType !== ReviewType.ProgressReview) || (!progressReview && (
                                    <div className="lt-status lt-status-error lt-text-error lt-status-pill fs-12 px-2 py-1 mb-3">
                                        <i className="bi-dash-circle"></i> {candidatePage ? 'Ghosted' : 'Offer Violated'}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
                {progressReview && (
                    <div className="d-flex align-items-center me-3 lt-text-primary-alt">
                        <span className="me-1 fw-600">{rating}</span>
                        <i className="bi-star-fill me-3 fs-14"></i>
                        <p className="fs-12 lt-text-secondary mb-0">{moment(date).format('DD MMM YYYY')}</p>
                    </div>
                )}
                {isEditReviewEnabled && (
                    <div className="flex-shrink-1">
                        {(hasUser.role === UserRoleEnum.candidate
                            ? creatorId === hasUser.id
                            : creatorId === hasUser.companyId) && (
                            <div className="dropdown">
                                <button
                                    className="dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="bi-three-dots fs-24"></i>
                                </button>
                                <ul className="dropdown-menu py-2 dropdown-alignment">
                                    <li>
                                        <button
                                            type="button"
                                            onClick={() => (
                                                setActiveReviewId(id ? id : ''),
                                                setReviewTypeProfile(reviewType ? reviewType : 0),
                                                setEditMode(true),
                                                setActiveJobTitle(jobTitle ? jobTitle : ''),
                                                setActiveJobStartDate(jobStartDate ? jobStartDate : undefined)
                                            )}
                                            className="dropdown-item fs-14"
                                            data-bs-toggle="modal"
                                            data-bs-target="#WriteReview"
                                        >
                                            <i className="bi bi-pencil"></i> Edit review
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            onClick={() => setActiveReviewId(id ? id : '')}
                                            className="dropdown-item fs-14"
                                            data-bs-toggle="modal"
                                            data-bs-target="#DeleteReview"
                                        >
                                            <i className="bi bi-trash"></i> Delete review
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="w-100">
                <p className={progressReview ? 'fs-12 ox-review-p text-red mb-3' : 'fs-12 ox-review-p'}>{text}</p>
                {contractViolationReason && (
                    <div className='d-none'>
                        <hr />
                        <div className="mb-2">
                            <div className="fs-14 fw-600">Reasons for contract violation:</div>
                            <p className="fs-12 mb-0">{contractViolationReason}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewTypeList;
