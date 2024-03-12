import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { TikTokProfileService } from '../../../demo/service/TikTokProfileService';
import { useRouter } from 'next/router';
import { formatNumberThousands } from '../../../src/commons/Utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TikTokSaveListService } from '../../../demo/service/TikTokSaveListService';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import { Tooltip } from 'primereact/tooltip';
import { Paginator } from 'primereact/paginator';
import { PAGE_SIZE_DEFAULT } from '../../../src/commons/Constant';
import NoteInput from './NoteInput';
import LabelsInput from './LabelsInput';
import { Sidebar } from 'primereact/sidebar';
import TabTiktok from '../search-tiktok-candidates/TabTiktok';
import { TabPanel, TabView } from 'primereact/tabview';
import getConfig from 'next/config';
import CandidateInfo from './CandidateInfo';
import SidebarInfluencer from '../search-tiktok-candidates/SidebarInfluencer';
import TabsKolTiktok from 'pages/commons/TabsKolTiktok';
import AppLayout from 'layout/AppLayout';

export default function SavedCandidateList() {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const toast = useRef(null);
    const [dataTiktoker, setDataTiktoker] = useState([]);
    const [visibleRight, setVisibleRight] = useState(false);
    const tikTokProfileService = new TikTokProfileService();
    const tikTokSaveListService = new TikTokSaveListService();
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
    const [changing, setChanging] = useState(false);
    const [labelsFilter, setLabelsFilter] = useState([]);
    const [username, setUsername] = useState('');
    const [visibleSidebar, setVisibleSidebar] = useState(false);

    const formik = useFormik({
        initialValues: {
            idTiktokSaveList: null,
            tag: null
        },
        onSubmit: async (data) => {
            const res = await tikTokProfileService.searchSavedList({
                idTiktokSaveList: formik.values.idTiktokSaveList,
                tiktokLabelId: formik.values.tag,
                page: page,
                recordPage: pageSize
            });
            setDataSavedList(res.data?.data?.content);
            setTotalRecords(res.data.data.totalElements);
            toast.current.show({
                severity: 'success',
                summary: 'Thông báo',
                detail: 'Lọc theo điều kiện thành công',
                life: 2000
            });
        }
    });

    const handleRemoveAllFilter = () => {
        formik.resetForm();
        setPage(1);
        setPageSize(PAGE_SIZE_DEFAULT);
    };

    const onPageChange = (event) => {
        setPage(event.page + 1);
        setPageSize(event.rows);
        setChanging(!changing);
    };

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };

    const location = useRouter().pathname;
    const [dataSavedList, setDataSavedList] = useState([]);
    const [dataList, setDataList] = useState([]);

    useEffect(async () => {
        const res = await tikTokSaveListService.search({});
        setDataList(res.data.data);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(async () => {
        const res = await tikTokProfileService.searchSavedList({
            idTiktokSaveList: formik.values.idTiktokSaveList,
            tiktokLabelId: formik.values.tag,
            page: page,
            recordPage: pageSize
        });
        setDataSavedList(res.data?.data?.content);
        setTotalRecords(res.data.data.totalElements);
    }, [changing]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        async function fetchData() {
            const res = await tikTokSaveListService.getAllLabels();
            if (res.data.code === 'success') {
                const data = res.data.data;
                setLabelsFilter(data);
            } else {
                setLabelsFilter([]);
            }
        }

        fetchData();
    }, []);

    const updateNote = async (tiktokProfileSaveListId, note) => {
        const response = await tikTokSaveListService.updateNote(tiktokProfileSaveListId, note);
        if (response.data.code !== 'success') {
            toast.current.show({
                severity: 'error',
                summary: 'Thông báo',
                detail: response.data.message,
                life: 2000
            });
            return;
        }

        toast.current.show({
            severity: 'success',
            summary: 'Thông báo',
            detail: response.data.message,
            life: 2000
        });

        // Update
        const itemIndex = dataSavedList.findIndex((item) => item.tiktokProfileSaveListId === tiktokProfileSaveListId);
        const newData = [...dataSavedList];
        console.log(newData[itemIndex]);
        newData[itemIndex].note = note;
        setDataSavedList(newData);
    };

    const rendernameTiktokSaveList = (rowData) => {
        return rowData?.nameTiktokSaveList;
    };

    const renderName = (rowData) => {
        return (
            <div
                onClick={() => {
                    if (!!rowData) {
                        setUsername(rowData?.username);
                        setDataTiktoker(rowData);
                    }
                    setVisibleSidebar(true);
                }}
            >
                <span className="font-bold cursor-pointer recruitment-title text-primary underline kolName-applied-candidates">{rowData?.username}</span>
            </div>
        );
    };

    const renderHeaderFollower = () => {
        return (
            <>
                <p>
                    Follower <i className="pi pi-info-circle followers ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
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
                    View trung bình/Video <i className="pi pi-info-circle video-avg ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
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
                    Doanh thu/Video <i className="pi pi-info-circle total-video-avg ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
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
                    Tổng doanh thu/Video <i className="pi pi-info-circle total-video-revenue ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
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
                    View trung bình/Live <i className="pi pi-info-circle live-avg ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
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
                    Doanh thu/Live <i className="pi pi-info-circle total-avg-live ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
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
                    Tổng doanh thu/Live <i className="pi pi-info-circle total-live-revenue ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
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

    const noteTemplate = (row) => {
        return <NoteInput key={row.tiktokProfileSaveListId} row={row} note={row?.note} onClick={(id, note) => updateNote(row?.tiktokProfileSaveListId, note)} />;
    };

    const HeaderNote = () => {
        return (
            <>
                <p>
                    Ghi chú <i className="pi pi-info-circle custom-target-persent-note ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
                </p>
                <Tooltip target=".custom-target-persent-note">Thêm ghi chú cho influcencer này</Tooltip>
            </>
        );
    };

    const contactTemplate = (rowData) => {
        return <CandidateInfo contactEmail={rowData?.contactEmail} contactPhone={rowData?.contactPhone} />;
    };

    const renderLabels = (row) => {
        return (
            <LabelsInput
                key={row.tiktokProfileSaveListId}
                row={row}
                labels={labelsFilter}
                onClick={(tiktokProfileSaveListId, label, isCreateNew) => {
                    if (isCreateNew) {
                        createLabel(row.tiktokProfileSaveListId, label);
                    } else {
                        deleteLabel(row.tiktokProfileSaveListId, label);
                    }
                }}
            />
        );
    };
    const createLabel = async (tiktokProfileSaveListId, label) => {
        const response = await tikTokSaveListService.createLabel(tiktokProfileSaveListId, label);
        if (response.data.code !== 'success') {
            toast.current.show({
                severity: 'error',
                summary: 'Thông báo',
                detail: response.data.message,
                life: 2000
            });
            return;
        }

        toast.current.show({
            severity: 'success',
            summary: 'Thông báo',
            detail: response.data.message,
            life: 2000
        });

        await updateLabelsFilter();
    };

    const deleteLabel = async (tiktokProfileSaveListId, label) => {
        const response = await tikTokSaveListService.deleteLabel(tiktokProfileSaveListId, label);
        if (response.data.code !== 'success') {
            toast.current.show({
                severity: 'error',
                summary: 'Thông báo',
                detail: response.data.message,
                life: 2000
            });
            return;
        }

        toast.current.show({
            severity: 'success',
            summary: 'Thông báo',
            detail: response.data.message,
            life: 2000
        });
        await updateLabelsFilter();
    };

    async function updateLabelsFilter() {
        const newLabels = await tikTokSaveListService.getAllLabels();
        if (newLabels.data.code === 'success') {
            const data = newLabels.data.data;
            setLabelsFilter(data);
        } else {
            setLabelsFilter([]);
        }
    }
    const HeaderLabels = () => {
        return (
            <>
                <p>
                    Thẻ phân loại <i className="pi pi-info-circle custom-target-persent-tag ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
                </p>
                <Tooltip target=".custom-target-persent-tag">Gắn thẻ phân loại giúp lọc và quản lý influcencer dễ dàng hơn. Ví dụ: Đã thanh toán, Đã gửi sản phẩm…</Tooltip>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    size="sm"
                    icon="pi pi-save"
                    label="Bỏ lưu"
                    className="p-button p-button-outlined"
                    onClick={(e) => {
                        removeFromList(rowData?.tiktokProfileSaveListId);
                    }}
                    tooltip="Bỏ lưu ứng viên"
                    tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                />
            </React.Fragment>
        );
    };

    const removeFromList = async (tiktokProfileSaveListId) => {
        const response = await tikTokSaveListService.removeTiktokProfileFromList(tiktokProfileSaveListId);
        if (response.data.code !== 'success') {
            toast.current.show({
                severity: 'error',
                summary: 'Thông báo',
                detail: response.data.message,
                life: 2000
            });
            return;
        }

        toast.current.show({
            severity: 'success',
            summary: 'Thông báo',
            detail: response.data.message,
            life: 2000
        });
        // Update
        const itemIndex = dataSavedList.findIndex((item) => item.tiktokProfileSaveListId === tiktokProfileSaveListId);
        const newData = [...dataSavedList];
        newData.splice(itemIndex, 1);
        setDataSavedList(newData);
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
            <SidebarInfluencer setChanging={setChanging} changing={changing} dataTiktoker={dataTiktoker} visibleRight={visibleRight} setVisibleRight={setVisibleRight} />
            <div className="card">
                <BreadcrumbCustom path={location} />
                <br />
                <div className="mb-2">
                    <TabsKolTiktok urlActive={location} />
                </div>
                <div className="card flex justify-content-left">
                    <form onSubmit={formik.handleSubmit} className="align-items-center gap-2">
                        <h4 className="mx-2">Danh sách Influencer đã lưu</h4>
                        <Toast ref={toast} />
                        <Dropdown
                            inputId="totalFollower"
                            name="totalFollower"
                            value={formik.values.idTiktokSaveList}
                            options={dataList}
                            optionLabel="name"
                            optionValue="idTiktokSaveList"
                            placeholder="Chọn danh sách"
                            emptyMessage="Không có danh sách nào được tạo"
                            className={classNames({ 'p-invalid': isFormFieldInvalid('idTiktokSaveList') }, 'mr-3')}
                            onChange={(e) => {
                                setPageSize(PAGE_SIZE_DEFAULT);
                                setPage(1);
                                formik.setFieldValue('idTiktokSaveList', e.target.value);
                            }}
                        />
                        {getFormErrorMessage('idTiktokSaveList')}

                        <Dropdown
                            inputId="tag"
                            name="tag"
                            value={formik.values.tag}
                            options={labelsFilter}
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Tất cả thẻ phân loại"
                            emptyMessage="Không có dữ liệu"
                            className={classNames({ 'p-invalid': isFormFieldInvalid('tag') }, 'mr-3')}
                            onChange={(e) => {
                                setPageSize(PAGE_SIZE_DEFAULT);
                                setPage(1);
                                formik.setFieldValue('tag', e.target.value);
                            }}
                        />
                        {getFormErrorMessage('tag')}
                        <Button type="submit" label="Tìm kiếm" icon="pi pi-search" />
                        <Button icon="pi pi-reply" onClick={handleRemoveAllFilter} label="Xóa chọn" className="p-button remove-filter ml-4"></Button>
                    </form>
                </div>
                <DataTable scrollable value={dataSavedList} dataKey="id" tableClassName="custom-table-kol-candidates-other" className="search-ticket-candidates p-datatable-custom" emptyMessage="Không có dữ liệu">
                    <Column header="#" body={indexTemplate} style={{ maxWidth: '3rem' }} />
                    <Column field="nameTiktokSaveList" header="Tên danh sách" style={{ minWidth: '10rem', wordBreak: 'break-all' }} body={rendernameTiktokSaveList} />
                    <Column field="username" header="Tài khoản tiktok" style={{ minWidth: '10rem' }} body={renderName} />
                    <Column field="totalFollowersCount" header={renderHeaderFollower} style={{ minWidth: '10rem' }} body={renderFollower} />
                    <Column field="videoAvg" header={renderHeaderVideoAvg} style={{ minWidth: '10rem' }} body={renderVideoAvg} />
                    <Column field="totalAvgVideo" header={renderHeaderTotalAvgVideo} style={{ minWidth: '10rem' }} body={renderTotalAvgVideo} />
                    <Column field="totalVideoRevenue" header={renderHeaderTotalVideoRevenue} style={{ minWidth: '10rem' }} body={renderTotalVideoRevenue} />
                    <Column field="liveAvg" header={renderHeaderLiveAvg} style={{ minWidth: '10rem' }} body={renderLiveAvg} />
                    <Column field="totalAvgLive" header={renderHeaderTotalAvgLive} style={{ minWidth: '10rem' }} body={renderTotalAvgLive} />
                    <Column field="totalLiveRevenue" header={renderHeaderTotalLiveRevenue} style={{ minWidth: '10rem' }} body={renderTotalLiveRevenue} />
                    {/* <Column field="contact" header="Liên hệ" style={{ minWidth: '10rem', maxWidth: '20rem' }} body={contactTemplate} /> */}
                    <Column style={{ minWidth: '16rem', maxWidth: '40rem', whiteSpace: 'nowrap' }} field="labels" header={HeaderLabels} body={renderLabels} />
                    <Column field="note" style={{ minWidth: '192px', maxWidth: '192px', whiteSpace: 'nowrap' }} header={HeaderNote} body={noteTemplate} />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem', justifyContent: 'flex-end' }} />
                </DataTable>
                <Paginator first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />
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
                                <TabTiktok key="TabTiktok" setChanging={setChanging} changing={changing} setVisibleRight={setVisibleRight} username={username} visible={visibleSidebar} />
                            </TabPanel>
                        </TabView>
                        <img className="logoPopup" src={`${contextPath}/layout/images/logo.jpg`} width="70" height={'30'} alt="logo" />
                    </div>
                </Sidebar>
            </div>
        </>
    );
}
