import axios from 'axios';
import { tokenManager } from '../token-manager';
import { apiUrl } from '../../config/constants';
import { toast } from 'react-toastify';

export const axiosInstance = axios.create({
    withCredentials: false,
    baseURL: apiUrl,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = tokenManager.getToken();
        if (token && config.headers) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                tokenManager.removeToken();
            } else {
                const {
                    data: { error: responseError },
                } = error.response;
                if (responseError) {
                    toast.error(responseError.message);
                } else {
                    toast.error(
                        'An error occurred while executing the request. Please try your request again and contact support.'
                    );
                }
            }
        }

        return Promise.reject(error);
    }
);
