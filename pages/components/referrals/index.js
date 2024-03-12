import AppLayout from 'layout/AppLayout';
import PageNotAdmin from './pageNotAdmin';
import PageAdmin from './pageAdmin';
import { useEffect, useState } from 'react';

const Referrals = () => {
    const [changing, setChanging] = useState(false);
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

    useEffect(() => {
        setChanging(true);
    }, []);
    
    if(!changing) return AppLayout(<></>);

    return AppLayout(<>{role === 'ADMINISTRATION' ? <PageAdmin /> : <PageNotAdmin />}</>);
};

export default Referrals;
