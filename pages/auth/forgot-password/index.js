import React, { useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import getConfig from 'next/config';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/router';
import { GlobalService } from '../../../demo/service/GlobalService';

const ForgotPassword = (props) => {
    const {
        openForgotPasswordDialog,
        setOpenForgotPasswordDialog,
        setOpenResetPasswordDialog,
        setOpenLoginDialog
    } = props;
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [loading, setLoading] = useState(false);
    const service = new GlobalService();

    const toast = useRef(null);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: ''
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
            return errors;
        },
        onSubmit: async (data) => {
            setLoading(true);
            const res = await service.forgotPassword(data);
            if (res.data.type === 'SUCCESS') {
                toast.current.show({
                    severity: 'success',
                    summary: 'Thông báo',
                    detail: 'Vui lòng kiểm tra email để lấy mã OTP',
                    life: 2000
                });
                formik.resetForm();
                setOpenForgotPasswordDialog(false);
                setOpenResetPasswordDialog(true);
            } else {
                toast.current.show({ severity: 'error', summary: 'Thông báo', detail: res.data.message, life: 2000 });
            }
            setLoading(false);

        }
    });
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className='p-error'>{formik.errors[name]}</small>;
    };
    return (
        <React.Fragment>
            <Toast ref={toast} />
            <Dialog header='Quên mật khẩu' visible={openForgotPasswordDialog} style={{ width: '30rem' }}
                    breakpoints={{ '960px': '75vw', '641px': '95vw' }}
                    onHide={() => setOpenForgotPasswordDialog(false)}
            >
                <div className='w-full surface-card'>
                    <div className='text-center'>
                        <img src={`${contextPath}/layout/images/logo.jpg`} alt='InfluX'
                             height='50' />
                    </div>
                    <div className='form-demo'>
                        <div className='justify-content-center'>
                            <form onSubmit={formik.handleSubmit} className='p-fluid'>
                                <div className='field'>
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
                                                   className={classNames({ 'p-invalid': isFormFieldValid('name') })}
                                                   placeholder='Vui lòng nhập email của bạn'
                                        />
                                    </div>
                                    {getFormErrorMessage('email')}
                                </div>
                                <Button icon={'pi pi-send'} label='Gửi mã OTP' className='w-full p-3 text-xl' loading={loading}></Button>
                                <div className={'mt-2 text-right'}>
                                    <a className='font-medium no-underline mb-2 text-right cursor-pointer'
                                       style={{ color: 'var(--primary-color)' }}
                                       onClick={(e) => {
                                           e.preventDefault();
                                           setOpenForgotPasswordDialog(false);
                                           setOpenLoginDialog(true);
                                           formik.resetForm();
                                       }}
                                    >
                                        Quay lại màn hình đăng nhập
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
export default ForgotPassword;
