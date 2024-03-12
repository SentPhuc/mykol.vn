import React, { useEffect, useState } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { GlobalService } from '../../../demo/service/GlobalService';
import { useRouter } from 'next/router';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import { CATEGORY_ENUM, DEV_URL } from '../../../src/commons/Utils';
import { Dropdown } from 'primereact/dropdown';
import { Avatar } from 'primereact/avatar';
import { MAJORS_OPTION } from '../../../src/commons/Constant';
import getConfig from 'next/config';

const InfluencerRanking = () => {
    const service = new GlobalService();
    const location = useRouter().pathname;
    const [kols, setKols] = useState([]);
    const [selectedKols, setSelectedKols] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        kolsInfluencerName: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        }
    });
    const [careerField, setCareerField] = useState(null);

    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    useEffect(async () => {
        const res = await service.influencerRanking({
            careerFieldCode: careerField?.careerFieldCode
        });
        setKols(res.data.data);
    }, [careerField]); // eslint-disable-line react-hooks/exhaustive-deps

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const MAJORS_OPTION_ALl = [...MAJORS_OPTION];

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap justify-content-between align-items-center">
                <h4 className="lx:m-0 lg:m-0 mb-3">Bảng xếp hạng Influencer</h4>
                <div className="grid grap-1 w-full lg:w-auto lx:w-auto md:w-auto">
                    <div className="col-6 item-filter-influencer-ranking">
                        <span className="p-input-icon-left mr-4 w-full">
                            <i className="pi pi-search" />
                            <InputText className=' w-full' value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Tìm kiếm Influencer" />
                        </span>
                    </div>
                    <div className="col-6 item-filter-influencer-ranking">
                        <span className="p-input-icon-left w-full">
                            <Dropdown
                                value={careerField}
                                onChange={(e) => {
                                    setCareerField(e.target.value);
                                }}
                                options={MAJORS_OPTION_ALl}
                                optionLabel="name"
                                display="chip"
                                placeholder="Lĩnh vực"
                                className="w-full"
                            />
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const kolsInfluencerBodyTemplate = (rowData) => {
        const kolsInfluencerName = rowData.kolsInfluencerName;
        const profileImage = rowData.profileImage;
        return (
            <div className="flex align-items-center gap-2">
                {profileImage != null ? (
                    <Avatar image={`${DEV_URL}${profileImage}`} size="normal" shape="circle" />
                ) : (
                    <Avatar image={`${contextPath}/demo/images/avatar/no-avatar.png`} size="normal" shape="circle" />
                )}
                {/*<Avatar image={`${DEV_URL}${profileImage}`} size="normal" shape="circle" />*/}
                <span>{kolsInfluencerName}</span>
            </div>
        );
    };

    const followTiktokBodyTemplate = (rowData) => {
        return rowData.followTiktok;
    };

    const followInstagramBodyTemplate = (rowData) => {
        return rowData.followInstagram;
    };

    const followFacebookBodyTemplate = (rowData) => {
        return rowData.followFacebook;
    };

    const followYoutubeBodyTemplate = (rowData) => {
        return rowData.followYoutube;
    };

    const projectParticipatedBodyTemplate = (rowData) => {
        return rowData.projectParticipated;
    };

    const indexTemplate = (rowData, field) => {
        return field.rowIndex + 1;
    };

    return (
        <>
            <React.Fragment>
                <div className="layout-main">
                    <div className="card px-3 lg:p-5 lx:p-5 md:p-5">
                        <BreadcrumbCustom path={location} />
                        <br />
                        <DataTable
                            scrollable
                            value={kols}
                            paginator
                            header={renderHeader}
                            rows={10}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            dataKey="id"
                            selectionMode="checkbox"
                            selection={selectedKols}
                            onSelectionChange={(e) => setSelectedKols(e.value)}
                            filters={filters}
                            filterDisplay="menu"
                            globalFilterFields={['kolsInfluencerName']}
                            emptyMessage="Không có dữ liệu"
                            currentPageReportTemplate="Hiển thị từ {first} đến {last} của {totalRecords} bản ghi"
                        >
                            <Column header="#" body={indexTemplate} style={{ maxWidth: '3rem' }} />
                            <Column header="Họ và tên" sortable sortField="kolsInfluencerName" style={{ minWidth: '14rem', 'overflowWrap': 'anywhere'}} body={kolsInfluencerBodyTemplate} />
                            <Column field="followTiktok" header="Follow Tiktok" sortable style={{ minWidth: '14rem' }} body={followTiktokBodyTemplate} />
                            <Column field="followInstagram" header="Follow Instagram" sortable style={{ minWidth: '14rem' }} body={followInstagramBodyTemplate} />
                            <Column field="followFacebook" header="Follow Facebook" sortable style={{ minWidth: '12rem' }} body={followFacebookBodyTemplate} />
                            <Column field="followYoutube" header="Follow Youtube" sortable style={{ minWidth: '12rem' }} body={followYoutubeBodyTemplate} />
                            <Column field="projectParticipated" header="Dự án đã tham gia" sortable dataType="numeric" style={{ minWidth: '13rem' }} body={projectParticipatedBodyTemplate} />
                        </DataTable>
                    </div>
                </div>
            </React.Fragment>
        </>
    );
};
export default InfluencerRanking;
