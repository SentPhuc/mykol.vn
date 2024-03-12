import axios from 'axios';
import { BaseService } from './BaseService';
import { EMAIL } from '../../src/commons/Constant';

export class UserService extends BaseService {
    constructor() {
        super('user');
    }

    async sendOTP(formData) {
        return await axios.post(`${this.baseUrl}${'/forgotPassword/sendOTP'}`, formData);
    }

    async changePassword(formData) {
        return await axios.post(`${this.baseUrl}${'/changePassword'}`, formData);
    }

    async findByEmail(formData) {
        return await axios.post(`${this.baseUrl}${'/findByEmail'}`, formData);
    }

    async register (data) {
        return await axios.post(`${this.baseUrl}${'/signup'}`, data);
    }

    async validateOTP(formData) {
        return await axios.post(`${this.baseUrl}${'/forgotPassword/validateOTP/'}${EMAIL}${'/'}${formData.token}`, {});
    }

    async verify(formData) {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        }
        return await axios.post(`${this.baseUrl}/updateVerify`, formData, axiosConfig);
    }
}
