import axios from 'axios';
import {BaseService} from './BaseService';

export class PostService extends BaseService {
    constructor() {
        super('post');
    }

    async findByPostShortTitle(postShortTitle) {
        return await axios.get(`${this.baseUrl}/content/${postShortTitle}`, {
            headers: {['Content-Type']: 'application/json'}
        });
    }

    async findTopThreeOrderByDateDesc() {
        return await axios.get(`${this.baseUrl}/selectTop3`, {
            headers: {['Content-Type']: 'application/json'}
        });
    }
}