import React, { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import ShowMoreText from 'react-show-more-text';
import candidateAvatar from '../../assets/img/avatar-grey.png';
import companyLogo from '../../assets/img/logo.svg';
import { routes } from '../../containers/routes/routes-names';
import { ContractComplianceStateEnum, ReviewType } from '../../types/review';
import PdfViewer from '../pdf-viewer';
import { getFileExtension } from '../../lib/utils/file-extension';
import DocxViewer from '../docx-viewer';
import { RootState } from '../../redux';
import { GenderEnum, UserRoleEnum, UserType } from '../../types/auth';
import DeleteReview from './modals/delete-review';
import { OfferNextActionEnum } from '../../types/candidate';
import UploadImage from './modals/upload-image';
import ReviewModal from '../review/modal';
import { RelationEnum } from '../../types';
import Report from './modals/report';
import { SuspendEnum } from '../../types/suspension';
import { OfferReviewStateEnum, OfferStateEnum, ReviewOfferType } from '../../types/offer';
import ReviewChart from './component/review-chart';
import Accordion from 'react-bootstrap/Accordion';
import ReviewTypeList from './component/review-type';
import { getAvgcardValue, getAvgProgressValue, getAvgReviewValue } from './utils/getReviews';
import Nodata from '../../assets/img/mortarboard.svg';
import ResumeImg from '../../assets/img/file-earmark-text.svg';
import Noreview from '../../components/no-data';
import { isExitReviewEnabled, isProgressReviewEnabled } from '../../lib/utils/reviews-config';
import { Rating } from 'react-simple-star-rating';
import history from '../../../src/history';
import { ExperienceLevelEnum } from '../../lib/constants/constants';
import WriteReplyTypeList from './component/write-reply-type';
import moment from 'moment';

type reviewTypes = {
    id?: string;
    avatar?: string;
    name?: string;
    text?: string | null;
    date?: Date;
    contractComplianceState?: ContractComplianceStateEnum;
    rating?: number | null;
    creatorId?: string | null;
    offerId?: string | null;
    reviewType?: number | null;
    reviewText?: string;
    contractViolationReason?: string;
    jobTitle?: string;
    jobStartDate?: Date;
    replys?: reply[];
};

type CandidateOfferHistoryType = {
    jobTitle?: string | null;
    offerAcceptedDate?: Date | null;
    offerState: OfferStateEnum | undefined;
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

type Props = {
    id?: string;
    avatar: string | null;
    banner: string | null;
    name: string;
    offerHistory?: CandidateOfferHistoryType[];
    activity: string;
    location: string | null;
    address?: string;
    releaseOfferId?: string;
    aboutMe?: string;
    aboutUs?: string;
    reviewsCount: number;
    rating: number;
    contractCompliance: number;
    contractViolation: number;
    children?: ReactNode;
    phone: string | null;
    email: string;
    website: string | null;
    education?: {
        highestEducation: string;
        institutionName: string;
        graduationYear: number;
    };
    editCandidate?: boolean;
    editCompany?: boolean;
    resume?: string;
    foundedYear?: number;
    currentCompanyOfferNextAvailableAction?: OfferNextActionEnum;
    allCompaniesAcceptedOffersCount?: number;
    currentCompanyLastEventDetailedText?: string | null;
    reOfferId?: string | null;
    candidate?: string;
    relationType?: RelationEnum;
    suspendStatus?: SuspendEnum;
    offerId?: string;
    offerReviewState?: number;
    reviewItemsList?: {
        id?: string | null;
        avatar?: string;
        name?: string;
        text?: string | null;
        date?: Date;
        contractComplianceState?: ContractComplianceStateEnum;
        rating?: any;
        creatorId: string | null;
        offerId: string | null;
        reviewType?: number[] | null;
        reviewText?: string;
        contractViolationReason?: string;
        location?: string;
        onboardReviewList?: reviewTypes[];
        progressReviewList?: reviewTypes[];
        exitReviewList?: reviewTypes[];
    }[];
    reviewLoading?: boolean;
    isCompany?: boolean;
    reviewOffers: ReviewOfferType[];
    isMyProfile?: boolean;
    prevCompany?: string;
    experienceLevel?: ExperienceLevelEnum;
    aadhar?: string | null;
    dob?: Date | null;
    gender?: GenderEnum | undefined;
};

const Profile: React.FC<Props> = ({
    id,
    avatar,
    banner,
    name,
    activity,
    location,
    address,
    releaseOfferId,
    aboutMe,
    aboutUs,
    reviewsCount,
    rating,
    contractCompliance,
    contractViolation,
    children,
    phone,
    email,
    website,
    education,
    editCandidate,
    editCompany,
    resume,
    foundedYear,
    reviewItemsList,
    currentCompanyOfferNextAvailableAction,
    allCompaniesAcceptedOffersCount,
    currentCompanyLastEventDetailedText,
    candidate,
    reOfferId,
    relationType,
    suspendStatus,
    offerId,
    offerReviewState,
    isCompany,
    reviewOffers,
    isMyProfile,
    prevCompany,
    experienceLevel,
    aadhar,
    offerHistory,
    dob,
    gender,
}) => {
    const candidatePage = !!education;
    const [activeReviewId, setActiveReviewId] = useState<string>('');
    const [activeJobTitle, setActiveJobTitle] = useState<string>('');
    const [activeJobStartDate, setActiveJobStartDate] = useState<Date>();
    const [imageModalType, setImageModalType] = useState<'banner' | 'avatar'>('banner');
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const suspendAccount = suspendStatus === SuspendEnum.suspended;
    const [editMode, setEditMode] = useState<boolean>();
    const [showMoreRec, setShowMoreRec] = useState<number | undefined>(3);

    const { user } = useSelector((state: RootState) => state.user);
    const hasUser = user as UserType;
    const hasCandidate = hasUser.role === UserRoleEnum.candidate;
    const uniqType = reviewItemsList?.map((x) => x.reviewType).find((x) => x);

    const [reviewTypeProfile, setReviewTypeProfile] = useState<ReviewType>();
    const isOnboardReviewGiven = uniqType?.includes(ReviewType.OnboardingReview);
    const isExitReviewGiven = uniqType?.includes(ReviewType.ExitReview);

    const getOfferStateValue = (state: OfferStateEnum | undefined) => {
        switch (state) {
            case OfferStateEnum.pending:
                return 'Pending';
            case OfferStateEnum.accepted:
                return 'Accepted';
            case OfferStateEnum.rejected:
                return 'rejected';
            case OfferStateEnum.retracted:
                return 'retracted';
            case OfferStateEnum.expired:
                return 'expired';
            case OfferStateEnum.onboarded:
                return 'onboarded';
            case OfferStateEnum.ghosted:
                return 'ghosted';
            default:
                return 'Pending';
        }
    };

    return (
        <>
            <section id="ProfilePage" className="profile-page mb-4">
                <div className={hasCandidate ? 'container' : 'w-100'}>
                    <div className="row">
                        {/* <div className="profile-banner-box px-0">
                            <div className={(imageModalType === 'banner' && croppedImage) || banner? 'profile-banner lt-gradient-bg rounded-0 banner-height':  'profile-banner lt-gradient-bg rounded-0 height-100'}
                                style={
                                    (imageModalType === 'banner' && croppedImage) || banner
                                        ? {
                                            backgroundSize: "contain",
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "top",
                                            backgroundImage: `url('${imageModalType === 'banner' && croppedImage
                                                ? croppedImage
                                                : banner || ''
                                                }')`,
                                        }
                                        : {}
                                }
                            >
                                {(editCandidate || editCompany) && (
                                    <div className="banner-controls">
                                        <button
                                            type="button"
                                            className="uploadpicbtn"
                                            data-bs-toggle="modal"
                                            data-bs-target="#BannerPic"
                                            onClick={() => setImageModalType('banner')}
                                        >
                                            <i className="bi bi-camera" /> Upload Banner
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div> */}
                    </div>
                    <div className="row mt-2">
                        <span className="mt-2 ps-4 pe-2 text-secondary">
                            <span onClick={() => history.goBack()} className="cursor-pointer">
                                <i className="bi bi-chevron-left lt-text-secondary-alt me-0"></i> Back
                            </span>
                        </span>
                        <div
                            className={
                                hasCandidate ? 'col-12 ps-lg-0 ps-md-0 pe-lg-0' : 'col-12 ps-lg-0 ps-md-0 border-right'
                            }
                        >
                            <div
                                className={
                                    hasCandidate ? 'profile-details rounded-0 px-0' : 'profile-details rounded-0'
                                }
                            >
                                <div className="d-flex">
                                    <div className="ps-0 py-2 pe-4 d-flex align-items-center">
                                        <div className="profile-pic">
                                            {(imageModalType === 'avatar' && croppedImage) || avatar ? (
                                                <img
                                                    src={
                                                        imageModalType === 'avatar' && croppedImage
                                                            ? croppedImage
                                                            : avatar || ''
                                                    }
                                                    className="avatar avatar--md"
                                                    alt=""
                                                />
                                            ) : (
                                                <img
                                                    src={candidatePage ? candidateAvatar : companyLogo}
                                                    alt=""
                                                    className="avatar avatar--md"
                                                />
                                            )}
                                            {(editCandidate || editCompany) && (
                                                <button
                                                    type="button"
                                                    className="banner-controls uploadpicbtn"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#BannerPic"
                                                    onClick={() => setImageModalType('avatar')}
                                                    title="Upload profile pic"
                                                >
                                                    <i className="bi bi-camera me-0" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pt-md-2 w-100">
                                        <h1 className="fw-700 fs-20 mb-1 text-capitalize">{name}</h1>
                                        {candidatePage ? (
                                            <>
                                                <div className="fs-14 fw-400 mb-1">
                                                    <span className="text-capitalize">
                                                        {experienceLevel == ExperienceLevelEnum.Experienced
                                                            ? activity
                                                            : ExperienceLevelEnum[ExperienceLevelEnum.Fresher]}
                                                    </span>
                                                </div>
                                            </>
                                        ) : null}
                                        <div className="fs-12 lt-text-secondary-alt">
                                            {candidatePage ? 'Lives in' : 'Located in'}{' '}
                                            <span className="text-capitalize">{location?.toLowerCase()}</span>
                                        </div>
                                        <div className="me-3 dropend ox-reviews-dropend">
                                            {!isProgressReviewEnabled && !isExitReviewEnabled && (
                                                <div className="d-flex align-items-center">
                                                    {rating > 0 && (
                                                        <div className="pt-1 me-1 lt-text-primary-light fs-20 fw-600">
                                                            {rating}
                                                        </div>
                                                    )}
                                                    <Rating
                                                        size={22}
                                                        fillColor="#4EB6FF"
                                                        initialValue={rating}
                                                        transition={true}
                                                        emptyColor="transparent"
                                                        SVGstrokeColor="#4EB6FF"
                                                        SVGstorkeWidth="1"
                                                        readonly={true}
                                                        allowTitleTag={false}
                                                        className="mb-1"
                                                        allowFraction={true}
                                                    />
                                                </div>
                                            )}
                                            {(isProgressReviewEnabled || isExitReviewEnabled) && (
                                                <div
                                                    className="d-inline-flex align-items-center dropdown-toggle cursor-pointer"
                                                    data-bs-toggle="dropdown"
                                                    data-bs-auto-close="outside"
                                                >
                                                    {reviewsCount > 0 && (
                                                        <span className="me-1 lt-text-primary-light fs-20 fw-600 mt-1">
                                                            {rating}
                                                        </span>
                                                    )}
                                                    <Rating
                                                        allowFraction={true}
                                                        size={22}
                                                        fillColor="#4EB6FF"
                                                        initialValue={rating}
                                                        transition={true}
                                                        emptyColor="transparent"
                                                        SVGstrokeColor="#4EB6FF"
                                                        SVGstorkeWidth="1"
                                                        readonly={true}
                                                        allowTitleTag={false}
                                                    />
                                                    <i className="bi bi-chevron-right mt-1"></i>
                                                </div>
                                            )}
                                            <div className="dropdown-menu p-3 border-0 shadow">
                                                <div className="">
                                                    <ReviewChart
                                                        title="Onboarding review"
                                                        reviewList={reviewItemsList
                                                            ?.map((x) => x.onboardReviewList)
                                                            .flat()}
                                                        ReviewTypeEnum={ReviewType.OnboardingReview}
                                                    />
                                                    {isProgressReviewEnabled && (
                                                        <ReviewChart
                                                            title={
                                                                candidatePage
                                                                    ? 'Performance review'
                                                                    : 'Employment review'
                                                            }
                                                            reviewList={reviewItemsList
                                                                ?.map((x) => x.progressReviewList)
                                                                .flat()}
                                                            ReviewTypeEnum={ReviewType.ProgressReview}
                                                        />
                                                    )}
                                                    {isExitReviewEnabled && (
                                                        <ReviewChart
                                                            title="Exit review"
                                                            reviewList={reviewItemsList
                                                                ?.map((x) => x.exitReviewList)
                                                                .flat()}
                                                            ReviewTypeEnum={ReviewType.ExitReview}
                                                        />
                                                    )}
                                                </div>
                                                <div className="mt-3">
                                                    <p className="fs-12 fw-600 mb-2">Contract metrics</p>
                                                    <ul className="list-group">
                                                        <li className="d-flex align-items-center fs-12 mb-1">
                                                            <span className="lt-text-success">
                                                                <i className="bi bi-check-circle"></i>
                                                            </span>
                                                            <div className="lt-text-secondary-alt">
                                                                <span className="">{contractCompliance}</span>{' '}
                                                                <span className="">
                                                                    {contractCompliance == 1
                                                                        ? candidatePage
                                                                            ? 'Onboarded'
                                                                            : 'Offer Compliance'
                                                                        : candidatePage
                                                                        ? 'Onboarded'
                                                                        : 'Offer Compliances'}
                                                                </span>
                                                            </div>
                                                        </li>
                                                        <li className="d-flex align-items-center fs-12">
                                                            <span className="lt-text-error">
                                                                <i className="bi bi-dash-circle"></i>
                                                            </span>
                                                            <div className="lt-text-secondary-alt">
                                                                <span className="">{contractViolation}</span>{' '}
                                                                <span className="">
                                                                    {contractViolation == 1
                                                                        ? candidatePage
                                                                            ? 'Ghosted'
                                                                            : 'Offer Violation'
                                                                        : candidatePage
                                                                        ? 'Ghosted'
                                                                        : 'Offer Violations'}{' '}
                                                                </span>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        {!isProgressReviewEnabled && !isExitReviewEnabled && (
                                            <div className="mt-1 mb-2">
                                                <ul className="list-group">
                                                    <li className="d-flex align-items-center fs-12 mb-1">
                                                        <span className="lt-text-success">
                                                            <i className="bi bi-check-circle"></i>
                                                        </span>
                                                        <div className="lt-text-secondary-alt">
                                                            <span className="">{contractCompliance}</span>{' '}
                                                            <span className="">
                                                                {contractCompliance == 1
                                                                    ? candidatePage
                                                                        ? 'Onboarded'
                                                                        : 'Offer Compliance'
                                                                    : candidatePage
                                                                    ? 'Onboarded'
                                                                    : 'Offer Compliances'}
                                                            </span>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex align-items-center fs-12">
                                                        <span className="lt-text-error">
                                                            <i className="bi bi-dash-circle"></i>
                                                        </span>
                                                        <div className="lt-text-secondary-alt">
                                                            <span className="">{contractViolation}</span>{' '}
                                                            <span className="">
                                                                <span className="">
                                                                    {contractViolation == 1
                                                                        ? candidatePage
                                                                            ? 'Ghosted'
                                                                            : 'Offer Violation'
                                                                        : candidatePage
                                                                        ? 'Ghosted'
                                                                        : 'Offer Violations'}{' '}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                        {(isProgressReviewEnabled || isExitReviewEnabled) && (
                                            <div className="d-flex align-items-center mb-3">
                                                <span className="lt-text-error">
                                                    <i className="bi bi-dash-circle fs-16 me-2"></i>
                                                </span>
                                                <div className="lt-text-secondary-alt fs-12 fw-600">
                                                    {contractViolation}{' '}
                                                    {contractViolation == 1 ? 'Violation' : 'Violations'}{' '}
                                                </div>
                                            </div>
                                        )}
                                        <div className="pb-4">
                                            {suspendAccount ||
                                                (releaseOfferId &&
                                                    typeof currentCompanyOfferNextAvailableAction !== 'undefined' && (
                                                        <ReleaseOfferBtn
                                                            id={releaseOfferId}
                                                            currentCompanyOfferNextAvailableAction={
                                                                currentCompanyOfferNextAvailableAction
                                                            }
                                                            reOfferId={reOfferId}
                                                        />
                                                    ))}
                                            {(editCandidate || editCompany) && (
                                                <span
                                                    className="btn btn-primary"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#EditProfile"
                                                >
                                                    <i className="bi bi-pencil" /> Edit profile
                                                </span>
                                            )}

                                            {!isMyProfile &&
                                                offerReviewState != OfferReviewStateEnum.thereIsNoOffer && (
                                                    <button
                                                        type="button"
                                                        className={
                                                            hasUser.role === UserRoleEnum.manager
                                                                ? 'btn btn-outline-primary outline-p-hover ms-0'
                                                                : 'btn btn-outline-primary outline-p-hover ms-0 me-3'
                                                        }
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#WriteReview"
                                                        disabled={reviewOffers?.length == 0}
                                                        onClick={() => setEditMode(false)}
                                                    >
                                                        <i className="bi-pencil-square"></i> Write a review
                                                    </button>
                                                )}

                                            {relationType === RelationEnum.hasRelation && (
                                                <span
                                                    className={
                                                        hasUser.role === UserRoleEnum.manager
                                                            ? 'btn ox-report-btn fw-600'
                                                            : 'btn ps-0 ox-report-btn fw-600'
                                                    }
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#Report"
                                                >
                                                    <i className="bi bi-flag" /> Report
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="d-flex w-100 justify-content-end flex-shrink-1">
                                            {candidatePage ? (
                                                <div className="dropdown ox-profile-drops">
                                                    <button
                                                        className="btn btn-link dropdown-toggle"
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        data-bs-auto-close="outside"
                                                        aria-expanded="false"
                                                    >
                                                        Education <i className="bi-chevron-down"></i>
                                                    </button>
                                                    <div className="dropdown-menu border-0 lt-shadow-sm education-dropdown">
                                                        {education &&
                                                        (education.highestEducation ||
                                                            education.institutionName ||
                                                            !!education.graduationYear) ? (
                                                            <div
                                                                className={
                                                                    hasCandidate
                                                                        ? 'card profile-card p-0'
                                                                        : 'card profile-card p-0'
                                                                }
                                                            >
                                                                <div className="w-100 mb-3">
                                                                    <h2 className="fs-12 fw-600">Highest education</h2>
                                                                    <p className="fs-12">
                                                                        {education.highestEducation
                                                                            ? education.highestEducation
                                                                            : 'N/A'}
                                                                    </p>
                                                                </div>

                                                                <div className="w-100 mb-3">
                                                                    <h2 className="fs-12 fw-600">Institution name</h2>
                                                                    <p className="fs-12">
                                                                        {education.institutionName
                                                                            ? education.institutionName
                                                                            : 'N/A'}
                                                                    </p>
                                                                </div>

                                                                <div className="w-100">
                                                                    <h2 className="fs-12 fw-600">Graduation year</h2>
                                                                    <p className="fs-12">
                                                                        {' '}
                                                                        {!!education.graduationYear
                                                                            ? education.graduationYear
                                                                            : 'N/A'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="card-body">
                                                                <div className="doc-full-size d-flex flex-column align-items-center justify-content-center">
                                                                    <img
                                                                        src={Nodata}
                                                                        className="w-25"
                                                                        alt="No education details"
                                                                    />
                                                                    <p className="fs-14 fw-400 mt-3">
                                                                        No education details
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : null}

                                            <div className="dropdown ox-profile-drops">
                                                <button
                                                    className="btn btn-link dropdown-toggle"
                                                    type="button"
                                                    data-bs-toggle="dropdown"
                                                    data-bs-auto-close="outside"
                                                    aria-expanded="false"
                                                >
                                                    Contact <i className="bi-chevron-down"></i>
                                                </button>
                                                <div
                                                    className={
                                                        hasUser.role === UserRoleEnum.candidate
                                                            ? candidatePage
                                                                ? 'dropdown-menu border-0 lt-shadow-sm candidate-prof-contact-dropdown'
                                                                : 'dropdown-menu border-0 lt-shadow-sm candidate-contact-dropdown'
                                                            : editCompany
                                                            ? 'dropdown-menu border-0 lt-shadow-sm contact-dropdown edit-contact-dropdown'
                                                            : ' dropdown-menu border-0 lt-shadow-sm contact-dropdown'
                                                    }
                                                >
                                                    {address && (
                                                        <div className="mb-3">
                                                            <div className="fw-600">Address</div>
                                                            <div className="fs-12 mt-1">{address}</div>
                                                        </div>
                                                    )}
                                                    {phone && (
                                                        <div className="d-flex mb-2 align-items-center justify-content-start">
                                                            <i className="bi bi-telephone lt-text-primary-alt me-2" />
                                                            <a href={`tel:+${phone}`} className="fs-12">
                                                                +{phone}
                                                            </a>
                                                        </div>
                                                    )}
                                                    <div className="d-flex mb-2 align-items-center justify-content-start">
                                                        <i className="bi bi-envelope lt-text-primary-alt me-2" />
                                                        <a
                                                            href={`mailto:${email}`}
                                                            className="fs-12 profile-email text-ellipsis"
                                                            title={email}
                                                        >
                                                            {email}
                                                        </a>
                                                    </div>
                                                    {website && (
                                                        <div className="d-flex align-items-center justify-content-start">
                                                            <i
                                                                className={`bi ${
                                                                    candidatePage
                                                                        ? 'bi-link-45deg fs-18 me-1'
                                                                        : 'bi-globe me-2'
                                                                } lt-text-primary-alt`}
                                                            />
                                                            <a
                                                                href={
                                                                    website?.includes('https://')
                                                                        ? website
                                                                        : `https://${website}`
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-ellipsis fs-12"
                                                                title={website}
                                                            >
                                                                {website}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {candidatePage ? (
                                                <div className="dropdown ox-profile-drops">
                                                    <button
                                                        className="btn btn-link dropdown-toggle"
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        data-bs-auto-close="outside"
                                                        aria-expanded="false"
                                                    >
                                                        Resume <i className="bi-chevron-down"></i>
                                                    </button>
                                                    <div
                                                        className={
                                                            hasUser.role === UserRoleEnum.candidate
                                                                ? 'dropdown-menu border-0 lt-shadow-sm p-0 candidate-resume-dropdown'
                                                                : 'dropdown-menu border-0 lt-shadow-sm p-0 resume-dropdown'
                                                        }
                                                    >
                                                        <div className="card">
                                                            {resume ? (
                                                                <>
                                                                    {' '}
                                                                    <div
                                                                        className="card-body resume-thumbnail p-0"
                                                                        hidden
                                                                    >
                                                                        <div className="doc-full-size">
                                                                            {getFileExtension(resume) === 'pdf' && (
                                                                                <PdfViewer url={resume} />
                                                                            )}
                                                                            {getFileExtension(resume) === 'docx' && (
                                                                                <DocxViewer url={resume} />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="align-items-center d-flex flex-column p-5">
                                                                        <div className="d-flex mb-2 justify-content-center">
                                                                            <button
                                                                                type="button"
                                                                                data-bs-toggle="offcanvas"
                                                                                data-bs-target="#offcanvasRight"
                                                                                aria-controls="offcanvasRight"
                                                                                className="btn btn-outline-primary fs-14 fw-600 mb-3 ox-btn-resume"
                                                                            >
                                                                                <i className="bi bi-eye"></i> View
                                                                                resume
                                                                            </button>
                                                                        </div>
                                                                        <div className="d-flex justify-content-center">
                                                                            <a
                                                                                className="fs-14 fw-600 ox-resume-btn"
                                                                                href={resume}
                                                                                download={`${name}.${getFileExtension(
                                                                                    resume
                                                                                )}`}
                                                                                title="Download Resume"
                                                                            >
                                                                                <i className="bi bi-download me-2" />
                                                                                Download
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="card-body">
                                                                    <div className="doc-full-size d-flex flex-column align-items-center justify-content-center">
                                                                        <img src={ResumeImg} className="w-25"></img>
                                                                        <p className="fs-14 fw-400 mt-3">
                                                                            Resume yet to upload
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}

                                            {candidatePage && (
                                                <div className="dropdown ox-profile-drops">
                                                    <button
                                                        className="btn btn-link dropdown-toggle"
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        data-bs-auto-close="outside"
                                                        aria-expanded="false"
                                                    >
                                                        Identity <i className="bi-chevron-down"></i>
                                                    </button>
                                                    <div className="dropdown-menu border-0 lt-shadow-sm aadhar-dropdown">
                                                        <h2 className="fs-12 fw-600">Aadhar</h2>
                                                        <div className="d-flex mb-2 align-items-center justify-content-start">
                                                            <i className="bi bi-person-vcard lt-text-primary-alt me-2" />
                                                            <span className="fs-12">**** **** {aadhar}</span>
                                                        </div>
                                                        <h2 className="fs-12 fw-600">DOB</h2>
                                                        <div className="d-flex mb-2 align-items-center justify-content-start">
                                                            <i className="bi bi-calendar3 lt-text-primary-alt me-2" />
                                                            {
                                                                <span className="fs-12">
                                                                    {moment(dob).format('D-MMM-YYYY')}
                                                                </span>
                                                            }
                                                        </div>
                                                        <h2 className="fs-12 fw-600">Gender</h2>
                                                        <div className="d-flex mb-2 align-items-center justify-content-start">
                                                            {gender == 0 && (
                                                                <i className="bi bi-gender-male lt-text-primary-alt me-2" />
                                                            )}
                                                            {gender == 1 && (
                                                                <i className="bi bi-gender-female lt-text-primary-alt me-2" />
                                                            )}
                                                            {gender == 2 && (
                                                                <i className="bi bi-person lt-text-primary-alt me-2" />
                                                            )}
                                                            <span className="fs-12"> {getGenderValue(gender)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {!!allCompaniesAcceptedOffersCount && (
                                <div className="w-100 ps-4 pe-2">
                                    <div className="alert alert-warning mt-3 mb-4">
                                        <p className="fs-14">
                                            This candidate accepted {allCompaniesAcceptedOffersCount} offer
                                            {allCompaniesAcceptedOffersCount > 1 && 's'}
                                            <span className="lt-tooltip ms-1">
                                                <span className="lt-tooltiptext lt-tooltiptext--right fw-400 fs-12">
                                                    It displays the total number of accepted offers of this candidate in
                                                    OfferX.
                                                </span>
                                                <i className="bi bi-info-circle lt-text-warning" />
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            )}
                            {suspendAccount && (
                                <div className="mt-4 ps-4 pe-2">
                                    <div className="alert lt-text-error text-center py-4 mb-4">
                                        <h5 className="fw-600">
                                            <span>
                                                <i className="bi bi-lock-fill" />
                                            </span>
                                            Account suspended
                                        </h5>
                                        <p className="fs-14">
                                            OfferX suspends accounts that violate the OfferX policies. For more
                                            information reach us at 'support@offerx.in'.
                                        </p>
                                    </div>
                                </div>
                            )}
                            {currentCompanyLastEventDetailedText && (
                                <div className="w-100 ps-4 pe-2">
                                    <div className="alert alert-info mb-4">
                                        <p className="fs-14">
                                            {currentCompanyLastEventDetailedText}
                                            <span className="lt-tooltip ms-1">
                                                <span className="lt-tooltiptext lt-tooltiptext--bottom fw-400 fs-12">
                                                    The latest event related to candidates offer is displayed here.
                                                </span>
                                                <i className="bi bi-info-circle" />
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {candidatePage && offerHistory?.length !== 0 && !isMyProfile && (
                                <div className="w-100 ps-4 pe-2">
                                    <div className="accordion offers-hist-acc mb-4" id="offersHistory">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingOne">
                                                <button
                                                    className="accordion-button collapsed px-3 fw-600"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapseOne"
                                                    aria-expanded="false"
                                                    aria-controls="collapseOne"
                                                >
                                                    Offer History
                                                </button>
                                            </h2>
                                            <hr className="my-0 px-3" />
                                            <div
                                                id="collapseOne"
                                                className="accordion-collapse collapse"
                                                aria-labelledby="headingOne"
                                                data-bs-parent="#offersHistory"
                                            >
                                                <div className="accordion-body">
                                                    <ul className="mb-0 ps-0">
                                                        {offerHistory?.length !== 0 &&
                                                            offerHistory?.map((item) => (
                                                                <li className="fs-12 lt-text-secondary mb-3">
                                                                    Accepted job offer for the role of{' '}
                                                                    <span className="fw-600">{item.jobTitle}</span> on{' '}
                                                                    {moment(item.offerAcceptedDate).format('D-MMM-YYYY')}.
                                                                    <span className="lt-text-primary-alt fw-600 ms-3">
                                                                        {getOfferStateValue(item.offerState)}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(aboutMe || aboutUs || !!foundedYear) && (
                                <div
                                    className={hasCandidate ? 'card profile-card px-0 pb-2' : 'card profile-card py-0'}
                                >
                                    <h1 className="fw-700 fs-18 mb-3">
                                        {aboutMe && 'About me'}
                                        {(aboutUs || foundedYear) && 'About us'}
                                    </h1>
                                    {!!foundedYear && (
                                        <div className="fs-14 mb-3">
                                            <span className="fw-700">Founded: </span>
                                            {foundedYear}
                                        </div>
                                    )}
                                    <ShowMoreText lines={3} more="Read more" less="Read less">
                                        <div className="showMoreText">
                                            {' '}
                                            {aboutUs}
                                            {aboutMe}{' '}
                                        </div>
                                    </ShowMoreText>
                                    <div className="mt-4 mb-2 border-bottom" />
                                </div>
                            )}
                            <div className={hasCandidate ? 'card profile-card px-0 pb-1' : 'card profile-card pe-2'}>
                                <div className="d-flex align-items-center mb-3">
                                    <div className="w-100">
                                        <h1 className="fw-700 fs-18 mb-3">Reviews</h1>
                                    </div>
                                </div>
                                {reviewItemsList?.length !== 0 ? (
                                    <Accordion defaultActiveKey={'0'} className="review-accordion ox-reviews-rating">
                                        {reviewItemsList?.map((item, index) => (
                                            <Accordion.Item eventKey={String(index)} key={index} className="reviewACC">
                                                <Accordion.Header className="px-0">
                                                    <div className="d-flex align-items-center">
                                                        <div className="pe-2">
                                                            <img
                                                                src={
                                                                    item.avatar ||
                                                                    (candidatePage ? companyLogo : candidateAvatar)
                                                                }
                                                                alt=""
                                                                className="avatar avatar--xxs"
                                                            />
                                                        </div>
                                                        <div className="p-2 align-items-center">
                                                            <h1 className="fw-600 fs-20 mb-2 text-capitalize">
                                                                {item.name}
                                                            </h1>
                                                            <div className="d-flex align-items-center fs-18 fw-600 lt-text-primary-light">
                                                                <div className="fs-18 fw-600 me-1 pt-0">
                                                                    {Number(
                                                                        (
                                                                            Math.round(
                                                                                Number(
                                                                                    getAvgcardValue(
                                                                                        item.onboardReviewList?.flat(),
                                                                                        item.progressReviewList?.flat(),
                                                                                        item.exitReviewList?.flat()
                                                                                    )
                                                                                ) * 100
                                                                            ) / 100
                                                                        ).toFixed(1)
                                                                    )}
                                                                    {/* {item.location} */}
                                                                </div>
                                                                <div>
                                                                    <Rating
                                                                        allowFraction={true}
                                                                        size={20}
                                                                        fillColor="#4EB6FF"
                                                                        initialValue={Number(
                                                                            (
                                                                                Math.round(
                                                                                    Number(
                                                                                        getAvgcardValue(
                                                                                            item.onboardReviewList?.flat(),
                                                                                            item.progressReviewList?.flat(),
                                                                                            item.exitReviewList?.flat()
                                                                                        )
                                                                                    ) * 100
                                                                                ) / 100
                                                                            ).toFixed(1)
                                                                        )}
                                                                        transition={true}
                                                                        emptyColor="transparent"
                                                                        SVGstrokeColor="#4EB6FF"
                                                                        SVGstorkeWidth="1"
                                                                        readonly={true}
                                                                        allowTitleTag={false}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span
                                                            className="lt-tooltiptext lt-shadow-md fw-400 fs-14 accord-tooltip"
                                                            hidden
                                                        >
                                                            Expand / Collapse reviews
                                                        </span>
                                                    </div>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    {item.onboardReviewList?.map((item, index) => (
                                                        <>
                                                            <div key={index}>
                                                                <ReviewTypeList
                                                                    contractComplianceState={
                                                                        item.contractComplianceState
                                                                    }
                                                                    title={'Onboarding review'}
                                                                    contractViolationReason={
                                                                        item.contractViolationReason
                                                                    }
                                                                    date={item.date}
                                                                    id={item.id}
                                                                    jobTitle={item.jobTitle}
                                                                    jobStartDate={item.jobStartDate}
                                                                    rating={item?.rating}
                                                                    reviewText={item.reviewText}
                                                                    candidatePage={candidatePage}
                                                                    reviewType={item.reviewType}
                                                                    creatorId={item.creatorId}
                                                                    setActiveReviewId={() =>
                                                                        setActiveReviewId(item.id ? item.id : '')
                                                                    }
                                                                    setActiveJobTitle={() =>
                                                                        setActiveJobTitle(
                                                                            item.jobTitle ? item.jobTitle : ''
                                                                        )
                                                                    }
                                                                    setActiveJobStartDate={() =>
                                                                        setActiveJobStartDate(item.jobStartDate)
                                                                    }
                                                                    text={item.text}
                                                                    setReviewTypeProfile={() =>
                                                                        setReviewTypeProfile(
                                                                            item.reviewType ? item.reviewType : 0
                                                                        )
                                                                    }
                                                                    setEditMode={() => setEditMode(true)}
                                                                />
                                                            </div>
                                                            <WriteReplyTypeList
                                                                id={item.id}
                                                                replys={item.replys}
                                                                ReviewCreatorId={item.creatorId}
                                                                commentlength={item.replys?.length}
                                                                candidatePage={candidatePage}
                                                                avatar={avatar}
                                                                hasCandidate={hasCandidate}
                                                                candidateName={name}
                                                                isMyProfile={isMyProfile}
                                                            />
                                                        </>
                                                    ))}
                                                    {isProgressReviewEnabled &&
                                                        item.progressReviewList?.length !== undefined &&
                                                        item.progressReviewList?.length !== 0 && (
                                                            <div className="ox-review-boble shadow-sm p-3">
                                                                <div className="w-100">
                                                                    <div className="d-flex align-items-center mb-3">
                                                                        <div className="fs-14 fw-600 me-3">
                                                                            {candidatePage
                                                                                ? 'Performance review'
                                                                                : 'Employment review'}
                                                                        </div>

                                                                        <div className="d-flex align-items-center">
                                                                            <div className="fs-18 fw-600 me-2 lt-text-primary-alt">
                                                                                {' '}
                                                                                {Number(
                                                                                    (
                                                                                        Math.round(
                                                                                            Number(
                                                                                                getAvgProgressValue(
                                                                                                    item.progressReviewList?.flat()
                                                                                                )
                                                                                            ) * 100
                                                                                        ) / 100
                                                                                    ).toFixed(1)
                                                                                )}
                                                                            </div>
                                                                            <div className="fs-18 lt-text-primary-alt">
                                                                                <Rating
                                                                                    allowFraction={true}
                                                                                    size={21}
                                                                                    fillColor="#4EB6FF"
                                                                                    initialValue={Number(
                                                                                        (
                                                                                            Math.round(
                                                                                                Number(
                                                                                                    getAvgProgressValue(
                                                                                                        item.progressReviewList?.flat()
                                                                                                    )
                                                                                                ) * 100
                                                                                            ) / 100
                                                                                        ).toFixed(1)
                                                                                    )}
                                                                                    transition={true}
                                                                                    emptyColor="transparent"
                                                                                    SVGstrokeColor="#4EB6FF"
                                                                                    SVGstorkeWidth="1"
                                                                                    readonly={true}
                                                                                    allowTitleTag={false}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {item.progressReviewList
                                                                    ?.slice(0, showMoreRec)
                                                                    .map((item, index) => (
                                                                        <ReviewTypeList
                                                                            key={index}
                                                                            contractComplianceState={
                                                                                item.contractComplianceState
                                                                            }
                                                                            title={'Progress Review'}
                                                                            progressReview={true}
                                                                            text={item.text}
                                                                            contractViolationReason={
                                                                                item.contractViolationReason
                                                                            }
                                                                            date={item.date}
                                                                            id={item.id}
                                                                            jobTitle={item.jobTitle}
                                                                            jobStartDate={item.jobStartDate}
                                                                            rating={item?.rating}
                                                                            reviewText={item.reviewText}
                                                                            reviewType={item.reviewType}
                                                                            creatorId={item.creatorId}
                                                                            setActiveReviewId={() =>
                                                                                setActiveReviewId(
                                                                                    item.id ? item.id : ''
                                                                                )
                                                                            }
                                                                            setActiveJobTitle={() =>
                                                                                setActiveJobTitle(
                                                                                    item.jobTitle ? item.jobTitle : ''
                                                                                )
                                                                            }
                                                                            setActiveJobStartDate={() =>
                                                                                setActiveJobStartDate(item.jobStartDate)
                                                                            }
                                                                            setReviewTypeProfile={() =>
                                                                                setReviewTypeProfile(
                                                                                    item.reviewType
                                                                                        ? item.reviewType
                                                                                        : 0
                                                                                )
                                                                            }
                                                                            setEditMode={() => setEditMode(true)}
                                                                        />
                                                                    ))}
                                                                {item.progressReviewList?.length !== undefined &&
                                                                    item.progressReviewList?.length > 3 && (
                                                                        <div className="d-flex justify-content-end cursor-pointer">
                                                                            <span
                                                                                className="fw-600 lt-text-primary-alt fs-12"
                                                                                onClick={() =>
                                                                                    showMoreRec === 3
                                                                                        ? setShowMoreRec(undefined)
                                                                                        : setShowMoreRec(3)
                                                                                }
                                                                            >
                                                                                {showMoreRec === 3
                                                                                    ? 'Show more'
                                                                                    : 'Show less'}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        )}

                                                    {isExitReviewEnabled &&
                                                        item.exitReviewList?.map((item, index) => (
                                                            <div className="ox-review-boble shadow-sm p-3" key={index}>
                                                                <ReviewTypeList
                                                                    contractComplianceState={
                                                                        item.contractComplianceState
                                                                    }
                                                                    title={'Exit Review'}
                                                                    text={item.text}
                                                                    contractViolationReason={
                                                                        item.contractViolationReason
                                                                    }
                                                                    date={item.date}
                                                                    id={item.id}
                                                                    jobTitle={item.jobTitle}
                                                                    jobStartDate={item.jobStartDate}
                                                                    rating={item?.rating}
                                                                    reviewText={item.reviewText}
                                                                    reviewType={item.reviewType}
                                                                    creatorId={item.creatorId}
                                                                    setActiveReviewId={() =>
                                                                        setActiveReviewId(item.id ? item.id : '')
                                                                    }
                                                                    setActiveJobTitle={() =>
                                                                        setActiveJobTitle(
                                                                            item.jobTitle ? item.jobTitle : ''
                                                                        )
                                                                    }
                                                                    setActiveJobStartDate={() =>
                                                                        setActiveJobStartDate(item.jobStartDate)
                                                                    }
                                                                    setReviewTypeProfile={() =>
                                                                        setReviewTypeProfile(
                                                                            item.reviewType ? item.reviewType : 0
                                                                        )
                                                                    }
                                                                    setEditMode={() => setEditMode(true)}
                                                                />
                                                            </div>
                                                        ))}
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))}
                                    </Accordion>
                                ) : (
                                    <Noreview
                                        title=""
                                        text="No reviews available"
                                        icon="bi-chat-right-text"
                                        style={{ height: 215 }}
                                    />
                                )}
                            </div>
                            {/* {suspendAccount || releaseOfferId && typeof currentCompanyOfferNextAvailableAction !== 'undefined' && (
                                <div className="d-flex bd-highlight">
                                    <div className="pt-4 bd-highlight" />
                                    <div className={hasCandidate ? 'pt-4 flex-grow-1 bd-highlight text-end' : 'pt-4 pe-2 flex-grow-1 bd-highlight text-end'}>
                                        <ReleaseOfferBtn
                                            id={releaseOfferId}
                                            currentCompanyOfferNextAvailableAction={
                                                currentCompanyOfferNextAvailableAction
                                            }
                                            reOfferId={reOfferId}
                                        />
                                    </div>
                                </div>
                            )} */}

                            {resume && (
                                <>
                                    <div
                                        className="offcanvas offcanvas-end lt-offcanvas-end"
                                        tabIndex={-1}
                                        id="offcanvasRight"
                                        aria-labelledby="offcanvasRightLabel"
                                    >
                                        <div className="offcanvas-header">
                                            <h5 id="offcanvasRightLabel" className="fs-16 fw-600 mb-0 text-capitalize">
                                                Resume Preview - {name}
                                            </h5>
                                            <button
                                                type="button"
                                                className="btn-close text-reset"
                                                data-bs-dismiss="offcanvas"
                                                aria-label="Close"
                                                title="Close"
                                            />
                                        </div>
                                        <div className="offcanvas-body">
                                            <div className="doc-full-size">
                                                {getFileExtension(resume) === 'pdf' && (
                                                    <PdfViewer url={resume} width={810} />
                                                )}
                                                {getFileExtension(resume) === 'docx' && (
                                                    <DocxViewer url={resume} docxSelector={'fullDocxId'} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {children}
            </section>
            {editMode ? (
                <ReviewModal
                    editModeModal={true}
                    userId={id}
                    candidate={candidate}
                    reviewId={activeReviewId}
                    reviewTypeProfile={reviewTypeProfile}
                    reviewTypeList={uniqType as number[]}
                    isJobOfferdisabled={true}
                    jobRole={activeJobTitle}
                    jobStartDate={activeJobStartDate}
                />
            ) : (
                <ReviewModal
                    editModeModal={false}
                    candidate={candidate}
                    offerId={offerId || ''}
                    reviewTypeProfile={
                        !isProgressReviewEnabled && !isExitReviewEnabled ? ReviewType.OnboardingReview : undefined
                    }
                    reviewTypeList={uniqType as number[]}
                    reviewId={null}
                    reviewOffers={reviewOffers}
                    isJobOfferdisabled={false}
                />
            )}
            <DeleteReview reviewId={activeReviewId} />
            <UploadImage
                imageModalType={imageModalType}
                candidatePage={candidatePage}
                hasBanner={!!banner}
                hasAvatar={!!avatar}
                setCroppedImage={setCroppedImage}
            />
            {id && <Report id={id} candidate={!isCompany} />}
        </>
    );
};

export default Profile;

const getGenderValue = (state: GenderEnum | undefined) => {
    switch (state) {
        case GenderEnum.male:
            return 'Male';
        case GenderEnum.female:
            return 'Female';
        case GenderEnum.preferNotToDisclose:
            return 'Prefer not to disclose';
        default:
            return 'prefer Not To Disclose';
    }
};

const ReleaseOfferBtn: React.FC<{
    id: string;
    currentCompanyOfferNextAvailableAction: OfferNextActionEnum;
    reOfferId?: string | null;
}> = ({ id, currentCompanyOfferNextAvailableAction, reOfferId }) => {
    return (
        <Link
            to={queryString.stringifyUrl({
                url: routes.releaseOffer,
                query: { candidate: id, ...(reOfferId && { offerId: reOfferId }) },
            })}
            className={`btn btn-primary me-3 ${
                currentCompanyOfferNextAvailableAction === OfferNextActionEnum.noActionAvailable
                    ? 'btn-disabled disabled'
                    : ''
            }`}
        >
            {currentCompanyOfferNextAvailableAction === OfferNextActionEnum.reOffer ? <i className="bi bi-pencil" /> : <i className="bi bi-file-earmark-text" />}
            {currentCompanyOfferNextAvailableAction === OfferNextActionEnum.reOffer ? 'Revise offer' : 'Release an offer'}
        </Link>
    );
};
