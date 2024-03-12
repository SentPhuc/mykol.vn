import React, { useEffect, useRef, useState } from 'react';
import getConfig from 'next/config';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { OverlayPanel } from 'primereact/overlaypanel';
import { GlobalService } from 'demo/service/GlobalService';

const CandidateInfo = (props) => {
    const { mask, kolId } = props;
    const op = useRef(null);
    const refZalo = useRef(null);
    const [infoKol, setInfoKol] = useState([]);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const toast = useRef(null);

    useEffect(async () => {
        if (!mask || !kolId) return;
        const res = await new GlobalService().getDetailKolsIgnorePublic(mask, kolId);
        if (res.data.code === 'success') {
            const data = res.data.data;
            setInfoKol(data);
        } else {
            setInfoKol({});
        }
    }, [mask, kolId]);

    const onCopyHandler = async (dataCopy) => {
        await navigator.clipboard.writeText(dataCopy);
        toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Copy to clipboard', life: 3000 });
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="grid w-full">
                {!!infoKol?.phoneNumber && (
                    <div className="col-12 lg:col-4 text-center cursor-pointer" onClick={(e) => refZalo.current.toggle(e)}>
                        <img src={`${contextPath}/demo/images/kolInfo/zalo.svg`} alt="Kols" className="max-w-full md:w-auto vertical-align-middle" />
                    </div>
                )}
                {!!infoKol?.email && (
                    <div className="col-12 lg:col-4 text-center cursor-pointer" onClick={(e) => op.current.toggle(e)}>
                        <img src={`${contextPath}/demo/images/kolInfo/gmail.svg`} alt="Kols" className="max-w-full md:w-auto vertical-align-middle" />
                    </div>
                )}
                {!!infoKol?.messenger && (
                    <div className="col-12 lg:col-4 text-center cursor-pointer" onClick={() => window.open(infoKol?.messenger, '_blank', 'noopener,noreferrer')}>
                        <img src={`${contextPath}/demo/images/kolInfo/message.svg`} alt="Kols" className="max-w-full md:w-auto vertical-align-middle" />
                    </div>
                )}

                {!infoKol?.messenger && !infoKol?.phoneNumber && !infoKol?.messenger && <span>No contacts</span>}
                <OverlayPanel ref={op}>
                    <div className="grid w-full align-items-center">
                        <div className="col-3">
                            <div className="text-left ">Email:</div>
                        </div>
                        <div className="w-full">
                            <div className="box-copy shadow-2 flex align-items-center">
                                <div className="pl-0 url-copy">
                                    <InputText value={infoKol?.email} disabled className={'w-full'}></InputText>
                                </div>
                                <div className="btn-copy-inner" onClick={() => onCopyHandler(infoKol?.email)}>
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
                                    <InputText value={infoKol?.phoneNumber} disabled className={'w-full'}></InputText>
                                </div>
                                <div className="btn-copy-inner" onClick={() => onCopyHandler(infoKol?.phoneNumber)}>
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
