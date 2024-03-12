import React, { useEffect, useRef, useState } from 'react';
import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Chip } from 'primereact/chip';
import HeaderSearchRecruitment from './HeaderSearchRecruitment';
import { MultiSelect } from 'primereact/multiselect';
import { ACTIVITY_PLATFORM_ENUM, AGE_ENUM, DEV_URL, GENDER_ENUM, WAGE_ENUM,convertAcronym,convertToSlug } from '../../../src/commons/Utils';
import { useFormik } from 'formik';
import { GlobalService } from '../../../demo/service/GlobalService';
import { Paginator } from 'primereact/paginator';
import moment from 'moment/moment';
import { useDispatch, useSelector } from 'react-redux';
import HeartButton from '../homepage/filter-recruitment/HeartButton';
import { KolRecruitmentService } from '../../../demo/service/KolRecruitmentService';
import { login } from '../../../public/reduxConfig/authSlice';
import { Toast } from 'primereact/toast';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';

const SearchRecruitment = () => {
    const loggedIn = useSelector((state) => state.auth.isLoggedIn);
    const service = new GlobalService();
    const pageSizeDefault = 12;
    const toast = useRef(null);

    const [dataViewValue, setDataViewValue] = useState(null);
    const [layout, setLayout] = useState('grid');
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [showDiv, setShowDiv] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeDefault);
    const [changing, setChanging] = useState(false);
    const recruitmentService = new KolRecruitmentService();
    const dispatch = useDispatch();

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

    const onPageChange = (event) => {
        setPage(event.page + 1);
        setPageSize(event.rows);
        setChanging(!changing);
    };

    const formik = useFormik({
        initialValues: {
            recGenderRequests: undefined,
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
                    setDataViewValue(content);
                    setPageSize(res.data.data.content?.length);
                    setTotalRecords(res.data.data.totalElements);
                } else {
                    setDataViewValue([]);
                }
            } catch (e) {
                console.log(e);
            }
        }
    });

    const panelHeaderTemplate = () => null; // return an empty template

    const handleRemoveAllFilter = () => {
        formik.resetForm();
    };

    useEffect(async () => {
        try {
            await callAPI(loggedIn);
        } catch (e) {
            console.log(e);
        }
    }, [formik.values.recGenderRequests, formik.values.rangeOfSalaries, formik.values.socialNetworks, formik.values.careerFieldRequests, formik.values.recLocationRequests, changing, loggedIn, createInterested]);

    const callAPI = async (isLoggedIn) => {
        const status = {
            false: await callAPIWithoutToken,
            true: await callAPIWithToken
        };
        return status?.[isLoggedIn]?.();
    };

    const callAPIWithoutToken = async () => {
        if (!formik.values.kolsInfluencerName) {
            const res = await service.searchRecruitment({ ...formik.values, page: page, recordPage: pageSize });
            if (res.data.code === 'success') {
                let content = res.data.data.content;
                setDataViewValue(content);
                setTotalRecords(res.data.data.totalElements);
            } else {
                setDataViewValue([]);
            }
        }
    };

    const callAPIWithToken = async () => {
        if (!formik.values.kolsInfluencerName) {
            const res = await service.searchRecruitmentWithToken({ ...formik.values, page: page, recordPage: pageSize });
            if (res.data.code === 'success') {
                let content = res.data.data.content;
                setDataViewValue(content);
                setTotalRecords(res.data.data.totalElements);
            } else {
                setDataViewValue([]);
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
                severity: 'success',
                summary: 'Thông báo',
                detail: res.data.message,
                life: 2000
            });
        }
    };

    const dataViewHeader = (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div className="sub-dataview-header">
                    <HeaderSearchRecruitment formik={formik} showDiv={showDiv} setShowDiv={setShowDiv} setPage={setPage}/>
                    {showDiv && (
                        <div className="flex flex-wrap justify-content-between align-items-center gap-3 lx:px-5 lg:px-5 p-3 lx:py-5 lg:py-5 filter-advance bg-white">
                            <span>Lọc nâng cao</span>
                            <MultiSelect
                                value={formik.values.recGenderRequests}
                                onChange={(e) => {
                                    formik.setFieldValue('recGenderRequests', e.target.value);
                                    setPage(1);
                                }}
                                options={GENDER_ENUM}
                                optionLabel="name"
                                display="chip"
                                placeholder="Giới tính"
                                maxSelectedLabels={3}
                                className="items-input-filter-advanced"
                                showSelectAll={false}
                                panelHeaderTemplate={panelHeaderTemplate}
                            />
                            <MultiSelect
                                value={formik.values.rangeOfSalaries}
                                onChange={(e) => {
                                    formik.setFieldValue('rangeOfSalaries', e.target.value);
                                    setPage(1);
                                }}
                                options={WAGE_ENUM}
                                optionLabel="name"
                                display="chip"
                                showSelectAll={false}
                                panelHeaderTemplate={panelHeaderTemplate}
                                placeholder="Mức lương"
                                maxSelectedLabels={3}
                                className="items-input-filter-advanced"
                            />
                            <MultiSelect
                                value={formik.values.socialNetworks}
                                onChange={(e) => {
                                    formik.setFieldValue('socialNetworks', e.target.value);
                                    setPage(1);
                                }}
                                options={ACTIVITY_PLATFORM_ENUM}
                                optionLabel="name"
                                display="chip"
                                showSelectAll={false}
                                panelHeaderTemplate={panelHeaderTemplate}
                                placeholder="Nền tảng"
                                maxSelectedLabels={3}
                                className="items-input-filter-advanced"
                            />
                            <div className="flex-grow-1 text-right">
                                <Button icon="pi pi-reply" onClick={handleRemoveAllFilter} label="Xóa chọn"
                                        className="p-button remove-filter"></Button>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );

    const dataViewListItem = (data) => {
        return (
            <div className="col-12 mx-auto lg:px-3 px-2" key={data.id}>
                    <div className="flex align-items-start flex-wrap lg:p-3 p-3 sm:px-0 px-0 w-full justify-content-between relative mb-2 cursor-pointer">
                        <Link href={
                            {
                                pathname: '/components/company/recruitment-detail/[mask]/[id]',
                                query: { mask: convertToSlug(data.mask), id: data.recruitmentId }
                            }
                        }>
                            <div className="flex align-items-start flex-wrap lg:p-3 p-3 sm:px-0 px-0 w-full justify-content-between shadow-one-recruiment relative mb-2" >
                                <img src={`${DEV_URL}${data.profileImage}`} alt={'Loading'} width={116} height={116} className="images shadow-1 mr-3 cursor-pointer"  style={{'object-fit': 'contain'}}/>
                                <div className="info flex-1 flex flex-column md:text-left pr-4">
                                    <div className="font-bold mb-2 text-2xl">
                                        <a className="font-bold mb-2 md:mt-3 font-size-title cursor-pointer recruitment-title">
                                            {data.jobTitle.slice(0, 45)}
                                            {data.jobTitle.length > 45 && <span>...</span>}
                                        </a>
                                    </div>
                                    <div className="flex align-items-center mt-2 mb-2 text-2xl">
                                        <div className="flex align-items-center mt-2 mb-2 text-2xl">
                                            {data.recSocialNetworks?.map((e) => {
                                                switch (e.value) {
                                                    case 'Facebook':
                                                        return <i className="fab fa-square-facebook mr-3" key={`${e.key}`}></i>;
                                                    case 'Tiktok':
                                                        return <i className="fab fa-tiktok mr-3" key={`${e.key}`}></i>;
                                                    case 'Youtube':
                                                        return <i className="fab fa-youtube mr-3" key={`${e.key}`}></i>;
                                                    case 'Instagram':
                                                        return <i className="fab fa-instagram mr-3" key={`${e.key}`}></i>;
                                                }
                                            })}
                                        </div>
                                    </div>
                                    {!isMobile && (
                                        <div className="flex align-items-center mt-2">
                                            {
                                                data.recLocations?.length == 63 ?
                                                    <Chip className="mr-2" key={`all`} label={'Tất cả tỉnh thành'} /> :
                                                    data.recLocations?.slice(0, 1).map((e) => (
                                                        <Chip className="mr-2" key={`${e.key}`} label={convertAcronym(e.value)} />
                                                    ))
                                            }

                                            <Chip className="mr-2" label={'Hạn nộp hồ sơ: ' + moment(data.expirationDate).format('DD/MM/YYYY')} />
                                        </div>
                                    )}
                                </div>

                                {isMobile && (
                                    <div className="filter-recruiment-col-detail-tags w-full mt-2">
                                        {
                                            data.recLocations?.length == 63 ?
                                                <Chip className="mr-2 text-sm mb-2" key={`all`} label={'Tất cả tỉnh thành'} /> :
                                                data.recLocations?.slice(0, 1).map((e) => (
                                                    <Chip className="mr-2 text-sm mb-2" key={`${e.key}`} label={convertAcronym(e.value)} />
                                                ))
                                        }
                                        <Chip className="mr-2 text-sm mb-2" label={'Hạn nộp hồ sơ: ' + moment(data.expirationDate).format('DD/MM/YYYY')} />
                                    </div>
                                )}
                            </div>
                        </Link>
                        {loggedIn && isRoleEqualKol() && <HeartButton data={data.isInterested} recruitmentId={data.recruitmentId} onJobSaving={onJobSaving} />}
                    </div>
            </div>
        );
    };

    const itemTemplate = (data) => {
        if (!data) {
            return;
        }
        return dataViewListItem(data);
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="surface-0 flex justify-content-center">
                <div id="home" className="landing-wrapper overflow-hidden page-search-recruitments w-full">
                    <div
                        id="hero"
                        className="flex flex-column xl:flex-row lg:flex-row pt-4 px-4 lg:px-8 overflow-hidden search-recruitment"
                        style={{
                            background: '#FFEDEF'
                        }}
                    >
                        <img className="threedot1" src={`${contextPath}/demo/images/list-recruitments/threedot1.svg`} alt="logo" />
                        <img className="threedot2" src={`${contextPath}/demo/images/list-recruitments/threedot1.svg`} alt="logo" />
                        <div className="rotate"></div>
                        <div className="md:mx-8 mt-0 md:mt-4 relative">
                            <h1 className="lg:text-6xl xl:text-6xl text-2xl text-gray-900 line-height-2">
                                <span className="font-light font-bold block cursor-default">Danh Sách Tin Tuyển Dụng</span>
                            </h1>
                        </div>
                        <div className="search-recruitments-banner flex justify-content-center md:justify-content-end mb:pb-8 lx:pb-8 lg:pb-8 relative">
                            <img src={`${contextPath}/demo/images/list-recruitments/banner.svg`} style={{ height: '554px' }} alt="Kols" className="w-auto" />
                        </div>
                    </div>

                    <div className="col-12 p-0 filter-recruitment">
                        <DataView
                            value={dataViewValue}
                            layout={layout}
                            itemTemplate={itemTemplate}
                            header={dataViewHeader}
                            emptyMessage={'Không tìm thấy kết quả phù hợp'}
                        >
                        </DataView>
                        <Paginator first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchRecruitment;
