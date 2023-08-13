import {ApiResponseType} from "./api";

export type SuspensionType = {
    suspendReasonId: string
    suspendReasonName: string
    suspendReasonOrder: number
    suspendReasonCategoryId: string
    suspendReasonCategoryName: string
    suspendReasonCategoryOrder: number
    suspendReasonText: string
}

export type ReportRequestType = {
    companyId: string
    suspensionReasonList: string[]
    otherText: string
}

export type ReportRequestFromCompanyType = {
    candidateId: string
    suspensionReasonList: string[]
    otherText: string
}

export enum SuspendEnum {
    active,
    suspended,
}
export type SuspensionResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: {
        items: SuspensionType[];
        hasMore: boolean;
        count: number;
    };
};
