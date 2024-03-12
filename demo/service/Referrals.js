import axios from 'axios';
import { BaseService } from './BaseService';

export class ReferralsService extends BaseService {
    constructor() {
        super('referrals');
    }

    async search(data) {
        return await axios.post(`${this.baseUrl}${'/search'}`, data);
    }

    async getCodeReferrals() {
        return await axios.get(this.baseUrl);
    }

    async getStatisticReferrals() {
        return await axios.get(`${this.baseUrl}${'/statistic'}`);
    }

    async getStatusReferrals() {
        return await axios.get(`${this.baseUrl}${'/status'}`);
    }

    async managements(data) {
        return await axios.post(`${this.baseUrl}${'/managements'}`, data);
    }

    async ranking() {
        return await axios.get(`${this.baseUrl}${'/ranking'}`);
    }

    async updateStatus(data) {
        return await axios.put(`${this.baseUrl}${'/status'}`, data);
    }
}
