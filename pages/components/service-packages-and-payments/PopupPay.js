import getConfig from 'next/config';
import { Dialog } from 'primereact/dialog';
import { formatNumberThousands } from 'src/commons/Utils';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import { SubscriptionService } from 'demo/service/SubscriptionService';

const PopupPay = ({ dataPopup, visible, setVisible, setIsLoading }) => {
    const subscription = new SubscriptionService();
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const toastCopy = useRef(null);
    const toastApply = useRef(null);
    const [dataPay, setDataPay] = useState();
    const [dataVoucher, setDataVoucher] = useState();

    const toastNotification = (severity, summary, detail) => {
        toastCopy.current.show({ severity: severity, summary: summary, detail: detail, life: 3000 });
    };

    const onCopyHandler = async (text) => {
        await navigator.clipboard.writeText(text);
        toastNotification('success', 'Thành công', 'Copy to clipboard');
    };

    const handleApplyCode = async () => {
        if (!!toastApply.current?.value) {
            await subscription
                .registerApplyVoucherSubscriptionsPackage({ orderCode: dataPay?.orderCode, referPhoneNumber: toastApply.current?.value })
                .then((data) => {
                    if (data?.data?.code === 'success') {
                        setDataVoucher(data?.data?.data);
                        toastNotification('success', 'Thành công', data?.data?.message);
                    } else {
                        toastNotification('error', 'Thất bại', data?.data?.message);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            toastNotification('error', 'Thất bại', 'Mã giới thiệu rỗng');
            return;
        }
    };
    const handleClosePopup = () => {
        setVisible(false);
        setIsLoading(false);
    };
    useEffect(() => {
        !!dataPopup && setDataPay(dataPopup);
    }, [dataPopup]);

    useEffect(() => {
        !!dataVoucher && setDataPay(dataVoucher);
    }, [dataVoucher]);

    return (
        <>
            <Toast ref={toastCopy} position="top-right" />
            <Dialog header="THÔNG TIN THANH TOÁN" visible={visible} style={{ width: '100%', maxWidth: '1120px' }} onHide={() => handleClosePopup()}>
                <div>
                    <div className="text-center">
                        <img src={`${contextPath}/demo/images/QA/QA-code.jpg`} alt="QA code" style={{ borderRadius: '11px', width: '100%', maxWidth: '225px' }} />
                    </div>
                    <ul className="list-none mt-3 pl-0 m-0">
                        <li className="flex justify-content-between align-items-center mb-3">
                            <span>
                                <b>Ngân hàng TMCP Ngoại thương Việt Nam</b>
                            </span>
                            <div className="info">
                                <img src={`${contextPath}/demo/images/bank/icon-vietcombank.jpg`} alt="icon vietcombank" style={{ maxWidth: '60px' }} />
                            </div>
                        </li>
                        <li className="flex justify-content-between align-content-center mb-3 flex-wrap">
                            <span>Số tài khoản:</span>
                            <div className="info md:w-auto w-full flex justify-content-between align-items-center" onClick={() => onCopyHandler('1012076666')}>
                                1012076666
                                <span className="p-2 inline-block surface-200 ml-2 cursor-pointer">
                                    <i className="pi pi-copy text-lg"></i>
                                </span>
                            </div>
                        </li>
                        <li className="flex justify-content-between align-content-center mb-3 flex-wrap">
                            <span>Chủ tài khoản:</span>
                            <div className="info md:w-auto w-full flex justify-content-between align-items-center" onClick={() => onCopyHandler('Công ty TNHH Influ X')}>
                                Công ty TNHH Influ X
                                <span className="p-2 inline-block surface-200 ml-2 cursor-pointer">
                                    <i className="pi pi-copy text-lg"></i>
                                </span>
                            </div>
                        </li>
                        <li className="flex justify-content-between align-content-center mb-3 flex-wrap">
                            <span>Số tiền thanh toán:</span>
                            <div className="info md:w-auto w-full flex justify-content-between align-items-center" onClick={() => onCopyHandler(dataPay?.finalAmount ?? 0)}>
                                <span className="text-primary font-bold text-lg">
                                    {!!dataPopup?.amount ? formatNumberThousands(dataPay?.finalAmount) : 0}
                                    <sup>đ</sup>
                                </span>
                                <span className="p-2 inline-block surface-200 ml-2 cursor-pointer">
                                    <i className="pi pi-copy text-lg"></i>
                                </span>
                            </div>
                        </li>
                        <li className="flex justify-content-between align-content-center mb-3 flex-wrap">
                            <span>
                                Nội dung chuyển khoản (<span className="text-primary">*</span>):
                            </span>
                            <div className="info md:w-auto w-full flex justify-content-between align-items-center" onClick={() => onCopyHandler(dataPay?.orderCode)}>
                                <span className="text-primary">{dataPay?.orderCode}</span>
                                <span className="p-2 inline-block surface-200 ml-2 cursor-pointer">
                                    <i className="pi pi-copy text-lg"></i>
                                </span>
                            </div>
                        </li>
                    </ul>
                    <div className="flex align-items-center flex-wrap">
                        <b className="text-lg mr-2">Mã giới thiệu của sale (Nhập để giảm 10%): </b>
                        <div className="flex mt-3 md:mt-0">
                            <InputText ref={toastApply} />
                            <Button onClick={() => handleApplyCode()} label="Áp dụng" className="ml-2" />
                        </div>
                    </div>
                    <div className="mt-3 md:px-5 line-height-3">
                        <b className="text-primary block mb-2 md:mb-0">Quan trọng:</b>
                        Bạn cần nhập chính xác nội dung chuyển khoản:<b>"{dataPay?.orderCode}"</b> để được nâng cấp gói tự động trong vòng 5p. Bạn sẽ nhận được email xác nhận thanh toán Ngoài ra, bạn có thể kiểm tra{' '}
                        <a title="Gói của bạn" className="hover:uppercase" href="/components/service-packages-and-payments">
                            <b>"Gói của bạn" </b>
                        </a>
                        hoặc liên hệ
                        <b className="pl-1">0383050533</b> để được hỗ trợ
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default PopupPay;
