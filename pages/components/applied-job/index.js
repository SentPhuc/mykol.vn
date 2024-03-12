import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/router';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { KolRecruitmentService } from '../../../demo/service/KolRecruitmentService';
import JobCompletionReport from './JobCompletionReport';
import { Paginator } from 'primereact/paginator';
import { Dropdown } from 'primereact/dropdown';
import { convertToSlug, RECRUITMENT_STATUS_ENUM, SOCIAL_NETWORK,formartDate } from '../../../src/commons/Utils';
import { useFormik } from 'formik';
import AppLayout from '../../../layout/AppLayout';
import Link from 'next/link';
import axios from 'axios';
import { formatPriceVnd } from '../../../src/commons/Utils';
import FileSaver from 'file-saver';
import { DEV_URL } from '../../../src/commons/Utils';
import ViewDetailMessage from './ViewDetailMessage';

const AppliedJob = () => {
    const service = new KolRecruitmentService();
    const location = useRouter().pathname;
    const [appliedJobList, setAppliedJobList] = useState([]);
    const [chooseKolRecId, setChooseKolRecId] = useState([]);
    const [recSocialNetworks, setRecSocialNetworks] = useState([]);
    const [openJobCompletionReportPopup, setJobCompletionReportPopup] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [isSubmit, setIsSubmit] = useState(false);
    const [visibleViewDetailMessage, setVisibleViewDetailMessage] = useState(false);

    const onPageChange = (event) => {
        setPage(event.page + 1);
        setPageSize(event.rows);
    };

    const formik = useFormik({
        initialValues: {
            key: '',
            recruitmentStatus: ''
        },
        onSubmit: async (data) => {
            formik.resetForm();
        }
    });

    const handleRemoveAllFilter = () => {
        formik.resetForm();
    };

    const [sorting, setSorting] = useState('');

    const sort = [
        { name: 'Mới nhất', code: 'DESC' },
        { name: 'Cũ nhất', code: 'ASC' }
    ];

    const isOneObjectPropertyNonUndefined = (object) => {
        return Object.values(object).some((v) => v !== undefined);
    };

    useEffect(() => {
        if (isOneObjectPropertyNonUndefined(formik.values)) {
            setPage(1);
        }
    }, [formik.values]);

    useEffect(async () => {
        try {
            const res = await service.appliedJob({
                page: page,
                recordPage: pageSize,
                sorting: sorting.code,
                ...formik.values
            });
            if (res.data.code === 'success') {
                let content = res.data.data.content;
                setAppliedJobList(content);
                setTotalRecords(res.data.data.totalElements);
            } else {
                setAppliedJobList([]);
            }
        } catch (e) {
            console.log(e);
        }
    }, [page, sorting, pageSize, isSubmit, formik.values]);

    const exportExcel = () => {
        console.log("before download");
        axios({
            url: `${DEV_URL}/api/kols/report/export-applied-job`,
            method: 'get',
            responseType: 'blob'
        })
            .then((res) => {
                const filetype = res.data.type;
                const file = new Blob([res.data], { type: filetype }); 
                FileSaver.saveAs(file, 'applied-job.xlsx');
            })
            .catch((error) => {
                console.error('error while downloading file:', error);
            });
    };

    //=========================================================================================================

    const dataViewHeader = (
        <>
            <div className="header-applied-job mb-4">
                <h2>
                    <span>{totalRecords} Việc làm đã ứng tuyển</span>
                </h2>
                <div className="note">
                    <p>
                        <i className="pi pi-exclamation-circle pr-2"></i>
                        MỚI! Bạn có thể gửi yêu cầu theo dõi đến nhà tuyển dụng sau 7 ngày từ khi ứng tuyển nếu đơn ứng tuyển của bạn vẫn còn trong trạng thái "Đang chờ duyệt". Mỗi công việc chỉ được gửi yêu cầu một lần.
                    </p>
                </div>
            </div>
        </>
    );

    const renderHeader = () => {
        return (
            <>
                <div className="grid align-items-center">
                    <div className="col-12 md:col-6 lg:col-2">
                        <Dropdown
                            value={formik.values.recruitmentStatus}
                            onChange={(e) => formik.setFieldValue('recruitmentStatus', e.value)}
                            options={RECRUITMENT_STATUS_ENUM}
                            optionLabel="name"
                            optionValue="code"
                            className="w-full"
                            placeholder="Trạng thái tuyển dụng"
                        />
                    </div>
                    <div className="col-12 md:col-6 lg:col-2">
                        <Dropdown
                            value={formik.values.key}
                            onChange={(e) => {
                                formik.setFieldValue('key', e.value);
                            }}
                            options={SOCIAL_NETWORK}
                            optionLabel="name"
                            optionValue="code"
                            className="w-full"
                            placeholder="Nền tảng"
                        />
                    </div>
                    <div className="col-12 md:col-6 lg:col-1">
                        <Button icon="pi pi-reply" onClick={handleRemoveAllFilter} label="Xóa chọn" className="p-button remove-filter w-120"></Button>
                    </div>
                </div>
            </>
        );
    };

    const applyTimeTemplate = (rowData) => {
        let today = new Date().getTime();
        let dateData = new Date(rowData.postVideoDeadlineAt).getTime();
        let daysLeft = dateData - today;
        if(!rowData.postVideoDeadlineAt) return '-';
        if(daysLeft < 0) return 'Hết hạn';
        return (
            <div>
                <p className='mb-1'>{formartDate(rowData.postVideoDeadlineAt)}</p>
                <p>{'Còn lại: ' +  Math.ceil(daysLeft / (24*60*60*1000)) + ' Ngày'}</p>
            </div>
        );
    };

    const jobTitleTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <Link
                    href={{
                        pathname: '/components/company/recruitment-detail/[mask]/[id]',
                        query: {
                            mask: convertToSlug(rowData?.mask),
                            id: rowData.recruitmentId
                        }
                    }}
                >
                    <a target="_blank" className="font-bold mb-2 cursor-pointer recruitment-title">
                        {rowData?.jobTitle}
                    </a>
                </Link>
            </div>
        );
    };

    const renderStatusTemplate = (rowData) => {
        return getRecruitmentStatus(rowData.recruitmentStatus, rowData?.isReport);
    };

    const messageTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-comment" className={'ml-4 mb-2'} style={{ borderColor: 'gray', backgroundColor: 'white', color: 'gray' }} onClick={() => setVisibleViewDetailMessage(rowData.kolId + '-' + rowData.recruitmentId)} />
                {visibleViewDetailMessage && visibleViewDetailMessage === rowData.kolId + '-' + rowData.recruitmentId && (
                    <ViewDetailMessage setVisibleViewDetailMessage={setVisibleViewDetailMessage} visibleViewDetailMessage={visibleViewDetailMessage} data={rowData || ''} />
                )}
            </>
        );
    };

    const indexTemplate = (rowData, field) => {
        return field.rowIndex + 1;
    };

    const onApprovedHandler = (isReport, status) => {
        const approvedDisplay = {
            false: onApprovedWithoutReport,
            true: onApprovedWithReport
        };
        return approvedDisplay?.[isReport]?.(status);
    };

    const onWaitingHandler = (isReport, status) => {
        return <Tag value={'Đang chờ'} severity={getStatus(status)} className="m-auto px-2 py-2"></Tag>;
    };

    const onrejectionhandled = (isReport, status) => {
        return <Tag value={'Từ chối'} severity={getStatus(status)} className="m-auto px-2 py-2"></Tag>;
    };

    const temporarilyBrowsinghandled = (isReport, status) => {
        return <Tag value={'Tạm duyệt'} severity={getStatus(status)} className="m-auto px-2 py-2"></Tag>;
    };

    const getStatus = (e) => {
        const severity = {
            0: 'warning',
            1: 'success',
            2: 'danger',
            3: 'info'
        };
        return severity?.[e];
    };

    const onApprovedWithoutReport = (status) => {
        return <Tag value={'Đã duyệt'} severity={getStatus(status)} className="m-auto px-2 py-2"></Tag>;
    };

    const renderReportTemplate = (rowData) => {
        return (
            <div>
                {rowData.isReport ? (
                    <Button label="Đã báo cáo kết quả" disabled={true} className="p-button send-email-button center-item" />
                ) : (
                    <Button
                        icon="pi pi-send"
                        label="Báo cáo kết quả"
                        disabled={rowData.recruitmentStatus == 2 || rowData.recruitmentStatus == 0}
                        onClick={() => {
                            setJobCompletionReportPopup(true);
                            setChooseKolRecId(rowData.kolRecId);
                            setRecSocialNetworks(rowData?.recSocialNetworks)
                        }}
                        className="p-button send-email-button center-item"
                    />
                )}
            </div>
        );
    };

    const onApprovedWithReport = (status) => {
        return <Tag value={'Đã duyệt'} severity={getStatus(status)} className="m-auto px-2 py-2"></Tag>;
    };

    const getRecruitmentStatus = (status, isReport) => {
        const statuses = {
            0: onWaitingHandler,
            1: onApprovedHandler,
            2: onrejectionhandled,
            3: temporarilyBrowsinghandled
        };
        return statuses?.[status]?.(isReport, status);
    };

    const priceBookingTemplate = (rowData) => {
        return rowData?.bookingPrice != null ? formatPriceVnd(rowData?.bookingPrice) : '-';
    };


    return AppLayout(
        <>
            <React.Fragment>
                <div className="layout-main">
                    <div className="card md:px-5 px-3">
                        <BreadcrumbCustom path={location} />
                        <br />
                        {dataViewHeader}
                        <div className="flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
                            <h4 className="m-0">Hồ sơ tin tuyển dụng</h4>
                            <Button className="p-button-danger p-button-outlined" type="button" label="Tải danh sách" icon="pi pi-file-excel" severity="info" onClick={exportExcel} data-pr-tooltip="XLS" />
                        </div>
                        <DataTable scrollable value={appliedJobList} header={renderHeader()} dataKey="id" selectionMode="checkbox" emptyMessage="Không có dữ liệu" currentPageReportTemplate="Hiển thị từ {first} đến {last} của {totalRecords} bản ghi">
                            <Column header="#" body={indexTemplate} style={{ minWidth: '1rem', maxWidth: '3rem' }} />
                            <Column sortable sortField="jobTitle" header="Tên công việc" style={{ minWidth: '15rem' }} body={jobTitleTemplate} />
                            <Column field="status" header="Trạng thái ứng tuyển" style={{ minWidth: '12rem', maxWidth: '12rem' }} body={renderStatusTemplate} />
                            <Column field="message" header="Đề xuất" style={{ minWidth: '12rem', maxWidth: '5rem', justifyContent: 'center' }} body={messageTemplate} />
                            <Column field="priceCast" header="Giá cast đã chốt" body={priceBookingTemplate} style={{ minWidth: '14rem' }} />
                            <Column field="expirationDate" header="Thời hạn đăng bài" sortable style={{ minWidth: '14rem' }} body={applyTimeTemplate} />
                            <Column field="report" header="Kết quả công việc" style={{ minWidth: '20rem' }} body={renderReportTemplate} />
                        </DataTable>

                        <Paginator rowsPerPageOptions={[5, 10, 20, 50, 100, 200, 500]} first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />
                        <JobCompletionReport isSubmit={isSubmit} setIsSubmit={setIsSubmit} recSocialNetworks={recSocialNetworks} chooseKolRecId={chooseKolRecId} openJobCompletionReportPopup={openJobCompletionReportPopup} setJobCompletionReportPopup={setJobCompletionReportPopup} />
                    </div>
                </div>
            </React.Fragment>
        </>
    );
};
export default AppliedJob;
