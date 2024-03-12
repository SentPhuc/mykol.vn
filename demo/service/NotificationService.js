import axios from 'axios';
import {BaseService} from './BaseService';
import _ from 'lodash';

export class NotificationService extends BaseService {
    constructor() {
        super('notification');
    }

    async getUnreadCount() {
        return await axios.get(`${this.baseUrl}/unread-count`);
    }

    async setAllNotificationRead() {
        return await axios.post(`${this.baseUrl}/set-all-notification-read`);
    }
}
