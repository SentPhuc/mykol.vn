import axios from 'axios';
import { BaseService } from './BaseService';

export class Wallets extends BaseService {
    constructor() {
        super('wallets');
    }

    async getWallets() {
        let axiosConfig = this.getConfig();
        return await axios.get(`${this.baseUrl}`, axiosConfig);
    }

    async depositWallet(data) {
        let axiosConfig = this.getConfig();
        return await axios.post(`${this.baseUrl}/deposit`, data, axiosConfig);
    }

    async getHistoris(data) {
        let axiosConfig = this.getConfig();
        return await axios.post(`${this.baseUrl}/histories`, data, axiosConfig);
    }

    async withDraw(data) {
        let axiosConfig = this.getConfig();
        return await axios.post(`${this.baseUrl}/withdraw`, data, axiosConfig);
    }
}
