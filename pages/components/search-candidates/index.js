import React, { useEffect, useRef, useState } from 'react';
import getConfig from 'next/config';
import { DataView } from 'primereact/dataview';
import HeaderSearchCandidate from './HeaderSearchCandidate';
import { Chip } from 'primereact/chip';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { ACTIVITY_PLATFORM_ENUM, hanldeChangeParamURL, DEV_URL, GENDER_ENUM, NUMBER_OF_FOLLOWER_ENUM, filterParamURL, getParams } from '../../../src/commons/Utils';
import { Button } from 'primereact/button';
import { useFormik } from 'formik';
import { GlobalService } from '../../../demo/service/GlobalService';
import { Paginator } from 'primereact/paginator';
import { OverlayPanel } from 'primereact/overlaypanel';
import SocialComponent from './SocialComponent';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../public/reduxConfig/authSlice';
import { CompanyKolsInfluencerService } from '../../../demo/service/CompanyKolsInfluencerService';
import _ from 'lodash';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/router';
import { PAGE_SIZE_DEFAULT_12 } from '../../../src/commons/Constant';

const SearchCandidates = () => {
    const service = new GlobalService();
    const router = useRouter();
    const path = router.pathname;
    const companyKolsInfluencerService = new CompanyKolsInfluencerService();
    const isRoleEqualRecruitment = () => {
        const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
        return role == 'REC';
    };

    const [isChangeParam, setIsChangeParam] = useState(false);
    const [createInterested, setCreateInterested] = useState(false);
    const [dataViewValue, setDataViewValue] = useState([]);
    const [dataViewValueWithParam, setDataViewValueWithParam] = useState([]);
    const [dataParam, setDataParam] = useState({});
    const [layout, setLayout] = useState('grid');
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [showDiv, setShowDiv] = useState(false);
    const [changing, setChanging] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalRecordsWithParam, setTotalRecordsWithParam] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT_12);
    const loggedIn = useSelector((state) => state.auth.isLoggedIn) && isRoleEqualRecruitment();
    const dispatch = useDispatch();
    const [sorting, setSorting] = useState('');
    const sortList = [
        { name: 'Cao đến thấp', code: 'DESC' },
        { name: 'Thấp đến cao', code: 'ASC' }
    ];
    const toast = useRef(null);
    const checkLogin = () => {
        if (window.localStorage.getItem('accessToken')) {
            dispatch(login());
        }
    };

    useEffect(() => {
        checkLogin();
    }, [dispatch]);

    const onPageChange = (event) => {
        setPage(() => {
            return event.page + 1;
        });
        setPageSize(event.rows);
        setChanging(!changing);
    };

    const formik = useFormik({
        initialValues: {
            kolsGenderRequests: undefined,
            workingAgeRequests: undefined,
            tiktokFollowerRequests: undefined,
            socialNetworks: undefined,
            kolsInfluencerName: undefined,
            careerFieldRequests: undefined,
            kolsLocationRequests: undefined
        },
        onSubmit: async (data) => {
            try {
                let res;
                if (loggedIn) {
                    res = await service.searchWithToken({ page: page, recordPage: PAGE_SIZE_DEFAULT_12, ...data });
                } else {
                    res = await service.search({ page: page, recordPage: PAGE_SIZE_DEFAULT_12, ...data });
                }
                if (res.data.code === 'success') {
                    let content = res.data.data?.content;
                    setDataViewValue(content);
                    setTotalRecords(res.data.data?.totalElements);
                } else {
                    setDataViewValue([]);
                }
            } catch (e) {
                setDataViewValue([]);
                console.log(e);
            }
        }
    });

    const handleRemoveAllFilter = () => {
        formik.resetForm();
        setSorting([]);
        setDataParam({});
        router.push(path, undefined, { scroll: false });
    };

    const panelHeaderTemplate = () => null; // return an empty template

    useEffect(() => {
        let mounted = true;
        let data = {
            kolsGenderRequests: undefined,
            workingAgeRequests: undefined,
            tiktokFollowerRequests: undefined,
            socialNetworks: undefined,
            kolsInfluencerName: undefined,
            careerFieldRequests: undefined,
            kolsLocationRequests: undefined
        };

        const params = getParams();
        const callChangeRouter = () => {
            filterParamURL.map((value) => {
                if (params.has(value)) {
                    if (value == 'sorting') {
                        setSorting(JSON.parse(params.get(value)));
                    } else {
                        let valueField = params.get(value);
                        if (value !== 'kolsInfluencerName') {
                            valueField = JSON.parse(params.get(value));
                        }
                        formik.setFieldValue(value, valueField);
                        data = { ...data, ...{ [value]: valueField } };
                        setDataParam(data);
                    }
                }
            });
        };

        mounted && callChangeRouter();
        setIsChangeParam(mounted);

        return () => {
            mounted = false;
        };
    }, [router]);

    useEffect(async () => {
        let mounted = true;
        try {
            let res;
            if (Object.values(dataParam).length > 0) {
                if (loggedIn) {
                    res = await service.searchWithToken({ ...dataParam, page: page, recordPage: PAGE_SIZE_DEFAULT_12, sorting: sorting.code });
                } else {
                    res = await service.search({ ...dataParam, page: page, recordPage: PAGE_SIZE_DEFAULT_12, sorting: sorting.code });
                }

                if (res.data.code === 'success' && mounted) {
                    let content = res.data.data?.content;
                    setDataViewValueWithParam(content);
                    setTotalRecordsWithParam(res.data.data?.totalElements);
                } else {
                    setDataViewValueWithParam([]);
                }
                return;
            } else {
                if (loggedIn) {
                    res = await service.searchWithToken({ ...formik.values, page: page, recordPage: PAGE_SIZE_DEFAULT_12, sorting: sorting.code });
                } else {
                    res = await service.search({ ...formik.values, page: page, recordPage: PAGE_SIZE_DEFAULT_12, sorting: sorting.code });
                }

                if (res.data.code === 'success' && mounted) {
                    let content = res.data.data?.content;
                    setDataViewValue(content);
                    setTotalRecords(res.data.data?.totalElements);
                } else {
                    setDataViewValue([]);
                }
            }
        } catch (e) {
            console.log(e);
        }

        return () => {
            mounted = false;
        };
    }, [formik.values, changing, sorting, router, isChangeParam, createInterested, dataParam]);

    // useEffect(async () => {
    //     try {
    //         await callAPI(loggedIn);
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }, [loggedIn, createInterested]);

    const withoutLoggedInHandler = (data) => {
        return <div />;
    };

    const onLoggedInHandler = (data) => {
        switch (data.isInterested) {
            case 1:
                return (
                    <button className="saved-kol-icon" onClick={() => offInterestedHandler(data)}>
                        <i className="pi pi-heart-fill" />
                    </button>
                );
            case 0:
                return (
                    <button className="saved-kol-icon" onClick={() => onInterestedHandler(data)}>
                        <i className="pi pi-heart" />
                    </button>
                );
            default:
                return (
                    <button className="saved-kol-icon" onClick={() => onInterestedHandler(data)}>
                        <i className="pi pi-heart" />
                    </button>
                );
        }
    };

    const onInterestedHandler = async (data) => {
        const res = await companyKolsInfluencerService.saveCandidate({ candidateId: data.kolsInfluencerId });
        if (res.data.code === 'success') {
            setCreateInterested(!createInterested);
            toast.current.show({
                severity: 'success',
                summary: 'Thông báo',
                detail: res.data.message,
                life: 2000
            });
        } else {
            console.log(e);
        }
    };

    const offInterestedHandler = async (data) => {
        const res = await companyKolsInfluencerService.saveCandidate({ candidateId: data.kolsInfluencerId });
        if (res.data.code === 'success') {
            setCreateInterested(!createInterested);
            toast.current.show({
                severity: 'success',
                summary: 'Thông báo',
                detail: res.data.message,
                life: 2000
            });
        } else {
            console.log(e);
        }
    };

    const onDisplayIconHandler = (data, loggedIn) => {
        const loginStatus = {
            true: onLoggedInHandler,
            false: withoutLoggedInHandler
        };
        return loginStatus?.[loggedIn](data);
    };

    const onChangeSort = (param) => {
        setSorting(param.value);
        hanldeChangeParamURL('sorting', param.value, router, path);
    };

    const selectedSortTemplate = (option, props) => {
        if (option) {
            return <div className="flex align-items-center">Follower Tiktok: &nbsp;{option.name}</div>;
        }

        return <span>{props.placeholder}</span>;
    };

    const dataViewHeader = (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div className="sub-dataview-header">
                    <HeaderSearchCandidate path={path} formik={formik} showDiv={showDiv} setShowDiv={setShowDiv} setPage={setPage} />
                    {showDiv && (
                        <div className="flex flex-wrap justify-content-between align-items-center gap-3 filter-advance">
                            <span>Lọc nâng cao</span>
                            <MultiSelect
                                value={formik.values.kolsGenderRequests}
                                onChange={(e) => {
                                    formik.setFieldValue('kolsGenderRequests', e.target.value);
                                    hanldeChangeParamURL('kolsGenderRequests', e.target.value, router, path);
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
                                value={formik.values.tiktokFollowerRequests}
                                onChange={(e) => {
                                    formik.setFieldValue('tiktokFollowerRequests', e.target.value);
                                    hanldeChangeParamURL('tiktokFollowerRequests', e.target.value, router, path);
                                    setPage(1);
                                }}
                                options={NUMBER_OF_FOLLOWER_ENUM}
                                optionLabel="name"
                                display="chip"
                                showSelectAll={false}
                                panelHeaderTemplate={panelHeaderTemplate}
                                placeholder="Follower"
                                maxSelectedLabels={3}
                                className="items-input-filter-advanced"
                            />
                            <MultiSelect
                                value={formik.values.socialNetworks}
                                onChange={(e) => {
                                    formik.setFieldValue('socialNetworks', e.target.value);
                                    hanldeChangeParamURL('socialNetworks', e.target.value, router, path);
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
                            <Button type="button" icon="pi pi-reply" onClick={handleRemoveAllFilter} label="Xóa chọn" className="p-button remove-filter" />
                        </div>
                    )}
                </div>
                <div className="flex justify-content-end mt-4 px-3">
                    <Dropdown valueTemplate={selectedSortTemplate} value={sorting} onChange={(e) => onChangeSort(e)} options={sortList} optionLabel="name" placeholder="Follower Tiktok: " className="w-full md:w-18rem" />
                </div>
            </form>
        </div>
    );

    const dataViewGridItem = (data) => {
        const op = useRef(null);
        const socials = _.orderBy(data.socialNetworks, ['socialNetworkCode'], ['asc']);
        const params = !!getParams().toString() ? '&' + getParams().toString() : '';
        return (
            <div className="col-6 md-2 lg:col-3 sm:col-6 md:col-4 items-kol" key={data.id}>
                <div className="m-3 border-0">
                    <div className="flex flex-column align-items-center text-center mb-3">
                        <div className="boxed">
                            <Link href={`/components/detail-candidate/?mask=${data.mask}&id=${data.kolsInfluencerId + params}`}>
                                <div
                                    className="boxed"
                                    onMouseEnter={(e) => {
                                        op.current.toggle(e);
                                    }}
                                    onMouseLeave={(e) => {
                                        op.current.toggle(e);
                                    }}
                                >
                                    {data.profileImage != null ? (
                                        <img src={`${DEV_URL}${data.profileImage}`} className="my-3 mx-0 avt-img" alt={'img'} />
                                    ) : (
                                        <img src={`${contextPath}/demo/images/avatar/no-avatar.png`} className="my-3 mx-0 avt-img" alt={'img'} />
                                    )}
                                </div>
                            </Link>
                            {onDisplayIconHandler(data, loggedIn)}
                        </div>
                        <div className="font-size-title mt-2 md:mt-3 font-bold name-candidate">{data.kolsInfluencerName}</div>
                    </div>

                    <div className="flex flex-wrap align-items-center justify-content-center mt-2">
                        {data?.careerFields ? data.careerFields.slice(0, 3).map((e, key) => <Chip className="text-xs lg:text-base md:text-base mr-2" key={key} label={e.value} />) : <></>}
                    </div>
                </div>
                <OverlayPanel ref={op} className="box-hover">
                    <div className="box-hover-title name-candidate">{data.kolsInfluencerName}</div>
                    <div className="box-hover-info">
                        <div className="box-hover-info-heading">Mạng xã hội</div>
                        <div className="box-hover-info-content">
                            <div className="box-hover-info-content">
                                <div className="grid">
                                    {socials?.map(
                                        (e, key) =>
                                            !!e.url &&
                                            !!e.followers && (
                                                <div className="col-inner col-6 pl-0" key={key}>
                                                    <div className="icon-box featured-box icon-box-left text-left flex" key={key}>
                                                        <SocialComponent e={e} />
                                                        <div className="icon" key={key}>
                                                            <div className="icon-inner" key={key}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </OverlayPanel>
            </div>
        );
    };

    const itemTemplate = (data, layout) => {
        if (!data) {
            return;
        }
        return dataViewGridItem(data);
    };
    let dataViews = Object.keys(dataParam).length > 0 ? dataViewValueWithParam : dataViewValue;
    let totalRecord = Object.keys(dataParam).length > 0 ? totalRecordsWithParam : totalRecords;

    return (
        <>
            <Toast ref={toast} />
            <div className="surface-0 flex justify-content-center page-search-candidates">
                <div id="home" className="landing-wrapper overflow-hidden search-candidates">
                    <div
                        id="hero"
                        className="flex flex-column lg:align-items-center align-items-start lg:flex-row pt-4 px-4 lg:px-8 overflow-hidden"
                        style={{
                            background: '#E9F2FF'
                        }}
                    >
                        <img className="threedot1" src={`${contextPath}/demo/images/list-recruitments/threedot1.svg`} alt="logo" />
                        <img className="threedot2" src={`${contextPath}/demo/images/list-recruitments/threedot1.svg`} alt="logo" />
                        <div className="mx-3 xl:ml-8 xl:mr-3 md:mx-2 mt-0 md:mt-4 z-1">
                            <h1 className="xl:text-6xl lg:text-6xl text-2xl text-gray-900 line-height-2">
                                <span className="font-light font-bold block">Danh Sách Influencers </span>
                            </h1>
                            <p className="w-12 xl:w-10 font-normal text-xl line-height-3 md:mt-3 text-gray-700">
                                Kết nối KOLs, Influencer chúng tôi, cùng xây dựng và phát triển chiến dịch. Tăng độ nhận diện thương hiệu và doanh số một cách nhanh chóng.
                            </p>
                        </div>
                        <div className="banner-search-candidates flex justify-content-center xl:w-auto md:justify-content-end relative">
                            <img src={`${contextPath}/demo/images/list-candidates/banner.svg`} style={{ height: '700px' }} alt="Kols" className="md:w-auto" />
                        </div>
                    </div>

                    <div className={classNames('col-12 filter-candidate p-0 3', { 'pb-3': !totalRecord })}>
                        <div>
                            <DataView emptyMessage={'Không tìm thấy kết quả phù hợp'} value={dataViews} layout={layout} sortOrder={sortOrder} sortField={sortField} itemTemplate={itemTemplate} header={dataViewHeader}></DataView>
                            {!!totalRecord && <Paginator first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecord} onPageChange={onPageChange} />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchCandidates;
