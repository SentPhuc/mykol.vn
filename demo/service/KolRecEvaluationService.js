import axios from 'axios';
import {BaseService} from './BaseService';

export class KolRecEvaluationService extends BaseService {
    constructor() {
        super('kol-evaluation');
    }

    async createNewEvaluate(formData) {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        };
        return await axios.post(`${this.baseUrl}/evaluate`,formData ,axiosConfig);
    }


}