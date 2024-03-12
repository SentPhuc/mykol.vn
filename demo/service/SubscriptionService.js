import axios from 'axios';
import { BaseService } from './BaseService';
import _ from 'lodash';

export class SubscriptionService extends BaseService {
    constructor() {
        super('subscriptions');
    }

    async createSubscriptions(data) {
        let axiosConfig = this.getConfig();
        return await axios.post(`${this.baseUrl}`, data, axiosConfig);
    }

    async updateSubscriptions(data) {
        let axiosConfig = this.getConfig();
        return await axios.put(`${this.baseUrl}`, data, axiosConfig);
    }

    async getSubscriptionsPackage(data) {
        let axiosConfig = this.getConfig();
        return await axios.post(`${this.baseUrl}${'/list'}`, data, axiosConfig);
    }

    async getRecruiter(data) {
        let axiosConfig = this.getConfig();
        return await axios.post(`${this.baseUrl}${'/recruiter'}`, data, axiosConfig);
    }

    async updateRecruiterSubscription(data) {
        let axiosConfig = this.getConfig();
        return await axios.put(`${this.baseUrl}${'/recruiter'}`, data, axiosConfig);
    }

    //Get My Package
    async getMySubscriptionsPackage() {
        let axiosConfig = this.getConfig();
        return await axios.get(`${this.baseUrl}${'/my-subscription'}`, axiosConfig);
    }

    //register Package
    async registerSubscriptionsPackage(data) {
        let axiosConfig = this.getConfig();
        return await axios.post(`${this.baseUrl}${'/register'}`,data, axiosConfig);
    }

    //register apply Voucher
    async registerApplyVoucherSubscriptionsPackage(data) {
        let axiosConfig = this.getConfig();
        return await axios.post(`${this.baseUrl}${'/register/apply-voucher'}`, data, axiosConfig);
    }

    async getAllCredits(data) {
        let axiosConfig = this.getConfig();
        return await axios.post(`${this.baseUrl}${'/recruiter/credit'}`, data, axiosConfig);
    }
    
    async getAllRecruiter() {
        let axiosConfig = this.getConfig();
        return await axios.post(`${this.baseUrl}${'/recruiter/all'}`, axiosConfig);
    }

    async activateSubscription(data) {
        let axiosConfig = this.getConfig();
        return await axios.post(`${this.baseUrl}${'/activation'}`,data, axiosConfig);
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
