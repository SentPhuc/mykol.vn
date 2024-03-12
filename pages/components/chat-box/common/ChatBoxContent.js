import { useState, useRef, useEffect, useContext } from 'react';
import { Calendar } from 'primereact/calendar';
import moment from 'moment/moment';
import { Bookings } from 'demo/service/Bookings';
import { Toast } from 'primereact/toast';
import { ROLE_CONTANT, formatCurrencyVND } from 'src/commons/Utils';
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';

const ChatBoxContent = ({ role, status = null, bookingCode = null, infoOrder }) => {
    const toast = useRef(null);
    const bookings = new Bookings();
    const [loading, setLoading] = useState(false);
    const [edit, setEdit] = useState(false);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const dateConvert = infoOrder?.expectedCompletionTime ? new Date(infoOrder?.expectedCompletionTime) : new Date();
        setDate(dateConvert);
    }, [infoOrder?.expectedCompletionTime]);

    //Set max 3 months
    let nextMonth = date.getMonth() + 3;
    let getDate = date.getDate() + 1;
    let getMonth = date.getMonth();
    let getFullYear = date.getFullYear();
    let maxDate = new Date();
    let minDate = new Date();
    maxDate.setDate(getDate);
    maxDate.setMonth(nextMonth);
    maxDate.setFullYear(getFullYear);
    minDate.setDate(getDate);
    minDate.setMonth(getMonth);
    minDate.setFullYear(getFullYear);

    const handleUpdateDate = async (valueDate) => {
        if (role == ROLE_CONTANT[0] && !bookingCode) return;
        const dateConvert = moment(valueDate).toISOString(true).replace('+07:00', 'Z');
        console.log({ dateConvert });

        const changeState = () =>
            setTimeout(() => {
                setDate(valueDate);
                setEdit(!edit);
                bookings
                    .updateDateBooking(bookingCode, { expectedCompletionTime: dateConvert })
                    .then((data) => {
                        if (data?.data?.code != 'error') {
                            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Cập nhật ngày mong đợi !!!', life: 3000 });
                        } else {
                            toast.current.show({ severity: 'error', summary: 'Error', detail: data?.data?.message, life: 3000 });
                        }
                    })
                    .catch((error) => console.error(error));
            }, 500);

        changeState();
        return () => {
            clearTimeout(changeState);
        };
    };

    useEffect(() => {
        setLoading(true);
    }, []);

    return (
        <>
            <Toast ref={toast} />
            <div className="md:mt-4 mt-2">
                <div className="flex mb-2 align-items-center justify-content-between">
                    <h3 className="text-base mb-0">Thông tin liên hệ của {!!infoOrder?.kocContact ? 'KOC/KOL' : 'nhãn hàng'}</h3>
                    <i className="text-xl pi pi-angle-down"></i>
                </div>
                <p className="mb-2">Số điện thoại: {infoOrder?.contactPhone}</p>
                <p className="flex">Email: {infoOrder?.contactEmail}</p>
                <div className="flex mb-2 align-items-center justify-content-between">
                    <h3 className="text-base mb-0">Mô tả dịch vụ</h3>
                    <i className="text-xl pi pi-angle-down"></i>
                </div>
                <p className="mb-2">Loại dịch vụ: {infoOrder?.serviceName}</p>
                <p className="flex">
                    Giá dịch vụ: {formatCurrencyVND(infoOrder?.price)} {!!status && status == 'complete' && <Tag className="ml-2" severity="success" value="Đã thanh toán"></Tag>}
                </p>
                {infoOrder?.serviceDescription && (
                    <>
                        <p className="mb-1">Mô tả:</p>
                        <div>{infoOrder?.serviceDescription}</div>
                    </>
                )}

                <div className="flex md:mt-5 mt-2 mb-2 align-items-center justify-content-between">
                    <h3 className="text-base mb-0">Yêu cầu từ nhãn hàng</h3>
                    <i className="text-xl pi pi-angle-down"></i>
                </div>
                <div className="mb-2 flex align-items-center">
                    <Tooltip target=".custom-target-persent">
                        <ul className="my-0 pl-3">
                            <li>"Ngày mong đợi" được coi là deadline của đơn hàng này.</li>
                            <li>Nhãn hàng có quyền chỉnh sửa ngày mong đợi</li>
                            <li>Nhãn hàng có quyền hủy đơn hàng và không thanh toán nếu KOC chậm deadline quá 7 ngày.</li>
                        </ul>
                    </Tooltip>
                    Ngày mong đợi: <i className="pi pi-info-circle custom-target-persent mx-2 cursor-pointer vertical-align-middle" autohide="false"></i>{' '}
                    <span className="inline-block pl-1 font-bold text-primary">{!edit && moment(date).format('DD/MM/YYYY')}</span>
                    {loading && role == ROLE_CONTANT[1] && (
                        <div className="ml-2">
                            {edit ? <Calendar minDate={minDate} maxDate={maxDate} value={date} onChange={(e) => handleUpdateDate(e.value)} dateFormat="dd/mm/yy" readOnlyInput /> : ''}
                            {!edit && status != 'complete' ? <i onClick={() => setEdit((pre) => !pre)} className="vertical-align-middle pi-pencil pi cursor-pointer text-lg"></i> : ''}
                        </div>
                    )}
                </div>
                <p className="mb-1">Mô tả công việc: </p>
                <div dangerouslySetInnerHTML={{ __html: infoOrder?.description }}></div>
            </div>
        </>
    );
};

export default ChatBoxContent;
