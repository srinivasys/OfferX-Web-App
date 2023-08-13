import { axiosInstance } from './index';
import { EmailRequestType } from '../../types/email';

export const emailService = {
    async create(data: EmailRequestType) {
        await axiosInstance.post('Enquiry', data);
    },
};
