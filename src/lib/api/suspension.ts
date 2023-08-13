import {axiosInstance} from "./index";
import {ReportRequestFromCompanyType, ReportRequestType, SuspensionResponseType} from "../../types/suspension";

export const suspensionService = {
    async getList() {
        const {data} = await axiosInstance.get('Suspension/GetAllSuspensionReasonsList');
        return data as SuspensionResponseType;
    },

    async report(data: ReportRequestType) {
        await axiosInstance.post('CompanySuspension/ReportFromCandidate', data);
    },

    async reportFromCompany(data: ReportRequestFromCompanyType ){
        await axiosInstance.post('CandidateSuspension/ReportFromCompany', data);
    }
}