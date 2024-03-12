import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { RoleService } from '../../../demo/service/RoleService';
import { useRouter } from 'next/router';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import moment from 'moment';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import ViewDetailsRole from './ViewDetailsRole';
import AppLayout from '../../../layout/AppLayout';

const RolesList = () => {
    let emptyData = {
        id: 1
    };

    const service = new RoleService();
    const location = useRouter().pathname;
    const [roles, setRoles] = useState([]);
    const [selectedKols, setSelectedKols] = useState([]);
    const [visibleViewDetailsRole, setVisibleViewDetailsRole] = useState(false);
    const [cloneData, setCloneData] = useState(emptyData);

    useEffect(async () => {
        const res = await service.search();
        setRoles(res.data.data.content);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const renderHeader = () => {
        return (
            <div className='flex flex-wrap gap-2 justify-content-between align-items-center'>
                <h4 className='m-0'>Danh sách quyền</h4>
            </div>
        );
    };

    const renderName = (rowData) => {
        return rowData.name;
    };

    const renderDesc = (rowData) => {
        return rowData.description;
    };

    const renderCreatedTime = (rowData) => {
        return moment(rowData.createdTime).format('DD/MM/YYYY');
    };

    const renderIsDeleted = (rowData) => {
        return (rowData.isDeleted == false ? <Tag severity='success' value='Đang sử dụng'></Tag>
            : <Tag severity='danger' value='Tắt hoạt động'></Tag>);
    };

    const indexTemplate = (rowData, field) => {
        return field.rowIndex + 1;
    };

    const viewDetails = (rowData) => {
        setVisibleViewDetailsRole(true);
        setCloneData({ ...rowData });
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button size='sm' icon='pi pi-eye' className='mr-2 p-button p-button-rounded p-button-warning'
                        onClick={() => {
                            viewDetails(rowData);
                        }}
                        tooltip='Xem chi tiết'
                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }} />
            </React.Fragment>
        );
    };

    return AppLayout(
        <>
            <React.Fragment>
                <div className='layout-main'>
                    <div className='card'>
                        <BreadcrumbCustom path={location} /><br />

                        <DataTable scrollable value={roles} paginator header={renderHeader} rows={10}
                                   paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
                                   rowsPerPageOptions={[5, 10, 25, 50]} dataKey='id' selectionMode='checkbox'
                                   className='roles-list'
                                   selection={selectedKols}
                                   onSelectionChange={(e) => setSelectedKols(e.value)}
                                   emptyMessage='Không có dữ liệu'
                                   currentPageReportTemplate='Hiển thị từ {first} đến {last} của {totalRecords} bản ghi'>
                            <Column header='#' body={indexTemplate} style={{ maxWidth: '3rem' }}
                            />
                            <Column field='name' header='Tên' sortable
                                    style={{ minWidth: '20rem' }} body={renderName} />
                            <Column field='description' header='Miêu tả' sortable
                                    style={{ minWidth: '20rem' }} body={renderDesc} />
                            <Column field='createdTime' header='Ngày tạo' sortable
                                    style={{ minWidth: '20rem' }} body={renderCreatedTime} />
                            <Column field='isDeleted' header='Trạng thái' sortable
                                    style={{ minWidth: '15rem' }} body={renderIsDeleted} />
                            <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '3rem' }} />
                        </DataTable>
                    </div>
                </div>

                <ViewDetailsRole
                    visibleViewDetailsRole={visibleViewDetailsRole}
                    setVisibleViewDetailsRole={setVisibleViewDetailsRole}
                    cloneData={cloneData}
                />
            </React.Fragment>
        </>
    );
};
export default RolesList;