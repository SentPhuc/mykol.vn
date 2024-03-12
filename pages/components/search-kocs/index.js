import { useRouter } from 'next/router';
import { GlobalService } from 'demo/service/GlobalService';
import { useEffect, useState, useRef } from 'react';
import { useFormik } from 'formik';
import { DataView } from 'primereact/dataview';
import { Toast } from 'primereact/toast';
import ItemKol from '../homepage/search-kol/ItemKol';
import SidebarTiktok from '../homepage/recruitment/SidebarTiktok';
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import { CATEGORY_ENUM, FOLLOWER_SEARCH_KOC_ENUM, BOOKKING_FILTER_ENUM, AVG_VIDEO_LIVE_SEARCH_KOC_ENUM } from 'src/commons/Utils';

const SearchKocs = () => {
    const [isChangingPaging, setIsChangingPaging] = useState(false);
    const [changing, setChanging] = useState(false);
    const [page, setPage] = useState(1);
    const [recordPage, setRecordPage] = useState(16);
    const [provinces, setProvinces] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageGoTo, setPageGoTo] = useState(1);
    const [datas, setDatas] = useState();
    const [visibleSidebar, setVisibleSidebar] = useState(false);
    const [username, setUserName] = useState('');
    const toast = useRef(null);
    const router = useRouter();
    const global = new GlobalService();
    const query = router?.query;

    useEffect(async () => {
        await global
            .getProvinces()
            .then((data) => {
                if (data?.status == 200) {
                    const provincesNotALl = data?.data?.data?.filter((value) => value.id != 1);
                    setProvinces(provincesNotALl);
                }
            })
            .catch((error) => console.error(error));
    }, []);

    const formikFilter = useFormik({
        initialValues: {
            bookingPrice: '',
            sorting: 'avgVideo',
            name: '',
            followers: '',
            avgVideo: '',
            avgLive: '',
            cityCode: 0,
            careerCode: 0,
            page: page,
            recordPage: recordPage
        },
        onSubmit: async (params) => {
            setPage(1);
            await global
                .searchKolsInfluencerV2(params)
                .then((data) => {
                    setDatas(data?.data?.data?.content);
                    setTotalRecords(data?.data.data.totalElements);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Thông báo',
                        detail: 'Lọc theo điều kiện thành công',
                        life: 2000
                    });

                    if (!!params.careerCode || !!params.bookingPrice) history.pushState({}, '', '/components/search-kocs');
                })
                .catch((error) => console.error(error));
        }
    });

    useEffect(async () => {
        const price = query?.bookingPrice ? query?.bookingPrice : formikFilter?.values?.bookingPrice ?? '';
        const career = query?.careerCodes ? query?.careerCodes : formikFilter?.values?.careerCode ?? 0;
        let params = {
            bookingPrice: price,
            careerCode: career,
            name: formikFilter.values.name,
            followers: formikFilter.values.followers,
            avgVideo: formikFilter.values.avgVideo,
            avgLive: formikFilter.values.avgLive,
            cityCode: formikFilter.values.cityCode,
            sorting: formikFilter.values.sorting,
            page: page,
            recordPage: recordPage
        };

        await global
            .searchKolsInfluencerV2(params)
            .then((data) => {
                if (data?.status == 200) {
                    setDatas(data?.data?.data?.content);
                    setTotalRecords(data?.data?.data?.totalElements);
                }
            })
            .catch((error) => console.error(error));
    }, [page, recordPage, query, changing, formikFilter.values.sorting]);

    useEffect(async () => {
        if (query?.bookingPrice) formikFilter.setFieldValue('bookingPrice', query?.bookingPrice);
        if (query?.careerCodes) formikFilter.setFieldValue('careerCode', query?.careerCodes);
    }, [query]);

    useEffect(() => {
        if (!isChangingPaging) return;

        document.getElementById('search-kocs').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        setIsChangingPaging(false);
    }, [page, isChangingPaging]);

    const handleResetForm = () => {
        setPage(1);
        formikFilter.resetForm();
        router.push('/components/search-kocs');
    };

    const handleShowProfile = (data) => {
        if (!data?.username) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Dữ liệu trống', life: 3000 });
            return;
        }
        setUserName(data?.username);
        setVisibleSidebar(true);
    };

    const TemplatePage = (rowData) => {
        return <ItemKol data={rowData} handleShowProfile={handleShowProfile} />;
    };

    const template1 = {
        layout: 'PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport',
        PrevPageLink: (options) => {
            return (
                <button type="button" className={classNames(options.className, 'border-round')} onClick={options.onClick} disabled={options.disabled}>
                    <span className="p-3">Previous</span>
                    <Ripple />
                </button>
            );
        },
        NextPageLink: (options) => {
            return (
                <button type="button" className={classNames(options.className, 'border-round')} onClick={options.onClick} disabled={options.disabled}>
                    <span className="p-3">Next</span>
                    <Ripple />
                </button>
            );
        },
        PageLinks: (options) => {
            if ((options.view.startPage === options.page && options.view.startPage !== 0) || (options.view.endPage === options.page && options.page + 1 !== options.totalPages)) {
                const className = classNames(options.className, { 'p-disabled': true });

                return (
                    <span className={className} style={{ userSelect: 'none' }}>
                        ...
                    </span>
                );
            }

            return (
                <button type="button" className={options.className} onClick={options.onClick}>
                    {options.page + 1}
                    <Ripple />
                </button>
            );
        },
        CurrentPageReport: (options) => {
            return (
                <span className="mx-3" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                    Go to <InputText disabled={!!options && options.totalPages < 2} min="0" minLength="1" size="2" className="ml-1" value={pageGoTo} onChange={onPageInputChange} />
                    <Button disabled={!!options && options.totalPages < 2} className="ml-2" onClick={() => onPageInputKeyDown(options)}>
                        Go
                    </Button>
                </span>
            );
        }
    };

    const onPageInputChange = (event) => {
        if (event.target.value >= 0) setPageGoTo(event.target.value);
    };

    const onPageInputKeyDown = (options) => {
        const pageGoToChange = parseInt(pageGoTo);
        if (pageGoToChange < 0 || pageGoToChange > options.totalPages) {
            setPage(options.totalPages);
        } else {
            setPage(pageGoToChange);
        }
        setRecordPage(options.rows);
        setChanging(!changing);
    };

    const onPageChange = (event) => {
        setPage(event.page + 1);
        setRecordPage(event.rows);
        setChanging(!changing);
        setIsChangingPaging(true);
    };

    return (
        <>
            <div id="search-kol-page" className="w-full bg-white">
                <div id="form-search-kol-page" className="md:pt-5 py-3 md:pb-7">
                    <div className="container">
                        <h3 className="text-center text-white">Tìm kiếm Influencer</h3>
                        <form className="text-center" onSubmit={formikFilter.handleSubmit}>
                            <div className="input-name md:mb-4 mb-2 border-round-2xl overflow-hidden m-auto relative w-full">
                                <input
                                    value={formikFilter.values.name}
                                    className="w-full border-none outline-none"
                                    type="text"
                                    placeholder="Nhập tên để tìm"
                                    name="name"
                                    onChange={(event) => formikFilter.setFieldValue('name', event?.target?.value)}
                                />
                                <button type="submit" className="border-none z-2 cursor-pointer absolute outline-none"></button>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-content-center">
                                <select
                                    value={formikFilter.values.careerCode}
                                    className="items-form border-none cursor-pointer outline-none shadow-1 border-round-2xl"
                                    name="careerCode"
                                    onChange={(event) => formikFilter.setFieldValue('careerCode', event?.target?.value)}
                                >
                                    <option value="0" key="0">
                                        Lĩnh vực
                                    </option>
                                    {CATEGORY_ENUM.map((value, index) => {
                                        return (
                                            <option key={index + 1} value={value?.careerFieldCode}>
                                                {value?.name}
                                            </option>
                                        );
                                    })}
                                </select>
                                <select
                                    value={formikFilter.values.followers}
                                    className="items-form border-none cursor-pointer outline-none shadow-1 border-round-2xl"
                                    name="followers"
                                    onChange={(event) => formikFilter.setFieldValue('followers', event?.target?.value)}
                                >
                                    <option value="0" key="0">
                                        Follower
                                    </option>
                                    {FOLLOWER_SEARCH_KOC_ENUM.map((value, index) => {
                                        return (
                                            <option key={index + 1} value={value?.value}>
                                                {value?.name}
                                            </option>
                                        );
                                    })}
                                </select>
                                <select
                                    value={formikFilter.values?.bookingPrice}
                                    className="items-form border-none cursor-pointer outline-none shadow-1 border-round-2xl"
                                    name="bookingPrice"
                                    onChange={(event) => formikFilter.setFieldValue('bookingPrice', event?.target?.value)}
                                >
                                    <option value="" key="0">
                                        Giá booking
                                    </option>
                                    {BOOKKING_FILTER_ENUM.map((value, index) => {
                                        return (
                                            <option key={index + 1} value={value?.value}>
                                                {value?.name}
                                            </option>
                                        );
                                    })}
                                </select>
                                <select
                                    value={formikFilter.values.cityCode}
                                    className="items-form border-none cursor-pointer outline-none shadow-1 border-round-2xl"
                                    name="cityCode"
                                    onChange={(event) => formikFilter.setFieldValue('cityCode', event?.target?.value)}
                                >
                                    <option value="0" key="0">
                                        Địa chỉ
                                    </option>
                                    {provinces.map((value, index) => {
                                        return (
                                            <option key={index + 1} value={value?.code}>
                                                {value?.name}
                                            </option>
                                        );
                                    })}
                                </select>
                                <select
                                    value={formikFilter.values.avgVideo}
                                    className="items-form border-none cursor-pointer outline-none shadow-1 border-round-2xl"
                                    name="avgVideo"
                                    onChange={(event) => formikFilter.setFieldValue('avgVideo', event?.target?.value)}
                                >
                                    <option value="" key="0">
                                        Doanh thu/video
                                    </option>
                                    {AVG_VIDEO_LIVE_SEARCH_KOC_ENUM.map((value, index) => {
                                        return (
                                            <option key={index + 1} value={value?.value}>
                                                {value?.name}
                                            </option>
                                        );
                                    })}
                                </select>
                                <select
                                    value={formikFilter.values.avgLive}
                                    className="items-form border-none cursor-pointer outline-none shadow-1 border-round-2xl"
                                    name="avgLive"
                                    onChange={(event) => formikFilter.setFieldValue('avgLive', event?.target?.value)}
                                >
                                    <option value="" key="0">
                                        Doanh thu/live
                                    </option>
                                    {AVG_VIDEO_LIVE_SEARCH_KOC_ENUM.map((value, index) => {
                                        return (
                                            <option key={index + 1} value={value?.value}>
                                                {value?.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="footer-search gap-2 flex justify-content-end pr-3 md:mt-3 mt-2">
                                <Button type="submit" style={{ width: '80px' }} label="Lọc" icon="pi pi-search" />

                                <Button type="button" icon="pi pi-reply" onClick={() => handleResetForm()} label="Xóa chọn" className="p-button remove-filter ml-2"></Button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="container">
                    <div id="search-kocs" className="card md:pb-6 pb-3 pl-3 pr-3 shadow-1 md:mt-6 mt-3 md:mb-3 my-3 border-round-2xl w-full">
                        <Toast ref={toast} />
                        <div className="header-list-koc mb-2 flex justify-content-between flex-wrap align-items-center">
                            <h3 className="mb-0"></h3>
                            <div className="select-soft md:w-auto w-full md:mt-0 mt-1 flex align-items-center">
                                <label htmlFor="sorting">Sắp xếp theo:</label>
                                <select
                                    value={formikFilter.values.sorting}
                                    className="cursor-pointer outline-none"
                                    id="sorting"
                                    name="sorting"
                                    onChange={(event) => {
                                        formikFilter.setFieldValue('sorting', event?.target?.value);
                                        setPage(1);
                                    }}
                                >
                                    <option value="0">...</option>
                                    <option value="avgVideo">Doanh thu/ Video</option>
                                    <option value="avgLive">Doanh thu/ Live</option>
                                    <option value="followers">Follower</option>
                                    <option value="price">Giá booking</option>
                                </select>
                            </div>
                        </div>
                        <DataView emptyMessage={'Không có dữ liệu'} value={datas} itemTemplate={TemplatePage} />
                        <Paginator className="md:mt-4" template={template1} first={page * recordPage - 1} rows={recordPage} totalRecords={totalRecords} onPageChange={onPageChange} />
                        <SidebarTiktok username={username} setVisibleSidebar={setVisibleSidebar} visibleSidebar={visibleSidebar} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchKocs;
