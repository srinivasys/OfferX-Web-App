import { axiosInstance } from './index';
import { profanityurl } from '../../config/constants';
import {
    CreateReviewRequestType,
    EditReviewRequestType,
    ReviewResponseType,
    ReviewsCandidateResponseType,
    ReviewsCompanyResponseType,
    ProfanityFilterResponse
} from '../../types/review';

export const reviewService = {
    async createCandidate(data: CreateReviewRequestType) {
        await axiosInstance.post('CandidateReview', data);
    },

    async editCandidate(data: EditReviewRequestType) {
        await axiosInstance.put('CandidateReview', data);
    },

    async getCandidate(reviewcandidateId: string) {
        const { data: responseData } = await axiosInstance.get(`CandidateReview/${reviewcandidateId}`);
        return responseData as ReviewResponseType;
    },

    async deleteCandidate(id: string) {
        await axiosInstance.delete(`CandidateReview/${id}`);
    },

    async createCompany(data: CreateReviewRequestType) {
        await axiosInstance.post('CompanyReview', data);
    },

    async editCompany(data: EditReviewRequestType) {
        await axiosInstance.put('CompanyReview', data);
    },

    async getCompany(companyReviewId: string) {
        const { data: responseData } = await axiosInstance.get(`CompanyReview/${companyReviewId}`);
        return responseData as ReviewResponseType;
    },

    async deleteCompany(id: string) {
        await axiosInstance.delete(`CompanyReview/${id}`);
    },

    async getCandidateReview(candidateId: string) {
        const { data: responseData } = await axiosInstance.get(`CandidateReview/${candidateId}/GetCandidate`);
        return responseData as ReviewsCandidateResponseType;
    },
    async getCompanyReview(reviewcompanyId: string) {
        const { data: responseData } = await axiosInstance.get(`CompanyReview/${reviewcompanyId}/GetCompany`);
        return responseData as ReviewsCompanyResponseType;
    },
    async checkProfanityFilter(reviewtext: string) {
        const { data: profanityfilterresponse } = await axiosInstance.post(profanityurl, {
            message: reviewtext,
        });

        return profanityfilterresponse as ProfanityFilterResponse;
    },
};
