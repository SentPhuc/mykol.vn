import axios from 'axios';
import { BaseService } from './BaseService';

export class AccountService extends BaseService {
    constructor() {
        super('account');
    }

    async signup(formData) {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        };
        return await axios.post(`${this.baseUrl}${'/signup'}`, formData, axiosConfig);
    }

    async sendMailSignUp(formData) {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        };
        return await axios.post(`${this.baseUrl}${'/send-mail-signup'}`, formData, axiosConfig);
    }

    async changePassword(formData) {
        const token = localStorage.getItem('accessToken');
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${token}`
            }
        };
        return await axios.post(`${this.baseUrl}${'/changePassword'}`, formData, axiosConfig);
    }

    async findByEmail(email) {
        return await axios.get(`${this.baseUrl}/email/${email}`, {
            headers: {['Content-Type']: 'application/json'}
        });
    }

    async update(formData, file) {
        const token = localStorage.getItem('accessToken');
        let axiosConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${token}`
            }
        };

        const data = new FormData();

        if (typeof formData.profileImage == 'object' && formData.profileImage) {
            data.append("profileImage", formData.profileImage);
        }

        const json = JSON.stringify(formData);
        const blob = new Blob([json], {
            type: 'application/json'
        });

        for (let i = 0; i < file.length; i++) {
            data.append('images', file[i]);
        }
        data.append('request', blob);
        return await axios.post(`${this.baseUrl}${'/update'}`, data, axiosConfig);
    }
}
