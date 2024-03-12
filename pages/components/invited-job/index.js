import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Chip } from 'primereact/chip';
import { Paginator } from 'primereact/paginator';
import moment from 'moment/moment';
import { KolRecruitmentService } from '../../../demo/service/KolRecruitmentService';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import { useRouter } from 'next/router';
import ConfirmPopup from './ConfirmPopup';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import MessageInviteJob from './MessageInviteJob';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import AppLayout from '../../../layout/AppLayout';
import { DEV_URL, formatCurrencyVND, RECRUITMENT_TYPE, convertToSlug, convertAcronym } from '../../../src/commons/Utils';
import { useSelector } from 'react-redux';

const InvitedJob = () => {
    const service = new KolRecruitmentService();
    const location = useRouter().pathname;
    const [dataViewValue, setDataViewValue] = useState(null);
    const [layout, setLayout] = useState('grid');
    const [visible, setVisible] = useState(null);
    const [confirmVisible, setConfirmVisible] = useState(null);
    const toast = useRef(null);
    const pageSizeDefault = 5;
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeDefault);
    const [sorting, setSorting] = useState('');
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);
    const router = useRouter();
    const accountProfile = useSelector((state) => state.profiles);
    const [isSendToCompany, setIsSendToCompany] = useState(false);
    const onPageChange = (event) => {
        setPage(event.page + 1);
        setPageSize(event.rows);
    };

    const sortList = [
        { name: 'Mới nhất', code: 'DESC' },
        { name: 'Cũ nhất', code: 'ASC' }
    ];

    useEffect(async () => {
        try {
            const res = await service.getJobWasInvited({
                page: page,
                recordPage: pageSizeDefault,
                sorting: sorting.code
            });
            if (res.data.code === 'success') {
                let content = res.data.data.content;
                setDataViewValue(content);
                setTotalRecords(res.data.data.totalElements);
            } else {
                setDataViewValue([]);
                setTotalRecords(0);
            }
        } catch (e) {
            toast.current.show({
                severity: 'error',
                summary: 'Thông báo',
                detail: res.data.message,
                life: 2000
            });
        }
    }, [page, sorting, isSendToCompany]);

    const applyJob = async (data) => {
        const param = {
            id: data?.accountId,
            recruitmentId: data?.recruitmentId,
            recruitmentType: RECRUITMENT_TYPE.INVITED.code,
            message: data?.message,
            castingPrice: data?.castingPrice
        };

        const res = await service.applyJob(param);
        if (res.data.code == 'success') {
            toast.current.show({
                severity: 'success',
                summary: 'Thông báo',
                detail: 'Ứng tuyển thành công',
                life: 2000
            });
            setIsSendToCompany(!isSendToCompany);
        } else {
            toast.current.show({
                severity: 'error',
                summary: 'Thông báo',
                detail: res.data.message,
                life: 2000
            });
        }
    };

    const onChangeSort = (param) => {
        setSortOrder(param.value);
        setSortField('applyDate');
        setSorting(param.value);
    };

    const selectedCountryTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    Sắp xếp theo: &nbsp;<b>{option.name}</b>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const placeholder = (
        <div>
            <span className="p-dropdown-placeholder-text">Sắp xếp theo hạn nộp hồ sơ:</span>
        </div>
    );

    const dataViewHeader = (
        <>
            <div className="header-applied-job flex align-items-center w-full justify-content-between flex-wrap">
                <h2 className="text-xl lg:text-3xl font-bold mb-3 xl:mb-0 lg:mb-0 md:mb-0">
                    <span>{totalRecords} Việc làm được mời tham gia</span>
                </h2>
                <div className="header-applied-job flex justify-content-center">
                    <Dropdown valueTemplate={selectedCountryTemplate} value={sorting} onChange={(e) => onChangeSort(e)} options={sortList} optionLabel="name" placeholder={placeholder} className="w-full md:w-17rem" />
                </div>
            </div>
        </>
    );

    const messageInvitedJob = (data) => {
        return (
            <div>
                <MessageInviteJob setVisible={setVisible} footerContent={footerContent} visible={visible} data={data} />
            </div>
        );
    };

    const confirmPopup = (data) => {
        return <ConfirmPopup setConfirmVisible={setConfirmVisible} applyJob={applyJob} data={data} />;
    };

    const dataViewListItem = (data) => {
        return (
            <>
                <div className="col-12 mx-auto" key={data.kolRecId}>
                    <div className="flex flex-wrap lg:align-items-end lx:align-items-end align-items-start p-3 w-full shadow-one-recruiment mb-3">
                        <img src={`${DEV_URL}${data.profileImage}`} alt={'Loading'} width={116} height={116} className="images shadow-1 mr-3 cursor-pointer" style={{ objectFit: 'contain' }} />
                        <div className="sm:flex-1 mt-2 sm:mt-0 sm:flex flex-column md:text-left">
                            <div className="font-bold mb-2">
                                <Link
                                    href={{
                                        pathname: '/components/company/recruitment-detail/[mask]/[id]',
                                        query: { mask: convertToSlug(data?.mask), id: data.recruitmentId }
                                    }}
                                >
                                    <a target="_blank" className="font-bold mb-2 text-lg cursor-pointer recruitment-title">
                                        {data.jobTitle.slice(0, 45)}
                                        {data.jobTitle.length > 45 && <span>...</span>}
                                    </a>
                                </Link>
                            </div>
                            {visible && visible === data.kolRecId && messageInvitedJob(data)}
                            {confirmVisible && confirmVisible === data.kolRecId && confirmPopup(data)}
                            <div className="flex align-items-center mt-2 mb-2 text-2xl">
                                <div className="flex align-items-center mt-2 mb-2 text-2xl">
                                    {data.recSocialNetworks?.map((e) => {
                                        switch (e.value) {
                                            case 'Facebook':
                                                return <i className="fab fa-square-facebook mr-3" />;
                                            case 'Tiktok':
                                                return <i className="fab fa-tiktok mr-3" />;
                                            case 'Youtube':
                                                return <i className="fab fa-youtube mr-3" />;
                                            case 'Instagram':
                                                return <i className="fab fa-instagram mr-3" />;
                                        }
                                    })}
                                </div>
                            </div>
                            {!isMobile && (
                                <div className="flex align-items-center mt-2">
                                    {data.recLocations?.length == 63 ? (
                                        <Chip className="mr-2 text-sm mb-2" key={`all`} label={'Tất cả tỉnh thành'} />
                                    ) : (
                                        data.recLocations?.slice(0, 1).map((e) => <Chip className="mr-2 text-sm mb-2" key={`${e.key}`} label={convertAcronym(e.value)} />)
                                    )}
                                    <Chip className="mr-2 text-sm mb-2" label={'Hạn nộp hồ sơ: ' + moment(data.expirationDate).format('DD/MM/YYYY')} />
                                    <Chip className="mr-2 text-sm mb-2" label={formatCurrencyVND(data.minimumSalary) + ' - ' + formatCurrencyVND(data.maximumSalary)} />
                                </div>
                            )}
                        </div>
                        {isMobile && (
                            <div className="tags-mobile w-full flex flex-wrap align-items-center mt-3">
                                {data.recLocations?.length == 63 ? (
                                    <Chip className="mr-2 text-sm mb-2" key={`all`} label={'Tất cả tỉnh thành'} />
                                ) : (
                                    data.recLocations?.slice(0, 1).map((e) => <Chip className="mr-2 text-sm mb-2" key={`${e.key}`} label={convertAcronym(e.value)} />)
                                )}
                                <Chip className="mr-2 text-sm mb-2" label={'Hạn nộp hồ sơ: ' + moment(data.expirationDate).format('DD/MM/YYYY')} />
                                <Chip className="mr-2 text-sm mb-2" label={formatCurrencyVND(data.minimumSalary) + ' - ' + formatCurrencyVND(data.maximumSalary)} />
                            </div>
                        )}
                        <div className="flex w-full lg:w-auto xl:w-auto md:w-auto flex-row md:flex-column md:w-auto md:align-items-end md:mt-0">
                            <div className={'flex w-full flex-column card-container'}>
                                <div className={'align-items-center justify-content-center font-bold empty-content hidden'}>Chỗ này nội dung rỗng</div>
                                <div className={'align-items-center justify-content-center font-bold mt-2 empty-content hidden'}>Chỗ này nội dung rỗng</div>
                                <div className="flex align-items-center justify-content-center font-bold w-full mt-2">
                                    <div className="flex align-items-center w-full">
                                        <Button
                                            className="mr-4"
                                            icon="pi pi-comment"
                                            style={{
                                                backgroundColor: 'white',
                                                color: 'gray',
                                                borderColor: 'white',
                                                boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
                                            }}
                                            onClick={() => {
                                                const acc = accountProfile?.[0];
                                                if (acc?.fullName == null || acc?.phoneNumber == null || acc?.email == null || acc?.socialNetworks.length == 0 || acc?.careerFields.length == 0) {
                                                    toast.current.show({
                                                        severity: 'error',
                                                        summary: 'Thông báo',
                                                        detail: 'Bạn cần hoàn thành hồ sơ trước khi ứng tuyển công việc'
                                                    });
                                                    setTimeout(() => {
                                                        router.push('/components/profile/');
                                                    }, 2000);
                                                } else {
                                                    setVisible(data.kolRecId);
                                                }
                                            }}
                                        />
                                        {data?.applyDate != null ? (
                                            <Button className={'p-button send-email-button w-10 center-item'} disabled>
                                                <i className={'mr-2 pi pi-send recruitment-text-icon'}></i>
                                                Đã ứng tuyển
                                            </Button>
                                        ) : (
                                            <Button icon="pi pi-send" label="Ứng tuyển" className="p-button send-email-button w-10 center-item" onClick={() => setConfirmVisible(data.kolRecId)} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const itemTemplate = (data) => {
        if (!data) {
            return;
        }
        return dataViewListItem(data);
    };

    const footerContent = (
        <div>
            <Button label="Đóng" onClick={() => setVisible(false)} autoFocus />
        </div>
    );

    return AppLayout(
        <>
            <div className="surface-0 flex justify-content-center">
                <div id="home" className="card px-3 lg:px-5 lg:px-5 landing-wrapper overflow-hidden w-full">
                    <div className="col-12 p-0 applied-job">
                        <BreadcrumbCustom path={location} />
                        <br />
                        <Toast ref={toast} />
                        <DataView sortOrder={sortOrder} sortField={sortField} value={dataViewValue} layout={layout} itemTemplate={itemTemplate} emptyMessage={'Không có dữ liệu'} header={dataViewHeader} />
                        <Paginator first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default InvitedJob;