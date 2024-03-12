import { Dialog } from 'primereact/dialog';
import { Wallets } from 'demo/service/Wallets';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ModalRecharge({ visible, setVisible }) {
    const wallets = new Wallets();
    const router = useRouter();
    const [customAmount, setCustomAmount] = useState(0);

    const handleRecharge = () => {
        if (!customAmount) return;
        const redirectUrl = process.env.APP_URL + router?.asPath;
        wallets
            .depositWallet({ amount: customAmount, redirectUrl: redirectUrl })
            .then((data) => {
                if (data?.data?.code === 'success') {
                    window.location.href = data?.data?.data?.billUrl;
                }
            })
            .catch((err) => console.error(err));
    };

    const closeModal = () => {
        setCustomAmount(0);
        setVisible(false);
        document.body.style.overflow = 'unset';
    };

    return (
        <Dialog header="Số tiền muốn nạp" visible={visible} style={{ width: '100%', maxWidth: '40rem' }} onHide={() => closeModal()}>
            <div className="w-full surface-card">
                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-col-12">
                        <div className="flex md:align-items-center md:flex-nowrap flex-wrap align-items-stretch">
                            <Button type="button" className="md:w-auto items-button-amount flex align-items-center justify-content-center bg-white text-primary border-round m-2" onClick={() => setCustomAmount(500000)}>
                                500,000đ
                            </Button>
                            <Button type="button" className="md:w-auto items-button-amount flex align-items-center justify-content-center bg-white text-primary border-round m-2" onClick={() => setCustomAmount(1000000)}>
                                1,000,000đ
                            </Button>
                            <Button type="button" className="md:w-auto items-button-amount flex align-items-center justify-content-center bg-white text-primary border-round m-2" onClick={() => setCustomAmount(5000000)}>
                                5,000,000đ
                            </Button>
                            <Button type="button" className="md:w-auto items-button-amount flex align-items-center justify-content-center bg-white text-primary border-round m-2" onClick={() => setCustomAmount(10000000)}>
                                10,000,000đ
                            </Button>
                            <Button type="button" className="md:w-auto items-button-amount2 flex align-items-center justify-content-center bg-white text-primary border-round m-2" onClick={() => setCustomAmount(20000000)}>
                                20,000,000đ
                            </Button>
                        </div>
                    </div>
                    <div className="p-col-12">
                        <div className="flex ">
                            <InputNumber className="w-full m-2" value={customAmount} onChange={(e) => setCustomAmount(e.value)} maxLength={12} placeholder="Nhập số tiền tối thiểu 500,000đ" />
                        </div>
                        <div className="flex">{customAmount < 500000 && <small className="p-error m-2 block">Số tiền tối thiểu là 500,000đ</small>}</div>
                    </div>
                </div>
                <div className="flex flex-wrap align-items-center justify-content-center">
                    <Button onClick={() => handleRecharge()} label="Nạp tiền" className="btn-primary mt-2" type="summit" disabled={customAmount < 500000} />
                </div>
            </div>
        </Dialog>
    );
}
