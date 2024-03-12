import AppLayout from 'layout/AppLayout';
import FeatureDetails from '../pricing/featureDetails';
import { listPricings, formatNumberThousands } from 'src/commons/Utils';
import { classNames } from 'primereact/utils';
import { Tooltip } from 'primereact/tooltip';
import { useState, useRef } from 'react';
import moment from 'moment';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import PopupPay from './PopupPay';
import { GlobalService } from 'demo/service/GlobalService';
import { SubscriptionService } from 'demo/service/SubscriptionService';
import { useEffect } from 'react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';

const PriceListPayment = () => {
    const subscription = new SubscriptionService();
    const globalService = new GlobalService();
    const [infoPackage, setInfoPackage] = useState();
    const [dataPopup, setDataPopup] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [showPhone, setShowPhone] = useState(false);
    const [visible, setVisible] = useState(false);
    const toastCopy = useRef(null);
    const [packages, setPackages] = useState(false);
    const accountId = typeof window !== 'undefined' ? localStorage.getItem('accountId') : 0;

    const handleBuyNow = async (type, subPackageId = 0) => {
        setIsLoading(true);
        if (type === 'Liên hệ') {
            setShowPhone(!showPhone);
            setIsLoading(false);
            return;
        }

        if (accountId == 0 || subPackageId == 0) return;

        await subscription
            .registerSubscriptionsPackage({ id: accountId, subPackageId })
            .then((data) => {
                if (data?.data?.code == 'success') {
                    setVisible(true);
                    setTimeout(() => setIsLoading(false), 2000);
                    setDataPopup(data.data.data);
                    toastCopy.current.show({ severity: 'success', summary: 'Thành công', detail: data?.data?.message, life: 3000 });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const onCopyHandler = async (email) => {
        await navigator.clipboard.writeText(email);
        toastCopy.current.show({ severity: 'success', summary: 'Thành công', detail: 'Copy to clipboard', life: 3000 });
        setShowPhone(false);
    };

    useEffect(() => {
        subscription
            .getMySubscriptionsPackage()
            .then((data) => {
                if (data?.data?.code === 'success') {
                    setInfoPackage(data?.data?.data);
                }
            })
            .catch((error) => {
                console.error(error);
            });

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

    return AppLayout(
        <>
            <ConfirmDialog />
            <PopupPay dataPopup={dataPopup} visible={visible} setVisible={setVisible} setIsLoading={setIsLoading} />
            <Toast ref={toastCopy} position="top-right" />
            <div className="page-pricing h-full p-3 md:pt-4 md:pr-5 md:pl-5 md:pb-8 bg-white">
                <h3 className="text-4xl font-bold mb-5">Gói của bạn</h3>
                <div className="grid">
                    <div className="md:col-10 col-12 py-0">
                        <div className="grid">
                            <div className="md:col-8 col-12 py-0">
                                <ul className="list-none pl-0 line-height-4 m-0">
                                    <li>
                                        <b className="text-lg w-18rem md:inline-block block">Tên gói đang được kích hoạt:</b>
                                        {infoPackage?.name ? infoPackage?.name : 'Updating...'}
                                    </li>
                                    <li>
                                        <b className="text-lg w-18rem md:inline-block block">
                                            Số lượt tìm kiếm và lọc:
                                            <i
                                                className="pi pi-info-circle target-number-search-filter ml-2 mr-1 cursor-pointer vertical-align-middle"
                                                data-pr-tooltip="Tại trang tìm kiếm influencer, khi bạn click vào nút 'Tìm kiếm', thì danh sách gồm 10 Influencer sẽ được hiển thị. Đây chính là 'Số lượt tìm kiếm'"
                                                data-pr-position="bottom"
                                                data-pr-at="center top-38"
                                                data-pr-my="center"
                                            ></i>
                                            <Tooltip target=".target-number-search-filter" />
                                        </b>
                                        Còn lại {infoPackage?.availableSearchLimit ?? 0}/{infoPackage?.searchLimit ?? 0} lượt
                                    </li>
                                    <li>
                                        <b className="text-lg w-18rem md:inline-block block">
                                            Số lượt sang trang:
                                            <i
                                                className="pi pi-info-circle target-number-next-page ml-2 mr-1 cursor-pointer vertical-align-middle"
                                                data-pr-tooltip='Tại trang tìm kiếm influencer, khi bạn click sang trang tiếp theo, thì danh sách 10 influencer sẽ được hiển thị. Đây chính là "Số lượt click sang trang"'
                                                data-pr-position="bottom"
                                                data-pr-at="center top-38"
                                                data-pr-my="center"
                                            ></i>
                                            <Tooltip target=".target-number-next-page" />
                                        </b>
                                        Còn lại {infoPackage?.availableNextPageLimit ?? 0}/{infoPackage?.nextPageLimit ?? 0} lượt
                                    </li>
                                    <li>
                                        <b className="text-lg w-18rem md:inline-block block">
                                            Ngày kích hoạt gói:
                                            <i
                                                className="pi pi-info-circle target-active-date ml-2 mr-1 cursor-pointer vertical-align-middle"
                                                data-pr-tooltip="Đây là thời gian hệ thống ghi nhận bạn đã thanh toán thành công và gói được kích hoạt"
                                                data-pr-position="bottom"
                                                data-pr-at="center top-38"
                                                data-pr-my="center"
                                            ></i>
                                            <Tooltip target=".target-active-date" />
                                        </b>
                                        {!!infoPackage?.startTime ? moment(infoPackage?.startTime).format('DD/MM/yyyy') : moment().format('DD/MM/yyyy')}
                                    </li>
                                    <li>
                                        <b className="text-lg w-18rem md:inline-block block">
                                            Ngày hết hạn:
                                            <i
                                                className="pi pi-info-circle target-expiration ml-2 mr-1 cursor-pointer vertical-align-middle"
                                                data-pr-tooltip="Đây là thời gian hết hạn của gói sản phẩm hiện tại, số lượt tìm kiếm và lượt sang trang chưa được sử dụng sẽ bị mất và không được cộng dồn"
                                                data-pr-position="bottom"
                                                data-pr-at="center top-38"
                                                data-pr-my="center"
                                            ></i>
                                            <Tooltip target=".target-expiration" />
                                        </b>
                                        {!!infoPackage?.expiredTime ? moment(infoPackage?.expiredTime).format('DD/MM/yyyy') : moment().format('DD/MM/yyyy')}
                                    </li>
                                </ul>
                            </div>
                            <div className="text-lg md:col-4 col-12 line-height-4 py-0">
                                <b className="w-18rem block">Thông tin liên hệ</b>
                                Hotline/Zalo: 0383050533
                            </div>
                        </div>
                    </div>
                    <div className="md:col-2 col-3 mt-2 md:mt-0 py-0">
                        <Button onClick={() => (window.location.href = '/components/credit/')} type="button" label="Quản lý gói"/>
                    </div>
                </div>
                <h3 className="text-4xl font-bold mb-5">Bảng giá</h3>
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
                                            onClick={() => handleBuyNow(listPricings(value.code)?.type, value.id)}
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

export default PriceListPayment;
