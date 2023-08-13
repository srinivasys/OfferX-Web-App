import { axiosInstance } from "."
import { getAllMonthWiseOffersCountRequestType, getAllOffersCountRequestType, getAllRecruiterOffersRequestType, getCandidateRatingsRequestType, getCompanyRatingsRequestType, getMyCompanyProfileRequestType } from "../../types/dashboard";


export const dashboardServices = {
    async getMyCompanyProfile() {
        const { data } = await axiosInstance.get('Company/GetMyCompanyProfile');
        return data as getMyCompanyProfileRequestType;
    },

    async getAllMonthWiseOffersCount(companyId: string, year: number) {
        const { data } = await axiosInstance.get(`Dashboard/GetAllMonthWiseOffersCount?CompanyId=${companyId}&Year=${year}`);
        return data as getAllMonthWiseOffersCountRequestType;
    },

    async getCandidateRatings(companyId: string, year: number) {
        const {data} = await axiosInstance.get(`Dashboard/GetCandidateRatings?CompanyId=${companyId}&Year=${year}`);
        return data as getCandidateRatingsRequestType;
    },

    async getAllOffersCount (companyId:string, year: number) {
        const {data} = await axiosInstance.get(`Dashboard/GetAllOffersCount?CompanyId=${companyId}&Year=${year}`);
        return data as getAllOffersCountRequestType;
    },

    async getCompanyRatings (companyId: string, year: number){
        const {data} = await axiosInstance.get(`Dashboard/GetCompanyRatings?CompanyId=${companyId}&Year=${year}`);
        return data as getCompanyRatingsRequestType;
    },

    async getAllRecruiterOffers (companyId: string, year: number){
        const {data} = await axiosInstance.get(`Dashboard/GetAllRecruiterOffers?CompanyId=${companyId}&Year=${year}`);
        return data as getAllRecruiterOffersRequestType;
    },
}