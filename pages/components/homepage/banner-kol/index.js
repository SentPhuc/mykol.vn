import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { openPopupLogin } from 'public/reduxConfig/loginSlice';
import { useDispatch } from 'react-redux';
import { confirmDialog } from 'primereact/confirmdialog';

const BannerKol = () => {
    const getStorage = typeof window !== 'undefined' ? localStorage : {};
    const dispatch = useDispatch();
    const router = useRouter();
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const handleRedirectPage = (url) => {
        if (!getStorage.getItem('accountId')) {
            dispatch(openPopupLogin());
            return;
        }

        if (!!getStorage?.accountId && getStorage?.role == 'KOLIFL') {
            confirmDialog({
                message: 'Để sử dụng tính năng này, bạn cần đăng nhập hoặc đăng ký bằng tài khoản Nhà tuyển dụng. Hoặc liên hệ hỗ trợ qua sđt/zalo: 0383050533',
                header: 'Vui lòng đăng nhập tài khoản "Nhà Tuyển dụng"',
                rejectLabel: 'Đóng',
                className: 'custom-confirmDialog-pricing'
            });
            return;
        }
        router.push(url);
    };

    return (
        <>
            <div id="banner-kol" className="bg-white w-full md:pb-4 pb-2">
                <div className="container">
                    <div className="flex flex-wrap ">
                        <div onClick={() => handleRedirectPage('/components/search-tiktok-products')} className="md:col-6 md:pl-0 col-12 cursor-pointer">
                            <img className="max-w-full" src={`${contextPath}/demo/images/banner/banner-home-two.png`} alt="banner" />
                        </div>
                        <div onClick={() => handleRedirectPage('/components/search-tiktok-candidates')} className="md:col-6 md:pr-0 col-12 cursor-pointer">
                            <img className="max-w-full pt-2" src={`${contextPath}/demo/images/banner/banner-home-one.png`} alt="banner" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BannerKol;
