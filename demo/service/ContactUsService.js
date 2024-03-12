import axios from 'axios';
import {BaseService} from './BaseService';

export class ContactUsService extends BaseService {
    constructor() {
        super('contactUs');
    }

    async sendMail(formData) {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        };
        return await axios.post(`${this.baseUrl}/insertData`, formData, axiosConfig);
    }

}