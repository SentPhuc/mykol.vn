import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import AppLayout from '../../../layout/AppLayout';
import { AccountRoleService } from 'demo/service/AccountRoleService';
import { DEV_URL, isValidTaxCode, validateEmail, validatePhone, validateWebsite } from '../../../src/commons/Utils';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const AssignRole = () => {
    const location = useRouter().pathname;
    const toast = useRef(null);

    const roles = [
        {
            roleName: 'SALE_STAFF',
            desc: 'Sales Staff'
        },
        {
            roleName: 'SALE_LEAD',
            desc: 'Sales Leader'
        }
    ];

    const formik = useFormik({
        initialValues: {
            accountPhone: '',
            role: '',
            refAccountPhone: ''
        },
        validate: (data) => {
            let errors = {};
            if (!data.accountPhone) {
                errors.accountPhone = 'Vui lòng nhập số điện thoại';
            } else if (!validatePhone(data.accountPhone)) {
                errors.accountPhone = 'Số điện thoại không hợp lệ';
            }

            if (!data.role) {
                errors.role = 'Vui lòng chọn chức vụ';
            }

            // if (data.role?.roleName === 'SALE_STAFF') {
            //     if (!data.refAccountPhone) {
            //         errors.refAccountPhone = 'Vui lòng nhập số điện thoại Sales Leader';
            //     } else if (!validatePhone(data.refAccountPhone)) {
            //         errors.refAccountPhone = 'Số điện thoại không hợp lệ';
            //     }
            // }

            return errors;
        },
        onSubmit: async () => {
            const accountRoleService = new AccountRoleService();
            const _data = {
                accountPhone: formik.values.accountPhone,
                roleName: formik.values.role?.roleName,
                refAccountPhone: formik.values.refAccountPhone
            };
            accountRoleService
                .assignRoleForUser(_data)
                .then((res) => {
                    if (res.data.code !== 'success') {
                        toast.current.show({ severity: 'error', summary: 'Thất bại', detail: res.data.message, life: 3000 });
                    } else {
                        toast.current.show({
                            severity: 'success',
                            summary: 'Thành công',
                            detail: 'Cập nhật role thành công',
                            life: 3000
                        });
                    }
                })
                .catch((err) => {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Thất bại',
                        detail: 'Cập nhật role thất bại',
                        life: 3000
                    });
                });
        }
    });

    const isFormFieldInvalid = (name) => {
        return !!(formik?.touched[name] && formik?.errors[name]);
    };

    const getFormErrorMessage = (name) => {
        return <small className="p-error">{formik?.errors[name]}</small>;
    };

    return AppLayout(
        <>
            <React.Fragment>
                <Toast ref={toast} />
                <form onSubmit={formik.handleSubmit}>
                    <div className="card">
                        <BreadcrumbCustom path={location} />
                        <br />
                        <div className={'mb-2'}>
                            <div className={'my-2'}>
                                <b>Cập nhật Role </b>
                            </div>
                            <hr />
                            <div className={'grid'}>
                                <div className={'col-12 lg:col-4'}>
                                    <div className="flex flex-column gap-2">
                                        <label htmlFor="input_value" className={'mb-1'}>
                                            Số điện thoại Sales
                                        </label>
                                        <InputText
                                            placeholder="Vui lòng nhập SDT"
                                            id="accountPhone"
                                            name="accountPhone"
                                            maxLength={14}
                                            value={formik?.values.accountPhone ?? ''}
                                            onChange={(e) => {
                                                formik.setFieldValue('accountPhone', e.target.value);
                                            }}
                                            className={classNames({ 'p-invalid': isFormFieldInvalid('accountPhone') }, 'w-full')}
                                        />
                                    </div>
                                    {getFormErrorMessage('accountPhone')}
                                </div>

                                <div className={'col-12 lg:col-4'}>
                                    <div className="flex flex-column gap-2">
                                        <label htmlFor="input_value" className={'mb-1'}>
                                            Chức vụ
                                        </label>
                                        <Dropdown
                                            placeholder="Vui lòng chọn chức vụ"
                                            id="role"
                                            name="role"
                                            options={roles}
                                            optionLabel="desc"
                                            // optionValue={'roleName'}
                                            value={formik?.values.role ?? ''}
                                            onChange={(e) => {
                                                formik.setFieldValue('role', e.value);
                                                console.log(formik.values.role);
                                            }}
                                            className={classNames({ 'p-invalid': isFormFieldInvalid('role') }, 'w-full')}
                                        />
                                    </div>
                                    {getFormErrorMessage('role')}
                                </div>

                                <div className={'col-12 lg:col-4'} hidden={formik?.values.role?.roleName === 'SALE_LEAD'}>
                                    <div className="flex flex-column gap-2">
                                        <label htmlFor="input_value" className={'mb-1'}>
                                            Số điện thoại Sales Leader
                                        </label>
                                        <InputText
                                            placeholder="Vui lòng nhập SDT Sales Leader"
                                            id="refAccountPhone"
                                            name="refAccountPhone"
                                            maxLength={14}
                                            value={formik?.values.refAccountPhone ?? ''}
                                            onChange={(e) => {
                                                formik.setFieldValue('refAccountPhone', e.target.value);
                                            }}
                                            className={classNames({ 'p-invalid': isFormFieldInvalid('refAccountPhone') }, 'w-full')}
                                        />
                                    </div>
                                    {getFormErrorMessage('refAccountPhone')}
                                </div>
                            </div>
                        </div>
                        <div className={'center-item'}>
                            <Button type="submit" label="Cập nhật" className={'w-wrap'} />
                        </div>
                    </div>
                </form>
            </React.Fragment>
        </>
    );
};
export default AssignRole;
