import {
    ReplyType
} from '../../types/reply';

import { axiosInstance } from './index';

export const replyService = {
    async createCompanyReply(data: ReplyType) {
        await axiosInstance.post('CompanyReviewComment', data);
    },

    async createCandidateReply(data: ReplyType) {
        await axiosInstance.post('CandidateReviewComment', data);
    }
};