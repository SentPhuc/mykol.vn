import React, { useEffect, useRef, useState } from 'react';
import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { useRouter } from 'next/router';
import { MultiSelect } from 'primereact/multiselect';
import { ACTIVITY_PLATFORM_ENUM, AGE_ENUM, DEV_URL, GENDER_ENUM, NUMBER_OF_FOLLOWER_ENUM } from '../../../../src/commons/Utils';
import { Chip } from 'primereact/chip';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useFormik } from 'formik';
import { GlobalService } from '../../../../demo/service/GlobalService';
import SocialComponent from '../../search-candidates/SocialComponent';
import Link from 'next/link';
import { CompanyKolsInfluencerService } from '../../../../demo/service/CompanyKolsInfluencerService';
import _ from 'lodash';
import { Toast } from 'primereact/toast';
import HeaderSearchCandidateHomePage from "./HeaderSearchCandidateHomePage";

const FilterKolHomePage = (props) => {
    const service = new GlobalService();
    const companyKolsInfluencerService = new CompanyKolsInfluencerService();

    const router = useRouter();
    const { loggedIn } = props;
    const [dataViewValue, setDataViewValue] = useState([]);
    const [layout, setLayout] = useState('grid');
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [showDiv, setShowDiv] = useState(false);

    const [rows, setRows] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [createInterested, setCreateInterested] = useState(false);
    const toast = useRef(null);

    const formik = useFormik({
        initialValues: {
            kolsGenderRequests: null,
            workingAgeRequests: null,
            tiktokFollowerRequests: null,
            socialNetworks: null,
            kolsInfluencerName: null,
            careerFieldRequests: null,
            kolsLocationRequests: null
        },
        onSubmit: async (data) => {
            try {
                let res;
                if (loggedIn) {
                    res = await service.searchWithToken({ page: currentPage, recordPage: 12, ...data });
                } else {
                    res = await service.search({ page: currentPage, recordPage: 12, ...data });
                }
                if (res.data.code === 'success') {
                    let content = res.data.data.content;
                    setDataViewValue(content);
                    setRows(res.data.data.size);
                    setTotalRecords(res.data.data.totalElements);
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
    };

    const panelHeaderTemplate = () => null; // return an empty template

    const callAPIWithoutToken = async () => {
        const res = await service.search({...formik.values, page: currentPage, recordPage: 12});
        if (res.data.code === 'success') {
            let content = res.data.data?.content;
            setDataViewValue(content);
            setRows(res.data.data.size);
            setTotalRecords(res.data.data.totalElements);
        } else {
            setDataViewValue([]);
        }
    };

    const callAPIWithToken = async () => {
        const res = await service.searchWithToken({ ...formik.values, page: currentPage, recordPage: 12 });
        if (res.data.code === 'success') {
            let content = res.data.data?.content;
            setDataViewValue(content);
            setRows(res.data.data.size);
            setTotalRecords(res.data.data.totalElements);
        } else {
            setDataViewValue([]);
        }

    };

    const callAPI = async (isLoggedIn) => {
        const status = {
            false: await callAPIWithoutToken,
            true: await callAPIWithToken
        };
        return status?.[isLoggedIn]?.();
    };

    useEffect(async () => {
        try {
            await callAPI(loggedIn);
        } catch (e) {
            console.log(e);
        }
    }, [formik.values, loggedIn, createInterested]);

    const onInterestedHandler = async (data) => {
        const res = await companyKolsInfluencerService.saveCandidate({ candidateId: data.kolsInfluencerId });
        if (res.data.code === 'success') {
            setCreateInterested(!createInterested);
            toast.current.show({
                severity: 'success',
                summary: 'Thông báo',
                detail: res.data.message,
                life: 2000
            })
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
            })
        } else {

            console.log(e);
        }
    };

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

    const onDisplayIconHandler = (data, loggedIn) => {
        const loginStatus = {
            true: onLoggedInHandler,
            false: withoutLoggedInHandler
        };
        return loginStatus?.[loggedIn](data);
    };

    const dataViewHeader = (
        <div className="p-dataview-header-box mb-4">
            <div className="center-item">
                <h2 className="center-item uppercase font-bold">Tìm kiếm KOL</h2>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <HeaderSearchCandidateHomePage formik={formik} showDiv={showDiv} setShowDiv={setShowDiv} />
                {showDiv && (
                    <div className="flex flex-wrap justify-content-between align-items-center gap-3 mt-4">
                        <span className="inline-block">Lọc nâng cao</span>
                        <MultiSelect
                            value={formik.values.kolsGenderRequests}
                            onChange={(e) => {
                                formik.setFieldValue('kolsGenderRequests', e.target.value);
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

    const dataViewGridItem = (data) => {
        const op = useRef(null);
        const socials = _.orderBy(data.socialNetworks, ['socialNetworkCode'], ['asc']);
        return (
            <div className="col-6 md-2 lg:col-3 sm:col-6 md:col-4 items-kol" key={data.id}>
                <div className="p-3 pb-0 border-0">
                    <div className="flex flex-column align-items-center text-center mb-3">
                        <div className="boxed">
                            <Link
                                href={{
                                    pathname: '/components/detail-candidate',
                                    query: { mask: data.mask, id: data.kolsInfluencerId }
                                }}
                            >
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
                        <div
                            className='mt-2 md:mt-3 font-size-title font-bold'
                            style={{ wordBreak: 'break-word' }}
                        >
                            {data.kolsInfluencerName}
                        </div>
                    </div>
                    <div className="flex flex-wrap align-items-center justify-content-center mt-2">
                        {data?.careerFields ? data.careerFields.slice(0, 3).map((e, i) => <Chip className="text-xs lg:text-base md:text-base mr-2 mb-2" label={e.value} key={i} />) : <></>}
                    </div>
                </div>
                <OverlayPanel ref={op} className="box-hover">
                    <div className="box-hover-title">{data.kolsInfluencerName}</div>
                    <div className="box-hover-info">
                        <div className="box-hover-info-heading">Mạng xã hội</div>
                        <div className="box-hover-info-content">
                            <div className="box-hover-info-content">
                                <div className="grid">
                                    {socials?.map((e, i) => (
                                        !!e.url && !!e.followers && <div className="col-inner col-6 pl-0" key={i}>
                                            <div className="icon-box featured-box icon-box-left text-left flex">
                                                <SocialComponent e={e} />
                                                <div className="icon">
                                                    <div className="icon-inner"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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

    return (
        <>
            <Toast ref={toast} />
            <div className="col-12 filter-kol-col p-0 pt-4 lg:pt-8">
                <div className="col-12 filter-candidate 2">
                    <DataView value={dataViewValue} layout={layout} itemTemplate={itemTemplate} header={dataViewHeader} emptyMessage={'Không tìm thấy kết quả phù hợp'}></DataView>
                </div>
                <div className="center-item mt-4 pb-5">
                    <Button
                        icon="pi pi-arrow-right"
                        label="Xem tất cả"
                        className="p-button-text"
                        onClick={() => {
                            router.push('/components/search-candidates');
                        }}
                    ></Button>
                </div>
            </div>
        </>
    );
};

export default FilterKolHomePage;
