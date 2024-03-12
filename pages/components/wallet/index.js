import { useState, useEffect } from 'react';
import AppLayout from 'layout/AppLayout';
import WalletKoc from './WalletKoc';
import WalletRec from './WalletRec';

export default function Wallet() {
    const [loading, setLoading] = useState(false);
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

    useEffect(() => {
        setLoading(true);
    }, []);

    return AppLayout(
        <div id="page-wallet">
            <div className="container">
                <div className="content py-5">{!!loading && role === 'KOLIFL' ? <WalletKoc /> : <WalletRec />}</div>
            </div>
        </div>
    );
}
