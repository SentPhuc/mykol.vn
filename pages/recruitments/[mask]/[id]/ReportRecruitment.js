import getConfig from 'next/config';
import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useFormik } from 'formik';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { GlobalService } from '../../../../demo/service/GlobalService';

const ReportRecruitment = (props) => {
    const {
        openReportCandidatePopup,
        setOpenReportCandidatePopup,
        nameReport
    } = props;

    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className='p-error font-italic'>{formik.errors[name]}</small>;
    };

    const service = new GlobalService();
    const toast = useRef(null);
    const formik = useFormik({
        initialValues: {
            fullname: '',
            phone: '',
            address: '',
            email: '',
            content: '',
            kolName: ''
        },
        validate: (data) => {
            let errors = {};
            if (!data.fullname) {
                errors.fullname = 'Đây là một trường bắt buộc';
            }
            if (!data.phone) {
                errors.phone = 'Đây là một trường bắt buộc';
            }
            if (!data.address) {
                errors.address = 'Đây là một trường bắt buộc';
            }
            if (!data.email) {
                errors.email = 'Đây là một trường bắt buộc';
            }
            if (data.email.length > 80) {
                errors.email = 'Vui lòng không nhập quá 80 ký tự';
            }
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
                errors.email = 'Vui lòng nhập một địa chỉ email hợp lệ (Ví dụ: johndoe@domain.com).';
            }
            return errors;
        },
        onSubmit: async (data) => {
            const submitData = {
                ...data,
                recruitmentName: nameReport
            };
            const res = await service.sendReportRecruitment(submitData);
            if (res.data.code == 'success') {
                toast.current.show({
                    severity: 'success',
                    summary: 'Thông báo',
                    detail: res.data.data,
                    life: 2000
                });
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Thông báo',
                    detail: res.data.message,
                    life: 2000
                });
            }
            setOpenReportCandidatePopup(false);
            formik.resetForm();
        }
    });

    const headerText = () => {
        return (
            <label>
                Báo cáo {nameReport}
            </label>
        );
    };

    return (<React.Fragment>
            <Toast ref={toast} />
            <div>
                <Dialog header={headerText} visible={openReportCandidatePopup}
                        style={{ width: '35vw' }}
                        breakpoints={{ '960px': '95vw', '95vw': '95vw' }}
                        onHide={() => setOpenReportCandidatePopup(false)}>
                    <p className='m-0'>
                        <div className='form-demo'>
                            <div className='justify-content-center'>
                                <p>Báo cáo thành viên khi thấy những bảo hiện của sự vi phạm nội quy KOL Việt.</p>
                                <form onSubmit={formik.handleSubmit} className='p-fluid'>
                                    <div className='field '>
                                        <label htmlFor='fullname'
                                               className={classNames({ 'p-error': isFormFieldValid('fullname') })}>
                                            Họ và tên <span className='primary-color'>*</span>
                                        </label>
                                        <InputText id='fullname' name='fullname'
                                                   placeholder='Họ và tên'
                                                   value={formik.values.fullname}
                                                   onChange={formik.handleChange} autoFocus
                                                   className={classNames({ 'p-invalid': isFormFieldValid('fullname') })} />
                                        {getFormErrorMessage('fullname')}
                                    </div>
                                    <div className='field '>
                                        <label htmlFor='phone'
                                               className={classNames({ 'p-error': isFormFieldValid('phone') })}>
                                            Số điện thoại: <span className='primary-color'>*</span>
                                        </label>
                                        <InputText id='phone' name='phone'
                                                   placeholder='Số điện thoại'
                                                   value={formik.values.phone}
                                                   onChange={formik.handleChange} autoFocus
                                                   className={classNames({ 'p-invalid': isFormFieldValid('phone') })} />
                                        {getFormErrorMessage('phone')}
                                    </div>
                                    <div className='field '>
                                        <label htmlFor='address'
                                               className={classNames({ 'p-error': isFormFieldValid('address') })}>
                                            Địa chỉ: <span className='primary-color'>*</span>
                                        </label>
                                        <InputText id='address' name='address'
                                                   value={formik.values.address}
                                                   placeholder='Địa chỉ'
                                                   onChange={formik.handleChange} autoFocus
                                                   className={classNames({ 'p-invalid': isFormFieldValid('address') })} />
                                        {getFormErrorMessage('address')}
                                    </div>
                                    <div className='field '>
                                        <label htmlFor='email'
                                               className={classNames({ 'p-error': isFormFieldValid('email') })}>
                                            Địa chỉ email: <span className='primary-color'>*</span>
                                        </label>
                                        <InputText id='email' name='email'
                                                   placeholder='Địa chỉ email'
                                                   value={formik.values.email}
                                                   onChange={formik.handleChange} autoFocus
                                                   className={classNames({ 'p-invalid': isFormFieldValid('email') })} />
                                        {getFormErrorMessage('email')}
                                    </div>
                                    <div className='field '>
                                        <label htmlFor='content'
                                               className={classNames({ 'p-error': isFormFieldValid('content') })}>
                                            Nội dung:
                                        </label>
                                        <InputTextarea id='content' name='content' rows={4}
                                                       placeholder='Nội dung'
                                                       value={formik.values.content}
                                                       onChange={formik.handleChange} autoFocus
                                                       className={classNames({ 'p-invalid': isFormFieldValid('content') })} />
                                        {getFormErrorMessage('content')}
                                    </div>

                                    <div className='flex justify-content-end'>
                                        <Button className='p-button w-120 mr-2' label='Báo cáo' icon='pi pi-send'
                                                type='submit' autoFocus />
                                        <Button className='p-button-secondary mr-0 w-120' label='Hủy bỏ'
                                                icon='pi pi-times'
                                                onClick={() => setOpenReportCandidatePopup(false)} />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </p>
                </Dialog>
            </div>
        </React.Fragment>
    );
};
export default ReportRecruitment;
