import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/router';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import { Button } from 'primereact/button';
import { useFormik } from 'formik';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { TikTokProfileService } from '../../../demo/service/TikTokProfileService';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Ripple } from 'primereact/ripple';
import { formatNumberThousands, LIVE_AVG_ENUM, SORT_ORDER_TIKTOK, TOTAL_AVG_LIVE_ENUM, TOTAL_AVG_LIVE_REVENUE_ENUM, TOTAL_AVG_VIDEO_ENUM, TOTAL_AVG_VIDEO_REVENUE_ENUM, VIDEO_AVG_ENUM, FOLLOWER_ENUM } from '../../../src/commons/Utils';
import { InputText } from 'primereact/inputtext';
import { Tooltip } from 'primereact/tooltip';
import { TikTokSaveListService } from '../../../demo/service/TikTokSaveListService';
import { Paginator } from 'primereact/paginator';
import SidebarInfluencer from './SidebarInfluencer';
import { TreeSelect } from 'primereact/treeselect';
import { GlobalService } from 'demo/service/GlobalService';
import AppLayout from 'layout/AppLayout';
import TabsKolTiktok from 'pages/commons/TabsKolTiktok';
import { Avatar } from 'primereact/avatar';
import SidebarTiktok from './SidebarTiktok';
import getConfig from 'next/config';

