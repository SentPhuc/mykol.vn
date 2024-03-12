import React, { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';

const CompanyInformation = (props) => {
    const regex = /^(\+?84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5|8|9|]|9[0-4|6-9])[0-9]{7}$/;
    const toast = useRef(null);
    const { formik } = props;

    const personnelSizes = [
        {
            personalSizeCode: 1,
            value: '0 - 10 nhân viên'
        },
        {
            personalSizeCode: 2,
            value: '10 - 30 nhân viên'
        },
        {
            personalSizeCode: 3,
            value: '30 - 50 nhân viên'
        },
        {
            personalSizeCode: 4,
            value: '50 - 100 nhân viên'
        },
        {
            personalSizeCode: 5,
            value: '100 - 500 nhân viên'
        },
        {
            personalSizeCode: 6,
            value: '500 - 1000 nhân viên'
        },
        {
            personalSizeCode: 7,
            value: '1000 - 2000 nhân viên'
        },
        {
            personalSizeCode: 8,
            value: '2000 - 5000 nhân viên'
        },
        {
            personalSizeCode: 9,
            value: 'Trên 5000 nhân viên'
        }
    ];

    const isFormFieldInvalid = (name) => {
        return !!(formik?.touched[name] && formik?.errors[name]);
    };

    const  getFormErrorMessage = (name) => {
        return <small className="p-error">{formik?.errors[name]}</small>;
    };

    return (
        <div>
            <div className={'mb-2'}>
                <div className={'my-2'}>
                    <b>Thông tin công ty</b>
                </div>
                <hr />
                <div className={'grid'}>
                    <div className={'col-12 lg:col-4'}>
                        <div className="flex flex-column gap-2">
                            <Toast ref={toast} />
                            <label htmlFor="input_value" className={'mb-1'}>
                                Tên công ty <sup className="primary-color">*</sup>
                            </label>
                            <InputText
                                placeholder="Vui lòng nhập tên công ty"
                                id="companyName"
                                name="companyName"
                                maxLength = {80}
                                value={formik?.values.fullName ?? ''}
                                onChange={(e) => {
                                    formik.setFieldValue('fullName', e.target.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldInvalid('fullName') }, 'w-full')}
                            />
                        </div>
                        {getFormErrorMessage('fullName')}
                    </div>
                    <div className={'col-12 lg:col-6'}>
                        <div className="flex flex-column gap-2">
                            <Toast ref={toast} />
                            <label htmlFor="input_value" className={'mb-1'}>
                                Địa chỉ cụ thể <sup className="primary-color">*</sup>
                            </label>
                            <InputText
                                placeholder="Vui lòng nhập địa chỉ công ty"
                                id="specificAddress"
                                name="specificAddress"
                                value={formik?.values.companyRequest.specificAddress ?? ''}
                                onChange={(e) => {
                                    formik.setFieldValue('companyRequest.specificAddress', e.target.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldInvalid('specificAddress') }, 'w-full')}
                            />
                        </div>
                        {getFormErrorMessage('specificAddress')}
                    </div>
                    <div className={'col-12 lg:col-6'}>
                        <div className="flex flex-column gap-2">
                            <Toast ref={toast} />
                            <label htmlFor="input_value" className={'mb-1'}>
                                Website
                            </label>
                            <InputText
                                placeholder="Vui lòng nhập website"
                                id="website"
                                name="website"
                                value={formik?.values.companyRequest.website ?? ''}
                                onChange={(e) => {
                                    formik.setFieldValue('companyRequest.website', e.target.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldInvalid('website') }, 'w-full')}
                            />
                        </div>
                        {getFormErrorMessage('website')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyInformation;
