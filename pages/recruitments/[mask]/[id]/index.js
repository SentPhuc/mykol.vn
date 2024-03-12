import React, { useContext, useEffect, useRef, useState } from 'react';
import linkifyHtml from 'linkify-html';
import { useRouter } from 'next/router';
import { GlobalService } from '../../../../demo/service/GlobalService';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import moment from 'moment';
import BreadcrumbCustom from '../../../commons/BreadcrumbCustom';
import { OverlayPanel } from 'primereact/overlaypanel';
import ReportRecruitment from './ReportRecruitment';
// import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { DEV_URL } from '../../../../src/commons/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../../public/reduxConfig/authSlice';
import { KolRecruitmentService } from '../../../../demo/service/KolRecruitmentService';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import { openPopupLogin } from './../../../../public/reduxConfig/loginSlice';
import { ProgressSpinner } from 'primereact/progressspinner';
import getConfig from 'next/config';
import PopupContact from './PopupContact';

const RecruitmentDetail = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const service = new GlobalService();
    // const { closeMenu } = useContext(LayoutContext);
    const location = useRouter().pathname;
    const [recruitmentDetail, setRecruitmentDetail] = useState({});
    const [recruitmentCarerField, setRecruitmentCarerField] = useState([]);
    const [recruitmentSocialNetworks, setRecruitmentSocialNetworks] = useState([]);
    const [recruitmentLocation, setRecruitmentLocation] = useState([]);
    const [companyDescription, setCompanyDescription] = useState([]);
    const [companyInformation, setCompanyInformation] = useState([]);
    const [openReportCandidatePopup, setOpenReportCandidatePopup] = useState(false);
    const [createInterested, setCreateInterested] = useState(false);
    const [visiblePopupContact, setVisiblePopupContact] = useState(false);
    const router = useRouter();
    const [path, setPath] = useState([]);
    const toast = useRef(null);
    const op = useRef(null);
    const dispatch = useDispatch();
    const accountProfile = useSelector((state) => state.profiles);

    const recruitmentService = new KolRecruitmentService();
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    const logIn = useRef(false);

    const loggedIn = useSelector((state) => state.auth.isLoggedIn);

    const checkLogin = () => {
        if (window.localStorage.getItem('accessToken')) {
            dispatch(login());
            logIn.current = true;
        }
    };

    const isRecruitmentExpired = () => {
        const expiredDate = moment(recruitmentDetail.expirationDate);
        return expiredDate.isSameOrBefore(moment());
    };

    const isRoleEqualKol = () => {
        return role === 'KOLIFL';
    };

    useEffect(() => {
        checkLogin();
    }, [dispatch]);

    useEffect(async () => {
        // closeMenu();
        if (!router.isReady) {
            return;
        }
        const data = router.query;

        const res = await service.findRecruitmentDetailByMaskV2(data.mask, data.id, logIn.current);
        // convert data to json
        if (res.data.code === 'success') {
            const content = res.data.data;
            const resCompany = await service.findCompanyInformationByAccountId(content.accountId);
            if (resCompany.data.code === 'success') {
                const company = resCompany.data.data;
                setCompanyInformation(company);
                setCompanyDescription(company.description);
            } else {
                setCompanyInformation([]);
                setCompanyDescription([]);
            }

            setRecruitmentDetail(content);
            setRecruitmentCarerField(content.careerFields);
            setRecruitmentLocation(content.locations);
        } else {
            setRecruitmentDetail([]);
            setCompanyInformation([]);
            setRecruitmentCarerField([]);
            setRecruitmentLocation([]);
            setRecruitmentSocialNetworks([]);
            setCompanyDescription([]);
        }
    }, [router, createInterested]);

    useEffect(async () => {
        setPath(window.location.href);
    }, []);

    const saveUrlToClipBoard = () => {
        navigator.clipboard.writeText(path);
        toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Copy to clipboard', life: 3000 });
    };

    const showButton = () => {
        if (!loggedIn) return true;

        return isRoleEqualKol();
    };

    const [loading, setLoading] = useState(false);

    const onApplyHandle = async () => {
        if (!loggedIn) {
            dispatch(openPopupLogin());
            return;
        }

        if (!isRoleEqualKol()) {
            console.log('How can you open this?');
            return;
        }

        /**
         * Check user match with platfrom the job
         */
        const acc = accountProfile?.[0];

        if (acc?.fullName == null || acc?.phoneNumber == null || acc?.email == null || acc?.careerFields.length == 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Thông báo',
                detail: 'Bạn cần hoàn thành hồ sơ trước khi ứng tuyển công việc',
                life: 2000
            });
            setTimeout(() => {
                router.push('/components/profile/');
            }, 2000);
            return;
        }

        try {
            const res = await recruitmentService.onApply({ id: recruitmentDetail.id });
            if (res.data.code === 'success') {
                setCreateInterested(!createInterested);
                toast.current.show({
                    severity: 'success',
                    summary: 'Thông báo',
                    detail: res.data.message,
                    life: 1000
                });
                //redirect to chat box
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Thông báo',
                    detail: res.data.message,
                    life: 2000
                });
            }
        } catch (e) {
            toast.current.show({
                severity: 'error',
                summary: 'Thông báo',
                detail: 'Có lỗi xảy ra, vui lòng thử lại sau',
                life: 2000
            });
        }
    };

    const buttonApply = () => {
        if (!showButton()) return '';

        if (recruitmentDetail?.isApplied === true) {
            return (
                <Button className={'recruitment-text-button-first justify-content-center w-full'} disabled>
                    <i className={'pi pi-send recruitment-text-icon'}></i>
                    Đã ứng tuyển
                </Button>
            );
        } else {
            return (
                <div>
                    <Button className={'recruitment-text-button-second justify-content-center w-full'} disabled={isRecruitmentExpired()} onClick={() => onApplyHandle()}>
                        <i className={'pi pi-send recruitment-text-icon'}></i>
                        Ứng tuyển ngay
                    </Button>
                </div>
            );
        }
    };

    const buttonApplyBottom = () => {
        if (!showButton()) return '';

        if (recruitmentDetail?.isApplied === true) {
            return (
                <Button className={'recruitment-detail-button-left'} disabled>
                    <i className={'pi pi-send recruitment-text-icon'}></i>
                    Đã ứng tuyển
                </Button>
            );
        } else {
            return (
                <Button className={'recruitment-detail-button-left'} disabled={isRecruitmentExpired()} onClick={() => onApplyHandle(recruitmentDetail.recruitmentId)}>
                    <i className={'pi pi-send recruitment-text-icon'}></i>
                    Ứng tuyển ngay
                </Button>
            );
        }
    };

    // const buttonChatBox = () => {
    //     if (!showButton()) return '';

    //     return (
    //         <div>
    //             <Button className={'recruitment-text-button-third w-full justify-content-center'} onClick={() => onSendMessage(recruitmentDetail.recruitmentId)}>
    //                 <i className={'pi pi-heart-fill recruitment-text-icon'}></i>
    //                 Nhắn tin
    //             </Button>
    //         </div>
    //     );
    // };

    const buttonContact = () => {
        if (!showButton()) return '';

        return (
            <div>
                <Button className={'recruitment-text-button-third w-full justify-content-center'} onClick={handleContact}>
                    <i className={'pi pi-phone recruitment-text-icon'}></i>
                    Liên hệ
                </Button>
            </div>
        );
    };

    // const buttonChatBoxBottom = () => {
    //     if (!showButton()) return '';

    //     return (
    //         <Button className={'recruitment-detail-button-left chatbox'} onClick={() => onSendMessage(recruitmentDetail.recruitmentId)}>
    //             <i className={'pi pi-heart-fill recruitment-text-icon'}></i>
    //             Nhắn tin
    //         </Button>
    //     );
    // };

    const buttonContactBottom = () => {
        if (!showButton()) return '';

        return (
            <Button className={'recruitment-detail-button-right'} onClick={handleContact}>
                <i className={'pi pi-phone recruitment-text-icon'}></i>
                Liên hệ
            </Button>
        );
    };

    // const onSendMessage = async (recruitmentId) => {
    //     if (!loggedIn) {
    //         dispatch(openPopupLogin());
    //         return;
    //     }

    //     const res = await recruitmentService.onSendMessage({ id: recruitmentDetail.id });
    //     if (res.data.code === 'success') {
    //         setCreateInterested(!createInterested);
    //         toast.current.show({
    //             severity: 'success',
    //             summary: 'Thông báo',
    //             detail: res.data.message,
    //             life: 1000
    //         });
    //         //open new tab to chat
    //         window.open('/components/chat-box');
    //     } else {
    //         toast.current.show({
    //             severity: 'error',
    //             summary: 'Thông báo',
    //             detail: res.data.message,
    //             life: 2000
    //         });
    //     }
    // };

    const handleContact = () => {
        if (!loggedIn) {
            dispatch(openPopupLogin());
            return;
        }
        setVisiblePopupContact(true);
    };

    const onViewCompany = () => {
        window.open(`/components/company/company-introduction/${companyInformation.accountId}`);
    };

    return (
        <>
            <React.Fragment>
                {loading && (
                    <div className="overlay">
                        <ProgressSpinner className="progress-spinner" />
                    </div>
                )}
                <Toast ref={toast} />
                <div className={'recruitment-breadcrumb'}>
                    <BreadcrumbCustom path={location} />
                </div>
                <div className={'company-background'}>
                    <div className={'recruitment-body pb-0'}>
                        <div className={'flex md:p-5 p-3 md:align-items-center align-items-start justify-content-between flex-wrap header-detail-recruitment-detail'}>
                            <div className={'recruitment-avt-width-div'}>
                                <img src={recruitmentDetail?.imageCover ? `${DEV_URL}${recruitmentDetail.imageCover}` : `${contextPath}/demo/images/avatar/no-avatar.png`} alt={'logo-company'} className="avt-border" />
                            </div>
                            <div className={'info'}>
                                <div className={'recruitment-header ml-0 mt-0'}>
                                    <div className={'recruitment-job-title'}>{recruitmentDetail.jobTitle}</div>
                                    {!isMobile && (
                                        <>
                                            <div className={'recruitment-account-name text-primary'} onClick={onViewCompany}>
                                                {companyInformation.companyName}
                                            </div>

                                            <div className={'recruitment-expiration-date flex flex-wrap align-items-center'}>
                                                <div className="flex align-items-center white-space-nowrap mt-1">
                                                    <i className={'pi pi-clock'}></i>
                                                    <span className={'ml-2 recruitment-expiration-date-text'}>Hạn nộp hồ sơ {moment(recruitmentDetail.expirationDate).format('DD/MM/YYYY')}</span>
                                                </div>
                                                <div className="flex align-items-center white-space-nowrap md:ml-5 mt-1">
                                                    <i className={'pi pi-users'}></i>
                                                    <span className={'ml-2 recruitment-expiration-date-text'}>Đã ứng tuyển: {recruitmentDetail?.appliedQuantity + '/' + recruitmentDetail?.quantity}</span>
                                                </div>
                                                {recruitmentDetail?.hasProductSample && (
                                                    <div className="flex align-items-center white-space-nowrap md:ml-5 mt-1">
                                                        <i className={'pi pi-book'}></i>
                                                        <span className={'ml-2 recruitment-expiration-date-text'}>Sản phẩm mẫu miễn phí</span>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className={'recruitment-button'}>
                                    <div className={'recruitment-text w-full'}>
                                        {buttonApply()}
                                        {/* {buttonChatBox()} */}
                                        {buttonContact()}
                                    </div>
                                </div>
                            </div>
                            {isMobile && (
                                <div className={'info-mobile'}>
                                    <div className={'recruitment-header ml-0 mt-0'}>
                                        <div className={'recruitment-account-name text-lg font-bold mb-2'}>{companyInformation.companyName}</div>
                                        <div className={'recruitment-expiration-date flex align-items-center'}>
                                            <i className={'pi pi-clock mr-1'}></i>
                                            <span className={'recruitment-expiration-date-text'}>Hạn nộp hồ sơ {moment(recruitmentDetail.expirationDate).format('DD/MM/YYYY')}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={'recruitment-body pt-4'}>
                        <div className={'grid'}>
                            <div className={'md:col-7 col-12 recruitment-detail'}>
                                <div className={'recruitment-detail-header'}>Chi tiết tuyển dụng</div>
                                <div className={'recruitment-detail-title'}>
                                    <div className={'recruitment-detail-title-text'}>Thông tin chung</div>
                                </div>
                                <div className={'grid'}>
                                    <div className={'sm:col-6 col-12'}>
                                        <div className={'grid recruitment-detail-general-information'}>
                                            <i className={'pi pi-users recruitment-detail-icon col-6'}></i>
                                            <div className={'col-6'}>
                                                <div className={'recruitment-detail-description-title'}>Số lượng tuyển</div>
                                                <div className={'recruitment-detail-description-text'}>{recruitmentDetail.quantity} người</div>
                                            </div>
                                        </div>
                                        <div className={'grid recruitment-detail-general-information'}>
                                            <i className={'fa-solid fa-fire recruitment-detail-icon col-6'}></i>
                                            <div className={'col-6'}>
                                                <div className={'recruitment-detail-description-title'}>Lĩnh vực</div>
                                                <div className={'recruitment-detail-description-text'}>
                                                    {recruitmentCarerField.map((carrerField, key) => (
                                                        <span>
                                                            {carrerField.value}
                                                            {key + 1 < recruitmentCarerField.length && recruitmentCarerField.length > 1 ? ' | ' : ''}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={'sm:col-6 col-12'}>
                                        <div className={'grid recruitment-detail-general-information'}>
                                            <i className={'fa-solid fa-fire recruitment-detail-icon col-6'}></i>
                                            <div className={'col-6'}>
                                                <div className={'recruitment-detail-description-title'}>Hạn nộp hồ sơ</div>
                                                <div className={'recruitment-detail-description-text'}>{moment(recruitmentDetail.expirationDate).format('DD/MM/YYYY')}</div>
                                            </div>
                                        </div>
                                        <div className={'grid recruitment-detail-general-information'}>
                                            <i className={'pi pi-map-marker recruitment-detail-icon col-6'}></i>
                                            <div className={'col-6'}>
                                                <div className={'recruitment-detail-description-title'}>Địa điểm</div>
                                                <div className={'recruitment-detail-description-text'}>
                                                    <div>
                                                        {recruitmentLocation.length == 63 ? (
                                                            <span>Tất cả tỉnh thành</span>
                                                        ) : (
                                                            recruitmentLocation.map((location, key) => (
                                                                <span>
                                                                    {location}
                                                                    {key + 1 < recruitmentLocation.length && recruitmentLocation.length > 1 ? ' | ' : ''}
                                                                </span>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={'md:col-4 md:mt-3 col-12 px-3 sm:p-0 recruitment-detail-share-information-column'}>
                                <div className={'recruitment-detail-share-information'}>
                                    <div className={'recruitment-header'}>Chia sẻ thông tin</div>
                                    <div className={'recruitment-share-link'}>Sao chép thông tin</div>
                                    <InputText value={path} className={'recruitment-share-link-input-text'} disabled></InputText>
                                    <Button icon={'pi pi-copy'} className={'recruitment-share-link-button'} onClick={() => saveUrlToClipBoard()}></Button>
                                    <div className={'recruitment-share-link-text'}>Chia sẻ qua mạng xã hội</div>
                                    <div className={'recruitment-share-link-group-icon'}>
                                        <a href={'https://www.facebook.com/sharer/sharer.php?u=' + path} target={'_blank'}>
                                            <i className="recruitment-share-link-icon pi pi-facebook"></i>
                                        </a>
                                        <a href={'https://twitter.com/intent/tweet?url=' + path} target={'_blank'}>
                                            <i className="recruitment-share-link-icon pi pi-twitter"></i>
                                        </a>
                                        <a href={'https://www.linkedin.com/cws/share?url=' + path} target={'_blank'}>
                                            <i className="recruitment-share-link-icon pi pi-linkedin"></i>
                                        </a>
                                    </div>
                                </div>
                                <Button icon={'pi pi-exclamation-circle'} label={' Báo cáo cho chúng tôi biết nếu bạn thấy vi phạm'} className={'recruitment-detail-share-information-report'} onClick={() => setOpenReportCandidatePopup(true)} />
                            </div>
                        </div>

                        <div className={'recruitment-detail'}>
                            <div className={'recruitment-detail-title mt-0'}>
                                <div className={'recruitment-detail-title-text'}>Mô tả công việc</div>
                            </div>
                            <div className={'description recruitment-detail-body-text'}>
                                {recruitmentDetail.description ? <p dangerouslySetInnerHTML={{ __html: linkifyHtml(`${recruitmentDetail.description}`, { target: '_blank' }) }}></p> : 'Loading...'}
                            </div>
                            {recruitmentDetail.links && (
                                <>
                                    <div className={'recruitment-detail-title'}>
                                        <div className={'recruitment-detail-title-text'}>Link shop, link website, link sản phẩm trên Tiktok Shop</div>
                                    </div>
                                    <div className={'description recruitment-detail-body-text'}>
                                        {recruitmentDetail.links?.map((value, index) => {
                                            return (
                                                <a className="block mb-3" title={value} href={value} target="_blank" key={index}>
                                                    {value}
                                                </a>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            <div>
                                <div className={'recruitment-detail-title'}>
                                    <div className={'recruitment-detail-title-text'}>Cách thức ứng tuyển</div>
                                </div>

                                <div className={'description recruitment-detail-body-text'}>Ứng viên nộp hồ sơ trực tuyến bằng cách bấm Ứng tuyển ngay dưới đây.</div>

                                <div className={'recruitment-detail-button'}>
                                    {buttonApplyBottom()}
                                    {/* {buttonChatBoxBottom()} */}
                                    {buttonContactBottom()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={'recruitment-body'}>
                        <div className={'recruitment-detail-company-information'}>
                            <div className={'grid grid-nogutter align-items-center justify-content-between w-full'}>
                                <span className={'recruitment-detail-header'}>Giới thiệu công ty</span>
                                <span className={'recruitment-detail-more-information'}>
                                    <Link href={`/components/company/company-introduction/${companyInformation.accountId}`}>Xem trang công ty</Link>
                                </span>
                            </div>
                            <div className={'recruitment-detail-company-information-description'}>
                                {companyInformation?.description?.slice(0, 400)}
                                <span className={'recruitment-detail-show-more-button cursor-pointer'} onClick={(e) => op.current.toggle(e)}>
                                    ...Xem thêm
                                </span>
                                <OverlayPanel className={'recruitment-detail-show-more-button-overlay'} ref={op} showCloseIcon>
                                    <div className={'description'}>{companyDescription}</div>
                                </OverlayPanel>
                            </div>

                            <div>
                                {companyInformation.website && (
                                    <span className={'recruitment-detail-company-information-general'}>
                                        <a href={companyInformation.website} className={'recruitment-detail-company-information-general-link'} target="_blank">
                                            <i className={'pi pi-globe recruitment-detail-company-information-general-icon'} />
                                            {companyInformation.website}
                                        </a>
                                    </span>
                                )}
                                {companyInformation.personnelSize && (
                                    <span className={'recruitment-detail-company-information-general'}>
                                        <i className={'pi pi-building recruitment-detail-company-information-general-icon'} />
                                        {companyInformation.personnelSize}
                                    </span>
                                )}
                                <span className={'recruitment-detail-company-information-general'}>
                                    <i className={'pi pi-map-marker recruitment-detail-company-information-general-icon'} />
                                    {companyInformation.specificAddress}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {/*<FilterRecruitmentByCondition/>*/}
                <ReportRecruitment openReportCandidatePopup={openReportCandidatePopup} setOpenReportCandidatePopup={setOpenReportCandidatePopup} nameReport={recruitmentDetail.jobTitle} />
                <PopupContact visible={visiblePopupContact} setVisible={setVisiblePopupContact} recruitmentDetail={recruitmentDetail} setCreateInterested={setCreateInterested} />
                {/* {recruitmentDetail && loggedIn && isRoleEqualKol() ? <ApplieJobPopup recruitmentDetail={recruitmentDetail} openApplieJobPopup={openApplieJobPopup} setOpenApplieJobPopup={setOpenApplieJobPopup} appliedSuccess={appliedSuccess} /> : ''} */}
            </React.Fragment>
        </>
    );
};

export default RecruitmentDetail;

export async function getServerSideProps(context) {
    const res = await new GlobalService().findRecruitmentDetailByMaskV2(context?.query?.mask, context?.query?.id, false);
    const resCompany = await new GlobalService().findCompanyInformationByAccountId(res?.data?.data?.accountId);
    const dataSeo = {
        title: !!res?.data?.data?.jobTitle ? 'Recruits ' + res?.data?.data?.jobTitle + '| INFLUX' : '',
        description: res?.data?.data?.description?.slice(0, 150) ?? '',
        image: DEV_URL + resCompany?.data?.data?.profileImage ?? '',
        ogType: 'profile'
    };
    return {
        props: {
            dataSeo: dataSeo
        }
    };
}
