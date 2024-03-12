import React, {useEffect, useRef, useState} from 'react';
import {Button} from 'primereact/button';
import {DataView} from 'primereact/dataview';
import {Chip} from 'primereact/chip';
import {
    convertAcronym,
    convertToSlug,
    DEV_URL,
    formatCurrencyVND
} from '../../../src/commons/Utils';
import {Paginator} from 'primereact/paginator';
import moment from 'moment/moment';
import {KolRecruitmentService} from '../../../demo/service/KolRecruitmentService';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import {useRouter} from 'next/router';
import {Dropdown} from 'primereact/dropdown';
import {Toast} from 'primereact/toast';
import Link from 'next/link';
import AppLayout from '../../../layout/AppLayout';

const SavedJob = () => {
    const service = new KolRecruitmentService();
    const location = useRouter().pathname;
    const pageSizeDefault = 5;
    const toast = useRef(null);

    const [dataViewValue, setDataViewValue] = useState(null);
    const [layout, setLayout] = useState('grid');
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeDefault);
    const [saveFlag, setSaveFlag] = useState(false);

    const onPageChange = (event) => {
        setPage(event.page + 1);
        setPageSize(event.rows);
    };

    const [sorting, setSorting] = useState('');
    const sortList = [
        { name: 'Mới nhất', code: 'DESC' },
        { name: 'Cũ nhất', code: 'ASC' }
    ];

    useEffect(async () => {
        try {
            const res = await service.savedJob({ page: page, recordPage: pageSizeDefault, sorting: sorting.code });
            if (res.data.code === 'success') {
                let content = res.data.data.content;
                setDataViewValue(content);
                setTotalRecords(res.data.data.totalElements);
            } else {
                setDataViewValue([]);
            }
        } catch (e) {
            console.log(e);
        }
    }, [page, sorting]);

    const onChangeSort = (param) => {
        setSorting(param.value);
    };

    const dataViewHeader = (
        <>
            <div className={'md:flex justify-content-between'}>
                <div className="header-applied-job">
                    <h2>
                        <span>{totalRecords} Việc làm đã lưu</span>
                    </h2>
                </div>
                <div className="header-applied-job flex justify-content-center">
                    <Dropdown value={sorting} onChange={(e) => onChangeSort(e)} options={sortList} optionLabel="name"
                              placeholder="Sắp xếp theo: " className="w-full md:w-14rem"/>
                </div>
            </div>
        </>
    );

    useEffect(async () => {
        try {
            const res = await service.savedJob({ page: page, recordPage: pageSizeDefault });
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
            setSaveFlag(false);
        }
    }, [saveFlag]);

    const onUnSavingJobsHandler = async (data) => {
        try {
            const res = await service.saveInterestingJob({ recruitmentId: data.recruitmentId });
            if (res.data.code === 'success') {
                setSaveFlag(true);
                toast.current.show({
                    severity: 'success',
                    summary: 'Thông báo',
                    detail: 'Bỏ việc làm đã lưu thành công',
                    life: 2000
                });
            }
        } catch (e) {
            console.log(e);
        }
    };

    const dataViewListItem = (data) => {
        return (
            <div className="col-12 mx-auto">
                <div className="p-3 w-full shadow-one-recruiment mb-2">
                    <div className="flex flex-row align-items-start md:align-items-center gap-4">
                        <img src={`${DEV_URL}${data.profileImage}`}
                             alt={'Loading'}
                             className="w-7rem md:w-10rem shadow-2"/>
                        <div className="flex-1 flex flex-column md:text-left flex-grow-1">
                            <div className="font-bold mb-2">
                                <Link href={{
                                    pathname: '/components/company/recruitment-detail/[mask]/[id]',
                                    query: {
                                        mask: convertToSlug(data?.mask),
                                        id: data.recruitmentId
                                    }
                                }}
                                >
                                    <a target="_blank"
                                       className="font-bold mb-2 text-lg md:text-2xl cursor-pointer recruitment-title">
                                        {data.jobTitle.slice(0, 45)}{data.jobTitle.length > 45 &&
                                        <span>...</span>}
                                    </a>
                                </Link>
                            </div>
                            <div className="flex align-items-center mt-2 mb-2 text-2xl">
                                <div className="flex align-items-center mt-2 mb-2 text-2xl">
                                    {
                                        data.recSocialNetworks?.map((e) => {
                                            switch (e.value) {
                                                case 'Facebook':
                                                    return <i className="fab fa-square-facebook mr-3"/>;
                                                case 'Tiktok':
                                                    return <i className="fab fa-tiktok mr-3"/>;
                                                case 'Youtube':
                                                    return <i className="fab fa-youtube mr-3"/>;
                                                case 'Instagram':
                                                    return <i className="fab fa-instagram mr-3"/>;

                                            }
                                        })
                                    }
                                </div>
                            </div>
                            <div className="md:flex align-items-center mt-2 hidden">
                                {
                                    data.recLocations?.length == 63 ?
                                        <Chip className="mr-2 " key={`all`} label={'Tất cả tỉnh thành'} /> :
                                        data.recLocations?.slice(0, 1).map((e) => (
                                            <Chip className="mr-2" key={`${e.key}`} label={convertAcronym(e.value)} />
                                        ))
                                }
                                <Chip className="mr-2"
                                      label={'Hạn nộp hồ sơ: ' + moment(data.expirationDate).format('DD/MM/YYYY')}/>
                                <Chip className="mr-2"
                                      label={formatCurrencyVND(data.minimumSalary) + ' - ' + formatCurrencyVND(data.maximumSalary)}/>
                            </div>
                        </div>
                        <div className="flex flex-row md:flex-column md:w-full md:w-auto md:align-items-end md:mt-0">
                            <div className="flex flex-column card-container">
                                <div
                                    className="flex md:align-items-end md:justify-content-end font-bold md:m-2"
                                >
                                    <Button icon="pi pi-heart-fill"
                                            className="p-button-rounded p-button-danger p-button-text p-0"
                                            onClick={() => onUnSavingJobsHandler(data)}
                                    />
                                </div>
                                <div
                                    className="hidden md:flex align-items-center justify-content-center font-bold m-2 empty-content">
                                    Chỗ này nội dung rỗng
                                </div>
                                <div
                                    className="hidden md:flex align-items-center justify-content-center font-bold m-2 empty-content">
                                    Chỗ này nội dung rỗng
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full mt-2 md:hidden">
                        {
                            data.recLocations?.length == 63 ?
                                <Chip className="mr-2 mb-2 text-sm " key={`all`} label={'Tất cả tỉnh thành'} /> :
                                data.recLocations?.slice(0, 1).map((e) => (
                                    <Chip className="mr-2" key={`${e.key}`} label={convertAcronym(e.value)} />
                                ))
                        }
                        <Chip className="mr-2 mb-2 text-sm"
                              label={formatCurrencyVND(data.minimumSalary) + ' - ' + formatCurrencyVND(data.maximumSalary)}/>

                        <Chip className="mr-2 text-sm"
                              label={'Hạn nộp hồ sơ: ' + moment(data.expirationDate).format('DD/MM/YYYY')}/>
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
            <Toast ref={toast}/>
            <div className="surface-0 flex justify-content-center">
                <div id="home" className="card landing-wrapper overflow-hidden w-full">
                    <BreadcrumbCustom path={location}/><br/>
                    <div className="col-12 p-0 applied-job w-full">
                        <DataView value={dataViewValue} layout={layout}
                                  emptyMessage={'Không có dữ liệu'}
                                  sortOrder={sortOrder} sortField={sortField} itemTemplate={itemTemplate}
                                  header={dataViewHeader}/>
                        <Paginator
                            first={page * pageSize - 1}
                            rows={pageSize}
                            totalRecords={totalRecords}
                            onPageChange={onPageChange}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SavedJob;