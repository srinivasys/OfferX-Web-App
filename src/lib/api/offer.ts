import { axiosInstance } from './index';
import {
    CreateOfferResponseType,
    ExternalSignatureAccessTokenResponseType,
    GetAllRetractReasonsListResponseType,
    OfferListResponseType,
    OfferListRquestType,
    OfferRequestFeedbackType,
    OfferResponseType,
    RejectionReasonRequestType,
    RejectionReasonResponseType,
    RetractReasonRequestType,
} from '../../types/offer';

export const offerService = {
    async create(data: FormData) {
        const { data: responseData } = await axiosInstance.post('Offer', data);
        return responseData as CreateOfferResponseType;
    },

    async getList(params: OfferListRquestType) {
        const { data: responseData } = await axiosInstance.get('Offer/GetOffers', {
            params,
        });
        return responseData as OfferListResponseType;
    },

    async get(id: string) {
        const { data: responseData } = await axiosInstance.get(`Offer/${id}`);
        return responseData as OfferResponseType;
    },

    async accept(id: string) {
        await axiosInstance.put(`Offer/${id}/Accept`);
    },

    async reject(data: RejectionReasonRequestType) {
        await axiosInstance.put(`Offer/Reject`, data);
    },

    async retract(id: string) {
        await axiosInstance.put(`Offer/${id}/Retract`);
    },

    async delete(id: string) {
        await axiosInstance.delete(`Offer/${id}`);
    },

    async getExternalSignatureAccessToken(id: string) {
        const { data: responseData } = await axiosInstance.get(`Offer/${id}/GetExternalSignatureAccessToken`);
        return responseData as ExternalSignatureAccessTokenResponseType;
    },

    async getRejectionReason() {
        const { data: responseData } = await axiosInstance.get('RejectionReason/GetAllRejectionReasonsList');
        return responseData as RejectionReasonResponseType;
    },

    async feedback(data: OfferRequestFeedbackType) {
        await axiosInstance.post('OfferFeedback', data);
    },
    async getAllRetractReasonsList() {
        const { data: responseData } = await axiosInstance.get('RetractReason/GetAllRetractReasonsList');
        return responseData as GetAllRetractReasonsListResponseType;
    },

    async retractOffer(data: RetractReasonRequestType) {
        await axiosInstance.put('Offer/Retract', data);
    },
};
