import {Dialog} from 'primereact/dialog';
import React, {useEffect, useRef, useState} from 'react';
import {KolAdditionalInfoService} from '../../../demo/service/KolAdditionalInfoService';
import {BANKSNAPAS} from "../../../src/commons/Utils";
import getConfig from "next/config";
import {InputText} from "primereact/inputtext";
import {Toast} from "primereact/toast";

const DialogCandidateInfo = (props) => {
    const {visible, setVisible, jobId, kolId} = props;
    const [infoKol, setInfoKol] = useState([]);
    const service = new KolAdditionalInfoService();
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [showEmailDetails, setShowEmailDetails] = useState(false);
    const toast = useRef(null);

    useEffect(async () => {
        const res = await service.getMoreInfo({
            jobId: jobId,
            kolId: kolId
        });
        if (res.data.code === 'success') {
            const data = res.data.data;
            setInfoKol(data);
        } else {
            setInfoKol({});
        }
    }, []);

    const findBankNameByCode = (code) => {
        const bank = BANKSNAPAS.find(b => b.code === code);
        return bank ? bank.vn_name : null;
    };

    const onCopyHandler = async () => {
        await navigator.clipboard.writeText(infoKol?.emailContact);
        toast.current.show({severity: 'success', summary: 'Thành công', detail: 'Copy to clipboard', life: 3000});
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className='flex justify-content-center'>
                <Dialog header='Thông tin chi tiết' visible={visible} style={{width: '40vw'}}
                        onHide={() => setVisible(false)} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                    <hr/>
                    <p className={'font-bold'}>Click để liên hệ</p>
                    <div className="grid">
                        {infoKol?.zaloContact ? (<div className='col-4 text-center cursor-pointer' onClick={() =>
                            window.open('https://zalo.me/' + infoKol?.zaloContact, '_blank', 'noopener,noreferrer')
                        }>
                            <img src={`${contextPath}/demo/images/kolInfo/zalo.svg`} alt="Kols" className="md:w-auto"/>
                            <div className=''>Zalo</div>
                        </div>) : ''}
                        {infoKol?.emailContact ? (<div className='col-4 text-center cursor-pointer'
                             onClick={() => setShowEmailDetails(!showEmailDetails)}>
                            <img src={`${contextPath}/demo/images/kolInfo/gmail.svg`} alt="Kols" className="md:w-auto"/>
                            <div className=''>Email</div>
                        </div>) : ''}
                        {infoKol?.messengerContact ? (<div className='col-4 text-center cursor-pointer' onClick={() =>
                            window.open(infoKol?.messengerContact, '_blank', 'noopener,noreferrer')
                        }>
                            <img src={`${contextPath}/demo/images/kolInfo/message.svg`} alt="Kols"
                                 className="md:w-auto"/>
                            <div className=''>Message</div>
                        </div>) : ''}
                        {showEmailDetails && (
                            <div className='grid w-full align-items-center'>
                                <div className='col-3'>
                                    <div className='text-left '>Email:</div>
                                </div>
                                <div className='col-9 -w-full'>
                                    <div className="box-copy shadow-2 flex align-items-center">
                                        <div className="pl-0 url-copy">
                                            <InputText value={infoKol?.emailContact} disabled className={'w-full'}>
                                            </InputText>
                                        </div>
                                            <div className="btn-copy-inner" onClick={onCopyHandler}>
                                            <i className="pi pi-copy" style={{ fontSize: '1rem' }}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <hr/>
                    <p className={'font-bold'}>Thông tin thanh toán</p>
                    <hr/>
                    {infoKol.bankAccountResponse?.map((e, index) => (
                        <div>
                            <div className='grid' key={e.accountNumber}>
                                <div className='col-6'>
                                    <div className='text-left '>Ngân hàng:</div>
                                </div>
                                <div className='col-6'>
                                    <div className='text-right '>{findBankNameByCode(e?.bankCode)}</div>
                                </div>
                                <div className='col-6'>
                                    <div className='text-left '>Số tài khoản:</div>
                                </div>
                                <div className='col-6'>
                                    <div className='text-right '>{e?.accountNumber}</div>
                                </div>
                                <div className='col-6'>
                                    <div className='text-left '>Tên tài khoản:</div>
                                </div>
                                <div className='col-6'>
                                    <div className='text-right '>{e?.accountName}</div>
                                </div>
                            </div>
                            <hr/>
                        </div>
                    ))}
                    <p className={'font-bold'}>Địa chỉ nhận hàng review</p>
                    <hr/>
                    <div className='grid'>
                        <div className='col-6'>
                            <div className='text-left '>Người nhận:</div>
                        </div>
                        <div className='col-6'>
                            <div className='text-right '>{infoKol?.consigneeName}</div>
                        </div>
                        <div className='col-6'>
                            <div className='text-left '>Số điện thoại:</div>
                        </div>
                        <div className='col-6'>
                            <div className='text-right '>{infoKol?.deliveryPhone}</div>
                        </div>
                        <div className='col-6'>
                            <div className='text-left '>Địa chỉ:</div>
                        </div>
                        <div className='col-6'>
                            <div className='text-right '>{infoKol?.specificAddress} {infoKol?.ward}</div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    );

};
export default DialogCandidateInfo;