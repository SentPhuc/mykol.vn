import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { useFormik } from 'formik';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { AccountService } from '../../../demo/service/AccountService';
import { validatePassword } from '../../../src/commons/Utils';

const ChangePassword = (props) => {
    const { openSidebarUpdate, setOpenSidebarUpdate } = props;

    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const router = useRouter();
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error" dangerouslySetInnerHTML={{ __html: formik.errors[name] }}></small>;
    };

    const accountService = new AccountService();
    const toast = useRef(null);
    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            email: ''
        },
        validateOnMount: true,
        validate: (data) => {
            let errors = {};
            if (!data.oldPassword) {
                errors.oldPassword = 'Đây là một trường bắt buộc';
            }
            // if (data.oldPassword != null && data.oldPassword.replace(/\s/g, '') != '' && !validatePassword(data.oldPassword)) {
            //     errors.oldPassword = '<ul>\n' +
            //         '  <li>Ít nhất 6 kí tự</li>\n' +
            //         '  <li>Có chứa chữ in hoa (A-Z)</li>\n' +
            //         '  <li>Có chứa chữ số (0-9)</li>\n' +
            //         '  <li>Có chứa kí tự đặc biệt (?*@...)</li>\n' +
            //         '</ul>';
            // }
            if (data.oldPassword != null && data.oldPassword.replace(/\s/g, '') != '' && data.oldPassword.length < 6) {
                errors.password = 'Vui lòng nhập password tối thiểu 6 ký tự';
            }
            if (!data.newPassword) {
                errors.newPassword = 'Đây là một trường bắt buộc';
            }
            // if (data.newPassword != null && data.newPassword.replace(/\s/g, '') != '' && !validatePassword(data.newPassword)) {
            //     errors.newPassword = '<ul>\n' +
            //         '  <li>Ít nhất 6 kí tự</li>\n' +
            //         '  <li>Có chứa chữ in hoa (A-Z)</li>\n' +
            //         '  <li>Có chứa chữ số (0-9)</li>\n' +
            //         '  <li>Có chứa kí tự đặc biệt (?*@...)</li>\n' +
            //         '</ul>';
            // }
            if (data.newPassword != null && data.newPassword.replace(/\s/g, '') != '' && data.newPassword.length < 6) {
                errors.password = 'Vui lòng nhập password tối thiểu 6 ký tự';
            }
            if (!data.confirmPassword) {
                errors.confirmPassword = 'Đây là một trường bắt buộc';
            }
            // if (data.confirmPassword != null && data.confirmPassword.replace(/\s/g, '') != '' && !validatePassword(data.confirmPassword)) {
            //     errors.confirmPassword = '<ul>\n' +
            //         '  <li>Ít nhất 6 kí tự</li>\n' +
            //         '  <li>Có chứa chữ in hoa (A-Z)</li>\n' +
            //         '  <li>Có chứa chữ số (0-9)</li>\n' +
            //         '  <li>Có chứa kí tự đặc biệt (?*@...)</li>\n' +
            //         '</ul>';
            // }
            if (data.confirmPassword != null && data.confirmPassword.replace(/\s/g, '') != '' && data.confirmPassword.length < 6) {
                errors.password = 'Vui lòng nhập password tối thiểu 6 ký tự';
            }
            if (data.newPassword === data.oldPassword) {
                errors.newPassword = 'Mật khẩu mới không được trùng với mật khẩu cũ';
            }
            if (data.newPassword !== data.confirmPassword) {
                errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
            }
            return errors;
        },
        onSubmit: async (data) => {
            data.email = window.localStorage.getItem('email');
            const res = await accountService.changePassword(data);
            if (data.newPassword !== data.oldPassword) {
            }
            if (res.data.type === 'SUCCESS') {
                toast.current.show({
                    severity: 'success',
                    summary: 'Thông báo',
                    detail: 'Đổi mật khẩu thành công',
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
            setOpenSidebarUpdate(false);
            formik.resetForm();
        }
    });

    const handleHide = () => {
        formik.resetForm();
        setOpenSidebarUpdate(false);
    };

    return (
        <React.Fragment>
            <Toast ref={toast} />
            <div>
                <Dialog className="bg-white" header="Thay đổi mật khẩu" visible={openSidebarUpdate} style={{ width: '100%', maxWidth: '320px' }} onHide={handleHide}>
                    <p className="m-0">
                        <div className="form-demo">
                            <div className="justify-content-center">
                                <form onSubmit={formik.handleSubmit} className="p-fluid">
                                    <div className="field">
                                        <label htmlFor="oldPassword" className={classNames({ 'p-error': isFormFieldValid('oldPassword') })}>
                                            Mật khẩu cũ <span className="primary-color">*</span>
                                        </label>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-lock" />
                                            </span>
                                            <Password
                                                id="oldPassword"
                                                name="oldPassword"
                                                inputid="oldPassword"
                                                feedback={false}
                                                value={formik.values.oldPassword}
                                                onChange={(e) => {
                                                    formik.setFieldValue('oldPassword', e.target.value);
                                                }}
                                                placeholder="Vui lòng nhập mật khẩu cũ của bạn"
                                                toggleMask={true}
                                                className={classNames({ 'p-invalid': isFormFieldValid('oldPassword') }, 'w-full')}
                                                inputClassName="w-full"
                                            ></Password>
                                        </div>
                                        {getFormErrorMessage('oldPassword')}
                                    </div>
                                    <div className="field">
                                        <label htmlFor="newPassword" className={classNames({ 'p-error': isFormFieldValid('newPassword') })}>
                                            Mật khẩu mới <span className="primary-color">*</span>
                                        </label>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-lock" />
                                            </span>
                                            <Password
                                                id="newPassword"
                                                name="newPassword"
                                                inputid="newPassword"
                                                feedback={false}
                                                value={formik.values.newPassword}
                                                onChange={formik.handleChange}
                                                placeholder="Vui lòng nhập mật khẩu mới của bạn"
                                                toggleMask={true}
                                                className={classNames({ 'p-invalid': isFormFieldValid('newPassword') }, 'w-full')}
                                                inputClassName="w-full"
                                            ></Password>
                                        </div>
                                        {getFormErrorMessage('newPassword')}
                                    </div>

                                    <div className="field mb-4">
                                        <label htmlFor="confirmPassword" className={classNames({ 'p-error': isFormFieldValid('confirmPassword') })}>
                                            Nhập lại mật khẩu mới <span className="primary-color">*</span>
                                        </label>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-lock" />
                                            </span>
                                            <Password
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                inputid="confirmPassword"
                                                feedback={false}
                                                value={formik.values.confirmPassword}
                                                onChange={formik.handleChange}
                                                placeholder="Vui lòng nhập lại mật khẩu của bạn"
                                                toggleMask={true}
                                                className={classNames({ 'p-invalid': isFormFieldValid('confirmPassword') }, 'w-full')}
                                                inputClassName="w-full"
                                            ></Password>
                                        </div>
                                        {getFormErrorMessage('confirmPassword')}
                                    </div>

                                    <div className="flex justify-content-end">
                                        <Button className="p-button w-120 mr-2" label="Cập nhật" icon="pi pi-check" type="submit" autoFocus />
                                        <Button
                                            className="p-button-secondary mr-0 w-120"
                                            label="Hủy bỏ"
                                            type="button"
                                            icon="pi pi-times"
                                            onClick={() => {
                                                setOpenSidebarUpdate(false);
                                                formik.resetForm();
                                            }}
                                        />
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

ChangePassword.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default ChangePassword;
