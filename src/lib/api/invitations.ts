import { axiosInstance } from './index';
import { CreateInviteRequestType, InviteListResponseType } from '../../types/invitations';

export const invitationsService = {
    async getList() {
        const { data } = await axiosInstance.get('Invitation/GetInvitationPaginatedList');
        return data as InviteListResponseType;
    },

    async create(data: CreateInviteRequestType) {
        await axiosInstance.post('Invitation', data);
    },

    async resend(id: string) {
        await axiosInstance.put(`Invitation/${id}/Resend`);
    },
};
