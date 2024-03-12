import axios from 'axios';
import { BaseService } from './BaseService';
import _ from 'lodash';

export class KolsInfluencerService extends BaseService {
    constructor() {
        super('kolsInfluencer');
    }

    /**
     * override search from get to post
     * @param formData
     * @param event
     * @returns {Promise<AxiosResponse<any>>}
     */
    async search(formData, event) {
        formData = _.cloneDeep(formData || {});
        if (event) {
            formData['_search'] = event;
        }
        return await axios.post(`${this.baseUrl}/search`, formData);
    }

    async updateVerify(accountId, verify) {
        const json = JSON.stringify({ 'accountId': accountId, 'isVerified': verify });
        return await axios.post(`${this.baseUrl}/updateVerify`, json, {
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    async search(data) {
        const token = localStorage.getItem('accessToken');
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${token}`
            }
        };
       return await axios.post(`${this.baseUrl}/search`, data, axiosConfig)
    }

}