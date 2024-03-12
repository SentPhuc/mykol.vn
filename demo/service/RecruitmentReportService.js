import axios from 'axios';
import {BaseService} from './BaseService';
import getConfig from 'next/config';

export class RecruitmentReportService{
    baseUrl;

    constructor() {
        this.baseUrl = getConfig().publicRuntimeConfig.url + '/api/kolsinfluencer/recruitment-report'
    }

    kolReport(data) {
        return axios.post(`${this.baseUrl}/kol-report`, data, {
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*'
            }
        });
    }
}