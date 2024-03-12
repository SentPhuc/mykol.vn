import axios from 'axios';
import getConfig from 'next/config';

export class KolAdditionalInfoService {
    baseUrl = getConfig().publicRuntimeConfig.url + "/kol-additional-info"

    async create(formData) {
        const token = localStorage.getItem('accessToken');
        let axiosConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${token}`
            }
        };
        const json = JSON.stringify(formData);
        const blob = new Blob([json], {
            type: 'application/json'
        });
        const data = new FormData();
        data.append("request", blob);
        return await axios.post(`${this.baseUrl}/create`, data, axiosConfig);
    }

    async kolAdditionalInfo(id) {
        return await axios.get(`${this.baseUrl}/citizen-id-card/${id}`, {
            headers: {['Content-Type']: 'application/json'}
        });
    }

    async getMoreInfo(formData) {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        };
        return await axios.post(`${this.baseUrl}/rec-find-kol-additional-info`, formData, axiosConfig);
    }
}