import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/router';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import { Button } from 'primereact/button';
import TotalRecruitment from './TotalRecruitment';
import { Tag } from 'primereact/tag';
import { RecruitmentService } from '../../../demo/service/RecruitmentService';
import { Toast } from 'primereact/toast';
import { Menu } from 'primereact/menu';
import moment from 'moment/moment';
import { convertToSlug, calculateSerialNumber } from '../../../src/commons/Utils';
import AppLayout from '../../../layout/AppLayout';
import { Paginator } from 'primereact/paginator';
import { addIdJobFilter } from 'public/reduxConfig/companyProfileSlice';
import { useDispatch } from 'react-redux';

const ListRecruitment = () => {
    const service = new RecruitmentService();
    const location = useRouter().pathname;
    const [data, setData] = useState([]);
    const toast = useRef(null);
    const [selectedData, setSelectedData] = useState(null);
    const menuRef = useRef(null);
    const router = useRouter();
    const [menuItems, setMenuItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [changing, setChanging] = useState(false);
    const dispatch = useDispatch();

    const items = [
        {
            label: 'Xem chi tiết',
            icon: 'pi pi-info',
            command: () => {}
        },
        {
            label: 'Chỉnh sửa',
            icon: 'pi pi-pencil',
            command: () => {}
        },
        {
            label: 'Sao chép',
            icon: 'pi pi-copy',
            command: () => {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Thông báo',
                    detail: 'Chức năng chưa phát triển',
                    life: 3000
                });
            }
        },
        {
            label: 'Gia hạn nộp',
            icon: 'pi pi-clock',
            command: () => {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Thông báo',
                    detail: 'Chức năng chưa phát triển',
                    life: 3000
                });
            }
        },
        {
            label: 'Xóa',
            icon: 'pi pi-trash',
            command: () => {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Thông báo',
                    detail: 'Chức năng chưa phát triển',
                    life: 3000
                });
            }
        }
    ];

    useEffect(() => {
        // Cập nhật giá trị của menuItems
        setMenuItems(items);
    }, []);

    useEffect(async () => {
        const res = await service.searchAll({
            keyword: '',
            hasProductSample: null,
            careerCode: null,
            page: page,
            recordPage: pageSize,
            sorting: ''
        });
        if (res.data.code === 'success') {
            const data = res.data.data;
            setTotalRecords(data.totalElements);
            setData(data.content);
        } else {
            setData([]);
        }
    }, [changing, pageSize, page]); // eslint-disable-line react-hooks/exhaustive-deps

    const formatDate = (value) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const createNewRecruitment = () => {
        router.push('/components/create-new-recruitment');
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h4 className="lg:m-0 md:m-0 sm:m-0 mb-2">Hồ sơ tin tuyển dụng</h4>
                <Button className="btn-primary " type="button" label="Tạo tin tuyển dụng " severity="info" onClick={createNewRecruitment} />
            </div>
        );
    };

    const handleClickFilterAppliedCandidates = (rowData) => {
        if (!!rowData?.isVerified) {
            dispatch(addIdJobFilter(rowData?.id));
            router.push('/components/applied-candidates/');
        } else {
            router.push({
                pathname: '/recruitments/[mask]/[id]',
                query: {
                    mask: convertToSlug(rowData?.mask),
                    id: rowData?.id
                }
            });
        }
    };

    const jobTitleTemplate = (rowData) => {
        return (
            <div className="flex cursor-pointer align-items-center gap-2 hover:text-primary hover:underline" onClick={() => handleClickFilterAppliedCandidates(rowData)}>
                {rowData?.jobTitle}
            </div>
        );
    };

    const dateBodyTemplate = (rowData) => {
        return <span>{moment(rowData.createdDate).format('DD/MM/YYYY')}</span>;
    };

    const totalAppliedTemplate = (rowData) => {
        return (
            <div className="underline cursor-pointer hover:text-primary" onClick={() => handleClickFilterAppliedCandidates(rowData)}>
                {rowData.applyCount == null ? '-' : rowData.applyCount}
            </div>
        );
    };

    const isExpiredTemplate = (rowData) => {
        return rowData.isExpired == true ? <span className="primary-color">Đã hết hạn</span> : <span>Còn hạn</span>;
    };

    const onPageChange = (event) => {
        setPage(event.page + 1);
        setPageSize(event.rows);
        setChanging(!changing);
    };

    const renderStatusTemplate = (rowData) => {
        return rowData.isVerified == true ? <Tag severity="success" value={'Đã duyệt'}></Tag> : <Tag severity="warning" value={'Chờ duyệt'}></Tag>;
    };

    const header = renderHeader();

    const indexTemplate = (rowData, field) => {
        return calculateSerialNumber(field.rowIndex, page, pageSize);
    };

    const handleSelectionChange = (e) => {
        // Lấy ra dòng được chọn
        const selectedRow = e.value[0];

        // Lưu dòng được chọn vào state
        setSelectedData(selectedRow);
    };

    const handleMenuClick = (event, rowData) => {
        // Hiển thị menu
        menuRef.current.toggle(event);
        // Cập nhật giá trị của item trong menu
        if (menuRef.current) {
            const menuItem = menuRef.current.props.model[0];
            menuItem.value = selectedData ? selectedData : '';
            menuItem.command = () => {
                return router.push('/recruitments/' + convertToSlug(rowData?.mask) + '/' + rowData?.id);
            };

            const menuItem2 = menuRef.current.props.model[1];
            menuItem2.command = () => {
                return router.push('/components/create-new-recruitment/?recruitId=' + rowData.id);
            };
        }
    };

    return AppLayout(
        <>
            <React.Fragment>
                <Toast ref={toast} />
                <div className="layout-main">
                    <div className="card">
                        <BreadcrumbCustom path={location} />
                        <br />
                        <TotalRecruitment totalElements={totalRecords} data={data} />
                        <DataTable
                            scrollable
                            value={data}
                            header={header}
                            rows={10}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            dataKey="id"
                            selection={selectedData}
                            onSelectionChange={handleSelectionChange}
                            emptyMessage="Không có dữ liệu"
                            currentPageReportTemplate="Hiển thị từ {first} đến {last} của {totalRecords} bản ghi"
                            className="p-datatable-custom list-recruitments"
                            tableClassName="custom-table-applied-candidates"
                        >
                            <Column style={{ maxWidth: '40px', minWidth: '40px' }} header="#" body={indexTemplate} />
                            <Column sortable sortField="jobTitle" header="Tên tin đăng" style={{ minWidth: '20rem' }} body={jobTitleTemplate} />
                            <Column sortable sortField="createdDate" header="Ngày đăng" style={{ minWidth: '12rem' }} body={dateBodyTemplate} />
                            <Column body={isExpiredTemplate} header="Thời gian nộp" sortable sortField="isExpired" style={{ minWidth: '14rem' }} />
                            <Column body={totalAppliedTemplate} header="Lượt nộp" sortable sortField="totalApplied" style={{ minWidth: '12rem' }} />
                            <Column field="status" header="Trạng thái" sortable sortField="isVerified" style={{ minWidth: '10rem' }} body={renderStatusTemplate} />
                            <Column body={(rowData) => <Button icon="pi pi-ellipsis-v" className="p-button-text" onClick={(event) => handleMenuClick(event, rowData)} />} />
                        </DataTable>
                        <Paginator rowsPerPageOptions={[5, 10, 20, 50, 100, 200, 500]} first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />
                        <Menu model={menuItems} popup ref={menuRef} />
                    </div>
                </div>
            </React.Fragment>
        </>
    );
};
export default ListRecruitment;
