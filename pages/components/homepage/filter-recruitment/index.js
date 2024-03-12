import React, { useEffect, useRef, useState } from 'react';
import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { useRouter } from 'next/router';
import { MultiSelect } from 'primereact/multiselect';
import { ACTIVITY_PLATFORM_ENUM, AGE_ENUM, DEV_URL, GENDER_ENUM, WAGE_ENUM, convertAcronym, convertToSlug } from '../../../../src/commons/Utils';
import { Chip } from 'primereact/chip';
import { useFormik } from 'formik';
import { GlobalService } from '../../../../demo/service/GlobalService';
import HeaderSearchRecruitmentHomepage from './HeaderSearchRecruitmentHomepage';
import moment from 'moment';
import HeartButton from './HeartButton';
import { useSelector } from 'react-redux';
import { KolRecruitmentService } from '../../../../demo/service/KolRecruitmentService';
import { Toast } from 'primereact/toast';
import Link from 'next/link';

const FilterRecruitmentHomePage = () => {
    const service = new GlobalService();
    const toast = useRef(null);
    const recruitmentService = new KolRecruitmentService();

    const [layout, setLayout] = useState('grid');
    const [showDiv, setShowDiv] = useState(false);
    const [dataViewValue, setDataViewValue] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);

    const [rows, setRows] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const loggedIn = useSelector((state) => state.auth.isLoggedIn);
    const [createInterested, setCreateInterested] = useState(false);

    const isRoleEqualKol = () => {
        const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
        return role == 'KOLIFL';
    };

    const formik = useFormik({
        initialValues: {
            recGenderRequests: undefined,
            rangeOfSalaries: undefined,
            socialNetworks: undefined,
            matchingJobs: undefined,
            careerFieldRequests: undefined,
            recLocationRequests: undefined
        },
        onSubmit: async (data) => {
            try {
                const res = await service.searchRecruitment({ page: currentPage, recordPage: 12, ...data });
                if (res.data.code === 'success') {
                    const content = res.data.data.content;
                    setDataViewValue(content);
                    setRows(res.data.data.size);
                    setTotalRecords(res.data.data.totalElements);
                } else {
                    setDataViewValue([]);
                }
            } catch (e) {
                console.log(e);
            }
        }
    });

    useEffect(async () => {
        try {
            if (!formik.values.matchingJobs) {
                const res = await service.searchRecruitment({ ...formik.values, page: currentPage, recordPage: 12 });
                if (res.data.code === 'success') {
                    let content = res.data.data.content;
                    setDataViewValue(content);
                    setRows(res.data.data.size);
                    setTotalRecords(res.data.data.totalElements);
                } else {
                    setDataViewValue([]);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }, [formik.values]);

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
                life: 1000
            });
        }
    };

    const panelHeaderTemplate = () => null; // return an empty template

    const handleRemoveAllFilter = () => {
        formik.resetForm();
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

    useEffect(async () => {
        try {
            await callAPI(loggedIn);
        } catch (e) {
            console.log(e);
        }
    }, [formik.values, loggedIn, createInterested]);

    const callAPI = async (isLoggedIn) => {
        const status = {
            false: await callAPIWithoutToken,
            true: await callAPIWithToken
        };
        return status?.[isLoggedIn]?.();
    };

    const callAPIWithoutToken = async () => {
        if (!formik.values.kolsInfluencerName) {
            const res = await service.searchRecruitment({ ...formik.values, page: currentPage, recordPage: 12 });
            if (res.data.code === 'success') {
                let content = res.data.data.content;
                setDataViewValue(content);
                setRows(res.data.data.size);
                setTotalRecords(res.data.data.totalElements);
            } else {
                setDataViewValue([]);
            }
        }
    };

    const callAPIWithToken = async () => {
        if (!formik.values.kolsInfluencerName) {
            const res = await service.searchRecruitmentWithToken({ ...formik.values, page: currentPage, recordPage: 12 });
            if (res.data.code === 'success') {
                let content = res?.data?.data?.content;
                setDataViewValue(content);
                setRows(res.data.data.size);
                setTotalRecords(res.data.data.totalElements);
            } else {
                setDataViewValue([]);
            }
        }
    };

    const gridItem = (data) => {
        return (
            <div className="col-12 sm:col-12 md:col-6 lg:col-6 xl:col-6 px-1 item-card-filter-recruiment filter-recruiment-col relative">
                <div className="p-3 w-full shadow-one-recruiment mb-2">
                    <Link
                        href={{
                            pathname: '/components/company/recruitment-detail/[mask]/[id]',
                            query: { mask: convertToSlug(data.mask), id: data.recruitmentId }
                        }}
                    >
                        <div className="flex justify-content-between align-items-start flex-wrap">
                            <img src={`${DEV_URL}${data.profileImage}`} alt={'Loading'} width={84} height={84} className="images shadow-2 cursor-pointer obj-fit-cover" />
                            <div className="info md:text-left">
                                <div className="recruitment-title-wrapper lg:mb-3 mb-2">
                                    <Link
                                        href={{
                                            pathname: '/components/company/recruitment-detail/[mask]/[id]',
                                            query: { mask: convertToSlug(data.mask), id: data.recruitmentId }
                                        }}
                                    >
                                        <a className="font-bold mb-2 font-size-title cursor-pointer recruitment-title">
                                            {data.jobTitle.slice(0, 40)}
                                            {data.jobTitle.length > 40 && <span>...</span>}
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
                    {loggedIn && isRoleEqualKol() && <HeartButton data={data.isInterested} recruitmentId={data.recruitmentId} onJobSaving={onJobSaving} />}
                </div>
            </div>
        );
    };
    const router = useRouter();

    const dataViewHeader = (
        <div className="p-dataview-header-box">
            <div className="center-item">
                <h2 className="center-item uppercase font-bold">Tin tuyển dụng</h2>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <HeaderSearchRecruitmentHomepage formik={formik} showDiv={showDiv} setShowDiv={setShowDiv} />
                {showDiv && (
                    <div className="flex flex-wrap justify-content-between align-items-center gap-3 mt-4 filter-advance">
                        <span>Lọc nâng cao</span>
                        <MultiSelect
                            value={formik.values.recGenderRequests}
                            onChange={(e) => {
                                formik.setFieldValue('recGenderRequests', e.target.value);
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
                        <Button icon="pi pi-reply" onClick={handleRemoveAllFilter} label="Xóa chọn" className="p-button remove-filter"></Button>
                    </div>
                )}
            </form>
        </div>
    );

    const itemTemplate = (product, layout) => {
        if (!product) {
            return;
        }
        return gridItem(product);
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="search-recruitment-col col-12 p-0 bg-white">
                <div className="card-search-recruitment px-3 lg:py-4 py-4">
                    <div className="search-recruitment">
                        <DataView value={dataViewValue} layout={layout} sortOrder={sortOrder} sortField={sortField} itemTemplate={itemTemplate} header={dataViewHeader} emptyMessage={'Không tìm thấy kết quả phù hợp'}></DataView>
                    </div>
                    <div className="center-item mt-4">
                        <Button
                            icon="pi pi-arrow-right"
                            label="Xem tất cả"
                            className="p-button-text"
                            onClick={() => {
                                router.push('/components/search-recruitments');
                            }}
                        ></Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FilterRecruitmentHomePage;
