import { RelationEnum } from '.';
import { ApiResponseType } from './api';
import { OfferReviewStateEnum, ReviewOfferType } from './offer';
import { CandidateReviewType } from './review';
import { SuspendEnum } from './suspension';

export type CompanyListRequestType = {
    Start: number;
    Limit: number;
    'SearchParam.FilterValue'?: string;
};

export type CompanyProfileType = {
    id: string;
    active: boolean;
    name: string;
    gstNumber: {
        value: string | null;
    };
    companyAddress: string;
    cityDistrict: string;
    state: string;
    country: string;
    postalCode: string;
    email: string;
    webSite: string;
    avatarUrl: string;
    bannerUrl: string;
    companyReviews: CandidateReviewType[];
    reviewsCount: number;
    rating: {
        value: number;
    };
    contractComplianceQuantity: number;
    contractViolationQuantity: number;
    industry: string;
    foundedYear: number;
    aboutUs: string;
    phone: string;
    relationType: RelationEnum;
    suspendStatus: SuspendEnum;
    offerId?: string;
    offerReviewState: OfferReviewStateEnum;
    reviewOffers: ReviewOfferType[];
};

export type CompanyProfileResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: CompanyProfileType;
};

export type EditCompanyFormType = {
    name: string;
    gstNumber: string | null;
    industry: string;
    foundedYear: number;
    aboutUs: string;
    phone: string;
    companyAddress: string;
    cityDistrict: string;
    state: string;
    postalCode: string;
    email: string;
    webSite: string;
};

export type UpdateCompanyRequestType = Omit<EditCompanyFormType, 'foundedYear'> & {
    foundedYear: number;
};

export type CompanyListResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: {
        items: CompanyProfileType[];
        hasMore: boolean;
        count: number;
    };
};
