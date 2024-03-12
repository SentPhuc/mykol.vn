import { useEffect, useRef, useState, useContext } from 'react';
import { ROLE_CONTANT, inProcess, isShowPayment } from 'src/commons/Utils';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import ChatBoxContent from '../common/ChatBoxContent';
import ModalReject from '../common/ModalReject';
import StatusContent from '../common/StatusContent';
import { Dialog } from 'primereact/dialog';
import { Bookings } from 'demo/service/Bookings';
import { ChatBoxContext } from '../index';

const Pending = ({ setStatus, setUpdateStatus, setBookingCode }) => {
    const context = useContext(ChatBoxContext);
    const bookings = new Bookings();
    const toast = useRef(null);
    const role = typeof window !== 'undefined' && localStorage.getItem('role');
    const [visible, setVisible] = useState(false);
    const [visibleNote, setVisibleNote] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [bookingCode, setBookingCodeNew] = useState(context?.bookingCode);
    let contentText = isShowPayment ? 'KOC có 7 ngày để chấp nhận hoặc từ chối đơn hàng. Nếu không có phản hồi, số tiền sẽ được hoàn lại vào ví của bạn.' : 'KOC có 7 ngày để chấp nhận hoặc từ chối đơn hàng.';

    useEffect(() => {
        setLoading(true);
    }, []);

    if (loading && !Object.keys(context?.infoOrder).length) return <></>;

    if (loading && role == ROLE_CONTANT[2]) {
        return 'Updating...';
    }

    if (loading && role == ROLE_CONTANT[0]) {
        contentText = 'Bạn có 7 ngày để chấp nhận hoặc từ chối đơn hàng';

        const hanldeRequest = () => {
            setIsLoading(true);
            bookings
                .confirmBooking(context?.bookingCode)
                .then((data) => {
                    if (data?.data?.code != 'error') {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Gửi chấp nhận thành công !!!', life: 3000 });
                        const changeTab = () =>
                            setTimeout(() => {
                                setStatus(inProcess);
                            }, 800);

                        changeTab();
                        clearTimeout(changeTab);
                        setVisibleNote(false);
                    }
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    setIsLoading(false);
                    setUpdateStatus((pre) => !pre);
                    setBookingCode(bookingCode);
                });
        };

        return (
            <>
                <Toast ref={toast} />
                <StatusContent status="Pending" content={contentText} />
                <div className="flex gap-5 justify-content-between md:mb-5 mb-2">
                    <Button disabled={isLoading} loading={isLoading} onClick={() => setVisibleNote(true)} className="w-full border-round-sm py-2" label="Chấp nhận" />
                    <Button disabled={isLoading} loading={isLoading} onClick={() => setVisible(true)} className="w-full border-round-sm bg-white text-primary py-2" label="Từ chối" />
                </div>
                <div className="text-center text-xl font-bold">Nội dung đơn hàng</div>
                <ChatBoxContent infoOrder={context?.infoOrder} role={role} />
                <ModalReject bookingCode={context?.bookingCode} setUpdateStatus={setUpdateStatus} visible={visible} setVisible={setVisible} setIsLoading={setIsLoading} />
                <Dialog header="Lưu ý quan trọng" visible={visibleNote} style={{ width: '40vw' }} onHide={() => setVisibleNote(false)}>
                    <ul className="my-0 pl-4 line-height-3">
                        <li>"Ngày mong đợi" được coi là deadline của đơn hàng này.</li>
                        <li>Nhãn hàng có quyền chỉnh sửa ngày mong đợi, hãy chủ động trao đổi để thống nhất với nhãn hàng</li>
                        <li>Nhãn hàng có quyền hủy đơn hàng và không thanh toán nếu bạn chậm deadline quá 7 ngày.</li>
                        <li>Nhãn hàng có 01 lần yêu cầu chỉnh sửa.</li>
                        {isShowPayment && <li>Chúng tôi đã tạm giữ số tiền thanh toán của nhãn hàng để đảm bảo bạn chắc chắn sẽ nhận được tiền khi hoàn thành công việc.</li>}
                        <li>Ngoài ra, bạn có thể liên hệ 0383050533 để được hỗ trợ.</li>
                    </ul>
                    <div className="text-center mt-3">
                        <Button disabled={isLoading} loading={isLoading} onClick={() => hanldeRequest()} label="Đã hiểu" />
                    </div>
                </Dialog>
            </>
        );
    }

    return (
        <>
            <Toast ref={toast} />
            <StatusContent status="Pending" content={contentText} />
            <span className="bg-red-100 text-primary inline-block p-3 font-bold">Nội dung đơn hàng</span>
            <ChatBoxContent infoOrder={context?.infoOrder} bookingCode={context?.bookingCode} role={role} />
        </>
    );
};
export default Pending;
