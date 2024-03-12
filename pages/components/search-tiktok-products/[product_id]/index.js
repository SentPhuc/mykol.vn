import { useRef, useState, useEffect } from 'react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { Ripple } from 'primereact/ripple';
import { SORT_ORDER_TIKTOK, formatNumberThousands } from 'src/commons/Utils';
import { TikTokProfileService } from 'demo/service/TikTokProfileService';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { DataView } from 'primereact/dataview';
import { Sidebar } from 'primereact/sidebar';
import { TabView } from 'primereact/tabview';
import { TabPanel } from 'primereact/tabview';
import TabTiktok from 'pages/components/search-tiktok-candidates/TabTiktok';
import SidebarInfluencer from 'pages/components/search-tiktok-candidates/SidebarInfluencer';
import AppLayout from 'layout/AppLayout';
import { ProductsService } from 'demo/service/ProductsService';

const ListKOLsAdvertisingProducts = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const tikTokProfileService = new TikTokProfileService();
    const products = new ProductsService();
    const [visibleSidebar, setVisibleSidebar] = useState(false);
    const [visibleRight, setVisibleRight] = useState(false);
    const [visibleVideo, setVisibleVideo] = useState(false);
    const [dataTiktoker, setDataTiktoker] = useState([]);
    const [username, setUsername] = useState('');
    const [tiktokProfileId, setTiktokProfileId] = useState(0);
    const [changing, setChanging] = useState(false);
    const [sorting, setSorting] = useState('totalFollowersCount');
    const [datas, setDatas] = useState([]);
    const toast = useRef(null);
    const router = useRouter();
    const product_id = router.query.product_id;
    const productName = router.query.product;
    const searchKeyword = router.query.searchKeyword;
    const [page, setPage] = useState(1);
    const [pageGoTo, setPageGoTo] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [videosPopup, setVideosPopup] = useState([]);

    useEffect(async () => {
        if (!product_id) return;

        const params = {
            sorting: sorting,
            page: page,
            recordPage: pageSize,
            actionType: 'SEARCH',
            withProduct: product_id == 'all',
            searchKeyword,
            product_id
        };
        if (!product_id || product_id == 'all') {
            delete params.product_id;
        }

        if (!searchKeyword) {
            delete params.searchKeyword;
        }

        await tikTokProfileService.search(params).then((res) => {
            if (res.data.code == 'success') {
                setDatas(res.data.data.content);
                setTotalRecords(res.data.data.totalElements);
            } else {
                toast?.current?.show({
                    severity: 'error',
                    summary: 'Thông báo',
                    detail: res.data.message,
                    life: 2000
                });
            }
        });
    }, [pageSize, changing, sorting, product_id, searchKeyword]);

    useEffect(() => {
        try {
            const fetchData = async () => {
                if (!!product_id && !!tiktokProfileId && !!visibleVideo) {
                    const res = await products.videos(product_id, tiktokProfileId);
                    if (res?.data?.code == "success") {
                        setVideosPopup(res?.data?.data?.videos);
                    }
                }
            };
            fetchData();
        } catch (error) {
            console.log(error);
        }
    }, [product_id, tiktokProfileId, visibleVideo]);

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h4 className="m-0">Danh sách KOL, KOC</h4>
                <div className="grid grap-1 w-full lg:w-22rem lx:w-auto md:w-auto">
                    <div className="col-4 item-filter-influencer-ranking align-items-center flex">Sắp xếp theo</div>
                    <div className="col-8 item-filter-influencer-ranking">
                        <span className="p-input-icon-left w-full">
                            <Dropdown value={sorting} onChange={(e) => setSorting(e.value)} options={SORT_ORDER_TIKTOK} optionLabel="name" optionValue="value" display="chip" placeholder="Chọn sắp xếp" className="w-full" />
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const indexTemplate = (rowData, field) => {
        return field.rowIndex + 1;
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
        setPageSize(options.rows);
        setChanging(!changing);
    };

    const onPageChange = (event) => {
        setPage(event.page + 1);
        setPageSize(event.rows);
        setChanging(!changing);
    };

    const renderName = (rowData) => {
        return (
            <div
                onClick={() => {
                    if (!!rowData) {
                        setUsername(rowData?.username);
                    }
                    setDataTiktoker(rowData);
                    setVisibleSidebar(true);
                }}
            >
                <span className="font-bold cursor-pointer recruitment-title underline text-primary kolName-applied-candidates">{rowData?.username}</span>
            </div>
        );
    };

    const renderFollower = (rowData) => {
        return formatNumberThousands(rowData?.totalFollowersCount) || 'N/A';
    };

    const renderVideoAvg = (rowData) => {
        return (rowData?.videoAvg && formatNumberThousands(rowData?.videoAvg)) || 'N/A';
    };

    const renderTotalAvgVideo = (rowData) => {
        return (rowData?.totalAvgVideo && formatNumberThousands(rowData?.totalAvgVideo) + ' VNĐ') || 'N/A';
    };

    const renderTotalVideoRevenue = (rowData) => {
        return (rowData?.totalVideoRevenue && formatNumberThousands(rowData?.totalVideoRevenue) + ' VNĐ') || 'N/A';
    };

    const renderLiveAvg = (rowData) => {
        return (rowData?.liveAvg && formatNumberThousands(rowData?.liveAvg)) || 'N/A';
    };

    const renderTotalAvgLive = (rowData) => {
        return (rowData?.totalAvgLive && formatNumberThousands(rowData?.totalAvgLive) + ' VNĐ') || 'N/A';
    };

    const renderTotalLiveRevenue = (rowData) => {
        return (rowData?.totalLiveRevenue && formatNumberThousands(rowData?.totalLiveRevenue) + ' VNĐ') || 'N/A';
    };

    const handleViewVideo = (id) => {
        if (product_id == 'all') {
            confirmDialog({
                message: 'Bạn vui lòng click username của KOC, KOL để xem video',
                header: '',
                rejectLabel: 'Đóng',
                className: 'custom-confirmDialog-pricing'
            });
            return;
        }
        setTiktokProfileId(id);
        return setVisibleVideo(true);
    };

    const renderPromotionalVideos = (rowData) => {
        return (
            <div onClick={() => handleViewVideo(rowData?.id)} className="underline text-primary font-bold cursor-pointer">
                Xem video
            </div>
        );
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

    const itemTemplateVideo = (video) => {
        return (
            <div key={video} className="item-videos w-full cursor-pointer">
                <a href={video?.url} title={video?.title} className="text-color" target="_blank">
                    <div className="grid">
                        <div className="col col-12 md:col-4" style={{ height: '130px' }}>
                            <div className="relative h-full">
                                <img
                                    style={{ objectFit: 'contain' }}
                                    src={video?.thumbnailUrl ? `${process.env.MEDIA_URL}/${video?.thumbnailUrl}` : `${contextPath}/layout/images/logo.jpg`}
                                    alt={video?.title}
                                    height={130}
                                    className="w-full border-1 border-solid surface-border border-round overflow-hidden h-full absolute left-0 top-0"
                                />
                            </div>
                        </div>
                        <div className="col col-12 md:col-8">
                            <h4 className="mb-2 hover:text-primary text-lg line-height-3 cut-line-2">{video?.title}</h4>
                            <div className="social-video">
                                <span className="mr-3 inline-block">
                                    <i className="pi mr-2 vertical-align-middle pi-eye"></i>
                                    {formatNumberThousands(video?.totalViewsCount)}
                                </span>
                                <span className="mr-3 inline-block">
                                    <i className="pi mr-2 vertical-align-middle pi-heart-fill"></i>
                                    {video?.totalLikesCount}
                                </span>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        );
    };

    const headerTabTiktok = (options) => {
        return (
            <div onClick={options.onClick} className={options.className}>
                <img className="mr-2" src={`${contextPath}/demo/images/social/icon-tiktok-tab.svg`} alt="Tiktok" />
                <img className="mr-2 active" src={`${contextPath}/demo/images/social/icon-tiktok-tab-active.svg`} alt="Tiktok" />
                Tiktok
            </div>
        );
    };

    return AppLayout(
        <>
            <ConfirmDialog />
            <div className="card">
                <br />
                <div className="card flex justify-content-left filter-name">
                    <h4 className="mb-0" dangerouslySetInnerHTML={{ __html: `Danh sách KOC, KOL quảng bá cho sản phẩm ${product_id == 'all' ? '' : '<span style="color: var(--primary-color) !important">: ' + productName + '<span>'}` }}></h4>
                </div>
                <DataTable scrollable value={datas} header={renderHeader} dataKey="id" tableClassName="custom-table-kol-candidates-kol-all" className="search-ticket-candidates p-datatable-custom" emptyMessage="Không có dữ liệu">
                    <Column header="#" body={indexTemplate} style={{ maxWidth: '42px', width: '42px' }} />
                    <Column field="username" header="Tài khoản tiktoker" style={{ minWidth: '10rem' }} body={renderName} />
                    <Column field="totalFollowersCount" header={'Followers'} style={{ minWidth: '10rem' }} body={renderFollower} />
                    <Column field="videoAvg" header={'View trung bình / Video'} style={{ minWidth: '10rem' }} body={renderVideoAvg} />
                    <Column field="totalAvgVideo" header={'Doanh thu / video'} style={{ minWidth: '10rem' }} body={renderTotalAvgVideo} />
                    <Column field="totalVideoRevenue" header={'Tổng doanh thu Video'} style={{ minWidth: '10rem' }} body={renderTotalVideoRevenue} />
                    <Column field="liveAvg" header={'View trung bình / Live'} style={{ minWidth: '10rem' }} body={renderLiveAvg} />
                    <Column field="totalAvgLive" header={'Doanh thu / Live'} style={{ minWidth: '10rem' }} body={renderTotalAvgLive} />
                    <Column field="totalLiveRevenue" header={'Tổng doanh thu Live'} style={{ minWidth: '10rem' }} body={renderTotalLiveRevenue} />
                    <Column className="view-videos" field="videos" header={'Video quảng bá'} style={{ minWidth: '10rem' }} body={renderPromotionalVideos} />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '118px', width: '118px' }} />
                </DataTable>
                <Paginator template={template1} first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />
            </div>
            <Dialog header="Video có gắn sản phẩm" visible={visibleVideo} style={{ width: '100%', maxWidth: '600px' }} onHide={() => setVisibleVideo(false)}>
                <DataView value={videosPopup} itemTemplate={itemTemplateVideo} paginator rows={3} />
            </Dialog>
            <Sidebar
                visible={visibleSidebar}
                position="right"
                onHide={() => {
                    setVisibleSidebar(false);
                }}
                className="custom-sidebar"
            >
                <div className="pl-2 md:pl-3 pr-2 md:pr-3 custom relative">
                    <TabView>
                        <TabPanel header="Tiktok" headerTemplate={headerTabTiktok} headerClassName="flex align-items-center header-tabs">
                            <TabTiktok key="TabTiktok" setChanging={setChanging} setVisibleRight={setVisibleRight} username={username} visible={visibleSidebar} />
                        </TabPanel>
                    </TabView>
                    <img className="logoPopup" src={`${contextPath}/layout/images/logo.jpg`} width="70" height={'30'} alt="logo" />
                </div>
            </Sidebar>
            <SidebarInfluencer setChanging={setChanging} changing={changing} dataTiktoker={dataTiktoker} visibleRight={visibleRight} setVisibleRight={setVisibleRight} />
        </>
    );
};
export default ListKOLsAdvertisingProducts;
