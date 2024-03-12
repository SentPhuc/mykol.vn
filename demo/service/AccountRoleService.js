import axios from 'axios';
import { BaseService } from './BaseService';

export class AccountRoleService extends BaseService {
    
    constructor() {
        super('accountRole');
    }


    async assignRoleForUser(data) {
        let axiosConfig = this.getConfig();
        return await axios.post(`${this.baseUrl}${'/assign'}`,data, axiosConfig);
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
