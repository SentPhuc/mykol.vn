import axios from 'axios';
import {BaseService} from './BaseService';

export class MailServices extends BaseService {
    constructor() {
        super('mail');
    }

    async sendMailVerify(accountEmail, accountName, title, reason) {
        const json = JSON.stringify({
            "to": [{"name": accountName, "email": accountEmail}],
            "subject": title, "content": reason, "isHtmlContent": true
        });
        return await axios.post(`${this.baseUrl}/send`, json, {
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        });
    }

}