import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useState, useRef, useEffect } from 'react';
import { Bookings } from 'demo/service/Bookings';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';

export default function ModalReject({ visible, setVisible, bookingCode, roleCancel = null, setUpdateStatus, setIsLoading }) {
    const bookings = new Bookings();
    const content = useRef(null);
    const toast = useRef(null);
    const [value, setValue] = useState('');
    const [require, setRequire] = useState(false);

    const handleReject = () => {
        if (!content.current?.value) {
            setRequire(true);
            return;
        }

        setIsLoading(true);

        if (roleCancel) {
            bookings
                .rejectBookingByRec(bookingCode, { reason: content.current?.value })
                .then((data) => {
                    if (data?.data?.code != 'error') {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Gửi lý do từ chối thành công !!!', life: 3000 });
                        setUpdateStatus((pre) => !pre);
                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: data?.data?.message, life: 3000 });
                    }
                })
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false));
        } else {
            bookings
                .rejectBooking(bookingCode, { reason: content.current?.value })
                .then((data) => {
                    if (data?.data?.code != 'error') {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Gửi lý do từ chối thành công !!!', life: 3000 });
                        setUpdateStatus((pre) => !pre);
                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: data?.data?.message, life: 3000 });
                    }
                })
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false));
        }

        setValue('');
        setVisible(false);
        setRequire(false);
    };

    useEffect(() => {
        if (!visible) {
            setValue('');
            setRequire(false);
        }
    }, [visible]);

    return (
        <>
            <Toast ref={toast} />
            <Dialog id="modalReject" header="Lý do hủy đơn hàng" visible={visible} onHide={() => setVisible(false)} style={{ width: '100%', maxWidth: '450px' }}>
                <InputTextarea
                    ref={content}
                    maxLength="150"
                    className={classNames(require ? 'border-1 border-primary' : '', 'w-full')}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        !!e.target.value && setRequire(false);
                    }}
                    rows={5}
                    cols={30}
                />
                {require && <small className="p-error mt-2 block">Lý do hủy đơn hàng bắt buộc nhập</small>}
                <div className="text-center mt-3">
                    <Button onClick={() => handleReject()} label="Xác nhận" />
                </div>
            </Dialog>
        </>
    );
}
