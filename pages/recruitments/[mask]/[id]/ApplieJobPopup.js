import React, { useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { RECRUITMENT_TYPE } from '../../../../src/commons/Utils';
import { KolRecruitmentService } from '../../../../demo/service/KolRecruitmentService';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { InputTextarea } from 'primereact/inputtextarea';
import { useFormik } from 'formik';
import { InputNumber } from 'primereact/inputnumber';

const ApplieJobPopup = (props) => {
    const { openApplieJobPopup, setOpenApplieJobPopup, recruitmentDetail, appliedSuccess } = props;
    const service = new KolRecruitmentService();
    const toast = useRef(null);
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error font-italic">{formik.errors[name]}</small>;
    };

    const formik = useFormik({
        initialValues: {
            message: '',
            castingPrice: 0
        },
        validate: (data) => {
            let errors = {};
            if (!data.message) {
                errors.message = 'Đây là một trường bắt buộc';
            }
            if (data.castingPrice===null) {
                errors.castingPrice = 'Đây là một trường bắt buộc';
            }
            return errors;
        },
        onSubmit: async (data) => {
            setOpenApplieJobPopup(false);
            applyJob(data);
        }
    });

    const applyJob = async (data) => {
        const param = {
            id: recruitmentDetail?.accountId,
            recruitmentId: recruitmentDetail?.recruitmentId,
            recruitmentType: RECRUITMENT_TYPE.INVITED.code,
            message: data.message,
            castingPrice: data.castingPrice
        };
        const res = await service.applyJob(param);
        if (res.data.code == 'success') {
            toast.current.show({
                severity: 'success',
                summary: 'Thông báo',
                detail: 'Ứng tuyển thành công',
                life: 2000
            });
            formik.resetForm();
            appliedSuccess();
        } else {
            toast.current.show({
                severity: 'error',
                summary: 'Thông báo',
                detail: res.data.message,
                life: 2000
            });
        }
    };

    const renderHeader = () => {
        return (
            <>
                <p className={'mb-0'}>Ứng tuyển</p>
                <i className={'text-xs'}>Nhà tuyển dụng sẽ xem trực tiếp trang thông tin cá nhân của bạn</i>
            </>
        );
    };

    return (
        <div>
            <Toast ref={toast} />
            <Dialog className="modal-custom-recruitment-detail" header={renderHeader} visible={openApplieJobPopup} style={{ width: '100%', maxWidth: '450px' }} onHide={() => setOpenApplieJobPopup(false)}>
                <form onSubmit={formik.handleSubmit} className="white-theme-kol">
                    <div className="field">
                        <label htmlFor="castingPrice" className={classNames({ 'p-error': isFormFieldValid('castingPrice') })}>
                            Giá cast đề xuất <span className="primary-color">*</span>
                        </label>
                        <div className="p-inputgroup">
                            <InputNumber
                                min={0}
                                inputId="castingPrice"
                                name="castingPrice"
                                placeholder="Nhập giá cast"
                                onChange={(e) => formik.setFieldValue('castingPrice', e.value)}
                                value={formik.values.castingPrice ?? 0}
                                className={classNames({ 'p-invalid': isFormFieldValid('castingPrice') })}
                            />
                            <span className="p-inputgroup-addon">
                                VNĐ
                            </span>
                        </div>
                        {getFormErrorMessage('castingPrice')}
                    </div>
                    <div className="field mb-0">
                        <label htmlFor="message" className={classNames({ 'p-error': isFormFieldValid('message') })}>
                            Gửi lời nhắn đến nhà tuyển dụng <span className="primary-color">*</span>
                        </label>
                        <div className="p-inputgroup">
                            <InputTextarea
                                id="message"
                                name="message"
                                rows={4}
                                placeholder="Nhập nội dung"
                                value={formik.values.message}
                                onChange={formik.handleChange}
                                autoFocus
                                className={classNames({ 'p-invalid': isFormFieldValid('message') })}
                                maxLength={5000}
                            />
                        </div>
                        <span className="font-normal text-sm">
                            <p className="text-right">{formik.values.message?.length}/5000</p>
                        </span>
                        {getFormErrorMessage('message')}
                    </div>
                    <div className={'flex flex-wrap align-items-center justify-content-end sm:mt-4'}>
                        <Button icon="pi pi-send" label="Ứng tuyển ngay" className="w-full sm:w-auto p-button send-email-button center-item sm:mr-2" type="submit" />
                        <Button
                            className="w-full sm:w-auto mt-2 sm:mt-0 p-button-secondary mr-0"
                            label="Hủy bỏ"
                            type="button"
                            icon="pi pi-times"
                            onClick={() => {
                                setOpenApplieJobPopup(false);
                                formik.resetForm();
                            }}
                        />
                    </div>
                </form>
            </Dialog>
        </div>
    );
};
export default ApplieJobPopup;
