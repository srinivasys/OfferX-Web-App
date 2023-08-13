import { axiosInstance } from './index';
import {
    CandidateProfileResponseType,
    CandidateAdvancedRequestType,
    CandidateListResponseType,
    CandidateGlobalRequestType,
    CandidateOfferHistoryResponseType
} from '../../types/candidate';

export const candidateService = {
    async getList(params: CandidateGlobalRequestType) {
        const { data } = await axiosInstance.get('candidate', {
            params,
        });
        return data as CandidateListResponseType;
    },

    async getListWithAnd(params: CandidateAdvancedRequestType) {
        const { data } = await axiosInstance.get('candidate/GetPaginatedListWithAnd', {
            params,
        });
        return data as CandidateListResponseType;
    },

    async getId(id: string) {
        const { data } = await axiosInstance.get(`candidate/${id}`);
        return data as CandidateProfileResponseType;
    },

    async getProfile() {
        const { data } = await axiosInstance.get(`Candidate/GetMyProfile`);
        return data as CandidateProfileResponseType;
    },

    async update(data: FormData) {
        await axiosInstance.put(`Candidate/UpdateMyCandidateProfile`, data);
    },

    async updateBanner(data: FormData) {
        await axiosInstance.put(`Candidate/UpdateCandidateProfileBannerImage`, data);
    },

    async deleteBanner() {
        await axiosInstance.put(`Candidate/DeleteCandidateProfileBannerImage`);
    },

    async updateAvatar(data: FormData) {
        await axiosInstance.put(`Candidate/UpdateCandidateAvatar`, data);
    },

    async deleteAvatar() {
        await axiosInstance.put(`Candidate/DeleteCandidateAvatar`);
    },

    async deleteResume() {
        await axiosInstance.put(`Candidate/DeleteCandidateResume`);
    },

    async getCandidateOfferHistory(candidateId: string) {
        const { data: responseData } = await axiosInstance.get(`Candidate/${candidateId}/GetCandidateOfferHistory`);
        return responseData as CandidateOfferHistoryResponseType;
    },
};
