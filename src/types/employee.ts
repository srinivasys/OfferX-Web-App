import { ManagerPermissionEnum } from './auth';
import { ApiResponseType } from './api';

export enum EmployeeJoinStatusEnum {
    pending,
    joined,
    deleted,
}

export type EmployeeFormType = {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    permissionTypeList: ManagerPermissionEnum[];
};

export type EmployeeType = {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    permissionTypeList: ManagerPermissionEnum[];
    dateAdded: Date;
    joinStatus: number;
};

export type EmployeeListResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: {
        items: EmployeeType[];
        hasMore: boolean;
        count: number;
    };
};

export type EmployeeCreateResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: {
        value: string;
    };
};
