import { axiosInstance } from './index';
import {
    AuthResponseType,
    CandidateRequestType,
    LinkedinResponseType,
    ManagerJoinByInvitationType,
    ManagerRequestType,
    socialSignInType,
    UserResponseType,
} from '../../types/auth';

export const authService = {
    async socialSignIn(data: socialSignInType) {
        const { data: responseData } = await axiosInstance.post('user/SignIn', data);
        return responseData as AuthResponseType;
    },

    async candidateSignUp(data: CandidateRequestType) {
        const { data: responseData } = await axiosInstance.post('user/CandidateSignUp', data);
        return responseData as AuthResponseType;
    },

    async managerSignUp(data: ManagerRequestType) {
        const { data: responseData } = await axiosInstance.post('user/ManagerSignUp', data);
        return responseData as AuthResponseType;
    },

    async managerJoinByInvitation(data: ManagerJoinByInvitationType) {
        await axiosInstance.post('user/ManagerJoinByInvitation', data);
    },

    async getUser() {
        const { data } = await axiosInstance.get('user');
        return data as UserResponseType;
    },

    async linkedin(code: string) {
        const { data: responseData } = await axiosInstance.post('user/LinkedIn', { AuthCode: code });
        return responseData as LinkedinResponseType;
    },
};
