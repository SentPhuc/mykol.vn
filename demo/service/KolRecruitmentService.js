import axios from 'axios';
import { BaseService } from './BaseService';

export class KolRecruitmentService extends BaseService {
    constructor() {
        super('recruitments');
    }

    async savedJob(formData) {
        return await axios.post(`${this.baseUrl}${'/saved-job'}`, formData);
    }

    async appliedJob(formData) {
        return await axios.post(`${this.baseUrl}${'/applied-job'}`, formData);
    }

    async applyJob(formData) {
        return await axios.post(`${this.baseUrl}${'/apply-job'}`, formData);
    }

    async saveInterestingJob(formData) {
        return await axios.post(`${this.baseUrl}${'/save-job'}`, formData);
    }

    async getJobWasInvited(formData) {
        return await axios.post(`${this.baseUrl}${'/invited-job'}`, formData);
    }

    async applyJobs(formData) {
        return await axios.post(`${this.baseUrl}${'/apply-invited-job'}`, formData);
    }

    async getAppliedJobOfCandidates(formData) {
        return await axios.post(`${this.baseUrl}${'/rec-find-applied-job'}`, formData);
    }

    async getAppliedJobOfCandidatesNoFilter(formData) {
        return await axios.post(`${this.baseUrl}${'/rec-find-applied-job-not-filter'}`, formData);
    }

    async getAllJobsTitle(formData) {
        return await axios.post(`${this.baseUrl}${'/rec-find-all-jobs-title'}`, formData);
    }

    async getInvitedJobOfCandidates(formData) {
        return await axios.post(`${this.baseUrl}${'/rec-find-invited-job'}`, formData);
    }

    async getInvitedJobOfCandidatesNoFilter(formData) {
        return await axios.post(`${this.baseUrl}${'/rec-find-invited-job-not-filter'}`, formData);
    }

    async onJbSaving(formData) {
        return await axios.post(`${this.baseUrl}${'/save-job'}`, formData);
    }

    async onSendMessage(formData) {
        return await axios.post(`${this.baseUrl}${'/contact'}`, formData);
    }

    async onApply(formData) {
        return await axios.post(`${this.baseUrl}${'/apply'}`, formData);
    }

    async findRecruitmentApprovedKOL(accountId) {
        return await axios.get(`${this.baseUrl}/rec-find-approved-of-kol/${accountId}`, {
            headers: { ['Content-Type']: 'application/json' }
        });
    }

    async getAllLabels(id) {
        return await axios.post(
            `${this.baseUrl}/labels/all`,
            { id },
            {
                headers: { ['Content-Type']: 'application/json' }
            }
        );
    }

    async inviteJob(recruitmentId, kolId, message) {
        return await axios.post(`${this.baseUrl}/invite-job`, {
            recruitmentId,
            kolId,
            message
        });
    }

    async updateStatus(kolRecruitmentId, status) {
        return await axios.post(`${this.baseUrl}/${kolRecruitmentId}/recruit-status`, {
            status
        });
    }

    async updateBookingPrice(kolRecruitmentId, bookingPrice) {
        return await axios.post(`${this.baseUrl}/${kolRecruitmentId}/updateBookingPrice`, {
            bookingPrice
        });
    }

    async updatePostVideoDeadlineAt(kolRecruitmentId, postVideoDeadlineAt) {
        return await axios.post(`${this.baseUrl}/${kolRecruitmentId}/updatePostVideoDeadlineAt`, {
            postVideoDeadlineAt
        });
    }

    async updateNote(kolRecruitmentId, note) {
        return await axios.post(`${this.baseUrl}/${kolRecruitmentId}/recruit-note-update`, {
            note
        });
    }

    async updateLabels(kolRecruitmentId, labels) {
        return await axios.post(`${this.baseUrl}/${kolRecruitmentId}/recruit-labels-update`, {
            labels
        });
    }

    async createLabel(kolRecruitmentId, name) {
        return await axios.post(`${this.baseUrl}/${kolRecruitmentId}/labels`, {
            name
        });
    }

    async deleteLabel(kolRecruitmentId, name) {
        return await axios.put(`${this.baseUrl}/${kolRecruitmentId}/labels`, {
            name
        });
    }

    async getApplyRecruitments(data) {
        const config = this.getConfig();
        return await axios.post(`${this.baseUrl}/applied/search`, data, config);
    }
}
