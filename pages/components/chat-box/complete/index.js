import { useState, useContext, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { ROLE_CONTANT } from 'src/commons/Utils';
import StatusContent from '../common/StatusContent';
import ChatBoxContent from '../common/ChatBoxContent';
import ResultWork from '../common/ResultWork';
import { ChatBoxContext } from '../index';

const Complete = () => {
    const context = useContext(ChatBoxContext);
    const [loading, setLoading] = useState(false);
    const role = typeof window !== 'undefined' && localStorage.getItem('role');
    const [tab, setTab] = useState('content');

    useEffect(() => {
        setLoading(true);
    }, []);

    if (loading && !Object.keys(context?.infoOrder).length) return <></>;

    if (role == ROLE_CONTANT[2]) {
        return 'Updating...';
    }

    return (
        <>
            <StatusContent status="Complete" content="Đơn hàng đã hoàn tất" />
            <div className="flex gap-2">
                <button
                    onClick={() => setTab('content')}
                    className={classNames(tab == 'content' ? 'bg-red-100 text-primary' : 'bg-white hover:bg-red-100 hover:text-primary', 'transition-all w-full inline-block p-2 md:p-3 font-bold border-none outline-none cursor-pointer')}
                >
                    Nội dung đơn hàng
                </button>
                <button
                    onClick={() => setTab('result')}
                    className={classNames(tab == 'result' ? 'bg-red-100 text-primary' : 'bg-white hover:bg-red-100 hover:text-primary', 'transition-all w-full inline-block p-2 md:p-3 font-bold border-none outline-none cursor-pointer')}
                >
                    Kết quả làm việc
                </button>
            </div>
            {tab == 'content' ? <ChatBoxContent infoOrder={context?.infoOrder} bookingCode={context?.bookingCode} role={role} status="complete" /> : <ResultWork result={context?.infoOrder?.results} />}
        </>
    );
};

export default Complete;
