import axios from 'axios';

import { useAuth } from './useAuth';

const useAuthenticatedAxios = () =>
{
    const { user } = useAuth();

    const axiosInstance = axios.create({
        baseURL: 'https://localhost:7146/api/',
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });

    axiosInstance.interceptors.request.use(
        (config) =>
        {
            const token = user?.token;
            if (token)
            {
                config.headers.Authorization = token;
            }
            return config;
        },
        (error) =>
        {
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default useAuthenticatedAxios;