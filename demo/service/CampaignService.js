import axios from 'axios';
import { BaseService } from './BaseService';
export class CampaignService extends BaseService {
    constructor() {
        super('Campaign');
    }

    async getCampaigns(data) {
        const token = localStorage.getItem('accessToken');
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${token}`
            }
        };
        
        return await axios.post(`${this.baseUrlAPI}/campaigns/list`, data, axiosConfig);
    }

    async uploadCampaigns(data) {
        const token = localStorage.getItem('accessToken');
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${token}`
            }
        };
        return await axios.post(`${this.baseUrlAPI}/campaigns`, data, axiosConfig);
    }

    async getCampaignDetailPerformance(id, data) {
        const token = localStorage.getItem('accessToken');
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${token}`
            }
        };

        return await axios.post(`${this.baseUrlAPI}/campaigns/${id}`, data, axiosConfig);
    }

    async getCampaignInfluencersPerformance(id, data) {
        const token = localStorage.getItem('accessToken');
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${token}`
            }
        };

        return await axios.post(`${this.baseUrlAPI}/campaigns/${id}/influencers`, data, axiosConfig);
    }

    async getCampaignsVideos(id) {
        return await axios.get(`${this.baseUrlAPI}/campaigns/${id}/videos`);
    }
}
