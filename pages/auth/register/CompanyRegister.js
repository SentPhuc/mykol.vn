import React, { useEffect, useRef, useState } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { useFormik } from 'formik';
import { Toast } from 'primereact/toast';
import { AccountService } from '../../../demo/service/AccountService';
import { ROLE, validatePhone } from '../../../src/commons/Utils';
import { getCookie, deleteCookie } from 'src/commons/Function';
import { nameCookieRef } from '../../../src/commons/Utils';
import { useRouter } from 'next/router';
import isForbiddenKeywordExists from 'src/commons/isForbiddenKeywordExists';
import { Checkbox } from 'primereact/checkbox';

const CompanyRegister = (props) => {
    const router = useRouter();
    const ref = router?.query?.ref;
    const [checked, setChecked] = useState(true);
    const { openCompanyRegisterDialog, setOpenCompanyRegisterDialog, openLoginDialog, setOpenLoginDialog } = props;
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error" dangerouslySetInnerHTML={{ __html: formik.errors[name] }}></small>;
    };
    const service = new AccountService();
    const toast = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [referralCode, setReferralCode] = useState('');

    useEffect(() => {
        setReferralCode(getCookie('referralCode'));
    }, []);

    const formik = useFormik({
        initialValues: {
            email: '',
            accountType: ROLE.REC.code,
            name: '',
            accountPhone: '',
            password: '',
            retypePassword: ''
        },
        validate: async (data) => {
            let errors = {};
            if (data.name === null || data.name === undefined || data.name.trim() === '') {
                errors.name = 'Đây là một trường bắt buộc';
            }
            if (data.name.length > 80) {
                errors.name = 'Vui lòng không nhập quá 80 ký tự';
            }

            const checkName = await isForbiddenKeywordExists(data.name);
            if (!!data.name && checkName?.error) {
                errors.name = `Vui lòng không nhập ký tự không phù hợp "${checkName?.message}"`;
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
            if (!data.password) {
                errors.password = 'Đây là một trường bắt buộc';
            }
            // if (data.password != null && data.password.replace(/\s/g, '') != '' && !validatePassword(data.password)) {
            //     errors.password = '<ul>\n' + '  <li>Ít nhất 6 kí tự</li>\n' + '  <li>Có chứa chữ in hoa (A-Z)</li>\n' + '  <li>Có chứa chữ số (0-9)</li>\n' + '  <li>Có chứa kí tự đặc biệt (?*@...)</li>\n' + '</ul>';
            // }
            if (data.password != null && data.password.replace(/\s/g, '') != '' && data.password.length < 6) {
                errors.password = 'Vui lòng nhập password tối thiểu 6 ký tự';
            }
            if (data.password.length > 80) {
                errors.password = 'Vui lòng không nhập quá 80 ký tự';
            }
            if (!data.retypePassword) {
                errors.retypePassword = 'Đây là một trường bắt buộc';
            }
            // if (data.retypePassword != null && data.retypePassword.replace(/\s/g, '') != '' && !validatePassword(data.retypePassword)) {
            //     errors.retypePassword = '<ul>\n' + '  <li>Ít nhất 6 kí tự</li>\n' + '  <li>Có chứa chữ in hoa (A-Z)</li>\n' + '  <li>Có chứa chữ số (0-9)</li>\n' + '  <li>Có chứa kí tự đặc biệt (?*@...)</li>\n' + '</ul>';
            // }
            if (data.retypePassword != null && data.retypePassword.replace(/\s/g, '') != '' && data.retypePassword.length < 6) {
                errors.retypePassword = 'Vui lòng nhập password tối thiểu 6 ký tự';
            }
            if (data.password != data.retypePassword) {
                errors.retypePassword = 'Xác nhận mật khẩu không trùng khớp';
            }
            if (data.retypePassword.length > 80) {
                errors.retypePassword = 'Vui lòng không nhập quá 80 ký tự';
            }
            if (!data.accountPhone) {
                errors.accountPhone = 'Đây là một trường bắt buộc';
            }
            if (!validatePhone(data.accountPhone) && !!data.accountPhone) {
                errors.accountPhone = 'Điện thoại không đúng định dạng.';
            }
            return errors;
        },
        onSubmit: async (data) => {
            if (!checked) return;

            if (!isSubmitting) {
                setIsSubmitting(true);
                setIsLoading(true);
                const dataNew = { ...data, ...{ referralCode: referralCode ?? '' } };
                const res = await service.signup(dataNew);
                if (res.data.type === 'SUCCESS') {
                    deleteCookie(nameCookieRef);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Thông báo',
                        detail: 'Đăng kí thành công',
                        life: 2000
                    });
                    formik.resetForm();

                    if (!!ref) {
                        const urlCallBack = !!router?.query?.id ? router.pathname + '?mask=' + router?.query?.mask + '&id=' + router?.query?.id : '/';
                        history.pushState({}, '', urlCallBack);
                    }
                    setTimeout(afterRegister, 500);
                    await service.sendMailSignUp(data);
                    setIsLoading(false);
                } else {
                    setIsSubmitting(false);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Thông báo',
                        detail: res.data.message,
                        life: 2000
                    });
                    setIsLoading(false);
                }
            }
        }
    });

    const afterRegister = () => {
        setOpenCompanyRegisterDialog(false);
        setOpenLoginDialog(true);
    };

    const footerContent = (
        <div>
            {!checked && <small className="p-error text-left block mb-3 font-bold">Để đăng ký, bạn cần đồng ý với điều khoản và chính sách của chúng tôi</small>}
            <div className="text-center gap-5">
                <p className="lg:mb-6 mb-3">
                    <Checkbox className="mr-2" onChange={(e) => setChecked(e.checked)} checked={checked}></Checkbox>
                    Bằng việc đăng ký, bạn đồng ý với{' '}
                    <a href="/landing/terms-of-use" target="_blank">
                        Điều khoản dịch vụ
                    </a>{' '}
                    và{' '}
                    <a href="/landing/privacy-policy" target="_blank">
                        Chính sách của chúng tôi
                    </a>
                </p>
                <span>Nếu đã có tài khoản ?</span>
                <a
                    className="font-bold no-underline ml-2 cursor-pointer hover:underline"
                    style={{ color: 'var(--primary-color)' }}
                    href={'#'}
                    onClick={(e) => {
                        e.preventDefault();
                        setOpenCompanyRegisterDialog(false);
                        setOpenLoginDialog(true);
                    }}
                >
                    Đăng Nhập
                </a>
            </div>
        </div>
    );

    return (
        <React.Fragment>
            <Dialog
                className="bg-white"
                header="Bạn là nhà tuyển dụng?"
                visible={openCompanyRegisterDialog}
                style={{ width: '480px' }}
                breakpoints={{ '30rem': '30rem' }}
                onHide={() => {
                    setOpenCompanyRegisterDialog(false);
                    formik.resetForm();
                }}
                footer={footerContent}
            >
                <Toast ref={toast} />
                <div className="w-full surface-card">
                    <div className="text-center mb-3">
                        <p>Hãy chắc rằng bạn là Doanh nghiệp, Nhà cung cấp, Tổ chức và có mong muốn được phân phối sản phẩm đến với người tiêu dùng qua mạng lưới của chúng tôi. Vậy hãy đăng ký tại đây.</p>
                    </div>
                    <p className="m-0">
                        <div className="form-demo">
                            <div className="justify-content-center">
                                <form onSubmit={formik.handleSubmit} className="p-fluid">
                                    <div className="field mt-4 mb-3">
                                        <label htmlFor="name" className={classNames({ 'p-error': isFormFieldValid('name') })}>
                                            Tên của bạn <span className="primary-color">*</span>
                                        </label>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-user" />
                                            </span>
                                            <InputText
                                                id="name"
                                                name="name"
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                autoFocus
                                                className={classNames({ 'p-invalid': isFormFieldValid('name') })}
                                                placeholder="Vui lòng nhập tên của bạn"
                                            />
                                        </div>
                                        {getFormErrorMessage('name')}
                                    </div>
                                    <div className="field mb-3">
                                        <label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid('email') })}>
                                            Email <span className="primary-color">*</span>
                                        </label>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-envelope" />
                                            </span>
                                            <InputText
                                                id="email"
                                                name="email"
                                                value={formik.values.email.trim()}
                                                onChange={formik.handleChange}
                                                placeholder="Vui lòng nhập email của bạn"
                                                className={classNames({ 'p-invalid': isFormFieldValid('email') })}
                                            />
                                        </div>
                                        {getFormErrorMessage('email')}
                                    </div>
                                    <div className="field mb-3">
                                        <label htmlFor="accountPhone" className={classNames({ 'p-error': isFormFieldValid('accountPhone') })}>
                                            Điện thoại <span className="primary-color">*</span>
                                        </label>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-envelope" />
                                            </span>
                                            <InputText
                                                id="accountPhone"
                                                name="accountPhone"
                                                value={formik.values.accountPhone}
                                                onChange={formik.handleChange}
                                                placeholder="Vui lòng nhập điện thoại của bạn"
                                                className={classNames({ 'p-invalid': isFormFieldValid('accountPhone') })}
                                            />
                                        </div>
                                        {getFormErrorMessage('accountPhone')}
                                    </div>
                                    <div className="field mb-3">
                                        <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid('password') })}>
                                            Mật khẩu <span className="primary-color">*</span>
                                        </label>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-lock" />
                                            </span>
                                            <Password
                                                id="password"
                                                name="password"
                                                inputid="password"
                                                feedback={false}
                                                value={formik.values.password}
                                                onChange={(e) => {
                                                    formik.setFieldValue('password', e.target.value);
                                                }}
                                                placeholder="Vui lòng nhập mật khẩu của bạn"
                                                toggleMask={true}
                                                className={classNames({ 'p-invalid': isFormFieldValid('password') })}
                                                inputClassName="w-full"
                                            ></Password>
                                        </div>
                                        {getFormErrorMessage('password')}
                                    </div>
                                    <div className="field mb-3">
                                        <label htmlFor="retypePassword" className={classNames({ 'p-error': isFormFieldValid('retypePassword') })}>
                                            Xác nhận mật khẩu <span className="primary-color">*</span>
                                        </label>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-lock" />
                                            </span>
                                            <Password
                                                id="retypePassword"
                                                name="retypePassword"
                                                inputid="retypePassword"
                                                feedback={false}
                                                value={formik.values.retypePassword}
                                                onChange={(e) => {
                                                    formik.setFieldValue('retypePassword', e.target.value);
                                                }}
                                                placeholder="Vui lòng nhập mật khẩu của bạn"
                                                toggleMask={true}
                                                className={classNames({ 'p-invalid': isFormFieldValid('retypePassword') })}
                                                inputClassName="w-full"
                                            ></Password>
                                        </div>
                                        {getFormErrorMessage('retypePassword')}
                                    </div>
                                    <Button loading={isLoading} disabled={isLoading} type="submit" label="Đăng ký" className="w-full text-xl mt-2"></Button>
                                </form>
                            </div>
                        </div>
                    </p>
                </div>
            </Dialog>
        </React.Fragment>
    );
};

// CompanyRegister.getLayout = function getLayout(page) {
//     return (
//         <React.Fragment>
//             {page}
//             <AppConfig simple />
//         </React.Fragment>
//     );
// };
export default CompanyRegister;
