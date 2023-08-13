
import { ApiResponseType } from './api';

export type getAllMonthWiseOffersCount = getAllOffersArray & {
    totalOffersReleased: number,
    totalOffersAccepted: number,
    totalOffersRejected: number,
    totalOffersExpired: number,
    totalOffersRetracted: number,
};

export type getAllOffersArray = {
    offersReleased: number[],
    offersAccepted: number[],
    offersRejected: number[],
    offersExpired: number[],
    offersRetracted: number[]
};
export type seriesArray = {
    name: string,
    data: number[]
};

export type getCandidateRatingsType = {
    candidateComplianceViolationCounts: candidateComplianceViolationType,
    candidateStarRatingCounts: candidateStarRatingType,
};

export type getCompanyRatingsType = {
    companyComplianceViolationCounts: candidateComplianceViolationType,
    companyStarRatingCounts: candidateStarRatingType,
};

export type candidateComplianceViolationType = {
    totalCount: number,
    complianceCount: number,
    violationCount: number
};

export type candidateStarRatingType = {
    violationCount: number;
    stars5Count: number,
    stars4Count: number,
    stars3Count: number,
    stars2Count: number,
    stars1Count: number,
    stars5Percentage: number,
    stars4Percentage: number,
    stars3Percentage: number,
    stars2Percentage: number,
    stars1Percentage: number
};

export type getAllOffersCountType = {
    totalOffersReleased: number,
    totalOffersAccepted: number,
    totalOffersRejected: number,
    totalOffersExpired: number,
    offersReleasedGrowth: number,
    offersAcceptedGrowth: number,
    offersRejectedGrowth: number,
    offersExpiredGrowth: number
};

export type getAllRecruiterOffersType = { 
    id: number,
    fullName:string,
    firstName: string,
    middleName: string,
    lastName: string,
    totalOffersReleased: number,
    totalOffersAccepted: number,
    totalOffersRejected: number,
    totalOffersExpired: number,
    totalOffersRetracted: number
};

export type getAllRecruiterOffersRequestType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: { items: getAllRecruiterOffersType[], hasMore: boolean, count: number  };
};

export type getAllOffersCountRequestType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: getAllOffersCountType;
};

export type getCandidateRatingsRequestType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: getCandidateRatingsType;
};

export type getCompanyRatingsRequestType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: getCompanyRatingsType;
};

export type getAllMonthWiseOffersCountRequestType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: getAllMonthWiseOffersCount;
};

export type getMyCompanyProfileRequestType = Pick<ApiResponseType, 'resultObject'> & {
    resultObject: { id: string }
}; 