import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { RootState } from '../../redux';
import { UserRoleEnum, UserType } from '../../types/auth';
import { ContractComplianceStateEnum, ReviewType } from '../../types/review';
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
    id?: string | null;
    title?: string;
    progressReview?: boolean;
};

const ReviewTypeProfile: React.FC<Props> = ({
    contractComplianceState,
    progressReview,
    id,
    title,
    reviewType,
    date,
    contractViolationReason,
    rating,
    reviewText,
    text,
    creatorId,
}) => {
    const { user } = useSelector((state: RootState) => state.user);
    const hasUser = user as UserType;
    const hasCandidate = hasUser.role === UserRoleEnum.candidate;

    return (
        <div className="d-flex justify-content-between review-border-bottom">
            <div>
                <div className={`lt-status lt-text-primary-alt fw-600 fw-14 ps-0 pe-2`}>{title}</div>
                {(contractComplianceState === ContractComplianceStateEnum.ContractCompliance &&
                    reviewType !== ReviewType.ProgressReview) ||
                    (!progressReview && (
                        <div className={`lt-status lt-status-success rounded-pill fw-600 fs-12`}>
                            Contract compliance
                        </div>
                    ))}
                {contractComplianceState === ContractComplianceStateEnum.ContractViolation ||
                    (!progressReview && (
                        <div className="lt-status lt-status-error lt-text-error rounded-pill fw-600 fs-12">
                            Contract violation
                        </div>
                    ))}
                <div className="mb-2 d-flex align-items-center">
                    <span className="fs-12"> {moment(date).format('DD MMM YYYY')} </span>{' '}
                    <i className="bi bi-dot fs-18 me-0"></i>{' '}
                    <span className="fs-12"> {moment(date).format(' hh:mm A')} </span>
                </div>

                {contractViolationReason && (
                    <>
                        <div className="fs-14 fw-600 ">Reasons for contract violation:</div>
                        <p className="fs-14 mb-3">{contractViolationReason}</p>
                    </>
                )}
                <div className="fs-14 fw-600">Overall experience:</div>
                <div className="my-2 ms-0 d-flex align-items-center">
                    <Rating
                        allowFraction={true}
                        size={21}
                        fillColor="#4EB6FF"
                        initialValue={Number(rating)}
                        transition={true}
                        emptyColor="transparent"
                        SVGstrokeColor="#4EB6FF"
                        SVGstorkeWidth="1"
                        readonly={true}
                        allowTitleTag={false}
                    />
                    <span className="fw-600 fs-14 ms-2 pt-1">{rating} out of 5 stars</span>
                </div>

                <p className="fs-14">{reviewText}</p>
                <p className="fs-14">{text}</p>
            </div>
        </div>
    );
};

export default ReviewTypeProfile;
