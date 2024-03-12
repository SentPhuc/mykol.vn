import { classNames } from 'primereact/utils';
import { Avatar } from 'primereact/avatar';
import { useState, useEffect, createContext, useRef } from 'react';
import { Bookings } from 'demo/service/Bookings';
import { DEV_URL, pending, inProcess, complete } from 'src/commons/Utils';
import getConfig from 'next/config';
import AppLayout from 'layout/AppLayout';
import moment from 'moment/moment';
import Pending from './pending';
import InProcess from './in-process';
import Complete from './complete';
import { setCookie } from 'src/commons/Function';
import { isMobile } from 'react-device-detect';
import { GlobalService } from 'demo/service/GlobalService';

export const ChatBoxContext = createContext();

const ChatBox = () => {
    const bookings = new Bookings();
    const service = new GlobalService();
    const list = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const fullName = typeof window !== 'undefined' && localStorage.getItem('fullName');
    const accountId = typeof window !== 'undefined' && localStorage.getItem('accountId');
    const role = typeof window !== 'undefined' && localStorage.getItem('role');
    const [urlDetail, setUrlDetail] = useState('');
    const [updateStatus, setUpdateStatus] = useState(false);
    const [loadingShowMessenger, setLoadingShowMessenger] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listMessenger, setListMessenger] = useState([]);
    const [infoOrder, setInfoOrder] = useState({});
    const [bookingCode, setBookingCode] = useState(0);
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState(pending);
    const [isChange, setIsChange] = useState(true);
    const [runOnlyClickMessenger, setRunOnlyClickMessenger] = useState(false);
    const [countBookings, setCountBookings] = useState([]);

    useEffect(() => {
        setLoading(true);
    }, []);

    useEffect(() => {
        setCookie('_zzag', `${accountId}|${fullName}`);
    }, [fullName, accountId]);

    useEffect(() => {
        bookings
            .statisticsBooking()
            .then((data) => {
                if (data?.data?.code != 'error') {
                    setCountBookings(data?.data?.data);
                }
            })
            .catch((error) => console.error(error));
    }, [updateStatus]);

    useEffect(() => {
        if (!status) return;

        bookings
            .getListOrderByStatus(status)
            .then((data) => {
                if (data?.data?.code != 'error') {
                    setListMessenger(data?.data?.data);
                }
            })
            .catch((error) => console.error(error));
    }, [status, updateStatus]);

    useEffect(() => {
        const getCode = listMessenger[0]?.bookingCode ?? 0;
        const getName = listMessenger[0]?.name ?? '';
        setTitle(getName);
        setBookingCode(getCode);
        if (role == 'REC') {
            setUrlDetail(`/components/detail-candidate?mask=${listMessenger[0]?.mask}&id=${listMessenger[0]?.accountId}`);
        }

        if (role != 'REC') {
            setUrlDetail(`/components/company/company-introduction/${listMessenger[0]?.accountId}`);
        }
    }, [listMessenger, role]);

    useEffect(() => {
        if (listMessenger.length === 0) return;

        const fetchMessenger = () =>
            setTimeout(() => {
                if (zigzag_api && zigzag_api.active && listMessenger) {
                    zigzag_api.offchat = function (st) {
                        // console.log(st);
                        service.sendNotifications({ email: listMessenger[0]?.email, senderName: fullName });
                    };
                }
            }, 500);

        fetchMessenger();

        return () => {
            clearTimeout(fetchMessenger());
        };
    }, [listMessenger, fullName]);

    useEffect(() => {
        setBookingCode(bookingCode);
    }, [bookingCode]);

    useEffect(() => {
        if (loading) {
            setRunOnlyClickMessenger(false);
            if (Number(listMessenger) == 0 && runOnlyClickMessenger) {
                return;
            }
            setLoadingShowMessenger(true);
            const fetchMessenger = () =>
                setTimeout(() => {
                    const element = list?.current?.firstChild?.firstElementChild;
                    if (zigzag_api && element) {
                        setLoadingShowMessenger(false);
                        zigzag_api.active(element);
                    }
                }, 700);

            fetchMessenger();

            return () => {
                clearTimeout(fetchMessenger());
            };
        }
    }, [listMessenger, loading]);

    useEffect(() => {
        if (!bookingCode) {
            setInfoOrder({});
            return;
        }

        bookings
            .getInfoOrder(bookingCode)
            .then((data) => {
                if (data?.data?.code != 'error') {
                    setInfoOrder(data?.data?.data);
                }
            })
            .catch((error) => console.error(error));
    }, [bookingCode, isChange]);

    const handleChangeMessenger = (title, bookingCodeUser, accountId, mask, email, event) => {
        setRunOnlyClickMessenger(true);
        setTitle(title);
        setBookingCode(bookingCodeUser);
        if (role == 'REC') {
            setUrlDetail(`/components/detail-candidate?mask=${mask}&id=${accountId}`);
        }

        if (role != 'REC') {
            setUrlDetail(`/components/company/company-introduction/${accountId}`);
        }

        if (zigzag_api && zigzag_api.active && accountId && event) {
            zigzag_api.active(event.target);
        }
    };

    const countPending = countBookings.find((value) => value.status === pending)?.count ?? 0;
    const countInProcess = countBookings.find((value) => value.status === inProcess)?.count ?? 0;
    const countComplete = countBookings.find((value) => value.status === complete)?.count ?? 0;

    return AppLayout(
        <div id="chatBox" className="card border-none md:p-5 p-3 mb-0">
            <div className="container">
                <div className="box-content overflow-x-auto flex border-1 border-black-alpha-20 shadow-1 md:flex-nowrap flex-wrap md:flex-col">
                    <div className={classNames(!!isMobile && loading ? 'list-chat-mobile' : '', 'md:w-3 w-12 border-right-1 border-black-alpha-20')}>
                        <h3 className="text-2xl mb-0 font-bold p-3">Đoạn chat</h3>
                        <div className="flex main-tab overflow-x-auto shadow-1">
                            <button
                                onClick={() => setStatus(pending)}
                                className={classNames(status == pending ? 'active' : '', 'transition-all bg-white  border-none cursor-pointer px-3 py-3 outline-none shadow-none flex white-space-nowrap align-items-center gap-2')}
                            >
                                Pending <span className="inline-block text-white px-2 py-1 border-circle">{countPending}</span>
                            </button>
                            <button
                                onClick={() => setStatus(inProcess)}
                                className={classNames(status == inProcess ? 'active' : '', 'transition-all bg-white  border-none cursor-pointer px-3 py-3 outline-none shadow-none flex white-space-nowrap align-items-center gap-2')}
                            >
                                In-Process <span className="inline-block text-white px-2 py-1 border-circle">{countInProcess}</span>
                            </button>
                            <button
                                onClick={() => setStatus(complete)}
                                className={classNames(status == complete ? 'active' : '', 'transition-all bg-white  border-none cursor-pointer px-3 py-3 outline-none shadow-none flex white-space-nowrap align-items-center gap-2')}
                            >
                                Complete <span className="inline-block text-white px-2 py-1 border-circle">{countComplete}</span>
                            </button>
                        </div>
                        <div id="box-messenger">
                            <ul className="my-0 pl-0 list-none overflow-y-auto" ref={list}>
                                {!!listMessenger &&
                                    listMessenger.map((value, index) => {
                                        return (
                                            <li key={index} className="relative select-none item-messenger">
                                                <div
                                                    data-box="message"
                                                    zzclient={value?.accountId}
                                                    zzname={value?.name}
                                                    onClick={(event) => handleChangeMessenger(value?.name, value.bookingCode, value?.accountId, value?.mask, value?.email, event)}
                                                ></div>
                                                <div data-box="content" className="relative z-0 flex p-3 shadow-1">
                                                    {value?.profileImage ? (
                                                        <Avatar image={DEV_URL + value?.profileImage} size="large" shape="circle" />
                                                    ) : (
                                                        <Avatar image={`${contextPath}/demo/images/avatar/no-avatar.png`} size="large" shape="circle" />
                                                    )}
                                                    {/*zzclient={codezz} */}
                                                    <div className="info pl-3">
                                                        <h3 className="mb-0 line-clamp-1 text-base">{value?.name}</h3>
                                                        <div className="flex align-items-center justify-content-between">
                                                            <div className="line-clamp-1">{value?.desc}</div>
                                                            <span className="white-space-nowrap ml-2 text-xs">{moment(value.createdTime).format('HH:mm A')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                            </ul>
                        </div>
                        {/* {loading && <div className="hidden" id="zzhisd"></div>} */}
                    </div>
                    {!isMobile && loading && (
                        <div className="md:w-4 w-7 relative">
                            <h3 style={{ minHeight: '54px' }} className="text-2xl absolute left-0 top-0 w-full bg-white z-5 mb-0 font-bold p-3 border-black-alpha-20 border-bottom-1">
                                <a className="text-color hover:underline" target="_blank" href={urlDetail} title={title}>
                                    {title}
                                </a>
                            </h3>
                            <div id="zigzagdiv" className="box-content-messenger">
                                {loadingShowMessenger && !!listMessenger && listMessenger.length > 0 && (
                                    <div className="loading">
                                        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                                    </div>
                                )}

                                
                            </div>
                            {listMessenger.length === 0 && <div className="hidden-chatbox"></div>}
                        </div>
                    )}

                    <div className="md:w-5 w-12 border-top-1 md:border-top-none md:border-left-1 border-black-alpha-20">
                        <h3 className="text-2xl mb-0 font-bold p-3">Trạng thái đơn hàng</h3>
                        <div className="box-status p-2 overflow-y-auto">
                            <ChatBoxContext.Provider value={{ infoOrder, bookingCode }}>
                                {status == pending && <Pending setBookingCode={setBookingCode} setStatus={setStatus} setIsChange={setIsChange} setUpdateStatus={setUpdateStatus} />}
                                {status == inProcess && <InProcess setBookingCode={setBookingCode} setStatus={setStatus} setIsChange={setIsChange} setUpdateStatus={setUpdateStatus} />}
                                {status == complete && <Complete />}
                            </ChatBoxContext.Provider>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;

export async function getServerSideProps(context) {
    return {
        props: {
            dataSeo: {
                showChat: true
            }
        }
    };
}
