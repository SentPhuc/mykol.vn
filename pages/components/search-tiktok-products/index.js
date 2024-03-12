import { useRef, useState, useEffect } from 'react';
import BreadcrumbCustom from 'pages/commons/BreadcrumbCustom';
import { useRouter } from 'next/router';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { Tooltip } from 'primereact/tooltip';
import { Ripple } from 'primereact/ripple';
import { SORT_ORDER_TIKTOK_PRODUCT, formatNumberThousands, SALES_AVG_ENUM, VIDEOS_KOC_KOL_AVG_ENUM, KOC_KOL_ENUM, formatCurrencyVND } from 'src/commons/Utils';
import { SubscriptionService } from 'demo/service/SubscriptionService';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useSelector } from 'react-redux';
import { ProductsService } from 'demo/service/ProductsService';
import AppLayout from 'layout/AppLayout';
import _ from 'lodash';
import TabsKolTiktok from 'pages/commons/TabsKolTiktok';

const SearchTiktokProducts = () => {
    const products = new ProductsService();
    const subscription = new SubscriptionService();
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
    const [changing, setChanging] = useState(false);
    const [infoPackage, setInfoPackage] = useState();
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [datas, setDatas] = useState([]);
    const location = useRouter().pathname;
    const toast = useRef(null);

    const [page, setPage] = useState(1);
    const [pageGoTo, setPageGoTo] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        if (!isLoggedIn) return;

        subscription
            .getMySubscriptionsPackage()
            .then((data) => {
                if (data?.data?.code === 'success') {
                    setInfoPackage(data?.data?.data);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, [isLoggedIn]);

    const formik = useFormik({
        initialValues: {
            name: '',
            sorting: 'soldCount'
        },
        onSubmit: async (data) => {
            await products
                .search({
                    name: data.name,
                    sorting: data.sorting,
                    page: page,
                    recordPage: pageSize
                })
                .then((res) => {
                    if (res.data.code == 'success') {
                        setDatas(res.data.data.content);
                        setTotalRecords(res.data.data.totalElements);
                        if (res.data.data.totalElements == 0) {
                            toast?.current?.show({
                                severity: 'warn',
                                summary: 'Warning',
                                detail: 'Hiện sản phẩm này chưa có sẵn dữ liệu, chúng tôi đang tiến hành update, vui lòng chờ 3-5p và kiểm tra lại',
                                life: 3000
                            });
                            return;
                        }
                        toast?.current?.show({
                            severity: 'success',
                            summary: 'Thông báo',
                            detail: 'Tìm kiếm sản phẩm ' + data.name + ' thành công',
                            life: 2000
                        });
                    } else if (res.data.code == 'limit') {
                        handleNoti(data.actionType);
                    } else {
                        toast?.current?.show({
                            severity: 'error',
                            summary: 'Thông báo',
                            detail: res.data.message,
                            life: 2000
                        });
                    }
                });
        }
    });

    const formikFilter = useFormik({
        initialValues: {
            name: '',
            soldCount: '',
            videoCount: '',
            tiktokProfileCount: ''
        },
        onSubmit: async (data) => {
            products
                .search({
                    name: formik.values.name,
                    soldCount: data.soldCount,
                    videoCount: data.videoCount,
                    tiktokProfileCount: data.tiktokProfileCount,
                    sorting: formik.values.sorting,
                    page: page,
                    recordPage: pageSize
                })
                .then((res) => {
                    if (res.data.code == 'success') {
                        setDatas(res.data.data.content);
                        setTotalRecords(res.data.data.totalElements);
                        toast?.current?.show({
                            severity: 'success',
                            summary: 'Thông báo',
                            detail: 'Lọc thành công',
                            life: 2000
                        });
                    } else if (res.data.code == 'limit') {
                        handleNoti(data.actionType);
                    } else {
                        toast?.current?.show({
                            severity: 'error',
                            summary: 'Thông báo',
                            detail: res.data.message,
                            life: 2000
                        });
                    }
                });
        }
    });

    useEffect(async () => {
        await products
            .search({
                page: page,
                recordPage: pageSize,
                name: formik.values.name,
                soldCount: formikFilter.values.soldCount,
                videoCount: formikFilter.values.videoCount,
                tiktokProfileCount: formikFilter.values.tiktokProfileCount,
                sorting: formik.values.sorting
            })
            .then((res) => {
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
    }, [formik.values.sorting, changing]);

    useEffect(() => {
        subscription
            .getMySubscriptionsPackage()
            .then((data) => {
                if (data?.data?.code === 'success') {
                    setInfoPackage(data?.data?.data);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, [isLoggedIn]);

    const handleRemoveAllFilter = () => {
        setPage(1);
        formikFilter.resetForm();
        formik.resetForm();
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h4 className="m-0">Danh sách sản phẩm</h4>
                <div className="grid grap-1 w-full lg:w-22rem lx:w-auto md:w-auto">
                    <div className="col-4 item-filter-influencer-ranking align-items-center flex">Sắp xếp theo</div>
                    <div className="col-8 item-filter-influencer-ranking">
                        <span className="p-input-icon-left w-full">
                            <Dropdown
                                value={formik.values.sorting}
                                onChange={(e) => {
                                    formik.setFieldValue('sorting', e.value);
                                }}
                                options={SORT_ORDER_TIKTOK_PRODUCT}
                                optionLabel="name"
                                optionValue="value"
                                display="chip"
                                placeholder="Chọn lượt bán"
                                className="w-full"
                            />
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const indexTemplate = (rowData, field) => {
        return field.rowIndex + 1;
    };

    const renderNameProduct = (rowData) => {
        return (
            <a href={`https://shop.tiktok.com/view/product/${rowData.productId}`} target="_blank" className="font-bold overflow-hidden underline text-primary search-tiktok-products-name line-clamp-2">
                {rowData?.name}
            </a>
        );
    };

    const renderPrices = (rowData) => {
        return formatCurrencyVND(rowData?.price) ?? 'N/A';
    };

    const renderSales = (rowData) => {
        return (rowData?.soldCount && formatNumberThousands(rowData?.soldCount)) ?? 'N/A';
    };

    const renderRating = (rowData) => {
        return (rowData?.ratingCount ?? 0) + '/5' ?? 'N/A';
    };

    const renderReviews = (rowData) => {
        return rowData?.reviewCount ?? 'N/A';
    };

    const renderVideoAdvertise = (rowData) => {
        return rowData?.videoCount ?? 'N/A';
    };

    const renderKOCKOL = (rowData) => {
        return rowData?.tiktokProfileCount ?? 'N/A';
    };

    const reject = () => (window.location.href = '/components/service-packages-and-payments/');

    const handleShowInfoSocial = () => {
        if (!!infoPackage && infoPackage?.name == 'Trải nghiệm') {
            setVisibleDialog(true);
            return;
        }

        return window.open(`/components/search-tiktok-products/all${!!formik?.values?.name ? '?searchKeyword=' + formik.values.name : ''}`, '_blank');
    };

    const renderHeaderViewAll = () => {
        return (
            <>
                <div className="flex align-items-center">
                    <Button disabled={!!infoPackage && infoPackage?.name == 'Trải nghiệm'} label="Xem tất cả" onClick={() => handleShowInfoSocial()} severity="danger" />{' '}
                    <i className="pi pi-info-circle total-view-all ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
                </div>
                <Tooltip target=".total-view-all">Xem tất cả KOC, KOL đã quảng bá cho sản phẩm bạn đang tìm kiếm</Tooltip>
            </>
        );
    };

    const renderItemsView = (rowData) => {
        return <Button label="Xem danh sách" onClick={() => window.open(`/components/search-tiktok-products/${rowData?.productId}?product=${encodeURIComponent(rowData.name)}`, '_blank')} severity="danger" />;
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
        formikFilter.values.actionType = 'NEXT_PAGE';
        setPageSize(options.rows);
        setChanging(!changing);
    };

    const onPageChange = (event) => {
        formikFilter.values.actionType = 'NEXT_PAGE';
        setPage(event.page + 1);
        setPageSize(event.rows);
        setChanging(!changing);
    };

    return AppLayout(
        <div className="card">
            <BreadcrumbCustom path={location} />
            <Toast ref={toast} />
            <br />
            <div className="mb-2">
                <TabsKolTiktok urlActive={location} />
            </div>
            <div className="card flex justify-content-left filter-name">
                <form onSubmit={formik.handleSubmit} className="align-items-center w-full gap-2">
                    <h4 className="mx-2">Tìm kiếm KOC, KOL theo tên sản phẩm</h4>
                    <div className="flex w-full m-auto align-items-center" style={{ maxWidth: '600px' }}>
                        <InputText
                            filter="true"
                            inputid="name"
                            name="name"
                            value={formik.values.name}
                            placeholder="Nhập keyword chính, ví dụ: Đồ chơi, Áo nam,..."
                            onChange={(e) => {
                                formik.setFieldValue('name', e.target.value);
                            }}
                            style={{ width: 'calc(100% - 140px)' }}
                        />
                        <Button type="submit" label="Tìm kiếm" icon="pi pi-search" className="ml-3 white-space-nowrap" style={{ width: '120px' }} onClick={() => setPage(1)} />
                    </div>
                </form>
            </div>
            <div className="card flex justify-content-left filter-tiktok-candidates" style={{ overflow: 'scroll' }}>
                <form onSubmit={formikFilter.handleSubmit} className="align-items-center gap-2">
                    <h4 className="mx-2">Bộ lọc</h4>
                    <div className="overflow-hidden">
                        <div className="flex">
                            <div className="flex-1 flex m-2 pr-3 py-3">
                                <Dropdown
                                    inputid="soldCount"
                                    name="soldCount"
                                    value={formikFilter.values.soldCount}
                                    options={SALES_AVG_ENUM}
                                    optionLabel="name"
                                    optionValue="value"
                                    placeholder="Lượt bán"
                                    onChange={(e) => {
                                        formikFilter.setFieldValue('soldCount', e.target.value);
                                    }}
                                />
                            </div>
                            <div className="flex-1 flex m-2 pr-3 py-3">
                                <Dropdown
                                    inputid="videoCount"
                                    name="videoCount"
                                    value={formikFilter.values.videoCount}
                                    options={VIDEOS_KOC_KOL_AVG_ENUM}
                                    optionLabel="name"
                                    optionValue="value"
                                    placeholder="Video quảng bá"
                                    onChange={(e) => {
                                        formikFilter.setFieldValue('videoCount', e.target.value);
                                    }}
                                />
                            </div>
                            <div className="flex-1 flex m-2 pr-3 py-3">
                                <Dropdown
                                    inputid="tiktokProfileCount"
                                    name="tiktokProfileCount"
                                    value={formikFilter.values.tiktokProfileCount}
                                    options={KOC_KOL_ENUM}
                                    optionLabel="name"
                                    optionValue="value"
                                    placeholder="KOC, KOL"
                                    onChange={(e) => {
                                        formikFilter.setFieldValue('tiktokProfileCount', e.target.value);
                                    }}
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
            <DataTable scrollable value={datas} header={renderHeader} dataKey="id" tableClassName="custom-table-kol-candidates" className="search-ticket-candidates p-datatable-custom" emptyMessage="Không có dữ liệu">
                <Column header="#" body={indexTemplate} style={{ maxWidth: '42px', width: '42px' }} />
                <Column field="nameProduct" header="Tên sản phẩm" style={{ minWidth: '10rem' }} body={renderNameProduct} />
                <Column field="prices" header="Giá bán" style={{ minWidth: '10rem' }} body={renderPrices} />
                <Column field="sales" header="Lượt bán" style={{ minWidth: '10rem' }} body={renderSales} />
                <Column field="rating" header="Rating" style={{ minWidth: '10rem' }} body={renderRating} />
                <Column field="commnets" header="Lượng đánh giá" style={{ minWidth: '10rem' }} body={renderReviews} />
                <Column field="videoAdvertise" header="Video quảng bá" style={{ minWidth: '10rem' }} body={renderVideoAdvertise} />
                <Column field="kockol" header="KOC, KOL" style={{ minWidth: '10rem' }} body={renderKOCKOL} />
                <Column field="itemsView" header={renderHeaderViewAll} style={{ minWidth: '170px', width: '170px' }} body={renderItemsView} />
            </DataTable>
            <Paginator template={template1} first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />

            <ConfirmDialog
                style={{ maxWidth: '320px' }}
                visible={visibleDialog}
                onHide={() => setVisibleDialog(false)}
                header="Vui lòng đăng ký gói trả phí"
                message="Bạn cần đăng ký gói dịch vụ trả phí để sử dụng tính năng này"
                rejectClassName="m-auto block"
                acceptClassName="hidden"
                rejectLabel="Đi đến trang thanh toán"
                reject={reject}
            />
        </div>
    );
};

export default SearchTiktokProducts;
