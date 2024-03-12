import FeatureDetails from './featureDetails';
import { formatNumberThousands, listPricings } from 'src/commons/Utils';
import { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useSelector, useDispatch } from 'react-redux';
import { openPopupLogin } from 'public/reduxConfig/loginSlice';
import { useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { GlobalService } from 'demo/service/GlobalService';
import { Tooltip } from 'primereact/tooltip';

const Pricing = () => {
    const dispatch = useDispatch();
    const globalService = new GlobalService();
    const isLogin = useSelector((state) => state?.auth?.isLoggedIn);
    const isBuy = useSelector((state) => state?.loginLayout?.isBuy);
    const toastCopy = useRef(null);
    const [packages, setPackages] = useState(false);
    const [showPhone, setShowPhone] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const getStorage = typeof window !== 'undefined' ? localStorage : {};

    const handleBuyNow = (type) => {
        setIsLoading(true);
        if (type == 'Liên hệ') {
            setShowPhone(!showPhone);
            setIsLoading(false);
            return;
        }

        //Logged
        checkRolesUser();

        //No login
        if (!!getStorage && getStorage.accountId == undefined) {
            dispatch(openPopupLogin());
        }

        setTimeout(() => setIsLoading(false), 1500);
    };

    useEffect(() => {
        globalService
            .getAllSubscriptionsPackage()
            .then((data) => {
                if (data?.data?.code === 'success') {
                    setPackages(data?.data?.data);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        if (!!isLogin && !!isBuy) {
            checkRolesUser();
        }
    }, [isLogin, isBuy]);
    const checkRolesUser = () => {
        if (getStorage && getStorage.accountId && getStorage.role === 'REC') {
            window.location.href = '/components/service-packages-and-payments';
        }

        if (getStorage && getStorage.accountId && getStorage.role === 'KOLIFL') {
            confirmDialog({
                message: 'Để mua gói dịch vụ này, bạn cần đăng nhập hoặc đăng ký bằng tài khoản Nhà tuyển dụng. Hoặc liên hệ  hỗ trợ qua sđt/zalo: 0383050533',
                header: 'Vui lòng đăng nhập tài khoản "Nhà Tuyển dụng"',
                rejectLabel: 'Đóng',
                className: 'custom-confirmDialog-pricing'
            });
        }
    };

    const onCopyHandler = async (email) => {
        await navigator.clipboard.writeText(email);
        toastCopy.current.show({ severity: 'success', summary: 'Thành công', detail: 'Copy to clipboard', life: 3000 });
        setShowPhone(false);
    };

    return (
        <>
            <ConfirmDialog />
            <Toast ref={toastCopy} position="top-right" />
            <div className="page-pricing h-full p-3 md:pt-4 md:pr-5 md:pl-5 md:pb-8 bg-white">
                <h3 className="text-center text-4xl font-bold mb-5">Bảng giá</h3>
                <div className="grid grid-nogutter align-items-start justify-content-between">
                    {packages &&
                        packages.map((value, index) => {
                            return (
                                <div className="item-listPricing cursor-pointer transition-all" key={index}>
                                    <h3 className="title-pricing">{value.name}</h3>
                                    <div className="price-pricing">
                                        {listPricings(value.code)?.type === 'Liên hệ' ? (
                                            <span>Liên hệ</span>
                                        ) : (
                                            <>
                                                <span>{formatNumberThousands(value.price)}đ</span>
                                                /tháng
                                            </>
                                        )}
                                    </div>
                                    <ul className="list-none pl-0 mb-0">
                                        {!!value &&
                                            listPricings(value.code)?.listService?.map((list, indexList) => {
                                                return (
                                                    <li key={indexList} className="mt-2 flex align-content-start">
                                                        <i className="pi pi-check-circle mr-2 vertical-align-middle text-green-400 text-3xl"></i>
                                                        <span>
                                                            {list.title}
                                                            {list.helper && (
                                                                <>
                                                                    <i
                                                                        className={`pi pi-info-circle target-helper-packages-${indexList} ml-2 mr-1 cursor-pointer vertical-align-middle`}
                                                                        data-pr-tooltip={list.titleHelper}
                                                                        data-pr-position="bottom"
                                                                        data-pr-at="center top-38"
                                                                        data-pr-my="center"
                                                                    ></i>
                                                                    <Tooltip target={`.target-helper-packages-${indexList}`} />
                                                                </>
                                                            )}
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                    </ul>
                                    <div className="relative w-full">
                                        <button
                                            disabled={isLoading}
                                            onClick={() => handleBuyNow(listPricings(value.code)?.type)}
                                            className={classNames(isLoading ? 'opacity-50' : '', 'button-pricing transition-all mt-3 cursor-pointer text-primary border-1 bg-white border-primary w-full')}
                                            type="button"
                                        >
                                            {listPricings(value.code)?.type}
                                            {isLoading && <i className="pi pi-spin pi-spinner text-2xl ml-2 vertical-align-middle"></i>}
                                        </button>
                                        {showPhone && listPricings(value.code)?.type == 'Liên hệ' && (
                                            <div className="box-copy-phone shadow-1 grid align-items-center absolute bottom-100 right-0 bg-white">
                                                <div className="col-3 pt-0 pb-0">
                                                    <div className="text-left ">Sđt/zalo:</div>
                                                </div>
                                                <div className="col-9 pt-0 pb-0">
                                                    <div className="box-copy flex align-items-center">
                                                        <div className="pl-0 url-copy">
                                                            <InputText value="0383050533" disabled className={'w-full'}></InputText>
                                                        </div>
                                                        <div className="btn-copy-inner" onClick={() => onCopyHandler('0383050533')}>
                                                            <i className="pi pi-copy" style={{ fontSize: '1rem' }}></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <FeatureDetails />
            </div>
        </>
    );
};

export default Pricing;
