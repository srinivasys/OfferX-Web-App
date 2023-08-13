import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { candidateService } from '../../lib/api/candidate';
import { CandidateOfferHistoryType, CandidateProfileType } from '../../types/candidate';
import { getHighestEducation} from '../../lib/utils/dictionary';
import Profile from '../../components/profile';
import PageLoader from '../../components/loader';
import Error404 from '../../components/errors/404';
import Context from '../../context/update';
import { reviewService } from '../../lib/api/review';
import { CandidateReviewsType } from '../../types/review';
import { isExitReviewEnabled, isProgressReviewEnabled } from '../../lib/utils/reviews-config';
import { GridConstants } from '../../lib/constants/constants';

type Props = RouteComponentProps<{ id: string }>;

const CandidateDetailsPage: React.FC<Props> = ({ match }) => {
    const { id } = match.params;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<CandidateProfileType | null>(null);
    const [offerhistorydata, setOfferhistorysetData] = useState<CandidateOfferHistoryType[]>();
    const [reviewData, setReviewData] = useState<CandidateReviewsType[]>();

    const getProfile = useCallback(async () => {
        if (!id) return;
        try {
            const { resultObject } = await reviewService.getCandidateReview(id);
            setReviewData(resultObject);
            const { resultObject: candidate } = await candidateService.getId(id);
            setData(candidate);
            const { resultObject : candidateHistory } = await candidateService.getCandidateOfferHistory(id);
            setOfferhistorysetData(candidateHistory);
        } catch (err: any) {
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        getProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    window.onpopstate = (event) => {
        sessionStorage.setItem(GridConstants.AreFiltersApplicable, GridConstants.True);
    };

    return loading ? (
        <PageLoader />
    ) : data ? (
        <Context.Provider value={{ updateProfile: getProfile }}>
            <Profile
                id={id}
                avatar={data.avatarUrl}
                banner={data.bannerUrl}
                name={`${data.firstName} ${data.middleName} ${data.lastName}`}
                activity={data.jobTitle + " at "+data.prevCompany}
                location={`${data.cityDistrict}, ${data.state}`}
                releaseOfferId={data.id}
                aboutMe={data.aboutMe ? data.aboutMe : undefined}
                reviewsCount={data.reviewsCount}
                rating={data.rating.value}
                contractCompliance={data.contractComplianceQuantity}
                contractViolation={data.contractViolationQuantity}
                experienceLevel = {data.experienceLevel}
                phone={data.phone}
                email={data.email}
                website={data.website}
                resume={data.resumeFileUrl}
                offerId={data.offerId || ''}
                offerHistory = {offerhistorydata?.map((item)=>({
                    
                    jobTitle:item.jobTitle,
                    offerAcceptedDate:item.offerAcceptedDate,
                    offerState:item.offerState
                }))}
                education={{
                    highestEducation:
                        typeof data.highestEducation === 'number' ? getHighestEducation(data.highestEducation) : '',
                    institutionName: data.institutionName || '',
                    graduationYear: data.graduationYear,
                }}
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
                        replys: item.replys.map((item)=> ({
                            id : item.id,
                            companyReviewId:item.companyReviewId,
                            candidateId:item.candidateId,
                            candidateFirstName:item.candidateLastName,
                            replyText: item.replyText,
                            companyName:item.companyName,
                            date:item.date,
                            offerId:item.offerId
                           
                            })),
                        reviewType: item.reviewType,
                        contractViolationReason: item.contractViolationReason,
                        jobTitle: item.jobTitle,
                        jobStartDate: item.jobStartDate,
                    })),
                    progressReviewList: !isProgressReviewEnabled
                        ? []
                        : item.progressReviews.map((item) => ({
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
                              jobTitle: item.jobTitle,
                              jobStartDate: item.jobStartDate,
                          })),
                    exitReviewList: !isExitReviewEnabled
                        ? []
                        : item.exitReviews.map((item) => ({
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
                              jobTitle: item.jobTitle,
                              jobStartDate: item.jobStartDate,
                          })),
                }))}
                currentCompanyOfferNextAvailableAction={data.currentCompanyOfferNextAvailableAction}
                allCompaniesAcceptedOffersCount={data.allCompaniesAcceptedOffersCount}
                currentCompanyLastEventDetailedText={data.currentCompanyLastEventDetailedText}
                reOfferId={data.reOfferId}
                relationType={data.relationType}
                candidate={id}
                suspendStatus={data.suspendStatus}
                offerReviewState={data.offerReviewState}
                reviewOffers={data.reviewOffers}
                aadhar = {data.aadhar}
                dob = {data.dob}
                gender = {data.gender}
            />
        </Context.Provider>
    ) : (
        <Error404 />
    );
};

export default CandidateDetailsPage;
