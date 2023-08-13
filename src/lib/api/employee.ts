import { axiosInstance } from './index';
import { EmployeeCreateResponseType, EmployeeFormType, EmployeeListResponseType } from '../../types/employee';

export const employeeService = {
    async getList() {
        const { data } = await axiosInstance.get('EmployeeManagement/GetEmployeesPaginatedList');
        return data as EmployeeListResponseType;
    },

    async create(data: EmployeeFormType) {
        const { data: responseData } = await axiosInstance.post('EmployeeManagement', data);
        return responseData as EmployeeCreateResponseType;
    },

    async update(data: EmployeeFormType & { id: string }) {
        await axiosInstance.put('EmployeeManagement', data);
    },

    async resend(id: string) {
        await axiosInstance.put(`EmployeeManagement/${id}/Resend`);
    },

    async delete(id: string) {
        await axiosInstance.delete(`EmployeeManagement/${id}`);
    },
};
