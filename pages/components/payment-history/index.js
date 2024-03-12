import React, { useEffect, useState } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { GlobalService } from '../../../demo/service/GlobalService';
import { useRouter } from 'next/router';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import { CATEGORY_ENUM } from '../../../src/commons/Utils';
import { Dropdown } from 'primereact/dropdown';

const PaymentHistory = () => {
    const service = new GlobalService();
    const location = useRouter().pathname;
    const [kols, setKols] = useState([]);
    const [selectedKols, setSelectedKols] = useState([]);
    const [selectedCareerFields, setSelectedCareerFields] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        kolsInfluencerName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(async () => {
        const res  = await service.influencerRanking();
        setKols(res.data.data);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className='flex flex-wrap gap-2 justify-content-between align-items-center'>
                <h4 className='m-0'>Bảng xếp hạng Influencer</h4>
                <div>
                    <span className='p-input-icon-left mr-4'>
                        <i className='pi pi-search' />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange}
                                   placeholder='Tìm kiếm Influencer' />
                    </span>
                    <span className='p-input-icon-left'>
                        <Dropdown value={selectedCareerFields} onChange={(e) => setSelectedCareerFields(e.value)}
                                  options={CATEGORY_ENUM}
                                  optionLabel='name' display='chip'
                                  placeholder='Lĩnh vực' className='w-full md:w-15rem' />
                    </span>
                </div>
            </div>
        );
    };

    const kolsInfluencerBodyTemplate = (rowData) => {
        const kolsInfluencerName = rowData.kolsInfluencerName;
        const profileImage = rowData.profileImage;

        return (
            <div className='flex align-items-center gap-2'>
                <img alt={kolsInfluencerName}
                     src={`https://primefaces.org/cdn/primereact/images/avatar/${profileImage}`} width='32'/>
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
                <div className='layout-main'>
                    <div className='card'>
                        <BreadcrumbCustom path={location} /><br />

                        <DataTable scrollable value={kols} paginator header={renderHeader} rows={10}
                                   paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
                                   rowsPerPageOptions={[5, 10, 25, 50]} dataKey='id' selectionMode='checkbox'
                                   selection={selectedKols}
                                   onSelectionChange={(e) => setSelectedKols(e.value)}
                                   filters={filters} filterDisplay='menu'
                                   globalFilterFields={['kolsInfluencerName']}
                                   emptyMessage='Không có dữ liệu'
                                   currentPageReportTemplate='Hiển thị từ {first} đến {last} của {totalRecords} bản ghi'>
                            <Column header='#' body={indexTemplate} style={{ maxWidth: '3rem' }}
                            />
                            <Column header='Họ và tên' sortable sortField='kolsInfluencerName'
                                    style={{ minWidth: '14rem' }} body={kolsInfluencerBodyTemplate} />
                            <Column field='followTiktok' header='Follow Tiktok' sortable
                                    style={{ minWidth: '14rem' }} body={followTiktokBodyTemplate} />
                            <Column field='followInstagram' header='Follow Instagram' sortable
                                    style={{ minWidth: '14rem' }} body={followInstagramBodyTemplate} />
                            <Column field='followFacebook' header='Follow Facebook' sortable
                                    style={{ minWidth: '12rem' }} body={followFacebookBodyTemplate} />
                            <Column field='followYoutube' header='Follow Youtube' sortable
                                    style={{ minWidth: '12rem' }} body={followYoutubeBodyTemplate} />
                            <Column field='projectParticipated' header='Dự án đã tham gia' sortable dataType='numeric'
                                    style={{ minWidth: '12rem' }} body={projectParticipatedBodyTemplate} />
                        </DataTable>
                    </div>
                </div>
            </React.Fragment>
        </>
    );
};
export default PaymentHistory ;
