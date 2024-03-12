import { Dialog } from 'primereact/dialog';
import { Wallets } from 'demo/service/Wallets';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Toast } from 'primereact/toast';

export default function WithdrawMoney({ visibleWithdraw, setVisibleWithdraw }) {
    const toast = useRef(null);
    const wallets = new Wallets();
    const [customAmount, setCustomAmount] = useState(0);

    const handleWithDraw = () => {
        if (!customAmount) return;

        wallets
            .withDraw({ amount: customAmount })
            .then((data) => {
                console.log(data?.data?.code);
                if (data?.data?.code === 'success') {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Số tiền bạn rút đang được xử lý, vui lòng chờ 3-5 ngày làm việc', life: 3000 });
                }
            })
            .catch((err) => {
                console.error(err);
                toast.current.show({ severity: 'error', summary: 'Error', detail: err?.response?.data?.message, life: 3000 });
            });
    };

    const closeModal = () => {
        setCustomAmount(0);
        setVisibleWithdraw(false);
        document.body.style.overflow = 'unset';
    };

    return (
        <>
            <Dialog header="Rút tiền" visible={visibleWithdraw} style={{ width: '40rem' }} breakpoints={{ '40rem': '40rem' }} onHide={() => closeModal()}>
                <div className="w-full surface-card">
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-col-12">
                            <div className="flex ">
                                <InputNumber onKeyDown={() => handleWithDraw()} className="w-full m-2" value={customAmount} onChange={(e) => setCustomAmount(e.value)} maxLength={12} placeholder="Nhập số tiền tối thiểu 500,000đ" />
                            </div>
                            <div className="flex">{customAmount < 500000 && <small className="p-error m-2 block">Số tiền tối thiểu là 500,000đ</small>}</div>
                        </div>
                    </div>
                    <div className="flex flex-wrap align-items-center justify-content-center">
                        <Button onClick={() => handleWithDraw()} label="Xác nhận" className="btn-primary mt-2" type="summit" disabled={customAmount < 500000} />
                    </div>
                </div>
            </Dialog>
            <Toast ref={toast} />
        </>
    );
}
