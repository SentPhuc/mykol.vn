import { useRouter } from 'next/router';
import { useEventListener, useUnmountEffect } from 'primereact/hooks';
import { classNames, DomHandler } from 'primereact/utils';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AppFooter from './AppFooter';
import AppMenu from './AppMenu';
import AppTopbar from './AppTopbar';
// import AppConfig from './AppConfig';
import { LayoutContext } from './context/layoutcontext';
import PrimeReact from 'primereact/api';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import 'swiper/swiper-bundle.css';
import 'swiper/swiper.css';
import { Provider } from 'react-redux';
import configureStore from '../public/reduxConfig/store/configureStore';
import HeadSEO from 'pages/components/SEO/HeadSEO';
import { isMobile } from 'react-device-detect';

const Layout = (props) => {
    const { layoutConfig, layoutState, setLayoutState, onMenuToggle } = useContext(LayoutContext);
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    const accountId = typeof window !== 'undefined' ? localStorage.getItem('accountId') : null;
    const topbarRef = useRef(null);
    const sidebarRef = useRef(null);
    const [isShow, setIsShown] = useState(false);
    const [isShowLeftMenu, setIsShowLeftMenu] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsShowLeftMenu((!!accountId && role == 'ADMINISTRATION') || isMobile);
    });
    const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] = useEventListener({
        type: 'click',
        listener: (event) => {
            const isOutsideClicked = !(
                sidebarRef?.current?.isSameNode(event.target) ||
                sidebarRef?.current?.contains(event.target) ||
                topbarRef?.current?.menubutton?.isSameNode(event.target) ||
                topbarRef?.current?.menubutton?.contains(event.target)
            );

            if (isOutsideClicked) {
                hideMenu();
            }
        }
    });

    const [bindProfileMenuOutsideClickListener, unbindProfileMenuOutsideClickListener] = useEventListener({
        type: 'click',
        listener: (event) => {
            const isOutsideClicked = !(
                topbarRef.current?.topbarmenu?.isSameNode(event.target) ||
                topbarRef.current.topbarmenu.contains(event.target) ||
                topbarRef.current?.topbarmenubutton?.isSameNode(event.target) ||
                topbarRef.current.topbarmenubutton.contains(event.target)
            );

            if (isOutsideClicked) {
                hideProfileMenu();
            }
        }
    });

    const hideMenu = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            overlayMenuActive: false,
            staticMenuMobileActive: false,
            menuHoverActive: false
        }));

        unbindMenuOutsideClickListener();
        unblockBodyScroll();
    };

    const hideProfileMenu = () => {
        setLayoutState((prevLayoutState) => ({ ...prevLayoutState, profileSidebarVisible: false }));
        unbindProfileMenuOutsideClickListener();
    };

    const blockBodyScroll = () => {
        DomHandler.addClass('blocked-scroll');
    };

    const unblockBodyScroll = () => {
        DomHandler.removeClass('blocked-scroll');
    };

    useEffect(() => {
        if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
            bindMenuOutsideClickListener();
        }

        layoutState.staticMenuMobileActive && blockBodyScroll();
    }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive]);

    useEffect(() => {
        if (layoutState.profileSidebarVisible) {
            bindProfileMenuOutsideClickListener();
        }
    }, [layoutState.profileSidebarVisible]);

    useEffect(() => {
        router.events.on('routeChangeComplete', () => {
            hideMenu();
            hideProfileMenu();
        });
    }, []);

    PrimeReact.ripple = true;

    useUnmountEffect(() => {
        unbindMenuOutsideClickListener();
        unbindProfileMenuOutsideClickListener();
    });

    const containerClass = classNames('layout-wrapper', {
        'layout-theme-light': layoutConfig.colorScheme === 'light',
        'layout-theme-dark': layoutConfig.colorScheme === 'dark',
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': !layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive,
        'p-input-filled': layoutConfig.inputStyle === 'filled',
        'p-ripple-disabled': !layoutConfig.ripple
    });

    return (
        <Provider store={configureStore}>
            <React.Fragment>
                <HeadSEO {...props?.children?.[0]?.props} />
                <div className={containerClass}>
                    <AppTopbar ref={topbarRef} />
                    {isShowLeftMenu && (
                        <div ref={sidebarRef} className={classNames(isShow ? 'show' : '', 'layout-sidebar layout-sidebar-hover')}>
                            <button
                                onClick={onMenuToggle}
                                data-resize-button="true"
                                aria-expanded="true"
                                aria-label="Sidebar navigation"
                                type="button"
                                data-testid="ContextualNavigation-resize-button"
                                className="css-button-menu"
                                aria-describedby="93val-tooltip"
                            >
                                <span aria-hidden="true" className="css-snhnyn">
                                    <svg width="24" height="24" viewBox="0 0 24 24" role="presentation">
                                        <path
                                            d="M10.294 9.698a.988.988 0 010-1.407 1.01 1.01 0 011.419 0l2.965 2.94a1.09 1.09 0 010 1.548l-2.955 2.93a1.01 1.01 0 01-1.42 0 .988.988 0 010-1.407l2.318-2.297-2.327-2.307z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                        ></path>
                                    </svg>
                                </span>
                                <div className="css-sub-menu"></div>
                            </button>
                            <div onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)} className="layout-sidebar-box">
                                <div className="contextualNavigation-shadow"></div>
                                <AppMenu />
                            </div>
                        </div>
                    )}

                    <div className={classNames(!isShowLeftMenu ? 'ml-0' : '', 'layout-main-container')}>
                        <div className="layout-main">{props.children}</div>
                        <AppFooter />
                    </div>
                    {/* <AppConfig /> */}
                    <div className="layout-mask"></div>
                </div>
            </React.Fragment>
        </Provider>
    );
};

export default Layout;
