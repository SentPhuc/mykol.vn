import axios from 'axios';
import { BaseService } from './BaseService';

export class FollowerService extends BaseService {
    constructor() {
        super('follower');
    }

    interestedKOLs(data) {
        return axios.post(`${this.baseUrl}/follow-kol`, data);
    }
}