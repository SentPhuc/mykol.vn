import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import { KolAdditionalInfoService } from '../../../demo/service/KolAdditionalInfoService';
import { useRouter } from 'next/router';
import { BANKSNAPAS, CITY_ENUM, validatePhone } from '../../../src/commons/Utils';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { useDispatch, useSelector } from 'react-redux';
import { FileUpload } from 'primereact/fileupload';
import AppLayout from '../../../layout/AppLayout';
import { addKolAdditionalProfileProfile } from '../../../public/reduxConfig/kolInformationSlice';

const KolInformation = (props) => {
    const toast = useRef(null);
    const chooseFileRef = useRef(null);
    const fileUploadRef = useRef(null);
    const [imageFront, setImageFront] = useState('');
    const [imageBack, setImageBack] = useState('');
    const service = new KolAdditionalInfoService;
    const kolAdditionalProfile = useSelector((state) => state.kolAdditionalProfile);
    const accountId = typeof window !== 'undefined' ? localStorage.getItem('accountId') : null;

    const dispatch = useDispatch();

    useEffect(() => {
        if (kolAdditionalProfile.length === 0) return;
        initFormik();
    }, [kolAdditionalProfile]);

    useEffect(async () => {
        if (kolAdditionalProfile[0]?.citizenIdCardFront != null && kolAdditionalProfile[0]?.citizenIdCardBackside) {
            try {
                const response = await service.kolAdditionalInfoImage(accountId, kolAdditionalProfile[0]?.citizenIdCardFront.split('/')[4]);
                console.log(response.data);
                setImageFront(URL.createObjectURL(response.data));
                const responseBack = await service.kolAdditionalInfoImage(accountId, kolAdditionalProfile[0]?.citizenIdCardBackside.split('/')[4]);
                console.log(responseBack.data);

                setImageBack(URL.createObjectURL(responseBack.data));
            } catch (error) {
                console.log(error);
            }
        }
    }, [kolAdditionalProfile]);

    const location = useRouter().pathname;
    const formik = useFormik({
        initialValues: {
            citizenIdCardFront: kolAdditionalProfile[0]?.citizenIdCardFront,
            citizenIdCardBackside: kolAdditionalProfile[0]?.citizenIdCardBackside,
            bankAccountRequest: !!kolAdditionalProfile[0]?.bankAccountResponse ?
                kolAdditionalProfile[0]?.bankAccountResponse?.map((bankAccountResponse) => ({
                    bankCode: bankAccountResponse.bankCode,
                    accountNumber: bankAccountResponse.accountNumber,
                    accountName: bankAccountResponse.accountName
                })) : [],

            consigneeName: kolAdditionalProfile[0]?.consigneeName,
            deliveryPhone: kolAdditionalProfile[0]?.deliveryPhone,
            cityCode: kolAdditionalProfile[0]?.cityCode,
            district: kolAdditionalProfile[0]?.district,
            ward: kolAdditionalProfile[0]?.ward,
            specificAddress: kolAdditionalProfile[0]?.specificAddress
        },
        onSubmit: async (data) => {
            const res = await service.create(data);
            if (res.data.type === 'SUCCESS') {
                toast.current.show({
                    severity: 'success',
                    summary: 'Thông báo',
                    detail: 'Cập nhật thành công',
                    life: 2000
                });
                const CITIZEN_ID_CARD_BACKSIDE = res.data.data.CITIZEN_ID_CARD_BACKSIDE?.ATTACHMENT_PATH;
                const CITIZEN_ID_CARD_FRONT = res.data.data.CITIZEN_ID_CARD_FRONT?.ATTACHMENT_PATH;
                if (CITIZEN_ID_CARD_FRONT != null) {
                    setImageFront(URL.createObjectURL(CITIZEN_ID_CARD_FRONT));
                }
                if (CITIZEN_ID_CARD_BACKSIDE != null) {
                    setImageBack(URL.createObjectURL(CITIZEN_ID_CARD_BACKSIDE));
                }
                const accountId = typeof window !== 'undefined' ? localStorage.getItem('accountId') : null;
                const resKolAdditionalInfo = await service.kolAdditionalInfo(accountId);
                if (resKolAdditionalInfo.data.code === 'success') {
                    const contentKolAdditionalInfo = resKolAdditionalInfo.data.data;
                    const action = addKolAdditionalProfileProfile(contentKolAdditionalInfo);
                    dispatch(action);
                }
            } else {
                console.log('Thất bại');
            }
        },
        validateOnMount: true,
        validate: (data) => {
            let errors = {};
            return errors;
        }
    });

    const initFormik = () => {
        formik.setValues({
            citizenIdCardFront: kolAdditionalProfile[0]?.citizenIdCardFront,
            citizenIdCardBackside: kolAdditionalProfile[0]?.citizenIdCardBackside,
            bankAccountRequest: !!kolAdditionalProfile[0]?.bankAccountResponse ?
                kolAdditionalProfile[0]?.bankAccountResponse?.map((bankAccountResponse) => ({
                    bankCode: bankAccountResponse.bankCode,
                    accountNumber: bankAccountResponse.accountNumber,
                    accountName: bankAccountResponse.accountName
                })) : [],
            consigneeName: kolAdditionalProfile[0]?.consigneeName,
            deliveryPhone: kolAdditionalProfile[0]?.deliveryPhone,
            cityCode: kolAdditionalProfile[0]?.cityCode,
            district: kolAdditionalProfile[0]?.district,
            ward: kolAdditionalProfile[0]?.ward,
            specificAddress: kolAdditionalProfile[0]?.specificAddress
        });
    };

    const pathFieldValue = async (fieldName, value, event) => {
        await formik.setFieldValue(fieldName, value ?? undefined);
        event && await handleChange(event);
    };

    const onRemoveService = async (rowData, event) => {
        const lstServiceDetail = formik.values.bankAccountRequest;
        const { rowIndex } = event;
        rowIndex !== -1 && lstServiceDetail.splice(rowIndex, 1);
        await pathFieldValue('bankAccountRequest', lstServiceDetail);
    };

    const onSelect = (fieldName, file) => {
        const filesArray = Array.from(file.files);
        filesArray.map((file, index) => formik.setFieldValue(fieldName, file));
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, cancelButton } = options;

        return (
            <div className={className}
                 style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {cancelButton}
            </div>
        );
    };
    const itemTemplate = (file, props) => {
        return (
            <div className='align-content-center'>
                <img alt={file.name} className={'max-w-8rem md:h-30rem md:max-w-30rem al'} src={file.objectURL} />
            </div>
        );
    };

    const emptyTemplate = (image) => {
        return (
            <div className='flex align-items-center flex-column dotted-spaced'>
                {!!image ? (
                    <div>
                        <img className={'h-6rem md:h-30rem md:max-w-30rem al'} src={image} alt={image} />
                    </div>
                ) : (
                    <>
                        <i className='pi pi-image mt-3 p-5' style={{
                            fontSize: '5em',
                            borderRadius: '50%',
                            backgroundColor: 'var(--surface-b)',
                            color: 'var(--surface-d)'
                        }}></i>
                        <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className='my-5'>
                    Drag and Drop Image Here
                    </span>
                    </>
                )}
            </div>
        );
    };

    const chooseOptions = {
        icon: 'pi pi-fw pi-images',
        className: 'custom-choose-btn p-button-rounded p-button-outlined',
        label: 'Chọn ảnh'
    };
    const cancelOptions = {
        icon: 'pi pi-fw pi-times',
        className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined',
        label: 'Xóa tất cả'
    };

    return AppLayout(
        <>
            <React.Fragment>
                <Toast ref={toast} />
                <div className='card layout-main'>
                    <BreadcrumbCustom path={location} /><br />
                    <div className='flex justify-content-center create-new-recruitment'>
                        <form id={'profile-form'} onSubmit={formik.handleSubmit}
                              className='w-full flex flex-column gap-2'>
                            <div className={'my-2'}>
                                <b>Căn cước công dân</b>
                                <div className={'grid'}>
                                    <div className={'col-6 text-center'}>
                                        <FileUpload
                                            ref={fileUploadRef}
                                            name='banner[]'
                                            accept='image/*'
                                            onSelect={(e) => onSelect('citizenIdCardFront', e)}
                                            chooseOptions={chooseOptions}
                                            cancelOptions={cancelOptions}
                                            headerTemplate={headerTemplate}
                                            itemTemplate={itemTemplate}
                                            emptyTemplate={emptyTemplate(imageFront)}
                                        />
                                        <span className={'font-bold'}> Mặt trước </span>
                                    </div>

                                    <div className={'col-6 text-center'}>
                                        <FileUpload
                                            ref={fileUploadRef}
                                            name='banner[]'
                                            accept='image/*'
                                            onSelect={(e) => onSelect('citizenIdCardBackside', e)}
                                            chooseOptions={chooseOptions}
                                            cancelOptions={cancelOptions}
                                            headerTemplate={headerTemplate}
                                            itemTemplate={itemTemplate}
                                            emptyTemplate={emptyTemplate(imageBack)}
                                        />
                                        <span className={'font-bold'}> Mặt Sau </span>
                                    </div>
                                </div>
                            </div>

                            <hr/>

                            <div className={'center-item'}>
                                <Button className='w-180' type='submit' label='Cập nhật' />
                            </div>
                        </form>
                    </div>
                </div>
            </React.Fragment>
        </>
    );
};

export default KolInformation;