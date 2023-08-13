import { ApiResponseType } from './api';

export enum NotificationTypeEnum {
    offerCreated,
    offerAccepted,
    offerRetracted,
    offerRejected,
    companyReviewAdded,
    candidateSignedUpByInvitation,
    managerSignedUpByEmployeeManagement,
    candidateReviewAdded,
    adminSignedUpBySuperAdminUserManagement,
    reportEmployerForCandidate,
    reportEmployerForAdmin,
    suspendEmployerForAdmin,
    suspendEmployerForCompany,
    suspendEmployerForCandidate,
    reportCandidateForEmployer,
    reportCandidateForAdmin,
    unsuspendEmployerForAdmin,
    unsuspendEmployerForCompany,
    unsuspendEmployerForCandidate,
    suspendCandidateForAdmin,
    suspendCandidateForCandidate,
    suspendCandidateForEmployer,
    unsuspendCandidateForAdmin,
    unsuspendCandidateForCompany,
    unsuspendCandidateForCandidate,
    ReplyByCompany,
    ReplyByCandidate
}

export enum NotificationStateEnum {
    new,
    read,
}

export type NotificationType = {
    notificationId: string;
    notificationType: NotificationTypeEnum;
    recipientId: string;
    recipientEmail: string;
    companyId: string | null;
    message: string;
    date: Date;
    avatarUrl: string;
    state: NotificationStateEnum;
    offerId?: string;
    candidateId?: string;
};

export type NotificationListResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: {
        items: NotificationType[];
        hasMore: boolean;
        count: number;
    };
};

export type GetUnreadCountResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: number;
};
