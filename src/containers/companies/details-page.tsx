import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Profile from '../../components/profile';
import { CompanyProfileType } from '../../types/company';
import { companyService } from '../../lib/api/company';
import PageLoader from '../../components/loader';
import Error404 from '../../components/errors/404';
import Context from '../../context/update';
import { CompanyReviewsType } from '../../types/review';
import { reviewService } from '../../lib/api/review';
import { GridConstants } from '../../lib/constants/constants';

type Props = RouteComponentProps<{ id: string }>;

const CompanyDetailsPage: React.FC<Props> = ({ match }) => {
    const { id } = match.params;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<CompanyProfileType | null>(null);
    const [reviewData, setReviewData] = useState<CompanyReviewsType[]>();

    const getProfile = useCallback(async () => {
        if (!id) return;
        try {
            const { resultObject: company } = await companyService.getId(id);
            setData(company);
            const { resultObject } = await reviewService.getCompanyReview(id);
            setReviewData(resultObject);
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
                name={data.name}
                activity={data.industry}
                location={`${data.cityDistrict}, ${data.state}`}
                address={data.companyAddress}
                aboutUs={data.aboutUs}
                reviewsCount={data.reviewsCount}
                rating={data.rating.value}
                contractCompliance={data.contractComplianceQuantity}
                contractViolation={data.contractViolationQuantity}
                phone={data.phone}
                email={data.email}
                foundedYear={data.foundedYear}
                website={data.webSite}
                relationType={data.relationType}
                suspendStatus={data.suspendStatus}
                offerReviewState={data.offerReviewState}
                candidate={data.id}
                isCompany={true}
                offerId={data.offerId || ''}
                reviewOffers={data.reviewOffers}
                reviewItemsList={reviewData?.map((item) => ({
                    id: item.id,
                    avatar: item.candidateAvatarUrl,
                    name: `${item.candidateFirstName} ${item.candidateLastName}`,
                    text: item.reviewText,
                    date: item.date,
                    contractComplianceState: item.contractComplianceState,
                    rating: item.stars,
                    creatorId: item.candidateId,
                    offerId: item.offerId,
                    reviewType: item.reviewType,
                    contractViolationReason: item.contractViolationReason,
                    location: item.jobTitle,
                    onboardReviewList: item.onboardingReviews.map((item) => ({
                        id: item.id,
                        avatar: item.companyAvatarUrl,
                        name: item.companyName,
                        text: item.reviewText,
                        date: item.date,
                        contractComplianceState: item.contractComplianceState,
                        rating: item.stars.value,
                        creatorId: item.candidateId,
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
                    progressReviewList: item.progressReviews.map((item) => ({
                        id: item.id,
                        avatar: item.companyAvatarUrl,
                        name: item.companyName,
                        text: item.reviewText,
                        date: item.date,
                        contractComplianceState: item.contractComplianceState,
                        rating: item.stars.value,
                        creatorId: item.candidateId,
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
                        creatorId: item.candidateId,
                        offerId: item.offerId,
                        reviewType: item.reviewType,
                        contractViolationReason: item.contractViolationReason,
                    })),
                }))}
            />
        </Context.Provider>
    ) : (
        <Error404 />
    );
};

export default CompanyDetailsPage;
