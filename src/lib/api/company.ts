import { axiosInstance } from './index';
import { CompanyListRequestType, CompanyListResponseType, CompanyProfileResponseType } from '../../types/company';

export const companyService = {
    async getList(params: CompanyListRequestType) {
        const { data } = await axiosInstance.get('company', {
            params,
        });
        return data as CompanyListResponseType;
    },

    async getId(id: string) {
        const { data } = await axiosInstance.get(`Company/${id}`);
        return data as CompanyProfileResponseType;
    },

    async getProfile() {
        const { data } = await axiosInstance.get('Company/GetMyCompanyProfile');
        return data as CompanyProfileResponseType;
    },

    async update(data: FormData) {
        await axiosInstance.put(`Company/UpdateMyCompanyProfile`, data);
    },

    async updateBanner(data: FormData) {
        await axiosInstance.put(`Company/UpdateCompanyProfileBannerImage`, data);
    },

    async deleteBanner() {
        await axiosInstance.put(`Company/DeleteCompanyProfileBannerImage`);
    },

    async updateAvatar(data: FormData) {
        await axiosInstance.put(`Company/UpdateCompanyAvatar`, data);
    },

    async deleteAvatar() {
        await axiosInstance.put(`Company/DeleteCompanyAvatar`);
    },
};
