import getConfig from 'next/config';
import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { useFormik } from 'formik';
import { AuthService } from '../../../demo/service/AuthService';
import { Toast } from 'primereact/toast';
import InfluencerRegister from '../register/InfluencerRegister';
import CompanyRegister from '../register/CompanyRegister';
import ForgotPassword from '../forgot-password';
import ResetPassword from '../forgot-password/ResetPassword';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { login } from '../../../public/reduxConfig/authSlice';
import { AccountService } from '../../../demo/service/AccountService';
import { addProfile } from '../../../public/reduxConfig/kolsProfileSlice';
import { GlobalService } from '../../../demo/service/GlobalService';
import { addCompanyProfile } from '../../../public/reduxConfig/companyProfileSlice';
import { KolAdditionalInfoService } from '../../../demo/service/KolAdditionalInfoService';
import { addKolAdditionalProfileProfile } from '../../../public/reduxConfig/kolInformationSlice';
import { isBuyLogin } from 'public/reduxConfig/loginSlice';

const LoginPage = (props) => {
    const { openLoginDialog, setOpenLoginDialog, setIsLogin, setFullName } = props;
    const dispatch = useDispatch();
    const router = useRouter();
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };
    const service = new AuthService();
    const accountService = new AccountService();
    const globalService = new GlobalService();
    const kolAdditionInfoService = new KolAdditionalInfoService();
    const toast = useRef(null);

    const [openInfluencerRegisterDialog, setOpenInfluencerRegisterDialog] = useState(false);
    const [openCompanyRegisterDialog, setOpenCompanyRegisterDialog] = useState(false);
    const [openForgotPasswordDialog, setOpenForgotPasswordDialog] = useState(false);
    const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCloseDialog = () => {
        setOpenLoginDialog(false);
        setIsLogin(true);
        setFullName(window.localStorage.getItem('fullName') ?? '');
    };
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

    const fetchData = async (data) => {
        try {
            const resAccount = await accountService.findByEmail(data);
            // convert data to json\
            if (resAccount?.data?.code === 'success') {
                const content = resAccount.data.data;
                const resGlobal = await globalService.getDetailKolsProfileUpdate(content.mask, content.id);
                const resCompanyGlobal = await globalService.findCompanyInformationByAccountId(content.id);
                if (resGlobal.data.code === 'success') {
                    const contentAccountInformation = resGlobal.data.data;
                    const action = addProfile(contentAccountInformation);
                    dispatch(action);
                }
                if (resCompanyGlobal.data.code === 'success') {
                    const contentCompanyInformation = resCompanyGlobal.data.data;
                    const action = addCompanyProfile(contentCompanyInformation);
                    dispatch(action);
                }
                if (role == 'KOLIFL') {
                    const resKolAdditionalInfo = await kolAdditionInfoService.kolAdditionalInfo(content.id);
                    if (resKolAdditionalInfo.data.code === 'success') {
                        const contentKolAdditionalInfo = resKolAdditionalInfo.data.data;
                        const action = addKolAdditionalProfileProfile(contentKolAdditionalInfo);
                        dispatch(action);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const formik = useFormik({
        initialValues: {
            password: '',
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
            if (!data.password) {
                errors.password = 'Đây là một trường bắt buộc';
            }
            if (data.password.length > 80) {
                errors.password = 'Vui lòng không nhập quá 80 ký tự';
            }
            return errors;
        },
        onSubmit: async (data) => {
            try {
                await submitForm(data);
            } catch (error) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Thông báo',
                    detail: 'Thông tin tài khoản hoặc mật khẩu không chính xác',
                    life: 2000
                });
            } finally {
                formik.setSubmitting(false);
            }
        }
    });

    const submitForm = async (data) => {
        if (!isSubmitting) {
            setIsSubmitting(true);
            const res = await service.login(data);
            if (res.data.type === 'SUCCESS') {
                toast.current.show({
                    severity: 'success',
                    summary: 'Thông báo',
                    detail: 'Đăng nhập thành công',
                    life: 2000
                });
                if (typeof window !== 'undefined' && res.data.data.accessToken != null) {
                    localStorage.setItem('accessToken', res.data.data.accessToken);
                    localStorage.setItem('refreshToken', res.data.data.refreshToken);
                    localStorage.setItem('accountId', res.data.data.privileged.accountId);
                    localStorage.setItem('email', res.data.data.privileged.email);
                    localStorage.setItem('fullName', res.data.data.privileged.fullName);
                    if (res.data.data.privileged.scopes != null) {
                        localStorage.setItem('role', res.data.data.privileged.scopes[0].split(':')[0]);
                    }
                    await fetchData(res.data.data.privileged.email);
                    dispatch(login());
                    if (router.pathname === '/components/pricing') dispatch(isBuyLogin(true));
                    else dispatch(isBuyLogin(false));
                }
                formik.resetForm();
                setTimeout(handleCloseDialog, 500);
            } else {
                setIsSubmitting(false);
                toast.current.show({
                    severity: 'error',
                    summary: 'Thông báo',
                    detail: res.data.message,
                    life: 2000
                });
            }
        }
    };

    const footerContent = (
        <div>
            <div className="text-center lg:mt-5 gap-5">
                <p className="mb-1">Đăng ký tài khoản ? </p>
                <a
                    className="font-bold no-underline mr-2 cursor-pointer hover:underline"
                    style={{ color: 'var(--primary-color)' }}
                    href={'#'}
                    onClick={(e) => {
                        e.preventDefault();
                        setOpenInfluencerRegisterDialog(true);
                        setOpenLoginDialog(false);
                    }}
                >
                    KOL Influencer
                </a>
                <span>hoặc</span>
                <a
                    className="font-bold no-underline ml-2 cursor-pointer hover:underline"
                    style={{ color: 'var(--primary-color)' }}
                    href={'#'}
                    onClick={(e) => {
                        e.preventDefault();
                        setOpenCompanyRegisterDialog(true);
                        setOpenLoginDialog(false);
                    }}
                >
                    Nhà tuyển dụng
                </a>
            </div>
        </div>
    );

    return (
        <React.Fragment>
            <Dialog className="bg-white" header="Đăng nhập" visible={openLoginDialog} style={{ width: '30rem' }} breakpoints={{ '30rem': '30rem' }} onHide={() => setOpenLoginDialog(false)} footer={footerContent}>
                <Toast ref={toast} />
                <div className="w-full surface-card">
                    <div className="text-center mb-5">
                        <img src={`${contextPath}/layout/images/logo.jpg`} alt="InfluX" height="50" />
                    </div>
                    <p className="m-0">
                        <div className="form-demo">
                            <div className="justify-content-center">
                                <form onSubmit={formik.handleSubmit} className="p-fluid">
                                    <div className="field mt-3 mb-3">
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
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                autoFocus
                                                placeholder="Vui lòng nhập email của bạn"
                                                className={classNames({ 'p-invalid': isFormFieldValid('name') })}
                                            />
                                        </div>
                                        {getFormErrorMessage('email')}
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
                                                inputid="oldPassword"
                                                feedback={false}
                                                value={formik.values.password}
                                                onChange={(e) => {
                                                    formik.setFieldValue('password', e.target.value);
                                                }}
                                                placeholder="Vui lòng nhập mật khẩu của bạn"
                                                toggleMask={true}
                                                className={classNames({ 'p-invalid': isFormFieldValid('password') }, 'w-full')}
                                                inputClassName="w-full"
                                            ></Password>
                                        </div>
                                        {getFormErrorMessage('password')}
                                    </div>
                                    <div className="flex align-items-center justify-content-between gap-5 lg:mb-7 mb-4">
                                        <div className="flex align-items-center"></div>
                                        <a
                                            className="font-medium no-underline text-right cursor-pointer"
                                            style={{ color: 'var(--primary-color)' }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setOpenForgotPasswordDialog(true);
                                                setOpenLoginDialog(false);
                                            }}
                                        >
                                            Quên mật khẩu?
                                        </a>
                                    </div>
                                    <Button type="submit" aria-label="Normal" label="Đăng nhập" className="w-full text-xl" disabled={isSubmitting}></Button>
                                </form>
                            </div>
                        </div>
                    </p>
                </div>
            </Dialog>
            <ForgotPassword openForgotPasswordDialog={openForgotPasswordDialog} setOpenForgotPasswordDialog={setOpenForgotPasswordDialog} setOpenResetPasswordDialog={setOpenResetPasswordDialog} setOpenLoginDialog={setOpenLoginDialog} />
            <ResetPassword setOpenForgotPasswordDialog={setOpenForgotPasswordDialog} setOpenResetPasswordDialog={setOpenResetPasswordDialog} openResetPasswordDialog={openResetPasswordDialog} setOpenLoginDialog={setOpenLoginDialog} />
            <InfluencerRegister setOpenLoginDialog={setOpenLoginDialog} openLoginDialog={openLoginDialog} openInfluencerRegisterDialog={openInfluencerRegisterDialog} setOpenInfluencerRegisterDialog={setOpenInfluencerRegisterDialog} />
            <CompanyRegister setOpenLoginDialog={setOpenLoginDialog} openLoginDialog={openLoginDialog} openCompanyRegisterDialog={openCompanyRegisterDialog} setOpenCompanyRegisterDialog={setOpenCompanyRegisterDialog} />
        </React.Fragment>
    );
};

// LoginPage.getLayout = function getLayout(page) {
//     return (
//         <React.Fragment>
//             <div>mãi yêu</div>
//             {page}
//             <AppConfig simple />
//         </React.Fragment>
//     );
// };
export default LoginPage;
