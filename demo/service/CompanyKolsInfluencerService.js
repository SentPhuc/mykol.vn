import axios from 'axios';
import { BaseService } from './BaseService';
import _ from 'lodash';

export class CompanyKolsInfluencerService extends BaseService {
    constructor() {
        super('companyKolsInfluencer');
    }

    async getSavedCandidate(data) {
        const token = localStorage.getItem('accessToken');
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${token}`
            }
        };
        return await axios.post(`${this.baseUrl}/candidate`, data, axiosConfig)
    }

    async savingCandidate(formData) {
        return await axios.post(`${this.baseUrl}${'/candidate'}`, formData);
    }

    async unSavingCandidate(formData) {
        return await axios.post(`${this.baseUrl}${'/un-save-candidate'}`, formData);
    }

    async saveCandidate(formData) {
        return await axios.post(`${this.baseUrl}${'/save-candidate'}`, formData);
    }



}