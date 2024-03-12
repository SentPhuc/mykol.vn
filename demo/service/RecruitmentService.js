import axios from 'axios';
import { BaseService } from './BaseService';
import _ from 'lodash';

export class RecruitmentService extends BaseService {
    constructor() {
        super('recruitments');
    }

    async searchAll(formData) {
        const token = localStorage.getItem('accessToken');
        return await axios.get(`${this.baseUrl}/search`, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${token}`
            },
            params: formData
        });
    }

    // async searchAll(formData, event) {
    //     formData = _.cloneDeep(formData || {});
    //     if (event) {
    //         formData['_search'] = event;
    //     }
    //     return await axios.get(`${this.baseUrl}/search-all`, {
    //         headers: {
    //             ['Content-Type']: 'application/json',
    //             'Access-Control-Allow-Origin': '*'
    //         },
    //         params: formData
    //     });
    // }

    jobProfileSearch(data) {
        return axios.post(`${this.baseUrl}/job-profile-search`, data, {
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*'
            }
        });
    }

    getTotalRecruitment(data) {
        return axios.get(`${this.baseUrl}/total`, data, {
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*'
            }
        });
    }

    async updateVerify(id, verify) {
        const json = JSON.stringify({ id: id, isVerified: !verify });
        if (verify) {
            return await axios.put(`${this.baseUrl}/${id}/un-verify`, json, {
                headers: {
                    ['Content-Type']: 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        return await axios.put(`${this.baseUrl}/${id}/verify`, json, {
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    async create(formData) {
        const token = localStorage.getItem('accessToken');
        let axiosConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${token}`
            }
        };

        const data = new FormData();

        if (typeof formData.imageCover == 'object' && formData.imageCover) {
            data.append('file', formData.imageCover);
        }

        const json = JSON.stringify(formData);
        const blob = new Blob([json], {
            type: 'application/json'
        });

        data.append('request', blob);

        return await axios.post(`${this.baseUrl}`, data, axiosConfig);
    }

    async update(id, formData) {
        const token = localStorage.getItem('accessToken');
        let axiosConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${token}`
            }
        };

        const data = new FormData();
        data.append('id', id);
        if (typeof formData.imageCover == 'object' && formData.imageCover) {
            data.append('file', formData.imageCover);
        }

        const json = JSON.stringify(formData);
        const blob = new Blob([json], {
            type: 'application/json'
        });

        data.append('request', blob);

        return await axios.post(`${this.baseUrl}/update`, data, axiosConfig);
    }

    async findRecruitmentWithInvitedJob(kolId, page = 1) {
        const token = localStorage.getItem('accessToken');

        return await axios.get(`${this.baseUrl}/rec-find-with-invited-job/${kolId}`, {
            params: {
                page: page
            },
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${token}`
            }
        });
    }

    async hideRecruitment(recruitmentId) {
        const token = localStorage.getItem('accessToken');

        return await axios.put(
            `${this.baseUrl}/${recruitmentId}/hidden`,

            {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${token}`
            }
        );
    }
}
