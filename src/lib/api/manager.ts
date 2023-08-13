import { axiosInstance } from './index';
import { ManagerUpdateDataType } from '../../types/manager';

export const managerService = {
    async update(data: ManagerUpdateDataType) {
        await axiosInstance.put('Manager/UpdateMyManagerProfile', data);
    },
};
