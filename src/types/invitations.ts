import { ApiResponseType } from './api';

export enum InviteStatusEnum {
    invited,
    joined,
    deleted,
}

export type CreateInviteRequestType = {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    emailSubject: string;
    emailMessage: string;
};

export type InviteType = {
    id: string;
    active: boolean;
    email: string;
    firstName: string;
    lastName: string;
    middleName: string;
    inviteStatus: InviteStatusEnum;
    invitedDate: Date;
};

export type InviteListResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: {
        items: InviteType[];
        hasMore: boolean;
        count: number;
    };
};
