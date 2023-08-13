import { ExperienceLevelEnum } from '../lib/constants/constants';
import { ApiResponseType } from './api';
import { GenderEnum, HighestEducationEnum, UserRoleEnum } from './auth';
import { RelationEnum, SortTypeEnum } from './index';
import { OfferReviewStateEnum, OfferStateEnum, ReviewOfferType } from './offer';
import { CompanyReviewType } from './review';
import { SuspendEnum } from './suspension';

export enum OfferNextActionEnum {
    releaseAnOffer,
    reOffer,
    noActionAvailable,
}

export type CandidateAdvancedRequestType = {
    Start: number;
    Limit: number;
    'FirstName.FilterValue'?: string;
    'FirstName.SortType'?: SortTypeEnum;
    'LastName.FilterValue'?: string;
    'LastName.SortType'?: SortTypeEnum;
    'JobTitle.FilterValue'?: string;
    'JobTitle.SortType'?: SortTypeEnum;
    'CityDistrict.FilterValue'?: string;
    'CityDistrict.SortType'?: SortTypeEnum;
    'State.FilterValue'?: string;
    'State.SortType'?: SortTypeEnum;
    'InstitutionName.FilterValue'?: string;
    'InstitutionName.SortType'?: SortTypeEnum;
    'Email.FilterValue'?: string;
    'Email.SortType'?: SortTypeEnum;
    'Phone.FilterValue'?: string;
    'Phone.SortType'?: SortTypeEnum;
};

export type CandidateGlobalRequestType = {
    Start: number;
    Limit: number;
    'SearchParam.FilterValue'?: string;
};

export type CandidateProfileType = {
    id: string;
    active: boolean;
    email: string;
    role: UserRoleEnum;
    firstName: string;
    middleName: string;
    lastName: string;
    avatarUrl: string;
    bannerUrl: string;
    jobTitle: string;
    cityDistrict: string;
    state: string;
    website: string;
    highestEducation: HighestEducationEnum | null;
    institutionName: string | null;
    graduationYear: number;
    candidateReviews: CompanyReviewType[];
    reviewsCount: number;
    rating: {
        value: number;
    };
    contractComplianceQuantity: number;
    contractViolationQuantity: number;
    aboutMe: string | null;
    phone: string | null;
    candidateNumber: number;
    resumeFileUrl: string;
    reOfferId: string | null;
    allCompaniesAcceptedOffersCount: number;
    currentCompanyLastEventShortText: string | null;
    currentCompanyLastEventDetailedText: string | null;
    currentCompanyOfferNextAvailableAction: OfferNextActionEnum;
    dob: Date;
    gender: GenderEnum;
    aadhar: string;
    country: string;
    relationType: RelationEnum;
    suspendStatus?: SuspendEnum;
    offerId?: string | null;
    offerReviewState: OfferReviewStateEnum;
    progressReviews: CompanyReviewType[];
    onboardingReviews: CompanyReviewType[];
    exitReviews: CompanyReviewType[];
    reviewOffers: ReviewOfferType[];
    prevCompany:string;
    experienceLevel: ExperienceLevelEnum ;
};

export type CandidateOfferHistoryType = {

    jobTitle: string;
    offerAcceptedDate: Date;
    offerState: OfferStateEnum;

};

export type EditCandidateFormType = {
    firstName: string;
    middleName: string;
    lastName: string;
    avatarUrl: string;
    jobTitle: string;
    cityDistrict: string;
    state: string;
    aboutMe: string;
    website: string;
    phone: string;
    highestEducation: HighestEducationEnum | string | null;
    institutionName: string;
    graduationYear: string;
    dob: Date;
    gender: GenderEnum;
    aadhar: string;
    country: string;
    prevCompany:string
    experienceLevel: ExperienceLevelEnum | string | null;
};

export type UpdateCandidateRequestType = Omit<EditCandidateFormType, 'graduationYear'|'prevCompany'> & {
    graduationYear: number;
    prevCompany:string | null;
};

export type CandidateListType = {
    id: string;
    firstName: string;
    lastName: string;
    jobTitle: string;
    cityDistrict: string;
    state: string;
    institutionName: string | null;
    avatarUrl: string | null;
    rating: number;
    reviewsCount: number;
    aboutMe: string | null;
    phone: string | null;
    email: string;
    website: string;
    highestEducation: HighestEducationEnum | null;
    graduationYear: number;
    allCompaniesAcceptedOffersCount: number;
    currentCompanyLastEventShortText: string | null;
    currentCompanyLastEventDetailedText: string | null;
    currentCompanyOfferNextAvailableAction: OfferNextActionEnum;
    reOfferId: string | null;
    suspendedStatus?: SuspendEnum;
    progressReviews?: CompanyReviewType[];
    onboardingReviews?: CompanyReviewType[];
    exitReviews?: CompanyReviewType[];
    contractComplianceQuantity?: number;
    contractViolationQuantity?: number;
    experienceLevel : ExperienceLevelEnum;
};

export type CandidateListResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: {
        items: CandidateListType[];
        hasMore: boolean;
        count: number;
    };
};

export type CandidateProfileResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: CandidateProfileType;
};

export type CandidateOfferHistoryResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: CandidateOfferHistoryType[];
};
