import axios from 'axios';
import { BaseService } from './BaseService';

export class AuthService extends BaseService {
    constructor() {
        super('auth');
    }

    async login(formData) {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        };
        return await axios.post(`${this.baseUrl}${'/login'}`, formData, axiosConfig);
    }
}
