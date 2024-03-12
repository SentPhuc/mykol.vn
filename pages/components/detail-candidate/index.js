import React, { useEffect, useRef, useState } from 'react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import ReportCandidate from './ReportCandidate';
import InvitationToApply from './InvitationToApply';
import { Chip } from 'primereact/chip';
import ImagesCandidate from './ImagesCandidate';
import { GlobalService } from '../../../demo/service/GlobalService';
import { DEV_URL, GENDER_ENUM, formatCurrencyVND, formatUrlExact, nameCookieRef, isShowPayment } from '../../../src/commons/Utils';
import ListComment from './ListComment';
import ReviewCandidate from './ReviewCandidate';
import ParticipatedJobs from './ParticipatedJobs';
import { Toast } from 'primereact/toast';
import { useDispatch, useSelector } from 'react-redux';
import { openPopupLogin } from '../../../public/reduxConfig/loginSlice';
import _ from 'lodash';
import BannerReferrals from '../referrals/bannerReferrals';
import SidebarTiktok from '../homepage/recruitment/SidebarTiktok';
import { getCookie, setCookie } from 'src/commons/Function';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Bookings } from 'demo/service/Bookings';
import { Dialog } from 'primereact/dialog';

const DetailCandidate = () => {
    const service = new GlobalService();
    const bookings = new Bookings();
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const getStorage = typeof window !== 'undefined' ? localStorage : {};
    const router = useRouter();
    const refCode = router?.query?.ref;
    const [visibleSidebar, setVisibleSidebar] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [userName, setUserName] = useState('');
    const [initData, setInitData] = useState([]);
    const [participatedJobs, setParticipatedJobs] = useState([]);
    const [infoLink, setInfoLink] = useState('');
    const [hasNewComment, setHasNewComment] = useState('');
    const toast = useRef(null);
    const [hoverName, setHoverName] = useState(false);

    useEffect(() => {
        if (!!refCode) {
            service
                .postClickReferals({
                    referralCode: refCode ?? '',
                    cookie: getCookie(nameCookieRef) ?? ''
                })
                .then((data) => {
                    if (data?.data?.code === 'success') {
                        if (data?.data?.message === 'Referral code is not found') {
                            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Referral code is not found' });
                            router.push(router.asPath);
                            return;
                        }
                        setCookie(nameCookieRef, refCode, 30);
                    }
                })
                .catch((error) => console.error(error));
        }
    }, [refCode]);

    useEffect(async () => {
        if (!router.isReady) {
            return;
        }
        const param = router.query;
        try {
            // closeMenu();
            const res = await service.getDetailKols(param.mask, param.id);
            if (res?.data?.code === 'success') {
                const content = res.data?.data;
                setInitData(content);
                setInfoLink(!!document.URL && document.URL);
            }

            if (res?.data?.code == 'no record') {
                router.push('/404');
            }

            const resParticipatedJobs = await service.getKolParticipatedJob(param.id);
            if (resParticipatedJobs.data.code === 'success') {
                const content = resParticipatedJobs.data?.data;
                setParticipatedJobs(content);
            } else {
                setParticipatedJobs([]);
            }
        } catch (e) {
            console.log(e);
            router.push('/components/search-candidates');
        }
    }, [router]);

    const [theme, setTheme] = useState('white-theme-kol');
    const [openReportCandidatePopup, setOpenReportCandidatePopup] = useState(false);
    const [openInvitationToApplyPopup, setOpenInvitationToApplyPopup] = useState(false);
    const [openParticipatedJobPopup, setOpenParticipatedJobPopup] = useState(false);
    const socials = _.orderBy(initData.socialNetworks, ['socialNetworkCode'], ['asc']);

    const onRedirectToSharingHandler = (item) => {
        const telegramShareUrl = onClickToSharing(item);
        window.open(telegramShareUrl, '_blank', 'noopener,noreferrer');
    };

    const onClickToSharing = (socialType) => {
        const navigatorLink = {
            Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(infoLink)}`,
            Instagram: `https://www.instagram.com/sharer/sharer.php?u=${encodeURIComponent(infoLink)}`,
            Twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(infoLink)}`,
            Linkedin: `https://www.linkedin.com/cws/share?url=${encodeURIComponent(infoLink)}`,
            Telegram: `https://t.me/share/url?url=${encodeURIComponent(infoLink)}&text=${encodeURIComponent(infoLink)}`
        };
        return navigatorLink?.[socialType];
    };

    const getGenderValue = (key) => {
        const gender = GENDER_ENUM.find((g) => g.code === key);
        return gender ? gender.name : '';
    };

    const onCopyHandler = async () => {
        await navigator.clipboard.writeText(infoLink);
        toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Copy to clipboard', life: 3000 });
    };

    const dispatch = useDispatch();
    const loggedIn = useSelector((state) => state.auth.isLoggedIn);

    const handleContactClick = () => {
        if (!loggedIn) {
            dispatch(openPopupLogin());
            return;
        }

        setOpenInvitationToApplyPopup(true);
    };

    const getFullName = (data) => {
        if (data?.length < 32) {
            return data;
        } else {
            return data?.substring(0, 30) + '...';
        }
    };
    const tiktok = socials?.find((item) => item.socialNetworkName == 'Tiktok');

    const handleAnalysis = () => {
        // if (getStorage?.role === 'KOLIFL') {
        //     confirmDialog({
        //         message: 'Để sử dụng tính năng này, bạn cần đăng nhập hoặc đăng ký bằng tài khoản Nhà tuyển dụng. Hoặc liên hệ hỗ trợ qua sđt/zalo: 0383050533',
        //         header: 'Vui lòng đăng nhập tài khoản "Nhà Tuyển dụng"',
        //         rejectLabel: 'Đóng',
        //         className: 'custom-confirmDialog-pricing'
        //     });
        //     return;
        // }
        if (!initData?.username) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Dữ liệu trống', life: 3000 });
            return;
        }

        setUserName(initData?.username);
        setVisibleSidebar(true);
    };

    const handleBuy = async (serviceName, id, price, serviceOption = 'AVAILABLE') => {
        if (!loggedIn) {
            dispatch(openPopupLogin());
            return;
        }

        if (getStorage?.role === 'KOLIFL') {
            confirmDialog({
                message: 'Để sử dụng tính năng này, bạn cần đăng nhập hoặc đăng ký bằng tài khoản Nhà tuyển dụng. Hoặc liên hệ hỗ trợ qua sđt/zalo: 0383050533',
                header: 'Vui lòng đăng nhập tài khoản "Nhà Tuyển dụng"',
                rejectLabel: 'Đóng',
                className: 'custom-confirmDialog-pricing'
            });
            return;
        }

        // if (!!id && serviceOption == 'AVAILABLE' && getStorage?.role === 'REC' && !!getStorage?.accountId) {
        //     const bookingIsset = await bookings
        //         .checkBookingIsset(id)
        //         .then((data) => data?.data?.code == 'success' && data?.data?.data?.booking)
        //         .catch((err) => {
        //             console.error(err);
        //             toast.current.show({ severity: 'error', summary: 'Error', detail: 'Dữ liệu trống', life: 3000 });
        //             return;
        //         });

        //     if (bookingIsset) {
        //         toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Bạn đang có một giao dịch với KOC, KOL này. Vui lòng kiểm tra Đơn hàng', life: 3000 });
        //         return;
        //     }
        // }

        if (serviceOption !== 'AVAILABLE') {
            window.location.href = `/components/requirement-basic?kolId=${initData?.accountId}&serviceOption=UNAVAILABLE`;
            return;
        }
        window.location.href = `/components/requirement-basic?serviceType=${serviceName}&serviceId=${id}&price=${price}&kolId=${initData?.accountId}&serviceOption=${serviceOption}`;
    };

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className={`layout-main page-profile ${theme}`}>
                <BannerReferrals />
                <div className={'card lx:p-5 lg:p-5 p-3'}>
                    <div className="main-content">
                        <div className="block-content-detail-candidate grid lg:w-10 lx:w-10 w-full candidate-summary">
                            <div className="lx:col-4 lg:col-4 md:col-4 col-12 text-center image-cover">
                                <div>
                                    {initData.profileImage != null ? (
                                        <img style={{ maxHeight: '400px', objectFit: 'cover' }} className="w-full" src={DEV_URL + initData.profileImage} alt="Kols" />
                                    ) : (
                                        <img src={`${contextPath}/demo/images/avatar/no-avatar.png`} className="my-3 mx-0 avt-img wfa" alt={'img'} />
                                    )}
                                </div>
                            </div>
                            <div className="lx:col-7 lg:col-7 md:col-7 col-12 lx:col-offset-1 lg:col-offset-1 md:col-offset-1">
                                <span
                                    className="kol-name md:mb-8 mb-3 md:mt-6 block"
                                    onMouseEnter={() => {
                                        setHoverName(true);
                                    }}
                                    onMouseLeave={() => {
                                        setHoverName(false);
                                    }}
                                >
                                    {hoverName ? (
                                        <div>
                                            <div className="kol-name-popup">
                                                <div className="kol-name-popup-content">{initData.fullName}</div>
                                            </div>
                                            <span>{getFullName(initData.fullName)}</span>
                                        </div>
                                    ) : (
                                        getFullName(initData.fullName)
                                    )}
                                </span>
                                <div className="flex candidate-social">
                                    <a href={formatUrlExact(initData?.tiktokUrl)} target="_blank">
                                        <div className="icon-inner">
                                            <img width="48" height="48" src={`${contextPath}/demo/images/social/icon-tiktok.svg`} />
                                        </div>
                                    </a>
                                    <div onClick={() => handleAnalysis()} className="button-detail-candidate">
                                        Phân tích
                                    </div>
                                </div>
                                {!!initData && initData?.description && <div className="mt-3 description">{initData.description}</div>}
                                <div className="mt-4">
                                    {initData.careerFields?.map((e) => (
                                        <Chip className="text-base mr-2 mb-2" label={e.value} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <ImagesCandidate title={initData.fullName} images={initData.galleryImages} />
                        <div className="block-content-detail-candidate lx:w-10 lg:w-10 w-full lx:p-5 lg:p-5 p-3 my-0 mx-auto kol-detail-infor-card">
                            <div className="grid">
                                {!!initData && initData?.personalServices?.length > 0 && (
                                    <div className="box-services col-12">
                                        <div>
                                            <h3 className="font-bold flex align-items-center justify-content-center text-white uppercase text-center">
                                                Gói dịch vụ{' '}
                                                {isShowPayment && (
                                                    <span onClick={() => setVisibleModal(true)} className="capitalize font-normal ml-2 cursor-pointer hover:underline">
                                                        <i style={{ marginBottom: '2px' }} className="pi vertical-align-middle pi-info-circle"></i> Giải thích!
                                                    </span>
                                                )}
                                            </h3>
                                            <div className="grid">
                                                {initData?.personalServices?.map((value, index) => {
                                                    return (
                                                        <div key={index} className="lg:col-6 col-12">
                                                            <div className="item-service w-full bg-white border-round shadow-1 p-3">
                                                                <div className="flex w-full justify-content-between">
                                                                    <h3 className="name mb-0 font-bold">{value?.serviceName}</h3>
                                                                    <span className="font-bold text-xl price-service">{formatCurrencyVND(value?.price)}</span>
                                                                </div>
                                                                <div className="description-service line-clamp-2 mb-3 mt-2 text-color text-sm text-gray-300">{value?.description}</div>
                                                                <div className="text-right">
                                                                    <Button onClick={() => handleBuy(value?.serviceName, value?.id, value?.price)} className="bg-blue-500 border-blue-500" label={isShowPayment ? "Mua ngay":"Liên hệ"} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="text-center text-lg text-white mt-2">
                                                Bạn muốn đàm phán giá?{' '}
                                                <a onClick={() => isShowPayment && handleBuy(0, 0, 0, 'UNAVAILABLE')} className="cursor-pointer font-bold text-white">
                                                    Hãy gửi gói dịch vụ mới
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="lg:col-6 lx:col-6 col-12">
                                    <div className="box-campaign px-3 lx:px-6 lg:px-6 py-4">
                                        <h3 className="text-center">Đã tham gia</h3>
                                        <div className="box-campain-content">
                                            <div className="box-campain-content-inner">
                                                <p>{participatedJobs.length}</p>
                                                <p>Chiến dịch</p>
                                            </div>
                                        </div>
                                        <div className="center-item mt-4">
                                            <Button iconPos="right" icon="pi pi-chevron-right" className="center-item p-button work-participated-button w-full" label="Công việc đã tham gia" onClick={() => setOpenParticipatedJobPopup(true)} />
                                            <ParticipatedJobs participatedJobs={participatedJobs} openParticipatedJobPopup={openParticipatedJobPopup} setOpenParticipatedJobPopup={setOpenParticipatedJobPopup} />
                                        </div>
                                    </div>
                                    {/* <Button
                                        icon={<i className={classNames('pi', 'pi-exclamation-triangle', 'mr-2')} />}
                                        label="Báo cáo cho chúng tôi biết nếu bạn thấy vi phạm"
                                        onClick={() => setOpenReportCandidatePopup(true)}
                                        className="p-button report-button-candidate flex w-full"
                                    ></Button> */}
                                </div>
                                <div className="lg:col-6 lx:col-6 col-12">
                                    <ReviewCandidate kolName={initData.fullName} accountId={initData.accountId} hasNewComment={hasNewComment} setHasNewComment={setHasNewComment} />
                                </div>
                                {/* <div className="lg:col-3 lx:col-7 col-12">
                                    <div className="box-share-job px-3 lx:px-7 lg:px-7 py-4">
                                        <h3 className="text-center">Chia sẻ thông tin</h3>
                                        <p>Sao chép đường dẫn</p>
                                        <div className="box-copy flex align-items-center">
                                            <div className="pl-0 url-copy">
                                                <InputText value={infoLink} disabled className={'w-full'}></InputText>
                                            </div>
                                            <div className="btn-copy-inner" onClick={onCopyHandler}>
                                                <i className="pi pi-copy" style={{ fontSize: '1rem' }}></i>
                                            </div>
                                        </div>
                                        <p className="mt-3">Chia sẻ qua mạng xã hội:</p>
                                        <div className="box-share mb-4">
                                            <i className="company-icon pi pi-facebook cursor-pointer" onClick={(e) => onRedirectToSharingHandler('Facebook')}></i>
                                            <i className="company-icon pi pi-twitter cursor-pointer" onClick={(e) => onRedirectToSharingHandler('Twitter')}></i>
                                            <i className="company-icon pi pi-linkedin cursor-pointer" onClick={(e) => onRedirectToSharingHandler('Linkedin')}></i>
                                            <i className="company-icon pi pi-telegram cursor-pointer" onClick={(e) => onRedirectToSharingHandler('Telegram')}></i>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <ListComment service={service} hasNewComment={hasNewComment} />
                        {/* <div className="center-item related-candidates">
                            <h2 className="center-item font-bold mt-5">Những người mà bạn có thể quan tâm</h2>
                            <RelatedCandidates />
                        </div> */}
                    </div>
                </div>
            </div>
            <ReportCandidate initData={initData} openReportCandidatePopup={openReportCandidatePopup} setOpenReportCandidatePopup={setOpenReportCandidatePopup} />
            <InvitationToApply initData={initData} openInvitationToApplyPopup={openInvitationToApplyPopup} setOpenInvitationToApplyPopup={setOpenInvitationToApplyPopup} />
            <SidebarTiktok visibleSidebar={visibleSidebar} setVisibleSidebar={setVisibleSidebar} username={userName} />
            <Dialog className="custom-modal-service" header="Sau khi tôi mua gói dịch vụ sẽ như thế nào?" visible={visibleModal} onHide={() => setVisibleModal(false)}>
                <div className="modal-content-scroll">
                    <div className="how-it-works-step">
                        <div className="how-it-works-img-holder how-it-works-img-holder-after">
                            <img className="how-it-works-img" src={`${contextPath}/demo/images/candidate/money.svg`} alt="Money icon" />
                        </div>
                        <div className="how-it-works-txt">Khoản thanh toán của bạn sẽ được tạm giữ trong 07 ngày để chờ KOC, KOL chấp nhận lời đề nghị.</div>
                    </div>
                    <div className="how-it-works-step">
                        <div className="how-it-works-img-holder how-it-works-img-holder-after">
                            <img className="how-it-works-img" src={`${contextPath}/demo/images/candidate/chat.svg`} alt="Money icon" />
                        </div>
                        <div className="how-it-works-txt">Trao đổi, nhắn tin với KOC, KOL trên MYKOL để thảo luận công việc.</div>
                    </div>
                    <div className="how-it-works-step">
                        <div className="how-it-works-img-holder">
                            <img className="how-it-works-img" src={`${contextPath}/demo/images/candidate/check.svg`} alt="Money icon" />
                        </div>
                        <div className="how-it-works-txt">Nhận kết quả công việc theo yêu cầu và phê duyệt khoản thanh toán cho KOC, KOL.</div>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default DetailCandidate;

export async function getServerSideProps(context) {
    const res = await new GlobalService().getDetailKols(context?.query?.mask, context?.query?.id);
    const dataSeo = {
        title: !!res?.data?.data?.fullName ? res?.data?.data?.fullName : '',
        description: res?.data?.data?.description?.slice(0, 150) ?? '',
        image: DEV_URL + res?.data?.data?.profileImage ?? '',
        ogType: 'profile'
    };
    return {
        props: {
            dataSeo: dataSeo
        }
    };
}
