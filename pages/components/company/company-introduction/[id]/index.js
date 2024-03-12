import React, { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { GlobalService } from 'demo/service/GlobalService';
import getConfig from 'next/config';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { LayoutContext } from '../../../../../layout/context/layoutcontext';
import Link from 'next/link';
import { convertAcronym, convertToSlug, DEV_URL } from '../../../../../src/commons/Utils';
import { Chip } from 'primereact/chip';
import moment from 'moment/moment';
import HeartButton from '../../../homepage/filter-recruitment/HeartButton';
import { useDispatch, useSelector } from 'react-redux';
import { KolRecruitmentService } from '../../../../../demo/service/KolRecruitmentService';
import { Toast } from 'primereact/toast';
import { DataView } from 'primereact/dataview';
import { login } from '../../../../../public/reduxConfig/authSlice';
import { useFormik } from 'formik';
import {PAGE_SIZE_DEFAULT_12} from "../../../../../src/commons/Constant";

const CompanyIntroduction = () => {
    const loggedIn = useSelector((state) => state.auth.isLoggedIn);
    const service = new GlobalService();
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [companyInformation, setCompanyInformation] = useState([]);
    const [checkCopy, setCheckCopy] = useState(false);
    const router = useRouter();
    const [path, setPath] = useState([]);
    const { closeMenu } = useContext(LayoutContext);
    const [recruitments, setRecruitments] = useState([]);
    const [profileImage, setProfileImage] = useState('');
    const [layout, setLayout] = useState('grid');
    const toast = useRef(null);
    const recruitmentService = new KolRecruitmentService();
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT_12);
    const dispatch = useDispatch();
    const [changing, setChanging] = useState(false);

    const [createInterested, setCreateInterested] = useState(false);

    const checkLogin = () => {
        if (window.localStorage.getItem('accessToken')) {
            dispatch(login());
        }
    };

    const isRoleEqualKol = () => {
        const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
        return role == 'KOLIFL';
    };

    useEffect(() => {
        checkLogin();
    }, [dispatch]);

    const formik = useFormik({
        initialValues: {
            recGenderRequests: undefined,
            workingAgeRequests: undefined,
            rangeOfSalaries: undefined,
            socialNetworks: undefined,
            matchingJobs: '',
            careerFieldRequests: undefined,
            recLocationRequests: undefined
        },
        onSubmit: async (data) => {
            setPage(1);
            try {
                let res;
                if (loggedIn) {
                    res = await service.searchRecruitmentWithToken({
                        page: page,
                        recordPage: pageSizeDefault,
                        ...data
                    });
                } else {
                    res = await service.searchRecruitment({ page: page, recordPage: pageSizeDefault, ...data });
                }
                if (res.data.code === 'success') {
                    let content = res.data.data.content;
                    setRecruitments(content);
                    setPageSize(res.data.data.content?.length);
                    setTotalRecords(res.data.data.totalElements);
                } else {
                    setRecruitments([]);
                }
            } catch (e) {
                console.log(e);
            }
        }
    });

    useEffect(() => {
        try {
            // closeMenu();

            if (!router.isReady) {
                return;
            }

            // convert data to json
            setPath(window.location.href);

            // Get company information
            getCompanyInformation();

            callAPI(loggedIn);
        } catch (e) {
            console.log(e);
        }
    }, [formik.values.recGenderRequests, formik.values.rangeOfSalaries, formik.values.socialNetworks, formik.values.careerFieldRequests, formik.values.recLocationRequests, changing, loggedIn, createInterested, router]);

    //Get images avatar
    useEffect(() => {
        if (companyInformation.length === 0) return;
        setProfileImage(companyInformation.profileImage);
    }, [companyInformation]);

    const getCompanyInformation = async () => {
        const res = await service.findCompanyInformationByAccountId(router.query.id);
        if (res.data.code === 'success') {
            const content = res.data.data;
            setCompanyInformation(content);
        } else {
            setCompanyInformation([]);
        }
    };

    const callAPI = async (isLoggedIn) => {
        const status = {
            false: await callAPIWithoutToken,
            true: await callAPIWithToken
        };
        return status?.[isLoggedIn]?.();
    };

    const callAPIWithoutToken = async () => {
        if (!formik.values.kolsInfluencerName) {
            const res = await service.searchRecruitment({ ...formik.values, companyId: router.query.id });
            if (res.data.code === 'success') {
                let content = res.data.data.content;
                setRecruitments(content);
                setTotalRecords(res.data.data.totalElements);
            } else {
                setRecruitments([]);
            }
        }
    };

    const callAPIWithToken = async () => {
        if (!formik.values.kolsInfluencerName) {
            const res = await service.searchRecruitmentWithToken({ ...formik.values, companyId: router.query.id });
            if (res.data.code === 'success') {
                let content = res.data.data.content;
                setRecruitments(content);
                setTotalRecords(res.data.data.totalElements);
            } else {
                setRecruitments([]);
            }
        }
    };

    const onJobSaving = async (recruitmentId) => {
        const res = await recruitmentService.onJbSaving({ recruitmentId: recruitmentId });
        if (res.data.code === 'success') {
            setCreateInterested(!createInterested);
            toast.current.show({
                severity: 'success',
                summary: 'Thông báo',
                detail: res.data.message,
                life: 1000
            });
        } else {
            toast.current.show({
                severity: 'error',
                summary: 'Thông báo',
                detail: res.data.message,
                life: 1000
            });
        }
    };

    const socialNetworkHandler = (param) => {
        const socialNetwork = {
            Facebook: <i className="fab fa-square-facebook mr-3" key={param.key} />,
            Tiktok: <i className="fab fa-tiktok mr-3" key={param.key} />,
            Youtube: <i className="fab fa-youtube mr-3" key={param.key} />,
            Instagram: <i className="fab fa-instagram mr-3" key={param.key} />
        };
        return socialNetwork[param];
    };

    const saveUrlToClipBoard = () => {
        navigator.clipboard.writeText(path);
        setCheckCopy(true);
    };
    const gridItem = (data) => {
        return (
            <div className="col-12 px-1 item-card-filter-recruiment filter-recruiment-col relative">
                <div className="flex justify-content-between align-items-start flex-wrap p-3 w-full shadow-one-recruiment mb-2">
                    <Link
                        href={{
                            pathname: '/components/company/recruitment-detail/[mask]/[id]',
                            query: { mask: convertToSlug(data.mask), id: data.recruitmentId }
                        }}
                    >
                        <div className="flex justify-content-between align-items-start flex-wrap w-full">
                            <img src={`${DEV_URL}${data.profileImage}`} alt={'Loading'} width={84} height={84} className="images shadow-2 cursor-pointer obj-fit-cover" />
                            <div className="info md:text-left">
                                <div className="recruitment-title-wrapper lg:mb-3 mb-2">
                                    <Link
                                        href={{
                                            pathname: '/components/company/recruitment-detail/[mask]/[id]',
                                            query: { mask: convertToSlug(data.mask), id: data.recruitmentId }
                                        }}
                                    >
                                        <a target="_blank" className="font-bold mb-2 text-lg cursor-pointer recruitment-title">
                                            {data.jobTitle}
                                        </a>
                                    </Link>
                                </div>
                                {data.recSocialNetworks ? <div className="social flex align-items-center mt-2 mb-2 text-2xl">{data.recSocialNetworks?.map((e) => socialNetworkHandler(e.value))}</div> : ''}
                            </div>
                            <div className="tags flex-wrap flex align-items-center mt-3">
                                {data.recLocations?.length == 63 ? (
                                    <Chip className="mr-2 " key={`all`} label={'Tất cả tỉnh thành'} />
                                ) : (
                                    data.recLocations?.slice(0, 1).map((e) => <Chip className="mr-2" key={`${e.key}`} label={convertAcronym(e.value)} />)
                                )}
                                <Chip className="mr-2" label={'Hạn nộp hồ sơ: ' + moment(data.expirationDate).format('DD/MM/YYYY')} />
                            </div>
                        </div>
                    </Link>
                    {true && isRoleEqualKol() && <HeartButton data={data.isInterested} recruitmentId={data.recruitmentId} onJobSaving={onJobSaving} />}
                </div>
            </div>
        );
    };

    const saveSuccess = (data) => {
        if (data) {
            return (
                <div>
                    <div className={'company-save-success'}>Sao chép thành công</div>
                </div>
            );
        }
    };

    return (
        <>
            <React.Fragment>
                <Toast ref={toast} />
                <div className="company-background">
                    <div
                        className="banner-company company-body"
                        style={{
                            borderRadius: `0px`
                        }}
                    >
                        {companyInformation?.galleryImages != null && companyInformation?.galleryImages.length > 0 ? (
                            <img className="banner-image flex" src={`${DEV_URL}${companyInformation.galleryImages[0]}`} />
                        ) : (
                            <img className="banner-image flex" src={`${contextPath}/demo/images/banner/banner.svg`} alt="Logo" />
                        )}
                    </div>
                    <div
                        className="col-12 company-body company-header"
                        style={{
                            borderRadius: `0px`
                        }}
                    >
                        <img className="avatar" src={!!profileImage ? `${DEV_URL + profileImage}` : `${contextPath}/demo/images/avatar/no-avatar.png`} />
                        <div className="info">
                            <div className="company-name">{companyInformation.companyName}</div>
                            <span className="flex company-size-addresses" style={{ marginLeft: '256px' }}>
                                {companyInformation.personnelSize && (
                                    <span className="company-size">
                                        <i className="pi pi-building" style={{ marginRight: '0.5rem', color: '#42a4ff' }}></i>
                                        {companyInformation.personnelSize}
                                    </span>
                                )}
                                <span className="company-addresses">
                                    <i className="pi pi-map-marker" style={{ marginRight: '0.5rem', color: '#42a4ff' }}></i>
                                    {companyInformation.specificAddress}
                                </span>
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap company-body-content">
                        <div className="w-full md:pr-3 md:w-8">
                            <div className={'company-body company-description'}>
                                <div className={'company-header-text'}>Giới thiệu công ty</div>
                                <div className="description company-description-detail">{companyInformation.description}</div>
                            </div>

                            <div className={'company-body company-description mt-2 md:mt-5 py-5'}>
                                <div className={'company-header-text'}>Thông tin liên hệ</div>

                                <div className={'company-contact-info'}>
                                    <p>
                                        <span className={'company-contact-label'}>Người liên hệ</span>
                                        {companyInformation.contactName}
                                    </p>
                                    <p>
                                        <span className={'company-contact-label'}>Email liên hệ</span>
                                        {companyInformation.contactEmail}
                                    </p>
                                    <p>
                                        <span className={'company-contact-label'}>Điện thoại</span>
                                        {companyInformation.contactPhone}
                                    </p>
                                    {companyInformation.website && (
                                        <p>
                                            <span className={'company-contact-label'}>Website</span>
                                            <a className={'company-contact-label-link'} href={companyInformation.website} target="_blank">
                                                {companyInformation.website}
                                            </a>
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className={'company-body company-description company-recruitment mt-2 md:mt-5 py-5'}>
                                <div className={'company-header-text pl-3 md:pl-0'}>Tuyển dụng</div>
                                <DataView value={recruitments} layout={layout} itemTemplate={gridItem} emptyMessage={'Không tìm thấy kết quả phù hợp'}></DataView>
                            </div>
                        </div>
                        <div className="w-full md:pl-3 md:w-4">
                            <div className={'company-right-column-share-information'}>
                                <div className={'company-left-column-header'}>
                                    <span>Chia sẻ thông tin</span>
                                </div>
                                <div className={'company-right-column-copy-link'}>Sao chép thông tin</div>
                                {saveSuccess(checkCopy)}
                                <InputText value={path} disabled className={'company-right-column-input-text'}></InputText>
                                <Button icon={'pi pi-copy'} className={'company-right-column-button'} onClick={() => saveUrlToClipBoard()} />
                                <div className={'company-right-column-share-to-social-network-text'}>Chia sẻ qua mạng xã hội</div>
                                <a href={'https://www.facebook.com/sharer/sharer.php?u=' + path} target={'_blank'}>
                                    <i className="pi pi-facebook company-icon" />
                                </a>
                                <a href={'https://twitter.com/intent/tweet?url=' + path} target={'_blank'}>
                                    <i className="company-icon pi pi-twitter"></i>
                                </a>
                                <a href={'https://www.linkedin.com/cws/share?url=' + path} target={'_blank'}>
                                    <i className="company-icon pi pi-linkedin"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        </>
    );
};

export default CompanyIntroduction;
