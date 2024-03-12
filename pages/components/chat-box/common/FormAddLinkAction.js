import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { validateWebsite } from 'src/commons/Utils';
import { Bookings } from 'demo/service/Bookings';

export default function FormAddLinkAction({ setIsShowAddLink, setTab, bookingCode, setIsChange, setBookingCode }) {
    const bookings = new Bookings();
    const [visible, setVisible] = useState(false);
    const [datas, setDatas] = useState([]);
    const toast = useRef(null);
    const form = useRef(null);

    let initialValues = {
        datas: [
            {
                link: ''
            }
        ]
    };

    const handleSubmit = (datas) => {
        setDatas(datas);
        setVisible(true);
    };

    const handleConfirm = () => {
        const arrayURLData = datas.map((value) => value.link);
        bookings
            .submitBooking(bookingCode, { links: arrayURLData })
            .then((data) => {
                if (data?.data?.code == 'success') {
                    toast?.current?.show({ severity: 'success', summary: 'Success', detail: 'Gửi kết quả công việc thành công', life: 3000 });
                    setTimeout(() => {
                        setIsShowAddLink(false);
                        setTab && setTab('result');
                    }, 500);
                } else {
                    setDatas([]);
                    toast?.current?.show({ severity: 'error', summary: 'Error', detail: data?.data?.message, life: 3000 });
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsChange((pre) => !pre);
                setBookingCode(bookingCode);
            });

        setVisible(false);
    };

    return (
        <div className="mb-4">
            <Toast ref={toast} />
            <Formik
                innerRef={form}
                initialValues={initialValues}
                onSubmit={async (values) => {
                    const length = !!values && values.datas.length;
                    for (let index = 0; index < length; index++) {
                        if (!values.datas?.[index]?.link) {
                            toast.current.show({ severity: 'error', summary: 'Error', detail: `Link bài đăng số ${index + 1} không thể rỗng`, life: 3000 });
                            return;
                        }

                        if (!validateWebsite(values.datas?.[index]?.link)) {
                            toast.current.show({ severity: 'error', summary: 'Error', detail: `Link bài đăng số ${index + 1} không đúng định dạng`, life: 3000 });
                            return;
                        }
                    }

                    values.datas && handleSubmit(values.datas);
                }}
            >
                {({ values }) => (
                    <Form>
                        <FieldArray name="datas">
                            {({ insert, remove, push }) => (
                                <div className="flex gap-3 flex-column">
                                    {values.datas.length > 0 &&
                                        values.datas.map((data, index) => (
                                            <div className="flex align-items-center gap-2 w-full" key={index}>
                                                <div className="w-11">
                                                    <Field
                                                        value={data?.[index]?.link}
                                                        className="border-1 border-round-sm border-gray-300 bg-white px-3 py-2 w-full outline-none"
                                                        name={`datas.${index}.link`}
                                                        placeholder="Điền link bài đăng"
                                                        type="text"
                                                    />
                                                    <ErrorMessage name={`datas.${index}.link`} component="div" className="field-error" />
                                                </div>
                                                <div className="w-1">
                                                    <button type="button" className="bg-white cursor-pointer border-none outline-none" onClick={() => remove(index)}>
                                                        <i className="pi pi-times"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    <button type="button" className="border-round-sm cursor-pointer bg-primary border-none outline-none py-2" onClick={() => push({ link: '' })}>
                                        Thêm input
                                    </button>
                                </div>
                            )}
                        </FieldArray>
                        {form.current?.values.datas.length > 0 && (
                            <div className="text-center mt-3">
                                <Button type="submit" className="border-round-sm bg-white text-primary py-2" label="Gửi" />
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
            <Dialog draggable={false} header="Gửi kết quả công việc" visible={visible} onHide={() => setVisible(false)} style={{ width: '100%', maxWidth: '400px' }}>
                Bạn đã hoàn thành công việc theo yêu cầu của nhãn hàng và muốn gửi kết quả công việc?
                <div className="text-center mt-4">
                    <button onClick={() => handleConfirm()} className={'border-round-sm transition-all inline-block p-3 font-bold border-none outline-none cursor-pointer bg-primary'}>
                        Xác nhận
                    </button>
                </div>
            </Dialog>
        </div>
    );
}
