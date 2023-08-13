import { ExperienceLevelEnum } from "../lib/constants/constants";

export type LsCompanyType = {
    id: string;
    name: string;
    cityDistrict: string;
    state: string;
    avatarUrl: string | null;
    industry: string;
};

export type LsCandidateType = {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    jobTitle: string;
    cityDistrict: string;
    state: string;
    allCompaniesAcceptedOffersCount?: number;
    currentCompanyLastEventShortText?: string | null;
};