const SearchTiktokCandidates = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const toast = useRef(null);
    const router = useRouter();
    const [visibleSidebar, setVisibleSidebar] = useState(false);
    const [visibleRight, setVisibleRight] = useState(false);
    const [dataTiktoker, setDataTiktoker] = useState([]);
    const [username, setUsername] = useState('');
    const [changing, setChanging] = useState(false);

    const [limitNextPage, setLimitNextPage] = useState(false);
    const [page, setPage] = useState(1);
    const [pageGoTo, setPageGoTo] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [nodeCategories, setNodeCategories] = useState(null);

    const formik = useFormik({
        initialValues: {
            username: '',
            sorting: 'totalLiveRevenue',
            actionType: 'SEARCH'
        },
        onSubmit: async (data) => {
            await tikTokProfileService
                .search({
                    username: data.username,
                    sorting: data.sorting,
                    actionType: data.actionType,
                    page: page,
                    recordPage: pageSize
                })
                .then((res) => {
                    if (res.data.code == 'success') {
                        setDatas(res.data.data.content);
                        setTotalRecords(res.data.data.totalElements);
                        if (res.data.data.totalElements == 0) {
                            toast.current.show({
                                severity: 'warn',
                                summary: 'Warning',
                                detail: 'Hiện KOC này chưa có sẵn dữ liệu, chúng tôi đang tiến hành update, vui lòng chờ 3-5p và kiểm tra lại',
                                life: 3000
                            });
                            return;
                        }
                        toast.current.show({
                            severity: 'success',
                            summary: 'Thông báo',
                            detail: 'Tìm kiếm Influencer ' + data.username + ' thành công',
                            life: 2000
                        });
                    } else if (res.data.code == 'limit') {
                        handleNoti(data.actionType);
                    } else {
                        toast.current.show({
                            severity: 'error',
                            summary: 'Thông báo',
                            detail: res.data.message,
                            life: 2000
                        });
                    }
                });
            // formik.resetForm();
        }
    });

    const handleNoti = (actionType) => {
        let titleHeader = 'Số lượt tiếp cận của bạn đã hết';
        if (actionType == 'SEARCH') {
            titleHeader = 'Số lượt tìm kiếm của bạn đã hết';
        }
        if (actionType == 'NEXT_PAGE') {
            titleHeader = 'Số lượt sang trang của bạn đã hết';
        }
        confirmDialog({
            message: 'Vui lòng mua gói dịch vụ. Hoặc liên hệ hỗ trợ qua sđt/zalo: 0383050533',
            header: titleHeader,
            rejectLabel: 'Đóng',
            className: 'custom-confirmDialog-pricing'
        });
    };

    const formikFilter = useFormik({
        initialValues: {
            totalFollower: '',
            videoAvg: '',
            totalAvgVideo: '',
            totalVideoRevenue: '',
            liveAvg: '',
            totalAvgLive: '',
            totalLiveRevenue: '',
            actionType: 'SEARCH',
            selectedNodeKeys: null
        },
        onSubmit: async (data) => {
            tikTokProfileService
                .search({
                    totalFollower: formikFilter.values.totalFollower,
                    videoAvg: formikFilter.values.videoAvg,
                    totalAvgVideo: formikFilter.values.totalAvgVideo,
                    totalVideoRevenue: formikFilter.values.totalVideoRevenue,
                    liveAvg: formikFilter.values.liveAvg,
                    totalAvgLive: formikFilter.values.totalAvgLive,
                    totalLiveRevenue: formikFilter.values.totalLiveRevenue,
                    sorting: formik.values.sorting,
                    page: page,
                    recordPage: pageSize,
                    actionType: formikFilter.values.actionType,
                    categories: formikFilter.values.selectedNodeKeys
                })
                .then((res) => {
                    if (res.data.code == 'success') {
                        setDatas(res.data.data.content);
                        setTotalRecords(res.data.data.totalElements);
                        toast.current.show({
                            severity: 'success',
                            summary: 'Thông báo',
                            detail: 'Lọc thành công',
                            life: 2000
                        });
                    } else if (res.data.code == 'limit') {
                        handleNoti(data.actionType);
                    } else {
                        toast.current.show({
                            severity: 'error',
                            summary: 'Thông báo',
                            detail: res.data.message,
                            life: 2000
                        });
                    }
                });
        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };

    const tikTokProfileService = new TikTokProfileService();
    const tikTokSaveListService = new TikTokSaveListService();
    const globalService = new GlobalService();

    const location = useRouter().pathname;
    const [datas, setDatas] = useState([]);
    const op = useRef(null);

    const onPageChange = (event) => {
        formikFilter.values.actionType = 'NEXT_PAGE';
        setPage(event.page + 1);
        setPageSize(event.rows);
        setChanging(!changing);
    };

    useEffect(async () => {
        await tikTokProfileService
            .search({
                totalFollower: formikFilter.values.totalFollower,
                videoAvg: formikFilter.values.videoAvg,
                totalAvgVideo: formikFilter.values.totalAvgVideo,
                totalVideoRevenue: formikFilter.values.totalVideoRevenue,
                liveAvg: formikFilter.values.liveAvg,
                totalAvgLive: formikFilter.values.totalAvgLive,
                totalLiveRevenue: formikFilter.values.totalLiveRevenue,
                sorting: formik.values.sorting,
                page: page,
                recordPage: pageSize,
                actionType: formikFilter.values.actionType,
                categories: formikFilter.values.selectedNodeKeys
            })
            .then((res) => {
                if (res.data.code == 'success') {
                    setDatas(res.data.data.content);
                    setTotalRecords(res.data.data.totalElements);
                } else if (res.data.code == 'limit') {
                    setLimitNextPage(res.data.code == 'limit');
                    handleNoti(formikFilter.values.actionType);
                } else {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Thông báo',
                        detail: res.data.message,
                        life: 2000
                    });
                }
            });

        globalService.getAllCategories().then((data) => setNodeCategories(data?.data?.data));
        // setDatas(res.data.data?.content);
        // setTotalRecords(res.data.data.totalElements);
    }, [formik.values.sorting, changing, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

    const headerTabTiktok = (options) => {
        return (
            <div onClick={options.onClick} className={options.className}>
                <img className="mr-2" src={`${contextPath}/demo/images/social/icon-tiktok-tab.svg`} alt="Tiktok" />
                <img className="mr-2 active" src={`${contextPath}/demo/images/social/icon-tiktok-tab-active.svg`} alt="Tiktok" />
                Tiktok
            </div>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h4 className="m-0">Danh sách KOC, KOL Tiktok</h4>
                <div className="flex w-full lg:w-auto lx:w-auto md:w-auto">
                    <div className="item-filter-influencer-ranking align-items-center flex">
                        <span className="mr-4">Sắp xếp theo</span>
                    </div>
                    <div className="col-8 item-filter-influencer-ranking">
                        <span className="p-input-icon-left w-full">
                            <Dropdown
                                value={formik.values.sorting}
                                onChange={(e) => {
                                    formik.setFieldValue('sorting', e.value);
                                }}
                                options={SORT_ORDER_TIKTOK}
                                optionLabel="name"
                                optionValue="value"
                                display="chip"
                                placeholder="Chọn sắp xếp"
                                className="w-full font-bold"
                            />
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const templateAvatar = (avatarImgUrl) => {
        if (!!avatarImgUrl) {
            return <Avatar style={{ width: '4rem', height: '4rem' }} size="large" image={process.env.MEDIA_URL + avatarImgUrl} shape="circle" alt="Influx" />;
        } else {
            return <Avatar style={{ width: '4rem', height: '4rem' }} image={`${contextPath}/demo/images/avatar/no-avatar.png`} shape="circle" alt="Influx" />;
        }
    };

    const renderName = (rowData) => {
        return (
            <>
                <div className="flex align-items-center">
                    <div className="mr-2">{templateAvatar(rowData?.resizedAvatarPath)}</div>
                    <div className="info">
                        <div
                            onClick={() => {
                                if (!!rowData) {
                                    setUsername(rowData?.username);
                                }
                                setDataTiktoker(rowData);
                                setVisibleSidebar(true);
                            }}
                        >
                            <span className="font-bold text-lg mb-1 cursor-pointer recruitment-title underline text-primary kolName-applied-candidates">{rowData?.username}</span>
                        </div>
                        <span>{rowData?.fullName}</span>
                    </div>
                </div>
            </>
        );
    };

    const renderHeaderFollower = () => {
        return (
            <>
                <p>
                    Tổng số lượng followers <i className="pi pi-info-circle followers ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
                </p>
                <Tooltip target=".followers">Tổng số lượng followers</Tooltip>
            </>
        );
    };

    const renderFollower = (rowData) => {
        return formatNumberThousands(rowData?.totalFollowersCount) || 'N/A';
    };

    const renderHeaderVideoAvg = () => {
        return (
            <>
                <p>
                    View trung bình/ Video <i className="pi pi-info-circle video-avg ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
                </p>
                <Tooltip target=".video-avg">Lượt xem trung bình của 1 video có gắn sản phẩm trong 30 ngày gần nhất</Tooltip>
            </>
        );
    };

    const renderVideoAvg = (rowData) => {
        return (rowData?.videoAvg && formatNumberThousands(rowData?.videoAvg)) || 'N/A';
    };

    const renderHeaderTotalAvgVideo = () => {
        return (
            <>
                <p>
                    Doanh thu trung bình / Video <i className="pi pi-info-circle total-video-avg ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
                </p>
                <Tooltip target=".total-video-avg">Doanh thu trung bình của 1 Video Tiktok có gắn sản phẩm trong 30 ngày gần nhất</Tooltip>
            </>
        );
    };

    const renderTotalAvgVideo = (rowData) => {
        return (rowData?.totalAvgVideo && formatNumberThousands(rowData?.totalAvgVideo) + ' VNĐ') || 'N/A';
    };

    const renderHeaderTotalVideoRevenue = () => {
        return (
            <>
                <p>
                    Tổng doanh thu Video <i className="pi pi-info-circle total-video-revenue ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
                </p>
                <Tooltip target=".total-video-revenue">Tổng doanh thu của Video Tiktok có gắn sản phẩm trong 30 ngày gần nhất</Tooltip>
            </>
        );
    };

    const renderTotalVideoRevenue = (rowData) => {
        return (rowData?.totalVideoRevenue && formatNumberThousands(rowData?.totalVideoRevenue) + ' VNĐ') || 'N/A';
    };

    const renderHeaderLiveAvg = () => {
        return (
            <>
                <p>
                    View trung bình/Livestream <i className="pi pi-info-circle live-avg ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
                </p>
                <Tooltip target=".live-avg">Lượt xem trung bình của 1 Livestream Tiktok có gắn sản phẩm trong 30 ngày gần nhất</Tooltip>
            </>
        );
    };

    const renderLiveAvg = (rowData) => {
        return (rowData?.liveAvg && formatNumberThousands(rowData?.liveAvg)) || 'N/A';
    };

    const renderHeaderTotalAvgLive = () => {
        return (
            <>
                <p>
                    Doanh thu trung bình / Livestream <i className="pi pi-info-circle total-avg-live ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
                </p>
                <Tooltip target=".total-avg-live">Doanh thu trung bình của 1 phiên Livestream Tiktok có gắn sản phẩm trong 30 ngày gần nhất</Tooltip>
            </>
        );
    };

    const renderTotalAvgLive = (rowData) => {
        return (rowData?.totalAvgLive && formatNumberThousands(rowData?.totalAvgLive) + ' VNĐ') || 'N/A';
    };

    const renderHeaderTotalLiveRevenue = () => {
        return (
            <>
                <p>
                    Tổng doanh thu Livestream <i className="pi pi-info-circle total-live-revenue ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
                </p>
                <Tooltip target=".total-live-revenue">Tổng doanh thu của Livestream Tiktok có gắn sản phẩm trong 30 ngày gần nhất</Tooltip>
            </>
        );
    };

    const renderTotalLiveRevenue = (rowData) => {
        return (rowData?.totalLiveRevenue && formatNumberThousands(rowData?.totalLiveRevenue) + ' VNĐ') || 'N/A';
    };

    const indexTemplate = (rowData, field) => {
        return field.rowIndex + 1;
    };

    const handleRemoveAllFilter = () => {
        setPage(1);
        formikFilter.resetForm();
        formik.resetForm();
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Button
                size="sm"
                icon="pi pi-save"
                label={`${!!rowData?.tiktokSaveListIds ? 'Đã lưu' : 'Lưu'}`}
                className="mr-2 p-button p-button-primary white-space-nowrap w-full"
                onClick={() => {
                    setVisibleRight(true);
                    setDataTiktoker(rowData);
                }}
                tooltip="Lưu ứng viên"
                tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
            />
        );
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
        if (!!limitNextPage) return;

        const pageGoToChange = parseInt(pageGoTo);
        if (pageGoToChange < 0 || pageGoToChange > options.totalPages) {
            setPage(options.totalPages);
        } else {
            setPage(pageGoToChange);
        }
        formikFilter.values.actionType = 'NEXT_PAGE';
        setPageSize(options.rows);
        setChanging(!changing);
    };

    return AppLayout(
        <>
            <ConfirmDialog />
            <Toast ref={toast} />
            <SidebarInfluencer setChanging={setChanging} changing={changing} dataTiktoker={dataTiktoker} visibleRight={visibleRight} setVisibleRight={setVisibleRight} />
            <div className="card">
                <BreadcrumbCustom path={location} />
                <br />
                <div className="mb-2">
                    <TabsKolTiktok urlActive={router?.pathname} />
                </div>
                <div className="card flex justify-content-left filter-tiktok-candidates" style={{ overflow: 'scroll' }}>
                    <div className="flex align-items-start flex-wrap w-full">
                        <div className="w-full flex justify-content-center">
                            <form className="align-items-center justify-content-center md:w-10 flex gap-2">
                                <InputText
                                    filter="true"
                                    inputid="username"
                                    name="username"
                                    value={formik.values.username}
                                    placeholder="Nhập username Tiktok, ví dụ: lebong95"
                                    className={classNames({ 'p-invalid': isFormFieldInvalid('username') }, 'md:w-7')}
                                    onChange={(e) => {
                                        formik.setFieldValue('username', e.target.value);
                                    }}
                                />
                                <Button
                                    type="button"
                                    label="Tìm kiếm"
                                    icon="pi pi-search"
                                    className="ml-3"
                                    onClick={() => {
                                        setPage(1);
                                        formik.handleSubmit();
                                    }}
                                />
                            </form>
                        </div>
                        <h4 className="ml-2 w-full mr-5 my-0">Bộ lọc</h4>
                        <form onSubmit={formikFilter.handleSubmit} className="align-items-center mt-3 gap-2">
                            <div className="overflow-hidden">
                                <div className="flex">
                                    <div className="w-3 m-2">
                                        <TreeSelect
                                            value={formikFilter.values.selectedNodeKeys}
                                            onChange={(e) => {
                                                formikFilter.setFieldValue('selectedNodeKeys', e.target.value);
                                            }}
                                            options={nodeCategories}
                                            metaKeySelection={false}
                                            className="w-full"
                                            selectionMode="checkbox"
                                            display="chip"
                                            placeholder="Chọn lĩnh vực"
                                            filter
                                        ></TreeSelect>
                                    </div>
                                    <div className="w-3 m-2">
                                        <Dropdown
                                            inputid="videoAvg"
                                            name="videoAvg"
                                            value={formikFilter.values.videoAvg}
                                            options={VIDEO_AVG_ENUM}
                                            optionLabel="name"
                                            optionValue="value"
                                            placeholder="View trung bình/Video"
                                            onChange={(e) => {
                                                formikFilter.setFieldValue('videoAvg', e.target.value);
                                            }}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="w-3 m-2">
                                        <Dropdown
                                            inputid="totalAvgVideo"
                                            name="totalAvgVideo"
                                            value={formikFilter.values.totalAvgVideo}
                                            options={TOTAL_AVG_VIDEO_ENUM}
                                            optionLabel="name"
                                            optionValue="value"
                                            placeholder="Doanh thu/Video"
                                            onChange={(e) => {
                                                formikFilter.setFieldValue('totalAvgVideo', e.target.value);
                                            }}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="w-3 m-2">
                                        <Dropdown
                                            inputid="totalVideoRevenue"
                                            name="totalVideoRevenue"
                                            value={formikFilter.values.totalVideoRevenue}
                                            options={TOTAL_AVG_VIDEO_REVENUE_ENUM}
                                            optionLabel="name"
                                            optionValue="value"
                                            placeholder="Tổng doanh thu/Video"
                                            onChange={(e) => {
                                                formikFilter.setFieldValue('totalVideoRevenue', e.target.value);
                                            }}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="w-3 m-2">
                                        <Dropdown
                                            inputid="totalFollower"
                                            name="totalFollower"
                                            value={formikFilter.values.totalFollower}
                                            options={FOLLOWER_ENUM.filter((e) => e?.name != 'Tất cả lượng theo dõi')}
                                            optionLabel="name"
                                            optionValue="value"
                                            placeholder="Chọn follower"
                                            onChange={(e) => {
                                                formikFilter.setFieldValue('totalFollower', e.target.value);
                                            }}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="w-3 m-2">
                                        <Dropdown
                                            inputid="liveAvg"
                                            name="liveAvg"
                                            value={formikFilter.values.liveAvg}
                                            options={LIVE_AVG_ENUM}
                                            optionLabel="name"
                                            optionValue="value"
                                            placeholder="View trung bình/Live"
                                            onChange={(e) => {
                                                formikFilter.setFieldValue('liveAvg', e.target.value);
                                            }}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="w-3 m-2">
                                        <Dropdown
                                            inputid="totalAvgLive"
                                            name="totalAvgLive"
                                            value={formikFilter.values.totalAvgLive}
                                            options={TOTAL_AVG_LIVE_ENUM}
                                            optionLabel="name"
                                            optionValue="value"
                                            placeholder="Doanh thu/Live"
                                            onChange={(e) => {
                                                formikFilter.setFieldValue('totalAvgLive', e.target.value);
                                            }}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="w-3 m-2">
                                        <Dropdown
                                            inputid="totalLiveRevenue"
                                            name="totalLiveRevenue"
                                            value={formikFilter.values.totalLiveRevenue}
                                            options={TOTAL_AVG_LIVE_REVENUE_ENUM}
                                            optionLabel="name"
                                            optionValue="value"
                                            placeholder="Tổng doanh thu/Live"
                                            onChange={(e) => {
                                                formikFilter.setFieldValue('totalLiveRevenue', e.target.value);
                                            }}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex-grow-1 text-left ml-2">
                                <Button type="submit" style={{ width: '80px' }} label="Lọc" icon="pi pi-search" />
                                <Button icon="pi pi-reply" onClick={handleRemoveAllFilter} label="Xóa chọn" className="p-button remove-filter ml-4"></Button>
                            </div>
                        </form>
                    </div>
                </div>
                <DataTable scrollable value={datas} header={renderHeader} dataKey="id" tableClassName="custom-table-kol-candidates" className="search-ticket-candidates p-datatable-custom" emptyMessage="Không có dữ liệu">
                    <Column header="#" body={indexTemplate} style={{ maxWidth: '3rem' }} />
                    <Column field="username" header="Tài khoản tiktoker" style={{ minWidth: '15rem' }} body={renderName} />
                    <Column field="totalFollowersCount" header={renderHeaderFollower} style={{ minWidth: '10rem' }} body={renderFollower} />
                    <Column field="videoAvg" header={renderHeaderVideoAvg} style={{ minWidth: '10rem' }} body={renderVideoAvg} />
                    <Column field="totalAvgVideo" header={renderHeaderTotalAvgVideo} style={{ minWidth: '10rem' }} body={renderTotalAvgVideo} />
                    <Column field="totalVideoRevenue" header={renderHeaderTotalVideoRevenue} style={{ minWidth: '10rem' }} body={renderTotalVideoRevenue} />
                    <Column field="liveAvg" header={renderHeaderLiveAvg} style={{ minWidth: '12rem' }} body={renderLiveAvg} />
                    <Column field="totalAvgLive" header={renderHeaderTotalAvgLive} style={{ minWidth: '13rem' }} body={renderTotalAvgLive} />
                    <Column field="totalLiveRevenue" header={renderHeaderTotalLiveRevenue} style={{ minWidth: '10rem' }} body={renderTotalLiveRevenue} />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '4rem' }} />
                </DataTable>
                <Paginator template={template1} first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />
                <SidebarTiktok visibleSidebar={visibleSidebar} setVisibleSidebar={setVisibleSidebar} setChanging={setChanging} changing={changing} setVisibleRight={setVisibleRight} username={username} />
            </div>
        </>
    );
};
export default SearchTiktokCandidates;
