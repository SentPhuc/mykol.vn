import axios from 'axios';
import { BaseService } from './BaseService';

export class SettingService extends BaseService {
    constructor() {
        super('settings');
    }

    async postKeywordBacklist(data) {
        let axiosConfig = this.getConfig();
        return await axios.post(`${this.baseUrlAPI}/settings/keyword-blacklist`, data, axiosConfig);
    }
}
