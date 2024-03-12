import axios from 'axios';
import getConfig from 'next/config';

export class FraudReportService {
    baseUrl = getConfig().publicRuntimeConfig.url + "/api/kols/fraudReport"

    async saveOrUpdate(formData) {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        };
        return await axios.post(`${this.baseUrl}`, formData, axiosConfig);
    }

    async getCurrentStatus(formData) {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        };
        return await axios.post(`${this.baseUrl}/getCurrentStatus`, formData, axiosConfig);
    }

    async countTotalReport(formData) {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        };
        return await axios.post(`${this.baseUrl}/countTotalReport`, formData, axiosConfig);
    }
}