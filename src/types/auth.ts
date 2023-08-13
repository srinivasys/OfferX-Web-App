import { ExperienceLevelEnum } from '../lib/constants/constants';
import { ApiResponseType } from './api';

export enum SocialEnum {
    microsoft,
    google,
    linkedIn,
    amazon,
}
export type SocialEnumKeyType = keyof typeof SocialEnum;

export enum HighestEducationEnum {
    NohighSchoolDiplomaOrGed,
    HighSchoolDiplomaOrGed,
    Vocational_TradeDegree_MilitaryTraining,
    SomeCollege_NotEnrolledNow,
    CurrentlyEnrolledInCollege,
    BachelorsOrAssociateDegree,
    GraduateWorkOrGraduateDegree,
}

export enum UserRoleEnum {
    manager,
    candidate,
}

export enum GenderEnum {
    male,
    female,
    preferNotToDisclose,
}

export enum ManagerPermissionEnum {
    admin,
    offerManager,
    owner,
}

export type socialSignInType = {
    Email: string;
    AuthType: SocialEnum;
    Token: string;
};

type CandidateFormsType = {
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Email: string;
    JobTitle: string;
    CityDistrict: string;
    State: string;
    Country: string;
    Dob: Date;
    Gender: GenderEnum;
    Phone: string;
    Aadhar: string;
    HighestEducation: HighestEducationEnum | string | null;
    ExperienceLevel : ExperienceLevelEnum | string | null;
    PrevCompany : string;
};

export type CandidateFormData = Omit<CandidateFormsType, 'Dob' | 'Gender' | 'HighestEducation' | 'ExperienceLevel'> & {
    Dob: Date | null;
    Gender: GenderEnum | undefined;
    HighestEducation: HighestEducationEnum | string | null;
    ExperienceLevel : ExperienceLevelEnum | string | null;
};

export type CandidateRequestType = CandidateFormsType & {
    InvitationId?: string;
    AuthType: SocialEnum;
    Token: string;
};

export type ManagerFormsType = {
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Email: string;
    CompanyName: string;
    GstNumber: string | null;
    CompanyAddress: string;
    CityDistrict: string;
    State: string;
    Country: string;
    PostalCode: string;
    CompanyEmail: string;
    Phone: string;
    WebSite: string;
};

export type ManagerRequestType = ManagerFormsType & {
    AuthType: SocialEnum;
    Token: string;
};

export type ManagerJoinByInvitationType = {
    Email: string;
    InvitationId: string;
};

export type AuthResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: {
        accessToken: string;
        authType: any;
    };
};

export type UserType = {
    id: string;
    active: boolean;
    email: string;
    role: UserRoleEnum;
    firstName: string;
    lastName: string;
    middleName: string;
    website: string;
    jobTitle: string | null;
    rating: {
        value: number;
    };
    companyId: string | null;
    companyName: string | null;
    avatarUrl: string;
    permissionTypes: ManagerPermissionEnum[] | null;
    offerCount: number;
    pendingOfferCount: number
    acceptedOfferCount: number;
    onboardedOfferCount: number;
    ghostedOfferCount: number;
    declinedOfferCount: number;
    retractedOfferCount: number;
    expiredOfferCount: number;
    
};

export type UserResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: UserType;
};

export type LinkedinResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: {
        firstName: string;
        lastName: string;
        emailAddress: string;
        accessToken: string;
    };
};
