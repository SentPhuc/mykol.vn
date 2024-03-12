import React, {useEffect, useRef, useState} from 'react';
import {Button} from 'primereact/button';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import {useRouter} from 'next/router';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Dropdown} from 'primereact/dropdown';
import {Sidebar} from 'primereact/sidebar';
import {useFormik} from 'formik';
import {
    ACTIVITY_PLATFORM_ENUM,
    AGE_ENUM,
    calculateSerialNumber,
    DEV_URL,
    EFFECTIVE_ENUM,
    formatNumberThousands,
    formatPriceVnd,
    GENDER_ENUM,
    RECRUITMENT_STATUS_ENUM
} from '../../../src/commons/Utils';
import {MAJORS_OPTION} from 'src/commons/Constant';
import {KolRecruitmentService} from '../../../demo/service/KolRecruitmentService';
import StatusDropdown from './StatusDropdown';
import ViewDetailMessage from './ViewDetailMessage';
import {Toast} from 'primereact/toast';
import AppLayout from '../../../layout/AppLayout';
import {Paginator} from 'primereact/paginator';
import {Tooltip} from 'primereact/tooltip';
import {MultiSelect} from 'primereact/multiselect';
import axios from 'axios';
import FileSaver from 'file-saver';
import SidebarKOLInfo from './sidebar-kol-info';
import BookingPriceInput from './BookingPriceInput';
import CalendarPostVideoDeadlineAt from './CalendarPostVideoDeadlineAt';
import CandidateInfo from './CandidateInfo';
import PostRffect from './PostRffect';
import {useDispatch, useSelector} from 'react-redux';
import {addIdJobFilter} from 'public/reduxConfig/companyProfileSlice';
import NoteInput from './NoteInput';
import LabelsInput from './LabelsInput';

