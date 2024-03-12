import axios from 'axios';
import {BaseService} from './BaseService';

export class CompanyService extends BaseService {
    constructor() {
        super('company');
    }

    async findByAccountId(accountId) {
        return await axios.get(`${this.baseUrl}/information/${accountId}`, {
            headers: {['Content-Type']: 'application/json'}
        });
    }

}