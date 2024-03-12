import React, { useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import getConfig from 'next/config';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/router';
import { Password } from 'primereact/password';
import { OTP_REGEX, validatePassword } from '../../../src/commons/Utils';
import { GlobalService } from '../../../demo/service/GlobalService';

const ResetPassword = (props) => {
    const {
        openResetPasswordDialog,
        setOpenResetPasswordDialog,
        setOpenForgotPasswordDialog,
        setOpenLoginDialog
    } = props;
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [loading, setLoading] = useState(false);
    const service = new GlobalService();

    const toast = useRef(null);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            otp: '',
            password: '',
            confirmPassword: ''
        },
        validate: (data) => {
            let errors = {};
            if (!data.email) {
                errors.email = 'Đây là một trường bắt buộc';
            }
            if (data.email.length > 80) {
                errors.email = 'Vui lòng không nhập quá 80 ký tự';
            }
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
                errors.email = 'Vui lòng nhập một địa chỉ email hợp lệ (Ví dụ: johndoe@domain.com).';
            }
            if (data.otp.length > 8) {
                errors.otp = 'Vui lòng không nhập quá 8 ký tự';
            }
            if (!OTP_REGEX.test(data.otp)) {
                errors.otp = 'Định dạng OTP sai';
            }
            if (!data.password) {
                errors.password = 'Đây là một trường bắt buộc';
            }
            // if (data.password != null && data.password.replace(/\s/g, '') != '' && !validatePassword(data.password)) {
            //     errors.password = '<ul>\n' +
            //         '  <li>Ít nhất 6 kí tự</li>\n' +
            //         '  <li>Có chứa chữ in hoa (A-Z)</li>\n' +
            //         '  <li>Có chứa chữ số (0-9)</li>\n' +
            //         '  <li>Có chứa kí tự đặc biệt (?*@...)</li>\n' +
            //         '</ul>';
            // }
            if (data.oldPassword != null && data.oldPassword.replace(/\s/g, '') != '' && data.oldPassword.length < 6) {
                errors.password = 'Vui lòng nhập password tối thiểu 6 ký tự';
            }
            if (data.password.length > 80) {
                errors.password = 'Vui lòng không nhập quá 80 ký tự';
            }
            if (!data.confirmPassword) {
                errors.confirmPassword = 'Đây là một trường bắt buộc';
            }
            if (data.confirmPassword != null && data.confirmPassword.replace(/\s/g, '') != '' && data.confirmPassword.length < 6) {
                errors.password = 'Vui lòng nhập password tối thiểu 6 ký tự';
            }
            // if (data.confirmPassword != null && data.confirmPassword.replace(/\s/g, '') != '' && !validatePassword(data.confirmPassword)) {
            //     errors.confirmPassword = '<ul>\n' +
            //         '  <li>Ít nhất 6 kí tự</li>\n' +
            //         '  <li>Có chứa chữ in hoa (A-Z)</li>\n' +
            //         '  <li>Có chứa chữ số (0-9)</li>\n' +
            //         '  <li>Có chứa kí tự đặc biệt (?*@...)</li>\n' +
            //         '</ul>';
            // }
            if (data.confirmPassword.length > 80) {
                errors.confirmPassword = 'Vui lòng không nhập quá 80 ký tự';
            }
            if (data.password != data.confirmPassword) {
                errors.retypePassword = 'Xác nhận mật khẩu không trùng khớp';
            }
            return errors;
        },
        onSubmit: async (data) => {
            setLoading(true);
            const res = await service.resetPassword(data);
            if (res.data.type === 'SUCCESS') {
                toast.current.show({
                    severity: 'success',
                    summary: 'Thông báo',
                    detail: 'Đổi mật khẩu thành công',
                    life: 2000
                });
                formik.resetForm();
                setTimeout(afterResetPassword, 500);
            } else {
                toast.current.show({ severity: 'error', summary: 'Thông báo', detail: res.data.message, life: 2000 });
            }
            setLoading(false);
        }

    });
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) &&
            <small className='p-error' dangerouslySetInnerHTML={{ __html: formik.errors[name] }}></small>;
    };

    const afterResetPassword = () => {
        setOpenResetPasswordDialog(false);
        setOpenLoginDialog(true);
    };

    return (
        <React.Fragment>
            <Dialog header='Đặt lại mật khẩu' visible={openResetPasswordDialog} style={{ width: '30rem' }}
                    breakpoints={{ '960px': '75vw', '641px': '95vw' }}
                    onHide={() => setOpenResetPasswordDialog(false)}
            >
                <Toast ref={toast} />
                <div className='w-full surface-card'>
                    <div className='text-center mb-3'>
                        <img src={`${contextPath}/layout/images/logo.jpg`} alt='InfluX'
                             height='50' />
                    </div>

                    <div className='form-demo'>
                        <div className='justify-content-center'>
                            <form onSubmit={formik.handleSubmit} className='p-fluid'>
                                <div className='field mt-4 mb-3'>
                                    <label htmlFor='email'
                                           className={classNames({ 'p-error': isFormFieldValid('email') })}>
                                        Email <span className='primary-color'>*</span>
                                    </label>
                                    <div className='p-inputgroup'>
                                        <span className='p-inputgroup-addon'>
                                           <i className='pi pi-envelope' />
                                        </span>
                                        <InputText id='email' name='email' value={formik.values.email}
                                                   onChange={formik.handleChange} autoFocus
                                                   onInput={formik.handleChange}
                                                   className={classNames({ 'p-invalid': isFormFieldValid('name') })}
                                                   placeholder='Vui lòng nhập email của bạn'
                                        />
                                    </div>
                                    {getFormErrorMessage('email')}
                                </div>
                                <div className='field mt-4 mb-3'>
                                    <label htmlFor='otp'
                                           className={classNames({ 'p-error': isFormFieldValid('otp') })}>
                                        Mã OTP <span className='primary-color'>*</span>
                                    </label>
                                    <div className='p-inputgroup'>
                                        <span className='p-inputgroup-addon'>
                                           <i className='pi pi-qrcode' />
                                        </span>
                                        <InputText id='otp' name='otp' value={formik.values.otp}
                                                   onChange={formik.handleChange} autoFocus
                                                   className={classNames({ 'p-invalid': isFormFieldValid('otp') })}
                                                   placeholder='Vui lòng nhập mã OTP'
                                        />
                                    </div>
                                    {getFormErrorMessage('otp')}
                                </div>
                                <div className='field mb-3'>
                                    <label htmlFor='password'
                                           className={classNames({ 'p-error': isFormFieldValid('password') })}>
                                        Mật khẩu <span className='primary-color'>*</span>
                                    </label>
                                    <div className='p-inputgroup'>
                                        <span className='p-inputgroup-addon'>
                                           <i className='pi pi-lock' />
                                        </span>
                                        <Password id='password' name='password' inputid='password'
                                                  feedback={false} value={formik.values.password}
                                                  onChange={(e) => {
                                                      formik.setFieldValue('password', e.target.value);
                                                  }} placeholder='Vui lòng nhập mật khẩu của bạn'
                                                  toggleMask={true}
                                                  className={classNames({ 'p-invalid': isFormFieldValid('password') }, 'w-full')}
                                                  inputClassName='w-full'>
                                        </Password>
                                    </div>
                                    {getFormErrorMessage('password')}
                                </div>
                                <div className='field mb-3'>
                                    <label htmlFor='confirmPassword'
                                           className={classNames({ 'p-error': isFormFieldValid('confirmPassword') })}>
                                        Xác nhận mật khẩu <span className='primary-color'>*</span>
                                    </label>
                                    <div className='p-inputgroup'>
                                        <span className='p-inputgroup-addon'>
                                           <i className='pi pi-lock' />
                                        </span>
                                        <Password id='confirmPassword' name='confirmPassword'
                                                  inputid='confirmPassword'
                                                  feedback={false} value={formik.values.confirmPassword}
                                                  onChange={(e) => {
                                                      formik.setFieldValue('confirmPassword', e.target.value);
                                                  }} placeholder='Vui lòng nhập mật khẩu của bạn'
                                                  toggleMask={true}
                                                  className={classNames({ 'p-invalid': isFormFieldValid('confirmPassword') }, 'w-full')}
                                                  inputClassName='w-full'>
                                        </Password>
                                    </div>
                                    {getFormErrorMessage('confirmPassword')}
                                </div>
                                <Button icon={'pi pi-shield'} label='Đổi mật khẩu' className='w-full p-3 text-xl'
                                        onClick={() => router.push('/')} loading={loading}></Button>
                                <div className={'mt-2 text-right'}>
                                    <a className='font-medium no-underline mb-2 text-right cursor-pointer'
                                       style={{ color: 'var(--primary-color)' }}
                                       onClick={(e) => {
                                           e.preventDefault();
                                           setOpenForgotPasswordDialog(true);
                                           setOpenResetPasswordDialog(false);
                                           formik.resetForm();
                                       }}
                                    >
                                        Quay lại màn hình quên mật khẩu
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Dialog>
        </React.Fragment>
    );
};
export default ResetPassword;