const AppliedCandidates = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const location = router.pathname;
    const [dataContent, setDataContent] = useState([]);
    const [dataKolsDetail, setDataKolsDetail] = useState([]);
    const service = new KolRecruitmentService();
    const [visibleViewDetailMessage, setVisibleViewDetailMessage] = useState(false);
    const [isIDShow, setIsIDShow] = useState(0);
    const toast = useRef(null);
    const [selectedJob, setSelectedJob] = useState([]);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(50);
    const [changing, setChanging] = useState(false);
    const [visibleSidebar, setVisibleSidebar] = useState(false);
    const idJobsFromState = useSelector((state) => state?.companyProfile?.idJob);
    const [labelsFilter, setLabelsFilter] = useState([]);
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            id: '',
            recruitmentStatus: '',
            careers: '',
            gender: '',
            age: '',
            hasReportResult: '',
            labels: ''
        },
        onSubmit: async (data) => {
            formik.resetForm();
        }
    });

    useEffect(async () => {
        const valueFormik = handleChangeFilterJobsFromRecruitments(formik.values, idJobsFromState);
        setLoading(true);
        const res = await service.getAppliedJobOfCandidates({
            ...valueFormik,
            page: page,
            recordPage: pageSize
        });
        if (res.data.code === 'success') {
            const data = res.data.data;
            if (data?.content?.length > 0) {
                setDataContent(data.content);
            }
            setTotalRecords(res.data.data.totalElements);
            setLoading(false);
        } else {
            setDataContent([]);
            setLoading(false);
        }
    }, [formik.values, changing, pageSize, idJobsFromState]);

    const handleChangeFilterJobsFromRecruitments = (value, idJobsFromState) => {
        if (idJobsFromState > 0) {
            formik.setFieldValue('id', idJobsFromState);
            value = { ...value, ...{ id: idJobsFromState } };
        }
        return value;
    };

    useEffect(() => {
        async function fetchData() {
            const res = await service.getAllJobsTitle({});
            if (res.data.code === 'success') {
                const data = res.data.data;
                setSelectedJob(data.content);
            } else {
                setSelectedJob([]);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            const res = await service.getAllLabels();
            if (res.data.code === 'success') {
                const data = res.data.data;
                setLabelsFilter(data);
            } else {
                setLabelsFilter([]);
            }
        }

        fetchData();
    }, []);

    const updatePriceBooking = async (kolRecruitId, bookingPrice) => {
        const response = await service.updateBookingPrice(kolRecruitId, bookingPrice);
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
        const itemIndex = dataContent.findIndex((item) => item.id === kolRecruitId);
        const newData = [...dataContent];
        newData[itemIndex].bookingPrice = bookingPrice;
        setDataContent(newData);
    };

    const updateNote = async (kolRecruitId, note) => {
        const response = await service.updateNote(kolRecruitId, note);
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
        const itemIndex = dataContent.findIndex((item) => item.id === kolRecruitId);
        const newData = [...dataContent];
        newData[itemIndex].note = note;
        setDataContent(newData);
    };

    const createLabel = async (kolRecruitId, label) => {
        const response = await service.createLabel(kolRecruitId, label);
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

    const deleteLabel = async (kolRecruitId, label) => {
        const response = await service.deleteLabel(kolRecruitId, label);
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

    const updateLabels = async (kolRecruitId, labels) => {
        const response = await service.updateLabels(kolRecruitId, labels);
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
        const itemIndex = dataContent.findIndex((item) => item.id === kolRecruitId);
        const newData = [...dataContent];
        newData[itemIndex].metaData.labels = labels;
        setDataContent(newData);

        await updateLabelsFilter();
    };

    async function updateLabelsFilter() {
        const newLabels = await service.getAllLabels();
        if (newLabels.data.code === 'success') {
            const data = newLabels.data.data;
            setLabelsFilter(data);
        } else {
            setLabelsFilter([]);
        }
    }

    const onChangeStatus = async (kolRecruitId, status) => {
        const response = await service.updateStatus(kolRecruitId, status);
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

        // Update status
        const itemIndex = dataContent.findIndex((item) => item.id === kolRecruitId);
        const newData = [...dataContent];
        newData[itemIndex].recruitmentStatus = status;
        setDataContent(newData);
    };

    const updatePostVideoDeadlineAt = async (kolRecruitId, postVideoDeadlineAt) => {
        const response = await service.updatePostVideoDeadlineAt(kolRecruitId, postVideoDeadlineAt);
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
        const itemIndex = dataContent.findIndex((item) => item.id === kolRecruitId);
        const newData = [...dataContent];
        newData[itemIndex].postVideoDeadlineAt = postVideoDeadlineAt;
        setDataContent(newData);
    };

    const statusDropDown = (row) => {
        return <StatusDropdown key={row.id} row={row} recruitmentStatus={row.recruitmentStatus} onChange={(kolRecruitId, status) => onChangeStatus(kolRecruitId, status)} />;
    };

    const renderBookingPrice = (row) => {
        return <BookingPriceInput key={row.id} row={row} bookingPrice={row?.bookingPrice} onClick={(kolRecruitId, bookingPrice) => updatePriceBooking(kolRecruitId, bookingPrice)} />;
    };

    const renderLabels = (row) => {
        return (
            <LabelsInput
                key={row.id}
                row={row}
                labels={labelsFilter}
                onClick={(kolRecruitId, label, isCreateNew) => {
                    if (isCreateNew) {
                        createLabel(kolRecruitId, label);
                    } else {
                        deleteLabel(kolRecruitId, label);
                    }
                }}
            />
        );
    };

    const renderNote = (row) => {
        return <NoteInput key={row.id} row={row} note={row?.note} onClick={(kolRecruitId, note) => updateNote(kolRecruitId, note)} />;
    };

    const toApplyDate = (row) => {
        return <CalendarPostVideoDeadlineAt key={row.id} row={row} postVideoDeadlineAt={row?.postVideoDeadlineAt} onChange={(kolRecruitId, postVideoDeadlineAt) => updatePostVideoDeadlineAt(kolRecruitId, postVideoDeadlineAt)} />;
    };

    const PostRffectTemplate = (rowData) => {
        return <PostRffect campaignId={rowData?.campaignId} url={rowData.url} />;
    };

    const PostLinkTemplate = (rowData) => {
        const url = rowData?.url;
        if (url) {
            return (
                <div key={rowData?.url}>
                    <a className="underline text-blue-400" href={url} target="_blank" title="Link bài viết">
                        Link bài viết
                    </a>
                </div>
            );
        }
        return <div>Chưa có bài đăng</div>;
    };

    const handleRemoveAllFilter = () => {
        dispatch(addIdJobFilter(0));
        formik.resetForm();
    };

    const messageTemplate = (rowData, field) => {
        return (
            <>
                <Button
                    type="button"
                    icon="pi pi-comment"
                    className={'m-auto'}
                    style={{ borderColor: 'gray', backgroundColor: 'white', color: 'gray' }}
                    onClick={() => {
                        setVisibleViewDetailMessage(true);
                        setIsIDShow(rowData.id);
                    }}
                />
                {visibleViewDetailMessage && isIDShow === rowData.id && <ViewDetailMessage setVisibleViewDetailMessage={setVisibleViewDetailMessage} visibleViewDetailMessage={visibleViewDetailMessage} data={rowData || 'Nice to meet you.'} />}
            </>
        );
    };

    const followerTemplate = (rowData) => {
        let netWorkCode = rowData?.socialNetwork?.socialNetworkCode;
        let contact = rowData?.contacts?.filter((value) => value?.socialNetworkCode == netWorkCode);
        return <>{formatNumberThousands(contact?.[0]?.followers) ?? 0}</>;
    };
    const onPageChange = (event) => {
        setPage(event.page + 1);
        setPageSize(event.rows);
        setChanging(!changing);
    };

    const profileColumnTemplate = (rowData) => {
        const socialNetworkCode = rowData?.socialNetwork?.socialNetworkCode;
        return (
            <div
                onClick={() => {
                    if (ACTIVITY_PLATFORM_ENUM[1].code == socialNetworkCode) {
                        document?.getElementsByTagName('html')?.[0].setAttribute('class', 'overflow-hidden');
                        if (!!rowData) {
                            setDataKolsDetail({
                                kolName: rowData.kolName,
                                kolId: rowData.kolId,
                                mask: rowData.mask,
                                jobId: rowData.jobId
                            });
                        }
                        setVisibleSidebar(true);
                    } else {
                        window.open('/components/detail-candidate/?mask=' + rowData.mask + '&id=' + rowData.kolId, '_blank');
                    }
                }}
            >
                <span className="font-bold cursor-pointer recruitment-title underline text-blue-400 kolName-applied-candidates">{rowData.kolName}</span>
                <br />
                <span className="text-sm">{rowData.kolAge} tuổi</span>
            </div>
        );
    };

    const contactTemplate = (rowData) => {
        return <CandidateInfo kolId={rowData?.kolId} mask={rowData?.mask} />;
    };

    const jobTitleColumnTemplate = (rowData) => {
        return <span className="jobTitle-applied-candidates cut-line-2">{rowData?.jobTitle}</span>;
    };

    const HeaderStatusDropDown = () => {
        return (
            <>
                <p>
                    Trạng thái ứng tuyển <i className="pi pi-info-circle custom-target-persent ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>{' '}
                </p>
                <Tooltip target=".custom-target-persent">
                    Chờ duyệt: Influencer đang chờ phản hồi từ NTD.
                    <br />
                    Tạm duyệt: Trạng thái giúp bạn phân loại Influencer trước khi "Duyệt" hoặc "Từ chối".
                    <br />
                    Đã duyệt: Đồng ý duyệt influencer.
                    <br />
                    Từ chối: Từ chối influencer.
                </Tooltip>
            </>
        );
    };

    const HeaderCastPrice = () => {
        return (
            <>
                <p>
                    Giá cast đề xuất <i className="pi pi-info-circle custom-target-persent-price ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
                </p>
                <Tooltip target=".custom-target-persent-price">Giá cast được đề xuất từ influencer</Tooltip>
            </>
        );
    };

    const headerTotalAvgVideo = () => {
        return (
            <>
                <p>
                    Doanh thu/Video <i className="pi pi-info-circle total-avg-video ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
                </p>
                <Tooltip target=".total-avg-video" >Doanh thu trung bình của 1 Video Tiktok có gắn sản phẩm trong 30 ngày gần nhất</Tooltip>
            </>
        );
    };

    const headerTotalAvgLive = () => {
        return (
            <>
                <p>
                    Doanh thu/Live <i className="pi pi-info-circle total-avg-live ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
                </p>
                <Tooltip target=".total-avg-live" >Doanh thu trung bình của 1 phiên Livestream Tiktok có gắn sản phẩm trong 30 ngày gần nhất</Tooltip>
            </>
        );
    };

    const renderTotalAvgVideo = (rowData) => {
        return (rowData?.totalAvgVideo ? formatPriceVnd(rowData?.totalAvgVideo) : 'N/A')
    };

    const renderTotalAvgLive = (rowData) => {
        return (rowData?.totalAvgLive ? formatPriceVnd(rowData?.totalAvgLive) : 'N/A')
    };

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

    const HeaderNote = () => {
        return (
            <>
                <p>
                    Ghi chú <i className="pi pi-info-circle custom-target-persent-note ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
                </p>
                <Tooltip target=".custom-target-persent-note">Thêm ghi chú cho ứng viên này</Tooltip>
            </>
        );
    };

    // export Excel file ----------------------------------------------------------------------------------------------------
    const exportExcel = () => {
        axios({
            url: `${DEV_URL}/api/kols/report/export-applied-candidates`,
            method: 'GET',
            responseType: 'blob' // important
        })
            .then((res) => {
                const fileType = res.data.type;
                const file = new Blob([res.data], { type: fileType });
                FileSaver.saveAs(file, 'applied-candidates.xlsx');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return AppLayout(
        <>
            <React.Fragment>
                <BreadcrumbCustom path={location} />
                <br />
                <Toast ref={toast} />
                {!!dataKolsDetail && (
                    <Sidebar
                        className="custom-sidebar"
                        visible={visibleSidebar}
                        position="right"
                        onHide={() => {
                            setVisibleSidebar(false);
                            document?.getElementsByTagName('html')?.[0].setAttribute('class', '');
                        }}
                    >
                        <SidebarKOLInfo dataKolsDetail={dataKolsDetail} visible={visibleSidebar} />
                    </Sidebar>
                )}
                <div className="card p-3 md:p-5">
                    <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                        <h4 className="m-0">
                            Tất cả tin đăng <span className={'primary-color'}>({totalRecords} Hồ sơ đã nộp)</span>
                        </h4>
                        <div>
                            <Button className="p-button-success p-button-outlined mr-2" type="button" label="Báo cáo chiến dịch" icon="pi pi-list" severity="info" onClick={() => router.push('/components/campaign-report/')} data-pr-tooltip="XLS" />
                            <Button className="p-button-danger p-button-outlined" type="button" label="Tải danh sách" icon="pi pi-file-excel" severity="info" onClick={exportExcel} data-pr-tooltip="XLS" />
                        </div>
                    </div>
                    <p>Trạng thái tuyển dụng khi đã chọn sẽ không thể thay đổi</p>
                    <hr />
                    <form onSubmit={formik.handleSubmit} className="p-fluid">
                        <div className="grid grid-nogutter justify-content-between align-content-center">
                            <div className="item-custom-filter">
                                <Dropdown
                                    value={formik.values.id}
                                    onChange={(e) => {
                                        dispatch(addIdJobFilter(0));
                                        formik.setFieldValue('id', e.value);
                                        setPage(1);
                                    }}
                                    options={selectedJob}
                                    optionLabel="jobTitle"
                                    optionValue="id"
                                    placeholder="Tất cả tin đăng"
                                />
                            </div>
                            <div className="item-custom-filter">
                                <Dropdown
                                    value={formik.values.recruitmentStatus}
                                    onChange={(e) => {
                                        formik.setFieldValue('recruitmentStatus', e.value);
                                        setPage(1);
                                    }}
                                    options={RECRUITMENT_STATUS_ENUM}
                                    optionLabel="name"
                                    optionValue="code"
                                    placeholder="Trạng thái tuyển dụng"
                                />
                            </div>
                            <div className="item-custom-filter">
                                <MultiSelect
                                    value={formik.values.careerIds}
                                    onChange={(e) => {
                                        formik.setFieldValue('careerIds', e.value);
                                        setPage(1);
                                    }}
                                    maxSelectedLabels={5}
                                    options={MAJORS_OPTION}
                                    showSelectAll={false}
                                    optionLabel="name"
                                    optionValue="careerFieldCode"
                                    placeholder="Tất cả lĩnh vực"
                                />
                            </div>
                            <div className="item-custom-filter">
                                <Dropdown
                                    value={formik.values.gender}
                                    onChange={(e) => {
                                        formik.setFieldValue('gender', e.value);
                                        setPage(1);
                                    }}
                                    options={GENDER_ENUM}
                                    optionLabel="name"
                                    optionValue="code"
                                    placeholder="Tất cả giới tính"
                                />
                            </div>
                            <div className="item-custom-filter">
                                <Dropdown
                                    value={formik.values.ages}
                                    onChange={(e) => {
                                        formik.setFieldValue('ages', e.value);
                                        setPage(1);
                                    }}
                                    options={AGE_ENUM}
                                    optionLabel="name"
                                    optionValue="code"
                                    placeholder="Độ tuổi"
                                />
                            </div>
                            <div className="item-custom-filter">
                                <Dropdown
                                    value={formik.values.performance}
                                    onChange={(e) => {
                                        formik.setFieldValue('performance', e.value);
                                        setPage(1);
                                    }}
                                    options={EFFECTIVE_ENUM}
                                    optionLabel="name"
                                    optionValue="code"
                                    placeholder="Hiệu quả bài đăng"
                                />
                            </div>
                            <div className="item-custom-filter lg:mt-3">
                                <MultiSelect
                                    value={formik.values.labels}
                                    onChange={(e) => {
                                        formik.setFieldValue('labels', e.value);
                                        setPage(1);
                                    }}
                                    maxSelectedLabels={labelsFilter.length}
                                    options={labelsFilter}
                                    showSelectAll={false}
                                    optionLabel="name"
                                    optionValue="id"
                                    placeholder="Tất cả nhãn"
                                    tooltip="Tìm kiếm theo nhãn"
                                    tooltipOptions={{ position: 'top' }}
                                />
                            </div>
                            <div className="w-120 lg:mt-3">
                                <Button type="button" icon="pi pi-reply" onClick={handleRemoveAllFilter} label="Xóa chọn" className="p-button remove-filter w-120"></Button>
                            </div>
                        </div>
                    </form>
                    <hr />
                    <DataTable className="p-datatable-custom" loading={loading} tableClassName="custom-table-applied-candidates" scrollable
                               value={dataContent}
                               rows={10}
                               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                               dataKey="id"
                               emptyMessage="Không có dữ liệu"
                    >
                        <Column header="#" body={(rowData, field) => calculateSerialNumber(field?.rowIndex, page, pageSize)} style={{ maxWidth: '40px', minWidth: '40px' }} />
                        <Column style={{ minWidth: '150px', maxWidth: '150px', whiteSpace: 'nowrap' }} body={jobTitleColumnTemplate} header="Tên công việc" />
                        <Column style={{ minWidth: '220px', maxWidth: '220px', whiteSpace: 'nowrap' }} body={profileColumnTemplate} header="Tên ứng viên" />
                        <Column style={{ minWidth: '100px', maxWidth: '100px', whiteSpace: 'nowrap' }} field="follower" body={followerTemplate} header="Follower" />
                        <Column style={{ minWidth: '176px', maxWidth: '176px', whiteSpace: 'nowrap' }} sortField="totalAvgVideo" body={renderTotalAvgVideo} sortable header={headerTotalAvgVideo}/>
                        <Column style={{ minWidth: '176px', maxWidth: '176px', whiteSpace: 'nowrap' }} sortField="totalAvgLive" body={renderTotalAvgLive} sortable header={headerTotalAvgLive} />
                        <Column style={{ minWidth: '176px', maxWidth: '176px', whiteSpace: 'nowrap' }} body={messageTemplate} header="Đề xuất của Influencer" />
                        <Column style={{ minWidth: '176px', maxWidth: '176px', whiteSpace: 'nowrap' }} field="castingPrice" header={HeaderCastPrice} sortable body={(rowData, field) => formatPriceVnd(rowData?.castingPrice ?? 0)} />
                        <Column style={{ minWidth: '165px', maxWidth: '165px', whiteSpace: 'nowrap' }} body={contactTemplate} header="Liên hệ" />
                        <Column style={{ minWidth: '192px', maxWidth: '192px', whiteSpace: 'nowrap' }} header={HeaderStatusDropDown} body={statusDropDown} />
                        <Column style={{ minWidth: '178px', maxWidth: '178px', whiteSpace: 'nowrap' }} field="bookingPrice" header="Giá booking" sortable body={renderBookingPrice} />
                        <Column style={{ minWidth: '150px', maxWidth: '150px', whiteSpace: 'nowrap' }} field="toApplyDate" header="Thời hạn nộp bài" body={toApplyDate} />
                        <Column style={{ minWidth: '400px', maxWidth: '400px', whiteSpace: 'nowrap' }} field="labels" header={HeaderLabels} body={renderLabels} />
                        <Column style={{ minWidth: '132px', maxWidth: '132px', whiteSpace: 'nowrap' }} header="Link bài đăng" body={PostLinkTemplate} />
                        <Column style={{ minWidth: '148px', maxWidth: '148px', whiteSpace: 'nowrap' }} header="Hiệu quả bài đăng" body={PostRffectTemplate} />
                        <Column style={{ minWidth: '192px', maxWidth: '192px', whiteSpace: 'nowrap' }} field="note" header={HeaderNote} body={renderNote} />
                    </DataTable>
                    <Paginator rowsPerPageOptions={[5, 10, 20, 50]} first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />
                </div>
            </React.Fragment>
        </>
    );
};
export default AppliedCandidates;
