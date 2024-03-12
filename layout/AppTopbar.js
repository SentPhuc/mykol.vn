import getConfig from 'next/config';
import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import ChangePassword from '../pages/auth/change-pasword';
import LoginPage from '../pages/auth/login';
import InfluencerRegister from '../pages/auth/register/InfluencerRegister';
import CompanyRegister from '../pages/auth/register/CompanyRegister';
import SelectPaymentMethod from '../pages/payment/SelectPaymentMethod';
import { DEV_URL, NEEDED_CLOSE_MENU, RULE_UPDATE_PROFILE_CREATE_RECRUITMENT, RULE_UPDATE_PROFILE_PROFILE } from '../src/commons/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { addProfile } from '../public/reduxConfig/kolsProfileSlice';
import { addCompanyProfile } from '../public/reduxConfig/companyProfileSlice';
import { AccountService } from '../demo/service/AccountService';
import { GlobalService } from '../demo/service/GlobalService';
import { Avatar } from 'primereact/avatar';
import Notifications from '../pages/components/notifications';
import { KolAdditionalInfoService } from '../demo/service/KolAdditionalInfoService';
import { addKolAdditionalProfileProfile } from '../public/reduxConfig/kolInformationSlice';
import { isMobile } from 'react-device-detect';
import { closePopupLogin, openPopupLogin } from '../public/reduxConfig/loginSlice';
import { NotificationService } from '../demo/service/NotificationService';
import _ from 'lodash';
import { deleteCookie } from 'src/commons/Function';

