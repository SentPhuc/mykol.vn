import axios from 'axios';
import { BaseService } from './BaseService';

export class GlobalService extends BaseService {
    constructor() {
        super('global');
    }

    search(data) {
        return axios.post(`${this.baseUrl}/kolsInfluencer/search`, data, {
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*'
            }
        });
    }

    searchWithToken(data) {
        const token = localStorage.getItem('accessToken');
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${token}`
            }
        };

        return axios.post(`${this.baseUrl}/kolsInfluencer/search`, data, axiosConfig);
    }

    interestedKOLs(data) {
        return axios.post(`${this.baseUrl}/follower/follow-kol`, data);
    }

    searchRecruitment(data) {
        return axios.post(`${this.baseUrl}/recruitment/search`, data, {
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*'
            }
        });
    }

    searchRecruitmentWithToken(data) {
        const token = localStorage.getItem('accessToken');
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${token}`
            }
        };

        return axios.post(`${this.baseUrl}/recruitment/search`, data, axiosConfig);
    }

    async findTopThreeOrderByDateDesc() {
        return await axios({
            method: 'get',
            url: `${this.baseUrl}/post/selectTop3`,
            withCredentials: false,
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*'
            }
        });
    }

    async influencerRanking(data) {
        const token = localStorage.getItem('accessToken');
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*'
            }
        };
        return await axios.post(`${this.baseUrl}/kolsInfluencer/influencer-ranking`, data, axiosConfig);
    }

    async findRecruitmentDetailByMask(mask, id, isLoggedIn) {
        const headers = {
            ['Content-Type']: 'application/json',
            'Access-Control-Allow-Origin': '*'
        };
        if (isLoggedIn == true) {
            var token = localStorage.getItem('accessToken');
            headers['Authorization'] = `Bearer ${token}`;
        }

        return await axios.get(`${this.baseUrl}/recruitments/${mask}/${id}`, {
            headers: headers
        });
    }

    async findRecruitmentDetailByMaskV2(mask, recruitmentId, isLoggedIn) {
        const headers = {
            ['Content-Type']: 'application/json',
            'Access-Control-Allow-Origin': '*'
        };
        if (isLoggedIn == true) {
            var token = localStorage.getItem('accessToken');
            headers['Authorization'] = `Bearer ${token}`;
        }

        return await axios.get(`${this.baseUrlV2}/recruitments/${mask}/${recruitmentId}`, {
            headers: headers
        });
    }

    async searchPost(data) {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        };
        return await axios.get(`${this.baseUrl}/post/search`, data, axiosConfig);
    }

    async getDetailKols(mask, kolId) {
        return await axios.get(`${this.baseUrl}/kolsInfluencer/${mask}/${kolId}`);
    }

    async getDetailKolsIgnorePublic(mask, kolId) {
        return await axios.get(`${this.baseUrl}/kolsInfluencer/${mask}/${kolId}/ignorePublicProfile`);
    }

    async getDetailTiktokKols(username) {
        return await axios.get(`${this.baseUrlAPI}/kols/tiktok-profiles/${username}`);
    }

    async getVideosTiktokKols(tikTokProfileId) {
        return await axios.get(`${this.baseUrlAPI}/kols/tiktok-profiles/${tikTokProfileId}/videos`);
    }

    async forgotPassword(formData) {
        return await axios.post(`${this.baseUrl}/forgot-password`, formData);
    }

    async resetPassword(formData) {
        return await axios.post(`${this.baseUrl}/reset-password`, formData);
    }

    async findCompanyInformationByAccountId(accountId) {
        return await axios.get(`${this.baseUrl}/company/information/${accountId}`, {
            headers: { ['Content-Type']: 'application/json' }
        });
    }

    async findByPostShortTitle(postShortTitle) {
        return await axios.get(`${this.baseUrl}/post/content/${postShortTitle}`, {
            headers: { ['Content-Type']: 'application/json' }
        });
    }

    async getEvaluationsByCandidates(data) {
        return await axios.post(`${this.baseUrl}/kol-rec-evaluation`, data);
    }

    async getRatingByAccountId(data) {
        return await axios.post(`${this.baseUrl}/find-star-rating`, data);
    }

    async getDetailKolsProfileUpdate(mask, kolId) {
        const token = localStorage.getItem('accessToken');
        let axiosConfig = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        return await axios.get(`${this.baseUrl}/kolsInfluencer/${mask}/${kolId}`, axiosConfig);
    }

    async getKolParticipatedJob(accountId) {
        return await axios.get(`${this.baseUrl}/find-kol-participated-jobs/${accountId}`, {
            headers: { ['Content-Type']: 'application/json' }
        });
    }

    sendReport(data) {
        return axios.post(`${this.baseUrl}/send-report`, data, {
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*'
            }
        });
    }

    sendReportRecruitment(data) {
        return axios.post(`${this.baseUrl}/send-report-recruitment`, data, {
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*'
            }
        });
    }

    //Get all Package
    async getAllSubscriptionsPackage() {
        return await axios.post(`${this.baseUrl}${'/all'}`, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    //Get Kols home page
    async searchKolsHomePage(userName) {
        return await axios.get(`${this.baseUrl}/tiktok-profiles?username=${userName}`, {
            headers: { ['Content-Type']: 'application/json' }
        });
    }

    //Get detail KOL
    async getDetailTiktokProfileNotLogin(userName) {
        const token = localStorage.getItem('accessToken');
        let axiosConfig = {
            headers: {
                // Authorization: `Bearer ${token}`,
                ['Content-Type']: 'application/json'
            }
        };
        // if (!token) delete axiosConfig.headers.Authorization;

        return await axios.get(`${this.baseUrl}/tiktok-profiles/${userName}`, axiosConfig);
    }

    async getAllCategories() {
        return await axios.get(`${this.baseUrl}/tiktok-profiles/categories`, {
            headers: { ['Content-Type']: 'application/json' }
        });
    }

    //Get all Package
    async refreshTiktokProfiles(username) {
        return await axios.post(`${this.baseUrl}${'/tiktok-profiles/refresh'}`, username, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    //Get all Package
    async postClickReferals(data) {
        return await axios.post(`${this.baseUrl}${'/referrals'}`, data, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    //Get Code Referrals
    async getCodeReferrals(kolsInfluencerId) {
        return await axios.get(`${this.baseUrl}${'/referrals'}?kolsInfluencerId=${kolsInfluencerId}`, {
            headers: { ['Content-Type']: 'application/json' }
        });
    }

    //Get Code Referrals
    async getKOL() {
        return await axios.get(`${this.baseUrl}/kolsInfluencer/preview`, {
            headers: { ['Content-Type']: 'application/json' }
        });
    }

    //Get Code Referrals
    async searchKolsInfluencerV2(data) {
        return await axios.post(`${this.baseUrlV2}${'/kolsInfluencer/search'}`, data, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    //Get Code Referrals
    async getProvinces() {
        return await axios.get(`${this.baseUrl}/address/provinces`, {
            headers: { ['Content-Type']: 'application/json' }
        });
    }

    //Get Code Referrals
    async sendNotifications(data) {
        return await axios.post(`${this.baseUrl}${'/bookings/notifications'}`, data, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    //Get Code Referrals
    async getKolsInfluencerForCareers(code) {
        return await axios.get(`${this.baseUrl}${`/kolsInfluencer/preview/${code}`}`, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    //Get Code Referrals
    async getReportData() {
        return await axios.get(`${this.baseUrl}${`/report-access`}`, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    //get Keyword Backlist
    async getKeywordBacklist() {
        return await axios.get(`${this.baseUrl}/keyword-blacklist`, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    //get Recruitment
    async getRecruitments(data) {
        return await axios.post(`${this.baseUrlV2}/recruitments/search`, data, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
