import { ApiResponseType } from './api';

export enum ContractComplianceStateEnum {
    ContractCompliance,
    ContractViolation,
}

export enum ReviewType {
    OnboardingReview,
    ProgressReview,
    ExitReview,
}

export type ReviewRequestType = {
    reviewText: string;
    stars: number;
    contractComplianceState: ContractComplianceStateEnum;
    contractViolationReason: string;
    reviewType: number;
};

export type CreateReviewRequestType = ReviewRequestType & {
    offerId: string;
};

export type EditReviewRequestType = ReviewRequestType & {
    companyReviewId?: string;
    candidateReviewId?: string;
};

export type ExistingReviewType = {
    id: string;
    reviewText: string;
    stars: {
        value: number;
    };
    contractComplianceState: ContractComplianceStateEnum;
    contractViolationReason: string;
    reviewType: number;
};

export type ProfanityFilterResponse = {
    maskedreview: string;
    status: boolean;
};

export type CompanyReviewType = {
    id: string;
    companyAvatarUrl: string;
    managerId: string;
    companyId: string;
    offerId: string;
    companyName: string;
    date: Date;
    reviewText: string;
    stars: {
        value: number;
    };
    contractComplianceState: ContractComplianceStateEnum;
    replys: reply[];
    reviewType?: number;
    contractViolationReason?: string;
};

export type CandidateReviewType = {
    id: string;
    candidateAvatarUrl: string;
    candidateFirstName: string;
    candidateLastName: string;
    candidateId: string;
    companyId: string;
    date: Date;
    offerId: string;
    reviewText: string;
    stars: {
        value: number;
    };
    contractComplianceState: ContractComplianceStateEnum;
    replys: reply[];
    reviewType?: number;
    contractViolationReason?: string;
};

export type CandidateReviewsType = {
    id: string;
    managerId: string;
    companyId: string;
    companyAvatarUrl: string;
    offerId: string;
    companyName: string;
    companyLocation: string;
    date: Date;
    reviewText: string;
    stars: {
        value: number;
    };
    contractComplianceState: ContractComplianceStateEnum;
    candidateReviews: candidateReviews[];
    reviewType: number[];
    contractViolationReason?: string;
    onboardingReviews: candidateReviews[];
    progressReviews: candidateReviews[];
    exitReviews: candidateReviews[];
};

export type candidateReviews = {
    id: string;
    managerId: string;
    companyId: string;
    companyAvatarUrl: string;
    offerId: string;
    companyName: string;
    date: Date;
    reviewText: string;
    stars: {
        value: number;
    };
    contractComplianceState: ContractComplianceStateEnum;
    replys: reply[];
    reviewType: number;
    contractViolationReason?: string;
    jobTitle: string;
    jobStartDate: Date;
};

export type CompanyReviewsType = {
    id: string;
    candidateId: string;
    candidateAvatarUrl: string;
    companyId: string;
    offerId: string;
    candidateFirstName: string;
    candidateLastName: string;
    date: Date;
    reviewText: string;
    stars: number;
    contractComplianceState: ContractComplianceStateEnum;
    companyReviews: CompanyReviews[];
    reviewType: number[];
    contractViolationReason: string;
    jobTitle: string;
    progressReviews: CompanyReviews[];
    onboardingReviews: CompanyReviews[];
    exitReviews: CompanyReviews[];
};

export type CompanyReviews = {
    id: string;
    candidateId: string;
    candidateAvatarUrl: string;
    companyId: string;
    offerId: string;
    companyName: string;
    companyAvatarUrl: string;
    candidateFirstName: string;
    candidateLastName: string;
    date: Date;
    reviewText: string;
    stars: {
        value: number;
    };
    contractComplianceState: ContractComplianceStateEnum;
    replys: reply[];
    reviewType: number;
    contractViolationReason: string;
    jobTitle: string;
    jobStartDate: Date;
};

type reply = {
    id?: string;
    companyReviewId?: string | null;
    candidateFirstName?: string;
    candidateId?: string | null;
    candidateLastName?: string;
    replyText?: string;
    companyName?: string | null;
    date?: Date;
    offerId?: string | null;
};

export type ReviewsCompanyResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: CompanyReviewsType[];
};

export type ReviewsCandidateResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: CandidateReviewsType[];
};

export type ReviewResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: ExistingReviewType;
};
