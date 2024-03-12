import React, { useEffect, useState } from 'react';
import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Chip } from 'primereact/chip';
import {convertAcronym, DEV_URL, formatCurrencyVND} from '../../../src/commons/Utils';
import { GlobalService } from '../../../demo/service/GlobalService';
import { Paginator } from 'primereact/paginator';
import moment from 'moment/moment';
import { Tag } from 'primereact/tag';
import AppLayout from '../../../layout/AppLayout';

const CancelContract = () => {
    const service = new GlobalService();

    const [dataViewValue, setDataViewValue] = useState(null);
    const [layout, setLayout] = useState('grid');
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [openJobCompletionReportPopup, setJobCompletionReportPopup] = useState(0);

    const pageSizeDefault = 5;

    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeDefault);

    const [loading, setLoading] = useState(false);

    const onPageChange = (event) => {
        setPage(event.page + 1);
        setPageSize(event.rows);
    };

    useEffect(async () => {
        setLoading(true);
        try {
            const res = await service.searchRecruitment({ page: page, recordPage: pageSizeDefault });
            if (res.data.code === 'success') {
                let content = res.data.data.content;
                setDataViewValue(content);
                setTotalRecords(res.data.data.totalElements);
            } else {
                setDataViewValue([]);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }

    }, [page]);

    const dataViewHeader = (
        <>
            <div className='header-applied-job'>
                <h2>
                    <span>Hủy trạng thái làm việc của nhà tuyển dụng và KOL</span>
                </h2>
            </div>
        </>
    );

    const getStatus = (data) => {
        const status = data.status == null ? 'CONFIRM' : data.status;
        switch (status) {
            case 'CONFIRM':
                return 'success';
            case 'WATTING':
                return 'warning';
            case 'REJECT':
                return 'danger';
            default:
                return null;
        }
    };

    const dataViewListItem = (data) => {
        return (
            <div className='col-12 mx-auto'>
                <div className='flex flex-column md:flex-row align-items-center p-3 w-full shadow-one-recruiment mb-2'>
                    <img src={`${DEV_URL}${data.profileImage}`} alt={'Loading'} width={116}
                         height={116}
                         className='my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5' />
                    <div className='flex-1 flex flex-column md:text-left'>
                        <div className='font-bold mb-2 text-2xl'>{data.jobTitle}</div>
                        <div className='flex align-items-center mt-2 mb-2 text-2xl'>
                            <div className='flex align-items-center mt-2 mb-2 text-2xl'>
                                {
                                    data.recSocialNetworks?.map((e) => {
                                        switch (e.value) {
                                            case 'Facebook':
                                                return <i className='fab fa-square-facebook mr-3'></i>;
                                            case 'Tiktok':
                                                return <i className='fab fa-tiktok mr-3'></i>;
                                            case 'Youtube':
                                                return <i className='fab fa-youtube mr-3'></i>;
                                            case 'Instagram':
                                                return <i className='fab fa-instagram mr-3'></i>;

                                        }
                                    })
                                }
                            </div>
                        </div>
                        <div className='flex align-items-center mt-2'>
                            {
                                data.recLocations?.length == 63 ?
                                    <Chip className="mr-2 " key={`all`} label={'Tất cả tỉnh thành'} /> :
                                    data.recLocations?.slice(0, 1).map((e) => (
                                        <Chip className="mr-2" key={`${e.key}`} label={convertAcronym(e.value)} />
                                    ))
                            }
                            <Chip className='mr-2'
                                  label={'Hạn nộp hồ sơ: ' + moment(data.expirationDate).format('DD/MM/YYYY')} />
                            <Chip className='mr-2'
                                  label={formatCurrencyVND(data.minimumSalary) + ' - ' + formatCurrencyVND(data.maximumSalary)} />
                        </div>
                    </div>
                    <div className='flex flex-row md:flex-column w-full md:w-auto md:align-items-end mt-5 md:mt-0'>
                        <div className='flex flex-column card-container'>
                            <div
                                className='flex align-items-center justify-content-center font-bold m-2'
                            >
                                <span>
                                    <i className='pi pi-calendar mr-2'></i>
                                    Hạn nộp hồ sơ ngày {moment(data.expirationDate).format('DD/MM/YYYY hh:mm')}
                                </span>
                            </div>
                            <div
                                className='flex align-items-center justify-content-center font-bold m-2 empty-content'
                            >
                                Chỗ này nội dung rỗng
                            </div>
                            <div
                                className='flex align-items-center justify-content-center font-bold m-2'>
                                <div className='flex align-items-center'>
                                    <Button icon='pi pi-send' className='center-item' label='Hủy bỏ'
                                            onClick={() => setJobCompletionReportPopup(true)}
                                            className='p-button send-email-button' />
                                    <Tag value={'Đã duyệt'} severity={getStatus(data)} className='ml-4 px-2 py-2'></Tag>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (data) => {
        if (!data) {
            return;
        }
        return dataViewListItem(data);
    };

    return AppLayout(
        <>
            <div className='surface-0 flex justify-content-center'>
                <div id='home' className='landing-wrapper overflow-hidden'>
                    <div className='col-12 p-0 applied-job w-full px-4'>
                        <DataView value={dataViewValue} layout={layout}
                                  sortOrder={sortOrder} sortField={sortField} itemTemplate={itemTemplate}
                                  header={dataViewHeader}></DataView>
                        <Paginator
                            first={page * pageSize - 1}
                            rows={pageSize}
                            totalRecords={totalRecords}
                            onPageChange={onPageChange}
                        />
                    </div>
                </div>
                {/*<JobCompletionReport*/}
                {/*    openJobCompletionReportPopup={openJobCompletionReportPopup}*/}
                {/*    setJobCompletionReportPopup={setJobCompletionReportPopup}*/}
                {/*/>*/}
            </div>
        </>
    );
};

export default CancelContract;