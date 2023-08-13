import { axiosInstance } from './index';
import { GetUnreadCountResponseType,  NotificationListResponseType } from '../../types/notification';


export const notificationService = {
    
    async getList(count: number, DayLimit: number) {
        const { data } = await axiosInstance.get(`Notification/GetLastNotifications?Start=${((count-1)*10)+1}&Limit=${count*10}&DayLimit=${DayLimit}`);
        return data as NotificationListResponseType;
    },

    async markRead(id: string) {
        await axiosInstance.put(`Notification/${id}/MarkAsRead`);
    },
    
    async getUnreadCount(DayLimit: number) {
        const { data } = await axiosInstance.get(`Notification/GetUnreadCount?Daylimit=${DayLimit}`);
        return data as GetUnreadCountResponseType;
    },
};
