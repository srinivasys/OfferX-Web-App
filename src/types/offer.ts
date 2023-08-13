import { ApiResponseType } from './api';
import { GridSortEnum } from './grid';

export enum OfferStateEnum {
    pending,
    accepted,
    rejected,
    retracted,
    expired,
    onboarded,
    ghosted
}

export enum OfferCreationEnum {
    newOffer,
    reOffer,
}

export enum OfferReviewStateEnum {
    offerIsNotInAppropriateStateForReview,
    startDateNotReached,
    availableForReview,
    reviewAlreadyExists,
    thereIsNoOffer,
}

export enum AutomaticReminderEnum {
    never,
    every1Day,
    every2Day,
    every3Day,
    every1Week,
}

export enum FeedbackExperienceEnum {
    VeryBad,
    Bad,
    Average,
    Good,
    Excellent,
}

export type OfferListRquestType = {
    state: OfferStateEnum;
    start: number;
    limit: number;
    sortField: string;
    sortOrder: GridSortEnum;
    startDate?: Date;
    endDate?: Date;
};

export type OfferRequestDataType = {
    jobTitle: string;
    offerExpiryDate: string;
    jobStartDate: string;
    timeZone: string;
    candidateId: string;
    emailSubject: string;
    emailMessage: () => string | undefined;
    automaticReminder: number;
    ReOfferId?: string;
};

export type OfferRequestFeedbackType = {
    offerId: string | null;
    feedbackExperience: FeedbackExperienceEnum | null;
    FeedbackRecommendation : FeedbackRecommendationEnum | null
    text: string;
};

export type CreateOfferResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: {
        value: string;
    };
};

export type OfferDataType = {
    id: string;
    jobTitle: string;
    offerExpiryDate: Date;
    jobStartDate: Date;
    offerDate: Date;
    offerRealeasedById: string;
    offerRealeasedByLastName: string;
    offerRealeasedByFirstName: string;
    companyId: string;
    companyName: string;
    companyAvatarUrl: string;
    candidateId: string;
    candidateFirstName: string;
    candidateLastName: string;
    candidateNumber: number;
    candidateJobTitle: string;
    candidateAvatarUrl: string;
    offerDocumentId: string;
    offerDocumentUrl: string;
    offerState: OfferStateEnum;
    acceptedDate: Date | null;
    rejectedDate: Date | null;
    retractedDate: Date | null;
    expiredDate: Date;
    offerReviewState: OfferReviewStateEnum;
    reviewId: string | null;
    externalForSignatureDocId: string;
    baseOfferId: string | null;
    offerCreationType: OfferCreationEnum;
    offerRejectionReasons: offerRejectionReasonType[];
    offerRetractReasons: offerRetractReasonsType[];
    reviewType: number[];
    reviewOffers: ReviewOfferType[];
};

export type offerRetractReasonsType = {
    id: string;
    reasonId: string;
    reason: string;
    order: number;
    reasonText: string;
};

export type offerRejectionReasonType = {
    id: string;
    reasonId: string;
    reason: string;
    reasonText: string;
    order: number;
};

export type RejectionReasonType = {
    id: string;
    reason: string;
    order: number;
};

export type RejectionReasonRequestType = {
    offerId: string;
    rejectionReasonList: string[];
    reasonText: string | null;
};

export type RetractReasonRequestType = {
    offerId: string;
    retractReasonList: string[];
    reasonText: string | null;
};

export type GetAllRetractReasonsListType = {
    id: string;
    reason: string;
    order: number;
};

export type GetAllRetractReasonsListResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: {
        items: GetAllRetractReasonsListType[];
    };
};

export type OfferListResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: {
        items: OfferDataType[];
        hasMore: boolean;
        count: number;
    };
};

export type OfferResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: OfferDataType;
};

export type RejectionReasonResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: {
        items: RejectionReasonType[];
        hasMore: boolean;
        count: number;
    };
};

export type ExternalSignatureAccessTokenResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: {
        id: string;
    };
};

export type ReviewOfferType = {
    jobRole: string;
    jobStartDate: Date;
    offerId: string;
};

export enum FeedbackRecommendationEnum {
    VeryUnlikely,
    SomeWhatUnlikely,
    Neutral,
    SomeWhatlikely,
    VeryLikely
}