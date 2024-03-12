import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { useFormik } from 'formik';

const SelectPaymentMethod = (props) => {
    const {
        selectPaymentMethodDialog,
        setSelectPaymentMethodDialog
    } = props;

    const formik = useFormik({
        initialValues: {
            money: ''
        },
        validate: (data) => {
        },
        onSubmit: async (data) => {
            const res = await accountService.changePassword(data);
            if (data.newPassword !== data.oldPassword) {
            }
            if (res.data.type === 'SUCCESS') {
                toast.current.show({
                    severity: 'success',
                    summary: 'Thông báo',
                    detail: 'Đổi mật khẩu thành công',
                    life: 2000
                });
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Thông báo',
                    detail: res.data.message,
                    life: 2000
                });
            }
            setSelectPaymentMethodDialog(false);
            formik.resetForm();
        }
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className='p-error font-italic'>{formik.errors[name]}</small>;
    };

    return (
        <>
            <React.Fragment>
                <Dialog header='Nạp xu vào tài khoản' visible={selectPaymentMethodDialog}
                        onHide={() => setSelectPaymentMethodDialog(false)}
                        style={{ width: '30vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                    <Accordion activeIndex={0}>
                        <AccordionTab header='Thanh toán qua VNPay'>
                            <div className='w-full mx-auto my-0'>
                                <InputText id='fullname' name='fullname'
                                           placeholder='Số xu muốn nạp'
                                           value={formik.values.fullname}
                                           onChange={formik.handleChange} autoFocus
                                           className={classNames({ 'p-invalid': isFormFieldValid('fullname') })} />
                                <Button icon='pi pi-vimeo' className='center-item p-button ml-4' label='Nạp tiền' />
                                <p className='text-xs font-italic mt-3'>Phí 3% giá trị nạp</p>
                            </div>
                        </AccordionTab>
                    </Accordion>
                    <p className='primary-color text-xs font-italic mt-3'>Giá trị quy đổi: 1000đ = 1 xu</p>
                    <div className='flex justify-content-end mt-4'>
                        <Button className='p-button-secondary mr-0 w-120' label='Hủy bỏ'
                                icon='pi pi-times'
                                onClick={() => setSelectPaymentMethodDialog(false)} />
                    </div>
                </Dialog>
            </React.Fragment>
        </>
    );
};

export default SelectPaymentMethod;