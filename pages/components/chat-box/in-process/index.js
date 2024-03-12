import { useState, useEffect, useRef, useContext } from 'react';
import { Toast } from 'primereact/toast';
import { ROLE_CONTANT, setContentStatusOrder, complete, isShowPayment } from 'src/commons/Utils';
import { classNames } from 'primereact/utils';
import { Tooltip } from 'primereact/tooltip';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import moment from 'moment/moment';
import StatusContent from '../common/StatusContent';
import ChatBoxContent from '../common/ChatBoxContent';
import ResultWork from '../common/ResultWork';
import ModalRequestRepeat from '../common/ModalRequestRepeat';
import ModalReject from '../common/ModalReject';
import FormAddLinkAction from '../common/FormAddLinkAction';
import { Bookings } from 'demo/service/Bookings';
import { ChatBoxContext } from '../index';

// Step Defaul First Second
//case 1: Defaul: true First: false Second:false
//case 2: Defaul: false First: true Second:false
//case 3: Defaul: false First: false Second:false
//case 4: Defaul: false First: false Second:true

const InProcess = ({ setStatus, setIsChange, setBookingCode, setUpdateStatus }) => {
    const context = useContext(ChatBoxContext);
    const bookings = new Bookings();
    const [visible, setVisible] = useState(false);
    const [visibleReject, setVisibleReject] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isShowAddLink, setIsShowAddLink] = useState(false);
    const [isfirstResults, setIsfirstResults] = useState(false);
    const [resultsWoking, setResultsWoking] = useState([]);
    const [tab, setTab] = useState('content');
    const toast = useRef(null);
    const role = typeof window !== 'undefined' && localStorage.getItem('role');
    const getDateValue = new Date(context?.infoOrder?.expectedCompletionTime).getDate();
    const getMonthValue = new Date(context?.infoOrder?.expectedCompletionTime).getMonth();
    const getYearValue = new Date(context?.infoOrder?.expectedCompletionTime).getFullYear();
    const dateExpected = moment().year(getYearValue).month(getMonthValue).date(getDateValue);
    const getYear = new Date().getFullYear();
    const getMonth = new Date().getMonth();
    const getDate = new Date().getDate();
    const today = moment().year(getYear).month(getMonth).date(getDate);
    const dateDeadLine = today.diff(dateExpected, 'days');

    useEffect(() => {
        setLoading(true);
    }, []);

    useEffect(() => {
        setIsfirstResults(!!context?.infoOrder?.results?.length && !context?.infoOrder?.requestRedoCount);
    }, [context?.infoOrder]);

    useEffect(() => {
        setResultsWoking(context?.infoOrder?.results ?? []);
    }, [context?.infoOrder?.results]);

    useEffect(() => {
        setIsShowAddLink(false);
    }, [context?.bookingCode]);

    const hanldeComplete = () => {
        setIsLoading(true);
        bookings
            .completeBooking(context?.bookingCode)
            .then((data) => {
                if (data?.data?.code != 'error') {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Hoàn tất đơn hàng thành công', life: 3000 });
                    setStatus(complete);
                } else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: data?.data?.message, life: 3000 });
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsLoading(false);
                setUpdateStatus((pre) => !pre);
            });

        setVisible(false);
    };

    if (loading && !Object.keys(context?.infoOrder).length) return <></>;

    if (role == ROLE_CONTANT[2]) {
        return 'Updating...';
    }

    if (loading && role == ROLE_CONTANT[0]) {
        return (
            <>
                <Toast ref={toast} />
                <StatusContent status="In process" content={setContentStatusOrder(role, dateExpected, context?.infoOrder?.requestRedoCount, resultsWoking)} />
                <div className="text-center md:my-3 my-2">
                    <Button onClick={() => setIsShowAddLink((pre) => !pre)} className="border-round-sm bg-white text-primary py-2" label="Thêm link" />
                </div>
                {isShowAddLink && <FormAddLinkAction setBookingCode={setBookingCode} setIsChange={setIsChange} bookingCode={context?.bookingCode} setIsShowAddLink={setIsShowAddLink} setTab={setTab} />}

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
                {tab == 'content' ? <ChatBoxContent infoOrder={context?.infoOrder} bookingCode={context?.bookingCode} role={role} /> : <ResultWork result={resultsWoking} />}
                <div className="text-center my-3">
                    <button disabled={isLoading} onClick={() => setVisibleReject(true)} className="transition-all border-round-sm bg-primary inline-block p-3 font-bold border-none outline-none cursor-pointer">
                        Hủy đơn hàng <i className="pi pi-info-circle tooltip-helper-cancel mx-2 cursor-pointer vertical-align-middle" autohide="false"></i>
                    </button>
                </div>
                <ModalReject setUpdateStatus={setUpdateStatus} setIsLoading={setIsLoading} bookingCode={context?.bookingCode} visible={visibleReject} setVisible={setVisibleReject} roleCancel={true} />
            </>
        );
    }
    const message = isShowPayment
        ? 'Bạn có 5 ngày để "Yêu cầu làm lại"  kể từ lúc KOC gửi kết quả công việc. Nếu quá thời hạn trên, bạn không có phản hồi, số tiền sẽ được tự động thanh toán cho KOC'
        : 'Bạn có 5 ngày để "Yêu cầu làm lại"  kể từ lúc KOC gửi kết quả công việc.';
        
    return (
        <>
            <Toast ref={toast} />
            <ModalRequestRepeat setIsfirstResults={setIsfirstResults} bookingCode={context?.bookingCode} visible={visibleModal} setVisible={setVisibleModal} setIsLoading={setIsLoading} />
            <StatusContent status="In process" content={setContentStatusOrder(role, dateExpected, context?.infoOrder?.requestRedoCount, resultsWoking)} />
            {isfirstResults && <Message className="mb-2" severity="error" text={message} />}

            <div className="flex justify-content-center mb-2 gap-2">
                <Button disabled={isLoading} loadingIcon={isLoading} onClick={() => setVisible(true)} className={'border-round-sm transition-all w-full inline-block p-3 font-bold border-none outline-none cursor-pointer bg-primary'}>
                    Hoàn tất đơn hàng
                </Button>
                {isfirstResults && (
                    <>
                        <Button
                            disabled={isLoading}
                            loadingIcon={isLoading}
                            onClick={() => setVisibleModal(true)}
                            className={'border-round-sm transition-all w-full inline-block p-3 font-bold border-none outline-none cursor-pointer bg-white text-primary'}
                        >
                            Yêu cầu lại <i className="pi pi-info-circle tooltip-helper-repeat mx-2 cursor-pointer vertical-align-middle" autohide="false"></i>
                        </Button>
                        <Tooltip position="top" target=".tooltip-helper-repeat">
                            Bạn có 01 lần yêu cầu KOC làm lại
                        </Tooltip>
                    </>
                )}
            </div>
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
            {tab == 'content' ? <ChatBoxContent infoOrder={context?.infoOrder} bookingCode={context?.bookingCode} role={role} /> : <ResultWork result={resultsWoking} />}
            {!!dateDeadLine && dateDeadLine > 7 && (
                <>
                    <div className="text-center md:my-4 my-2">
                        <button onClick={() => setVisibleReject(true)} className="transition-all border-round-sm bg-primary inline-block p-3 font-bold border-none outline-none cursor-pointer">
                            Hủy đơn hàng <i className="pi pi-info-circle tooltip-helper-cancel mx-2 cursor-pointer vertical-align-middle" autohide="false"></i>
                        </button>
                        <Tooltip position="top" target=".tooltip-helper-cancel">
                            Bạn có quyền hủy đơn hàng vì KOC đã trễ hạn quá 7 ngày.
                            <br />
                            Chúng tôi khuyến khích bạn nên trao đổi với KOC trước khi thực hiện việc hủy đơn hàng.
                        </Tooltip>
                    </div>
                    <ModalReject setUpdateStatus={setUpdateStatus} setIsLoading={setIsLoading} bookingCode={context?.bookingCode} visible={visibleReject} setVisible={setVisibleReject} roleCancel={true} />
                </>
            )}

            <Dialog header="Hoàn tất đơn hàng" visible={visible} onHide={() => setVisible(false)} style={{ width: '100%', maxWidth: '400px' }}>
                Xác nhận đơn hàng đã hoàn tất. Bạn đã nhận được kết quả công việc và mong muốn thanh toán cho KOC
                <div className="text-center mt-4">
                    <button onClick={() => hanldeComplete()} className={'border-round-sm transition-all inline-block p-3 font-bold border-none outline-none cursor-pointer bg-primary'}>
                        Xác nhận
                    </button>
                </div>
            </Dialog>
        </>
    );
};

export default InProcess;
