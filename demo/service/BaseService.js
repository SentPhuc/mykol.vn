import axios from 'axios';
import getConfig from 'next/config';
import _ from 'lodash';
import { API_WITHOUT_TOKEN } from '../../src/commons/Utils';

axios.defaults.timeout = 5 * 60 * 1000;
axios.interceptors.request.use(
    (req) => {
        const regex = /\/global/;
        if (regex.test(req.url)) {
            return req;
        }
        if (req.url.includes('login') || req.url.includes('account/signup') || req.url.includes('account/send-mail-signup')) {
            req.headers.Authorization = null;
            return req;
        }
        if (!API_WITHOUT_TOKEN.includes(req.url)) {
            req.headers.Authorization = `Bearer ${localStorage.getItem('accessToken') ?? null}`;
        }

        return req;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if the error response status is 401 (unauthorized) and the original request has not already been retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = window.localStorage.getItem('refreshToken');
            if (!refreshToken) {
                return Promise.reject(error);
            }

            // Fetch a new JWT token using a refresh token or any other method you have implemented on the server
            return axios
                .post(getConfig().publicRuntimeConfig.url + '/api/kols/auth/refresh-token', {
                    refreshToken: window.localStorage.getItem('refreshToken')
                })
                .then((res) => {
                    if (res.data.code === 'success') {
                        // Store the new JWT token
                        const newToken = res.data?.data?.accessToken;
                        localStorage.setItem('accessToken', newToken);

                        // Update the request headers with the new token and retry the original request
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return axios(originalRequest);
                    } else {
                        window.localStorage.clear();
                    }
                });
        }

        if (originalRequest._retry) {
            window.localStorage.clear();
        }

        return Promise.reject(error);
    }
);

export class BaseService {
    baseUrl;
    baseUrlV2;
    baseUrlAPI;

    constructor(module) {
        this.baseUrl = getConfig().publicRuntimeConfig.url + getConfig().publicRuntimeConfig.path + module;
        this.baseUrlV2 = getConfig().publicRuntimeConfig.url + getConfig().publicRuntimeConfig.pathV2 + module;
        this.baseUrlAPI = getConfig().publicRuntimeConfig.url + '/api';
    }

    async search(formData, event) {
        formData = _.cloneDeep(formData || {});
        if (event) {
            formData['_search'] = event;
        }
        return await axios.get(`${this.baseUrl}/search`, {
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            params: formData
        });
    }

    async saveOrUpdate(formData) {
        // formData = CommonUtil.convertFormFile(formData);
        return await axios.post(`${this.baseUrl}`, formData);
    }

    async findById(id) {
        return await axios.get(`${this.baseUrl}/${id}`, {
            headers: { ['Content-Type']: 'application/json' }
        });
    }

    async delete(id) {
        return await axios.delete(`${this.baseUrl}/${id}`);
    }

    async findAll() {
        return await axios.get(`${this.baseUrl}/find-all`);
    }

    getConfig() {
        const token = localStorage.getItem('accessToken');
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${token}`
            }
        };
        return axiosConfig;
    }
}
