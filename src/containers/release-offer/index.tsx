import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string';
import { CandidateListType, CandidateProfileType } from '../../types/candidate';
import { candidateService } from '../../lib/api/candidate';
import ReleaseOfferCandidate from './candidate';
import ReleaseOfferDocument, { OfferFormDataType } from './document';
import history from '../../history';
import ReleaseOfferEmail, { OfferFormEmailType } from './email';
import { OfferRequestDataType } from '../../types/offer';
import { offerService } from '../../lib/api/offer';
import ReleaseOfferSuccess from './success';
import { routes } from '../routes/routes-names';
import PageLoader from '../../components/loader';
import { ReactFilesFile } from '../../types/files';
import { getFileExtension, getFileName } from '../../lib/utils/file-extension';
import { CandidateReviewsType, CompanyReviewType } from '../../types/review';
import { reviewService } from '../../lib/api/review';
import { GridConstants } from '../../lib/constants/constants';
import moment from 'moment';

type Props = RouteComponentProps;

export type ReleaseOfferReviewsType = {
    contractViolationQuantity: number;
    contractComplianceQuantity: number;
    candidateReviews: CompanyReviewType[];
};

const ReleaseOffer: React.FC<Props> = ({ location }) => {
    const { candidate: queryCandidate, offerId } = queryString.parse(location.search);
    const [startLoading, setStartLoading] = useState(!!queryCandidate);
    const [requestLoading, setRequestLoading] = useState(false);
    const [candidate, setCandidate] = useState<CandidateListType | null>(null);
    const [candidateReviews, setCandidateReviews] = useState<ReleaseOfferReviewsType | null>(null);
    const [docValues, setDocValues] = useState<OfferFormDataType | null>(null);
    const [emailValues, setEmailValues] = useState<OfferFormEmailType | null>(null);
    const [activeTab, setActiveTab] = useState('offer-candidate');
    const [createdId, setCreatedId] = useState('');
    const [reviewData, setReviewData] = useState<CandidateReviewsType[]>();
    const [reOfferTab, setOfferTab] = useState<boolean>(true);
    let reOfferState = location.search && reOfferTab && candidate?.reOfferId;

    const getProfile = useCallback(async () => {
        try {
            if (candidate?.id) {
                const { resultObject } = await reviewService.getCandidateReview(
                    candidate?.id !== undefined ? candidate.id : ''
                );
                setReviewData(resultObject);
            }
        } catch (err: any) {
        } finally {
        }
    }, [candidate, offerId]);

    useEffect(() => {
        location.search && setActiveTab('offer-document'); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offerId]);

    useEffect(() => {
        getProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [candidate, emailValues, docValues, offerId]);

     const castDate = (dateValue: string | Date,format:string)=>{

        return moment(dateValue).format(format);
        
        }

    const submitForm = useCallback(async () => {
        if (!candidate || !docValues || !emailValues) return;
        const { file, ...docData } = docValues;
        const value: OfferRequestDataType = {
            jobTitle: docData.jobTitle,
            offerExpiryDate: castDate(docData.offerExpiryDate as Date,'yyyy/MM/DD HH:mm'),
            jobStartDate: castDate(docData.jobStartDate as Date,'yyyy/MM/DD HH:mm'),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            candidateId: candidate.id,
            ...emailValues,
            ...(offerId && { ReOfferId: offerId as string }),
        };
        let formData = new FormData();
        formData.append('file', file as File);
        formData.append('value', JSON.stringify(value));
        try {
            setRequestLoading(true);
            const {
                resultObject: { value },
            } = await offerService.create(formData);
            setCreatedId(value);
            setActiveTab('offer-success');
            history.replace({ search: '' });
        } catch (err) {
        } finally {
            setRequestLoading(false);
        }
    }, [candidate, emailValues, docValues, offerId]);

    const tabs = useMemo(
        () => [
            {
                key: 'offer-candidate',
                component: (
                    <ReleaseOfferCandidate
                        candidateReviews={candidateReviews}
                        setCandidate={(candidate) => {
                            setCandidate(candidate);
                            setCandidateReviews(null);
                            setOfferTab(false);
                        }}
                        candidate={candidate}
                        disabledSelect={!!offerId}
                        goNext={() => setActiveTab('offer-document')}
                    />
                ),
            },
            {
                key: 'offer-document',
                component: (
                    <ReleaseOfferDocument
                        docValues={docValues}
                        candidate={candidate}
                        reOfferState={reOfferState as boolean}
                        candidateReviews={candidateReviews}
                        setDocValues={setDocValues}
                        goPrev={() => setActiveTab('offer-candidate')}
                        goNext={() => setActiveTab('offer-email')}
                        reviewItemsList={reviewData?.map((item) => ({
                            id: item.id,
                            avatar: item.companyAvatarUrl,
                            name: item.companyName,
                            text: item.reviewText,
                            date: item.date,
                            contractComplianceState: item.contractComplianceState,
                            rating: item.stars,
                            creatorId: item.companyId,
                            offerId: item.offerId,
                            reviewType: item.reviewType,
                            contractViolationReason: item.contractViolationReason,
                            location: item.companyLocation,
                            onboardReviewList: item.onboardingReviews.map((item) => ({
                                id: item.id,
                                avatar: item.companyAvatarUrl,
                                name: item.companyName,
                                text: item.reviewText,
                                date: item.date,
                                contractComplianceState: item.contractComplianceState,
                                rating: item.stars.value,
                                creatorId: item.companyId,
                                offerId: item.offerId,
                                reviewType: item.reviewType,
                                contractViolationReason: item.contractViolationReason,
                            })),
                            progressReviewList: item.progressReviews.map((item) => ({
                                id: item.id,
                                avatar: item.companyAvatarUrl,
                                name: item.companyName,
                                text: item.reviewText,
                                date: item.date,
                                contractComplianceState: item.contractComplianceState,
                                rating: item.stars.value,
                                creatorId: item.companyId,
                                offerId: item.offerId,
                                reviewType: item.reviewType,
                                contractViolationReason: item.contractViolationReason,
                            })),
                            exitReviewList: item.exitReviews.map((item) => ({
                                id: item.id,
                                avatar: item.companyAvatarUrl,
                                name: item.companyName,
                                text: item.reviewText,
                                date: item.date,
                                contractComplianceState: item.contractComplianceState,
                                rating: item.stars.value,
                                creatorId: item.companyId,
                                offerId: item.offerId,
                                reviewType: item.reviewType,
                                contractViolationReason: item.contractViolationReason,
                            })),
                        }))}
                    />
                ),
            },
            {
                key: 'offer-email',
                component: (
                    <ReleaseOfferEmail
                        candidate={candidate as CandidateListType}
                        docValues={docValues as OfferFormDataType}
                        emailValues={emailValues}
                        setEmailValues={setEmailValues}
                        goPrev={() => setActiveTab('offer-document')}
                        submitForm={submitForm}
                        loading={requestLoading}
                        reofferState={reOfferState as boolean}
                    />
                ),
            },
        ],
        [candidate, docValues, emailValues, submitForm, requestLoading, candidateReviews, offerId, reviewData]
    );

    window.onpopstate = (event) => {
        sessionStorage.setItem(GridConstants.AreFiltersApplicable, GridConstants.True);
    };

    useEffect(() => {
        if (!queryCandidate) return;
        (async function () {
            try {
                const { resultObject: candidateProfile } = await candidateService.getId(queryCandidate as string);
                setCandidateReviews(mapTypeProfileToReviews(candidateProfile));
                setCandidate(mapTypeProfileToList(candidateProfile));
                if (offerId) {
                    const { resultObject: offer } = await offerService.get(offerId as string);
                    const file = await getFileFromUrl(offer.offerDocumentUrl);
                    const docValues = {
                        jobTitle: offer.jobTitle,
                        offerExpiryDate: new Date(offer.offerExpiryDate),
                        jobStartDate: new Date(offer.jobStartDate),
                        file,
                    };
                    setDocValues(docValues);
                }
            } catch (err: any) {
                history.replace({ search: '' });
            } finally {
                setStartLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Get reviews from candidate profile when candidate changed
    useEffect(() => {
        if (candidateReviews || !candidate) return;
        (async function () {
            try {
                const { resultObject: candidateProfile } = await candidateService.getId(candidate.id);
                setCandidateReviews(mapTypeProfileToReviews(candidateProfile));
            } catch (err: any) {
            }
        })();
    }, [candidate, candidateReviews]);

    return startLoading ? (
        <PageLoader />
    ) : activeTab === 'offer-success' ? (
        <ReleaseOfferSuccess
            createdId={createdId}
            docValues={docValues as OfferFormDataType}
            candidateName={`${candidate?.firstName} ${candidate?.lastName}`}
        />
    ) : (
        <>
            <div className="company-page-contener">
                <div className="row mt-4 mb-2">
                    <nav aria-label="breadcrumb">
                        <span className="mt-2 text-secondary">
                            <span onClick={() => history.goBack()} className="cursor-pointer">
                                <i className="bi bi-chevron-left lt-text-secondary-alt me-0"></i> Back
                            </span>
                        </span>
                    </nav>
                </div>
                <div className="release-offer-container">
                    <div className="d-flex align-items-center">
                        <div className="flex-grow-1 text-start">
                            <h1 className="fw-700 fs-20 page-header-title mb-0 lt-text-secondary">
                                {reOfferState ? 'Revise offer' : 'Release offer'}
                            </h1>
                        </div>
                        <div className="flex-shrink-1 text-sm-center">
                            <a className="lt-icon-button me-4 fs-14" href="/offers">
                                <i className="bi bi-trash me-0"></i>
                                <span className="fs-14">Discard offer</span>
                            </a>
                        </div>
                    </div>
                    <div
                        className="nav d-flex justify-content-center ox-muti-steper nav-pills lt-bg-gray-10 py-4"
                        id="v-pills-tab"
                        role="tablist"
                        aria-orientation="horizontal"
                    >
                        {!reOfferState && (
                            <div
                                className={`step-nav-link text-start d-flex align-items-center disabled ${
                                    activeTab === 'offer-candidate' ? 'active' : ''
                                } ${
                                    activeTab === 'offer-document' || activeTab === 'offer-email' ? 'step-complete' : ''
                                }`}
                                data-bs-toggle="pill"
                                aria-selected={activeTab === 'offer-candidate'}
                            >
                                <div>
                                    <span>1</span>
                                </div>
                                <span>Select candidate</span>
                            </div>
                        )}
                        <div
                            className={`step-nav-link text-start disabled d-flex align-items-center ${
                                activeTab === 'offer-document' ? 'active' : ''
                            } ${activeTab === 'offer-email' ? 'step-complete' : ''}`}
                            data-bs-toggle="pill"
                            aria-selected={activeTab === 'offer-document'}
                        >
                            {reOfferState ? (
                                <>
                                    <div>
                                        <span>1</span>
                                    </div>
                                    <span>Revise offer details</span>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <span>2</span>
                                    </div>
                                    <span>Add offer details</span>
                                </>
                            )}
                        </div>
                        <div
                            className={`step-nav-link text-start disabled d-flex align-items-center ${
                                activeTab === 'offer-email' ? 'active' : ''
                            }`}
                            id="ReviewSend"
                            data-bs-toggle="pill"
                            aria-selected={activeTab === 'offer-email'}
                        >
                            {reOfferState ? (
                                <>
                                    <div>
                                        <span>2</span>
                                    </div>
                                    <span>Release offer</span>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <span>3</span>
                                    </div>
                                    <span>Release offer</span>
                                </>
                            )}
                        </div>
                    </div>
                    {/* <div className="ox-job-buttons">
                    <div className="d-flex align-items-center justify-content-center">
                    <button type="button" className="btn btn-outline-secondary ox-next-button me-4" disabled>Previous</button>
                        <button type="button" className="btn btn-primary ox-next-button" disabled>Next</button></div>
                        
                    </div> */}
                    <div className="d-flex align-items-center justify-content-center">
                        <div className="col-md-8">
                            <div className="tab-content" id="v-pills-tabContent">
                                <div
                                    className="tab-pane fade show active"
                                    id="AddCandidateTab"
                                    role="tabpanel"
                                    aria-labelledby="AddCandidate"
                                >
                                    <div className="card step-content-box lt-bg-gray-10 p-4">
                                        {tabs.find((item) => item.key === activeTab)?.component}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReleaseOffer;

async function getFileFromUrl(url: string) {
    const name = getFileName(url);
    const extension = getFileExtension(url);
    const response = await fetch(url);
    const data = await response.blob();
    const file = new File([data], `${name}.${extension}`, {
        type: `application/${extension}`,
    });
    const reactFile = file as ReactFilesFile;
    reactFile.preview = {
        type: 'file',
        url: URL.createObjectURL(file),
    };
    reactFile.id = name;
    reactFile.extension = extension;
    return reactFile;
}

const mapTypeProfileToList = (candidateProfile: CandidateProfileType) => ({
    id: candidateProfile.id,
    firstName: candidateProfile.firstName,
    lastName: candidateProfile.lastName,
    jobTitle: candidateProfile.jobTitle,
    cityDistrict: candidateProfile.cityDistrict,
    state: candidateProfile.state,
    institutionName: candidateProfile.institutionName,
    avatarUrl: candidateProfile.avatarUrl,
    rating: candidateProfile.rating.value,
    reviewsCount: candidateProfile.reviewsCount,
    aboutMe: candidateProfile.aboutMe,
    phone: candidateProfile.phone,
    email: candidateProfile.email,
    website: candidateProfile.website,
    highestEducation: candidateProfile.highestEducation,
    graduationYear: candidateProfile.graduationYear,
    allCompaniesAcceptedOffersCount: candidateProfile.allCompaniesAcceptedOffersCount,
    currentCompanyOfferNextAvailableAction: candidateProfile.currentCompanyOfferNextAvailableAction,
    currentCompanyLastEventShortText: candidateProfile.currentCompanyLastEventShortText,
    currentCompanyLastEventDetailedText: candidateProfile.currentCompanyLastEventDetailedText,
    reOfferId: candidateProfile.reOfferId,
    contractComplianceQuantity: candidateProfile.contractComplianceQuantity,
    contractViolationQuantity: candidateProfile.contractViolationQuantity,
    experienceLevel : candidateProfile.experienceLevel,
});

const mapTypeProfileToReviews = (candidateProfile: CandidateProfileType) => ({
    contractViolationQuantity: candidateProfile.contractViolationQuantity,
    contractComplianceQuantity: candidateProfile.contractComplianceQuantity,
    candidateReviews: candidateProfile.candidateReviews,
});
