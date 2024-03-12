import axios from 'axios';
import { BaseService } from './BaseService';

export class Bookings extends BaseService {
    constructor() {
        super('bookings');
    }

    //GỬi đơn hàng
    async request(data) {
        let axiosConfig = this.getConfig();
        return await axios.post(`${this.baseUrl}`, data, axiosConfig);
    }

    //Lấy thông tin đơn hàng
    async getInfoOrder(bookingCode) {
        let axiosConfig = this.getConfig();
        return await axios.get(`${this.baseUrl}/${bookingCode}`, axiosConfig);
    }

    //Cập nhật ngày dự kiến hoàn thành
    async updateDateBooking(bookingCode = null, data) {
        let axiosConfig = this.getConfig();
        return await axios.put(`${this.baseUrl}/${bookingCode}`, data, axiosConfig);
    }

    //Nộp bài booking
    async submitBooking(bookingCode = null, data) {
        let axiosConfig = this.getConfig();
        return await axios.put(`${this.baseUrl}/submit/${bookingCode}`, data, axiosConfig);
    }

    //Hủy đơn hàng
    async rejectBooking(bookingCode = null, data) {
        let axiosConfig = this.getConfig();
        return await axios.put(`${this.baseUrl}/reject/${bookingCode}`, data, axiosConfig);
    }

    //Yêu cầu làm lại booking
    async redoBooking(bookingCode = null, data) {
        let axiosConfig = this.getConfig();
        return await axios.put(`${this.baseUrl}/redo/${bookingCode}`, data, axiosConfig);
    }

    //Xác nhận đơn hàng
    async confirmBooking(bookingCode = null) {
        let axiosConfig = this.getConfig();
        return await axios.put(`${this.baseUrl}/confirm/${bookingCode}`, axiosConfig);
    }

    //Xác nhận đơn hàng booking hoàn thành
    async completeBooking(bookingCode = null) {
        let axiosConfig = this.getConfig();
        return await axios.put(`${this.baseUrl}/complete/${bookingCode}`, axiosConfig);
    }

    //Hủy đơn booking bở nhà tuyển dụng
    async rejectBookingByRec(bookingCode = null, data) {
        let axiosConfig = this.getConfig();
        return await axios.put(`${this.baseUrl}/cancel/${bookingCode}`, data, axiosConfig);
    }

    //Lấy danh sách đơn hàng booking theo trạng thái
    async getListOrderByStatus(status = '') {
        let axiosConfig = this.getConfig();
        return await axios.get(`${this.baseUrl}?status=${status}`, axiosConfig);
    }

    //Thống kê đơn hàng theo trạng thái
    async statisticsBooking() {
        let axiosConfig = this.getConfig();
        return await axios.get(`${this.baseUrl}/statistics`, axiosConfig);
    }

    //Thống kê đơn hàng theo trạng thái
    async checkBookingIsset(serviceId) {
        let axiosConfig = this.getConfig();
        return await axios.get(`${this.baseUrl}/check/${serviceId}`, axiosConfig);
    }

    async getBookingStatus() {
        let axiosConfig = this.getConfig();
        return await axios.get(`${this.baseUrl}/status`, axiosConfig);
    }

    async trackingBooking(data) {
        let axiosConfig = this.getConfig();
        return await axios.post(`${this.baseUrl}/search`, data, axiosConfig);
    }
}
