import getConfig from 'next/config';
import React, { useState, useRef, useEffect, useContext } from 'react';
import dynamic from 'next/dynamic';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { Ripple } from 'primereact/ripple';
import LoginPage from '../pages/auth/login';
import { Menu } from 'primereact/menu';
import InfluencerRegister from '../pages/auth/register/InfluencerRegister';
import CompanyRegister from '../pages/auth/register/CompanyRegister';
import ChangePassword from '../pages/auth/change-pasword';
import { LayoutContext } from './context/layoutcontext';
import { Avatar } from 'primereact/avatar';
import { DEV_URL, RULE_UPDATE_PROFILE_CREATE_RECRUITMENT, RULE_UPDATE_PROFILE_PROFILE } from '../src/commons/Utils';
import { useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { AccountService } from '../demo/service/AccountService';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { isBuyLogin } from 'public/reduxConfig/loginSlice';
import { deleteCookie } from 'src/commons/Function';

const AppMenu = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { closeMenu, layoutState, setLayoutState } = useContext(LayoutContext);
    const AppMenuitem = dynamic(() => import('./AppMenuitem'));
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [openLoginDialog, setOpenLoginDialog] = useState(false);
    const [openCompanyRegisterDialog, setOpenCompanyRegisterDialog] = useState(false);
    const [openInfluencerRegisterDialog, setOpenInfluencerRegisterDialog] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [fullName, setFullName] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [openSidebarUpdate, setOpenSidebarUpdate] = useState(false);
    const signUpMenu = useRef(null);
    const profiles = useSelector((state) => state.profiles);
    const companyProfile = useSelector((state) => state.companyProfile);
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
    const getLocalStorage = typeof window !== 'undefined' ? { ...localStorage } : null;
    const accountService = new AccountService();
    const [accountId, setAccountId] = useState('');
    const [accountMask, setAccountMask] = useState('');
    const [checkDataFull, setCheckDataFull] = useState(false);

    useEffect(() => {
        if (router.pathname !== '/components/pricing') {
            dispatch(isBuyLogin(false));
        }
    }, [router]);

    useEffect(async () => {
        const currentUrl = window?.location;
        if (isLoggedIn || Number(getLocalStorage?.accountId) > 0) {
            setIsLogin(true);
            setFullName(getLocalStorage?.fullName);

            // if (NEEDED_CLOSE_MENU.includes(currentUrl.pathname)) {
            //     closeMenu();
            // }
            // setLayoutState((state) => ({ ...state, ...{ staticMenuDesktopInactive: false } }));
        }
    }, [isLoggedIn]);

    useEffect(async () => {
        if (companyProfile.length === 0) return;
        setProfileImage(companyProfile?.[0]?.profileImage);
        setAccountId(companyProfile?.[0]?.accountId);

        let confirmUpdateCompanyProfile = RULE_UPDATE_PROFILE_CREATE_RECRUITMENT.map((value) => !!companyProfile?.[0]?.[value]);
        if (_.every(confirmUpdateCompanyProfile)) {
            setCheckDataFull(true);
        }
    }, [companyProfile]);

    useEffect(async () => {
        if (profiles.length === 0) return;
        if (!!profileImage) return;
        setProfileImage(profiles?.[0]?.profileImage);
        setAccountMask(profiles?.[0]?.mask);
        setAccountId(profiles?.[0]?.id);

        let confirmUpdateCompanyProfile = RULE_UPDATE_PROFILE_PROFILE.map((value) => !!profiles?.[0]?.[value]);
        if (_.every(confirmUpdateCompanyProfile)) {
            setCheckDataFull(true);
        }
    }, [profiles]);

    useEffect(async () => {
        if (!getLocalStorage?.email && !getLocalStorage?.role) return;
        const resAccount = await accountService.findByEmail(getLocalStorage?.email);
        if (resAccount?.data?.code !== 'success') return;
        setProfileImage(resAccount?.data?.data?.profileImage);
        setFullName(getLocalStorage?.fullName);
        setAccountMask(resAccount?.data?.data?.mask);
        setAccountId(resAccount?.data?.data?.id);
    }, [getLocalStorage]);

    const onLogout = () => {
        localStorage.clear();
        window.location.reload();
        deleteCookie('_zzag');
    };

    const getMenuWithRole = () => {
        const role = getLocalStorage?.role;
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
        // Start: Module Kols
        {
            items: [
                // {
                //     label: 'Referrals',
                //     icon: false,
                //     to: '/components/referrals'
                // },
                {
                    label: 'Đơn hàng',
                    icon: false,
                    to: '/components/chat-box'
                },
                {
                    label: 'Xem profile',
                    icon: false,
                    to: !!accountId && !!accountMask ? `/components/detail-candidate/?mask=${accountMask}&id=${accountId}` : ''
                },
                // {
                //     label: 'Ví của bạn',
                //     icon: false,
                //     to: '/components/wallet'
                // },
                {
                    label: 'Cập nhật hồ sơ',
                    icon: false,
                    to: '/components/profile'
                }
            ]
        }
    ];

    const menuRecruitment = [
        //Start: Module nhà tuyển dụng
        {
            items: [
                // {
                //     label: 'Referrals',
                //     icon: false,
                //     to: '/components/referrals'
                // },
                {
                    label: 'Đơn hàng',
                    icon: false,
                    to: '/components/chat-box'
                },
                {
                    label: 'Quản lý tin đăng',
                    icon: false,
                    to: '/components/list-recruitments'
                },
                {
                    label: 'Khám phá Tiktok',
                    icon: false,
                    to: '/components/search-tiktok-candidates'
                },
                {
                    label: 'Xem profile',
                    icon: false,
                    to: !!accountId ? `/components/company/company-introduction/${accountId}` : ''
                },
                // {
                //     label: 'Ví của bạn',
                //     icon: false,
                //     to: '/components/wallet'
                // },
                {
                    label: 'Hồ sơ công ty',
                    icon: false,
                    to: '/components/company-profile'
                }
            ]
        }
        // End: Module nhà tuyển dụng
    ];

    const menuAdmin = [
        // Start: Module admin
        {
            label: 'Duyệt hồ sơ',
            items: [
                { label: 'Khóa tài khoản KOLS', icon: 'pi pi-fw pi-verified', to: '/components/verified-kols' },
                { label: 'Duyệt tin tuyển dụng', icon: 'pi pi-fw pi-verified', to: '/components/verified-recruitment' }
            ]
        },
        {
            label: 'Quản trị',
            items: [
                { label: 'Xem danh sách quyền', icon: 'pi pi-cog', to: '/components/roles' },
                { label: 'Hủy trạng thái làm việc', icon: 'pi pi-at', to: '/components/cancel-contract' },
                // { label: 'Lịch sử thanh toán', icon: 'pi pi-at', to: '/components/payment-history' },
                //sales icon
                { label: 'Cập nhật số lượt bán', icon: 'pi pi-shopping-bag', to: '/components/update-kol-sales' },
                { label: 'Quản lý gói tin NTD', icon: 'pi pi-money-bill', to: '/components/recruiter-subscription' },
                { label: 'Quản lý gói dịch vụ', icon: 'pi pi-money-bill', to: '/components/subscription-package' },
                { label: 'Phần quyền sales', icon: 'pi pi-lock', to: '/components/assign-sales-role' },
                { label: 'Referrals', icon: 'pi pi-share-alt', to: '/components/referrals' },
                { label: 'Kiểm duyệt thông tin', icon: 'pi pi-lock', to: '/components/information-censorship' },
                { label: 'Theo dõi giao dịch', icon: 'pi pi-book', to: '/booking-tracking' }
            ]
        }
        // End: Module admin
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

    const onClickAvatarToprofile = (role) => {
        if (!role) return;
        if (role == 'KOLIFL') {
            return router.push('/components/detail-candidate/?mask=' + accountMask + '&id=' + accountId);
            // if (!!checkDataFull) return router.push('/components/detail-candidate/?mask=' + accountMask + '&id=' + accountId);
            // return router.push('/components/profile/');
        }
        if (role == 'REC') {
            if (!!checkDataFull) return router.push('/components/company/company-introduction/' + accountId + '/');
            return router.push('/components/company-profile/');
        }
    };

    return (
        <MenuProvider>
            <ul className="this-login-layout-menu-mobile layout-menu flex justify-content-center my-3 align-items-center layout-menu-is-mobile">
                {isMobile && !isLogin && (
                    <>
                        <li>
                            <a
                                className="text-900"
                                title="Đăng nhập"
                                onClick={() => {
                                    setOpenLoginDialog(true);
                                }}
                            >
                                Đăng nhập
                            </a>
                        </li>
                        <li className="px-3">|</li>
                        <li>
                            <a className="text-900" title="Đăng ký" onClick={(e) => signUpMenu.current.toggle(e)}>
                                Đăng ký
                            </a>
                        </li>
                        <Menu model={signUpList} popup ref={signUpMenu} />
                    </>
                )}
                {isMobile && isLogin && (
                    <>
                        {profileImage != null ? (
                            <div className="avatar-menu-topbar relative" onClick={() => onClickAvatarToprofile(getLocalStorage?.role)}>
                                <Avatar className="border-circle" imageFallback={`${DEV_URL}${profileImage}`} image={`${DEV_URL}${profileImage}`} size="large" shape="circle" />
                            </div>
                        ) : (
                            <div className="avatar-menu-topbar relative">
                                <Avatar className="border-circle" image={`${contextPath}/demo/images/avatar/no-avatar.png`} alt={'img'} size="large" />
                            </div>
                        )}
                        <span className="fullName-text cursor-pointer font-bold pl-2" onClick={() => onClickAvatarToprofile(getLocalStorage?.role)}>
                            {fullName?.slice(0, 45)}
                            {fullName?.length > 45 && <span>...</span>}
                        </span>
                    </>
                )}
            </ul>
            {isMobile && <hr></hr>}
            <ul className="layout-menu layout-menu-is-mobile">
                <li className="layout-root-menuitem">
                    <div className="layout-menuitem-root-text">Menu</div>
                    <ul>
                        <li>
                            <Link href="/components/search-kocs" title="Danh sách Influencers">
                                <a tabIndex="0">
                                    <span className="layout-menuitem-text">Danh sách Influencers</span>
                                    <Ripple />
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/recruitments" title="Tin tuyển dụng">
                                <a tabIndex="0">
                                    <span className="layout-menuitem-text">Tin tuyển dụng</span>
                                    <Ripple />
                                </a>
                            </Link>
                        </li>
                    </ul>
                </li>
            </ul>

            <ul className="layout-menu">
                {getMenuWithRole().map((item, i) => {
                    return !item.seperator && <AppMenuitem item={item} root={true} index={i} key={i} />;
                })}
            </ul>
            {isLogin && isMobile && (
                <>
                    <hr />
                    <ul className="this-login-layout-menu-mobile layout-menu flex my-3 align-items-center layout-menu-is-mobile">
                        <li>
                            <a
                                className="text-900"
                                title="Đổi mật khẩu"
                                onClick={() => {
                                    setOpenSidebarUpdate(true);
                                }}
                            >
                                Đổi mật khẩu
                            </a>
                        </li>
                        <li className="px-3">|</li>
                        <li>
                            <a className="text-900" title="Đăng ký" onClick={() => onLogout()}>
                                Đăng xuất
                            </a>
                        </li>
                    </ul>
                </>
            )}
            {isLogin && isMobile && <ChangePassword openSidebarUpdate={openSidebarUpdate} setOpenSidebarUpdate={setOpenSidebarUpdate} />}
            {!isLogin && isMobile && (
                <>
                    <LoginPage setFullName={setFullName} setIsLogin={setIsLogin} openLoginDialog={openLoginDialog} setOpenLoginDialog={setOpenLoginDialog} />
                    <InfluencerRegister setOpenLoginDialog={setOpenLoginDialog} openLoginDialog={openLoginDialog} openInfluencerRegisterDialog={openInfluencerRegisterDialog} setOpenInfluencerRegisterDialog={setOpenInfluencerRegisterDialog} />
                    <CompanyRegister setOpenLoginDialog={setOpenLoginDialog} openLoginDialog={openLoginDialog} openCompanyRegisterDialog={openCompanyRegisterDialog} setOpenCompanyRegisterDialog={setOpenCompanyRegisterDialog} />
                </>
            )}
        </MenuProvider>
    );
};

export default AppMenu;