const AppTopbar = forwardRef((props, ref) => {
    const { layoutState, onMenuToggle, showProfileSidebar, closeMenu } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const menu = useRef(null);
    const signUpMenu = useRef(null);
    const router = useRouter();
    const accountService = new AccountService();
    const globalService = new GlobalService();
    const kolAdditionInfoService = new KolAdditionalInfoService();
    const [openSidebarUpdate, setOpenSidebarUpdate] = useState(false);
    const [openInfluencerRegisterDialog, setOpenInfluencerRegisterDialog] = useState(false);
    const [openCompanyRegisterDialog, setOpenCompanyRegisterDialog] = useState(false);
    const [selectPaymentMethodDialog, setSelectPaymentMethodDialog] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [fullName, setFullName] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [accountId, setAccountId] = useState('');
    const [accountMask, setAccountMask] = useState('');
    const [checkDataFull, setCheckDataFull] = useState(false);
    const dispatch = useDispatch();
    const notificationOp = useRef(null);
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    const isOpenPopupLogin = useSelector((state) => state.loginLayout.isOpenPopup);
    const [unReadCount, setUnReadCount] = useState(0);
    const notificationService = new NotificationService();
    const setOpenLoginDialog = (open) => {
        dispatch(open ? openPopupLogin() : closePopupLogin());
    };
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

    useEffect(() => {
        // const fetchReadCount = async () => {
        //     const token = localStorage.getItem('accessToken');
        //     if (!token) return;
        //     const response = await notificationService.getUnreadCount();
        //     if (response.data.code !== 'success') {
        //         return;
        //     }
        //     setUnReadCount(response.data.data.total);
        // };
        // const interval = setInterval(fetchReadCount, 3000);
        // return () => clearInterval(interval);
    }, [isLoggedIn]);

    const fetchData = async (data) => {
        const resAccount = await accountService.findByEmail(data);
        // convert data to json
        if (resAccount?.data?.code === 'success') {
            const content = resAccount.data.data;
            setProfileImage(content.profileImage);
            setAccountMask(content?.mask);
            localStorage?.setItem('accountMask', content?.mask);
            setAccountId(content.id);
            const resGlobal = await globalService.getDetailKolsProfileUpdate(content?.mask, content.id);
            // const resCompanyGlobal = await globalService.findCompanyInformationByAccountId(content.id);
            if (resGlobal.data.code === 'success') {
                const contentAccountInformation = resGlobal.data.data;
                const action = addProfile(contentAccountInformation);
                dispatch(action);
            }
            // if (resCompanyGlobal.data.code === 'success') {
            //     const contentCompanyInformation = resCompanyGlobal.data.data;
            //     const action = addCompanyProfile(contentCompanyInformation);
            //     dispatch(action);
            // }
            if (role == 'KOLIFL') {
                const resKolAdditionalInfo = await kolAdditionInfoService.kolAdditionalInfo(content.id);
                if (resKolAdditionalInfo.data.code === 'success') {
                    const contentKolAdditionalInfo = resKolAdditionalInfo.data.data;
                    const action = addKolAdditionalProfileProfile(contentKolAdditionalInfo);
                    dispatch(action);
                }
            }
        }
    };

    useEffect(async () => {
        const currentUrl = window.location;
        const storedToken = localStorage?.getItem('accessToken');
        if (!!isLoggedIn || !!storedToken) {
            setIsLogin(true);
            setFullName(localStorage?.getItem('fullName'));
            setAccountMask(localStorage?.getItem('accountMask'));
            await fetchData(localStorage?.getItem('email'));
        }
        // if (NEEDED_CLOSE_MENU.includes(currentUrl.pathname) && !isLoggedIn && !storedToken) {
        //     closeMenu();
        // }
    }, [isLoggedIn]);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const getMenuWithRole = () => {
        switch (role) {
            case 'KOLIFL':
                return menuInflu;
                break;
            case 'REC':
                return menuRecruitment;
                break;
            case 'ADMINISTRATION':
                return menuAdmin;
                break;
            default:
                return [];
        }
    };

    const menuInflu = [
        {
            label: 'Xem profile',
            icon: 'pi pi-info-circle',
            command: () => {
                onMenuToggle();
                handleClickKOL();
            }
        },
        // {
        //     label: 'Ví của bạn',
        //     icon: 'pi pi-wallet',
        //     command: () => {
        //         router.push('/components/wallet');
        //     }
        // },
        {
            label: 'Cập nhật hồ sơ',
            icon: 'pi pi-book',
            command: () => {
                router.push('/components/profile');
            }
        },
        {
            label: 'Đổi mật khẩu',
            icon: 'pi pi-user-edit',
            command: () => {
                setOpenSidebarUpdate(true);
            }
        },
        {
            label: 'Đăng xuất',
            icon: 'pi pi-sign-out',
            command: () => {
                onLogout();
            }
        }
    ];

    const menuRecruitment = [
        {
            label: 'Quản lý tin đăng',
            icon: 'pi pi-verified',
            command: () => {
                router.push('/components/list-recruitments');
            }
        },
        {
            label: 'Khám phá Tiktok',
            icon: 'pi pi-search',
            command: () => {
                // onMenuToggle();
                router.push('/components/search-tiktok-candidates');
            }
        },
        {
            label: 'Xem profile',
            icon: 'pi pi-info-circle',
            command: () => {
                // onMenuToggle();
                handleClickREL();
            }
        },
        // {
        //     label: 'Ví của bạn',
        //     icon: 'pi pi-wallet',
        //     command: () => {
        //         router.push('/components/wallet');
        //     }
        // },
        {
            label: 'Hồ sơ công ty',
            icon: 'pi pi-building',
            command: () => {
                // onMenuToggle();
                router.push('/components/company-profile');
            }
        },
        {
            label: 'Đổi mật khẩu',
            icon: 'pi pi-user-edit',
            command: () => {
                setOpenSidebarUpdate(true);
            }
        },
        {
            label: 'Đăng xuất',
            icon: 'pi pi-sign-out',
            command: () => {
                onLogout();
            }
        }
    ];

    const menuAdmin = [
        {
            label: 'Quản lý hệ thống',
            icon: 'pi pi-briefcase',
            command: () => {
                onMenuToggle();
                router.push('/components/verified-kols');
            }
        },
        {
            label: 'Đăng xuất',
            icon: 'pi pi-sign-out',
            command: () => {
                onLogout();
            }
        }
    ];

    const signUpList = [
        {
            label: 'Đăng ký',
            items: [
                {
                    label: 'KOLs, Influencers',
                    icon: 'pi pi-user-plus',
                    command: () => {
                        setOpenInfluencerRegisterDialog(true);
                        setOpenLoginDialog(false);
                    }
                },
                {
                    label: 'Nhà tuyển dụng',
                    icon: 'pi pi-building',
                    command: () => {
                        setOpenCompanyRegisterDialog(true);
                        setOpenLoginDialog(false);
                    }
                }
            ]
        }
    ];

    const onLogout = () => {
        localStorage.clear();
        router.push('/');
        deleteCookie('_zzag');
        setTimeout(() => window.location.reload(), 500);
    };

    const closeProfiles = () => {
        // closeMenu();
    };

    const handlerRouter = (url) => {
        // closeMenu();
        router.push(url);
    };

    function handleClickKOL() {
        // Handle click logic
        const mask = localStorage?.getItem('accountMask');
        if (mask) {
            const tempMask = mask;
            setAccountMask(() => tempMask);
        }
        if (!!checkDataFull) return router.push('/components/detail-candidate/?mask=' + accountMask + '&id=' + accountId);
        return router.push('/components/profile/');
    }

    function handleClickREL() {
        // Handle click logic
        // if (!!checkDataFull) return router.push('/components/company/company-introduction/' + accountId + '/');
        // return router.push('/components/company-profile/');
        if (!accountId) return;

        router.push('/components/company/company-introduction/' + accountId + '/');
    }

    const companyProfile = useSelector((state) => state.companyProfile);
    const profiles = useSelector((state) => state.profiles);

    useEffect(() => {
        if (companyProfile.length === 0) return;
        setFullName(companyProfile?.[0]?.companyName);
        setProfileImage(companyProfile?.[0]?.profileImage);
        setAccountMask(localStorage?.getItem('accountMask'));
        let confirmUpdateCompanyProfile = RULE_UPDATE_PROFILE_CREATE_RECRUITMENT.map((value) => !!companyProfile?.[0]?.[value]);
        if (_.every(confirmUpdateCompanyProfile)) {
            setCheckDataFull(true);
        }
    }, [companyProfile]);

    useEffect(() => {
        if (profiles.length === 0) return;
        setFullName(profiles?.[0].fullName);
        setProfileImage(profiles?.[0].profileImage);
        setAccountMask(localStorage?.getItem('accountMask'));
        let confirmUpdateCompanyProfile = RULE_UPDATE_PROFILE_PROFILE.map((value) => !!profiles?.[0]?.[value]);
        if (_.every(confirmUpdateCompanyProfile)) {
            setCheckDataFull(true);
        }
    }, [profiles]);

    return (
        <div className="layout-topbar">
            <Link href="/">
                <a className="layout-topbar-logo" onClick={closeProfiles}>
                    <>
                        <img src={`${contextPath}/layout/images/logo.jpg`} width="70" height={'60'} alt="logo" />
                    </>
                </a>
            </Link>
            <div className="btn-header-topbar">
                {(isLogin && isMobile) ?? (
                    <Button type="button" className="p-link layout-topbar-button" onClick={(e) => notificationOp.current.toggle(e)}>
                        <i className="pi pi-bell notification-icon"></i>
                        {unReadCount > 0 ? <span className="block absolute bg-primary border-round w-1rem h-1rem text-xs top-0 right-0">{unReadCount}</span> : ''}
                    </Button>
                )}
                {(isLogin && role == 'ADMINISTRATION') || isMobile ? (
                    <button ref={menubuttonRef} type="button" className={'p-link layout-menu-button layout-topbar-button layout-topbar-button-open-left-menu'} onClick={onMenuToggle}>
                        <i className="pi pi-bars" />
                    </button>
                ) : (
                    ''
                )}
            </div>
            {!isMobile && (
                <div className="nav-menu-top-bar">
                    <button type="button" className="p-link ml-0 px-3 py-2 layout-menu-button layout-topbar-button font-bold" onClick={() => handlerRouter('/components/search-kocs')}>
                        Danh sách Influencers
                    </button>
                    <button type="button" className="p-link ml-0 px-3 py-2 layout-menu-button layout-topbar-button font-bold" onClick={() => handlerRouter('/recruitments')}>
                        Tin tuyển dụng
                    </button>
                    {isLogin && (
                        <>
                            <button type="button" className="p-link ml-0 px-3 py-2 layout-menu-button layout-topbar-button font-bold" onClick={() => (window.location.href = '/components/chat-box')}>
                                Đơn hàng
                            </button>
                            {/* Ẩn tạm thời */}
                            {/* <button type="button" className="p-link px-3 py-2 layout-menu-button layout-topbar-button font-bold" onClick={() => handlerRouter('/components/referrals')}>
                                Referrals
                            </button> */}
                        </>
                    )}
                </div>
            )}

            {!isMobile && (
                <button ref={topbarmenubuttonRef} type="button" className={'p-link ml-0 outline-none layout-topbar-menu-button layout-topbar-button'} onClick={showProfileSidebar}>
                    {!isLogin ? (
                        <div className="no-login">
                            <i className="pi pi-bars" style={{ fontSize: '2rem' }}></i>
                        </div>
                    ) : profileImage != null ? (
                        <Avatar image={`${DEV_URL}${profileImage}`} size="large" shape="circle" />
                    ) : (
                        <Avatar image={`${contextPath}/demo/images/avatar/no-avatar.png`} alt={'img'} size="large" />
                    )}
                </button>
            )}

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu layout-topbar-menu-moblie', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                {isLogin ? (
                    <div className="loginned-menu-topbar">
                        <Button type="button" className="p-link layout-topbar-button relative" onClick={(e) => notificationOp.current.toggle(e)}>
                            <i className="pi pi-bell notification-icon"></i>
                            {unReadCount > 0 ? <span className="block absolute bg-primary border-round w-1rem h-1rem text-xs top-0 right-0">{unReadCount}</span> : ''}
                        </Button>
                        <span className="fullName-text cursor-pointer font-bold" onClick={(e) => menu.current.toggle(e)}>
                            {fullName?.slice(0, 45)}
                            {fullName?.length > 45 && <span>...</span>}
                        </span>
                        {profileImage ? (
                            <div className="avatar-menu-topbar relative cursor-pointer" onClick={(e) => menu.current.toggle(e)}>
                                <Avatar className="border-circle" image={`${DEV_URL}${profileImage}`} size="large" shape="circle" />
                                <i className="pi pi-chevron-circle-down absolute right-0"></i>
                            </div>
                        ) : (
                            <div className="avatar-menu-topbar relative cursor-pointer" onClick={(e) => menu.current.toggle(e)}>
                                <Avatar className="border-circle" image={`${contextPath}/demo/images/avatar/no-avatar.png`} alt={'img'} size="large" />
                                <i className="pi pi-chevron-circle-down absolute right-0"></i>
                            </div>
                        )}
                        <Menu model={getMenuWithRole()} popup ref={menu} className="topbar-fixed-menu" />
                    </div>
                ) : (
                    <div>
                        <button
                            type="button"
                            className="p-link layout-topbar-button"
                            onClick={() => {
                                setOpenLoginDialog(true);
                            }}
                        >
                            <span>Đăng nhập</span>
                        </button>
                        <span> | </span>
                        <button type="button" className="p-link layout-topbar-button" onClick={(e) => signUpMenu.current.toggle(e)}>
                            <span>Đăng ký</span>
                        </button>
                    </div>
                )}
                <Menu model={signUpList} popup ref={signUpMenu} />
                {isLogin && isMobile && <Menu model={getMenuWithRole()} className="topbar-fixed-menu topbar-fixed-menu-for-mobile" />}
            </div>

            <ChangePassword openSidebarUpdate={openSidebarUpdate} setOpenSidebarUpdate={setOpenSidebarUpdate} />
            <LoginPage setFullName={setFullName} setIsLogin={setIsLogin} openLoginDialog={isOpenPopupLogin} setOpenLoginDialog={setOpenLoginDialog} />
            <InfluencerRegister setOpenLoginDialog={setOpenLoginDialog} openLoginDialog={isOpenPopupLogin} openInfluencerRegisterDialog={openInfluencerRegisterDialog} setOpenInfluencerRegisterDialog={setOpenInfluencerRegisterDialog} />
            <CompanyRegister setOpenLoginDialog={setOpenLoginDialog} openLoginDialog={isOpenPopupLogin} openCompanyRegisterDialog={openCompanyRegisterDialog} setOpenCompanyRegisterDialog={setOpenCompanyRegisterDialog} />
            <SelectPaymentMethod selectPaymentMethodDialog={selectPaymentMethodDialog} setSelectPaymentMethodDialog={setSelectPaymentMethodDialog} />
            {/* <Notifications notificationOp={notificationOp} isLogin={isLogin} setUnReadCount={setUnReadCount} /> */}
        </div>
    );
});

export default AppTopbar;
