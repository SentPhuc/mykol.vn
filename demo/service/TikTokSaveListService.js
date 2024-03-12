import { get } from 'lodash';
import { BaseService } from './BaseService';
import axios from 'axios';

export class TikTokSaveListService extends BaseService {
    constructor() {
        super('tiktok-save-list');
    }

    async search(data) {
        const token = localStorage.getItem('accessToken');

        return await axios.post(`${this.baseUrl}/search`, data, {
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                Authorization: `Bearer ${token}`
            }
        });
    }

    async updateNote(tiktokProfileSaveListId, note) {
        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                Authorization: `Bearer ${token}`
            }
        };
        return await axios.post(
            `${this.baseUrl}/${tiktokProfileSaveListId}/tiktok-note-update`,
            {
                note
            },
            headers
        );
    }

    async getAllLabels(id) {
        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                Authorization: `Bearer ${token}`
            }
        };
        return await axios.post(`${this.baseUrl}/labels/all`, { id }, headers);
    }

    async createLabel(kolRecruitmentId, name) {
        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                Authorization: `Bearer ${token}`
            }
        };
        return await axios.post(
            `${this.baseUrl}/${kolRecruitmentId}/labels`,
            {
                name
            },
            headers
        );
    }

    async deleteLabel(kolRecruitmentId, name) {
        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                Authorization: `Bearer ${token}`
            }
        };
        return await axios.put(
            `${this.baseUrl}/${kolRecruitmentId}/labels`,
            {
                name
            },
            headers
        );
    }

    async removeTiktokProfileFromList(tiktokProfileSaveListId) {
        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                Authorization: `Bearer ${token}`
            }
        };
        return await axios.delete(
            `${this.baseUrl}/${tiktokProfileSaveListId}`,
            headers
        );
    }
}
