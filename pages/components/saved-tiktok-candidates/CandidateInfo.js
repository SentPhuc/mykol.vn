import React, { useRef, useState, useEffect } from 'react';
import getConfig from 'next/config';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { SubscriptionService } from 'demo/service/SubscriptionService';

const CandidateInfo = (props) => {
    const subscription = new SubscriptionService();
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [infoPackage, setInfoPackage] = useState();
    const { contactEmail, contactPhone } = props;
    const op = useRef(null);
    const refZalo = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const toast = useRef(null);

    const onCopyHandler = async (dataCopy) => {
        await navigator.clipboard.writeText(dataCopy);
        toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Copy to clipboard', life: 3000 });
    };

    const reject = () => (window.location.href = '/components/service-packages-and-payments/');

    const handleShowSocial = (current, event) => {
        if (!!infoPackage && infoPackage?.name == 'Trải nghiệm') {
            setVisibleDialog(true);
            return;
        }
        current.toggle(event);
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
    }, []);

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog
                style={{ maxWidth: '320px' }}
                visible={visibleDialog}
                onHide={() => setVisibleDialog(false)}
                header="Bạn cần đăng ký gói trả phí để xem thông tin liên hệ"
                rejectClassName="m-auto"
                acceptClassName="hidden"
                rejectLabel="Xem bảng giá"
                reject={reject}
            />
            <div className="grid w-full">
                {!!contactPhone && (
                    <div className="col-12 lg:col-4 text-center cursor-pointer" onClick={(e) => handleShowSocial(refZalo.current, e)}>
                        <img src={`${contextPath}/demo/images/kolInfo/zalo.svg`} alt="Kols" className="max-w-full md:w-auto vertical-align-middle" />
                    </div>
                )}
                {!!contactEmail && (
                    <div className="col-12 lg:col-4 text-center cursor-pointer" onClick={(e) => handleShowSocial(op.current, e)}>
                        <img src={`${contextPath}/demo/images/kolInfo/gmail.svg`} alt="Kols" className="max-w-full md:w-auto vertical-align-middle" />
                    </div>
                )}

                {!contactEmail && !contactPhone && <span>Không có liên hệ</span>}
                <OverlayPanel ref={op}>
                    <div className="grid w-full align-items-center">
                        <div className="col-3">
                            <div className="text-left ">Email:</div>
                        </div>
                        <div className="w-full">
                            <div className="box-copy shadow-2 flex align-items-center">
                                <div className="pl-0 url-copy">
                                    <InputText value={contactEmail} disabled className={'w-full'}></InputText>
                                </div>
                                <div className="btn-copy-inner" onClick={() => onCopyHandler(contactEmail)}>
                                    <i className="pi pi-copy" style={{ fontSize: '1rem' }}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </OverlayPanel>
                <OverlayPanel ref={refZalo}>
                    <div className="grid w-full align-items-center">
                        <div className="col-3">
                            <div className="text-left ">Zalo:</div>
                        </div>
                        <div className="w-full">
                            <div className="box-copy shadow-2 flex align-items-center">
                                <div className="pl-0 url-copy">
                                    <InputText value={contactPhone} disabled className={'w-full'}></InputText>
                                </div>
                                <div className="btn-copy-inner" onClick={() => onCopyHandler(contactPhone)}>
                                    <i className="pi pi-copy" style={{ fontSize: '1rem' }}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </OverlayPanel>
            </div>
        </>
    );
};
export default CandidateInfo;
