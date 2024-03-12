import { BaseService } from './BaseService';
import axios from 'axios';

export class TikTokProfileService extends BaseService {
    constructor() {
        super('tiktok-profiles');
    }

    async getAllUsername() {
        return await axios.get(`${this.baseUrl}${'/get-all-username'}`);
    }

    search(data) {
        return axios.post(`${this.baseUrl}/search`, data, {
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*'
            }
        });
    }

    searchSavedList(data) {
        return axios.post(`${this.baseUrl}/search-saved-list`, data, {
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*'
            }
        });
    }
    async CheckTiktokSaveList(tiktokProfileId, tiktokSaveListId) {
        const token = localStorage.getItem('accessToken');

        return await axios.post(
            `${this.baseUrl}/save-list`,
            { tiktokProfileId, tiktokSaveListId },
            {
                headers: {
                    ['Content-Type']: 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }

    async UnCheckTiktokSaveList(tiktokProfileId, tiktokSaveListId) {
        const token = localStorage.getItem('accessToken');

        return await axios.delete(
            `${this.baseUrl}/save-list`,
            { data: { tiktokProfileId, tiktokSaveListId } },
            {
                headers: {
                    ['Content-Type']: 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }
}
