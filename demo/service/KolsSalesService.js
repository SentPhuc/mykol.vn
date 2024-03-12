import axios from 'axios';
import { BaseService } from './BaseService';
import _ from 'lodash';

export class KolsSalesService extends BaseService {
    constructor() {
        super('sales');
    }

    async updateTotalSales(data) {
        let axiosConfig = this.getConfig();
        return await axios.put(`${this.baseUrl}`, data, axiosConfig);
    }

    async getKols(data) {
        let axiosConfig = this.getConfig();
        return await axios.post(`${this.baseUrl}`, data, axiosConfig);
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
