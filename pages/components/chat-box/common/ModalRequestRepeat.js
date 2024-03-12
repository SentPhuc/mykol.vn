import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useState, useRef, useEffect } from 'react';
import { Bookings } from 'demo/service/Bookings';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';

export default function ModalRequestRepeat({ visible, setVisible, bookingCode, setIsfirstResults, setIsLoading }) {
    const bookings = new Bookings();
    const content = useRef(null);
    const toast = useRef(null);
    const [value, setValue] = useState('');
    const [require, setRequire] = useState(false);

    const handleRequestRepeat = () => {
        if (!content.current?.value) {
            setRequire(true);
            return;
        }
        setIsLoading(true);
        bookings
            .redoBooking(bookingCode, { reason: content.current?.value })
            .then((data) => {
                if (data?.data?.code != 'error') {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Yêu cầu làm lại thành công !!!', life: 3000 });
                } else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: data?.data?.message, life: 3000 });
                }
            })
            .catch((err) => console.error(err))
            .finally(() => {
                setIsfirstResults(false);
                setIsLoading(false);
            });

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
            <Dialog id="modalRequestRepeat" header="Lý do yêu cầu làm lại" visible={visible} onHide={() => setVisible(false)} style={{ width: '100%', maxWidth: '450px' }}>
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
                {require && <small className="p-error mt-2 block">Lý do yêu cầu làm lại bắt buộc nhập</small>}
                <div className="text-center mt-3">
                    <Button onClick={() => handleRequestRepeat()} label="Xác nhận" />
                </div>
            </Dialog>
        </>
    );
}
