import React, { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

const ContactInformation = (props) => {
    const toast = useRef(null);
    const { formik } = props;

    const isFormFieldInvalid = (name) => {
        return !!(formik?.touched[name] && formik?.errors[name]);
    };

    const getFormErrorMessage = (name) => {
        if (isFormFieldInvalid(name)) {
            return <small className="p-error">{formik?.errors[name]}</small>;
        }
        return <small className="p-error">&nbsp;</small>;
    };

    const getServiceErrorMessage = (name) => {
        if (formik?.errors[name]) {
            return <small className="p-error">{formik?.errors[name]}</small>;
        }
        return <small className="p-error">&nbsp;</small>;
    };

    return (
        <div>
            <div className={'mb-2'}>
                <div className={'my-2'}>
                    <b>Thông tin liên hệ </b>
                </div>
                <hr />
                <div className={'grid'}>
                    <div className={'col-12 lg:col-4'}>
                        <div className="flex flex-column gap-2">
                            <Toast ref={toast} />
                            <label htmlFor="contactName" className={'mb-1'}>
                                Họ và tên <sup className='primary-color'>*</sup>
                            </label>
                            <InputText
                                placeholder="Vui lòng nhập họ và tên"
                                id="name"
                                name="name"
                                value={formik?.values.companyRequest.contactName ?? ''}
                                onChange={(e) => {
                                    formik.setFieldValue('companyRequest.contactName', e.target.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldInvalid('contactName') }, 'w-full')}
                                maxLength={80}
                            />
                        </div>
                        {getServiceErrorMessage('contactName')}
                    </div>
                    <div className={'col-12 lg:col-4'}>
                        <div className="flex flex-column gap-2">
                            <Toast ref={toast} />
                            <label htmlFor="input_value" className={'mb-1'}>
                                Số điện thoại <sup className='primary-color'>*</sup>
                            </label>
                            <InputText
                                placeholder="Vui lòng nhập số điện thoại"
                                id="phone"
                                name="phone"
                                keyfilter={"num"}
                                maxLength = {12}
                                value={formik?.values.contactPhone ?? ''}
                                onChange={(e) => {
                                    formik.setFieldValue('contactPhone', e.target.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldInvalid('contactPhone') }, 'w-full')}
                            />
                        </div>
                        {getFormErrorMessage('contactPhone')}
                    </div>
                    <div className={'col-12 lg:col-4'}>
                        <div className="flex flex-column gap-2">
                            <Toast ref={toast} />
                            <label htmlFor="input_value" className={'mb-1'}>
                                Mail liên hệ <sup className='primary-color'>*</sup>
                            </label>
                            <InputText
                                placeholder="Vui lòng nhập mail liên hệ"
                                id="mail"
                                name="mail"
                                value={formik?.values.contactEmail ?? ''}
                                onChange={(e) => {
                                    formik.setFieldValue('contactEmail', e.target.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldInvalid('contactEmail') }, 'w-full')}
                            />
                        </div>
                        {getFormErrorMessage('contactEmail')}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ContactInformation;
