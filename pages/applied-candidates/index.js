import { KolRecruitmentService } from 'demo/service/KolRecruitmentService';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { DataView } from 'primereact/dataview';
import { Paginator } from 'primereact/paginator';
import { Ripple } from 'primereact/ripple';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import SidebarTiktok from 'pages/components/homepage/recruitment/SidebarTiktok';
import ItemKol from 'pages/components/homepage/search-kol/ItemKol';
import BreadcrumbCustom from 'pages/commons/BreadcrumbCustom';
import { useRouter } from 'next/router';

const AppliedCandidates = () => {
    const router = useRouter();
    const location = router.pathname;
    const toast = useRef(null);
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    const kolRecruitment = new KolRecruitmentService();

    const [isChangingPaging, setIsChangingPaging] = useState(false);
    const [changing, setChanging] = useState(false);
    const [page, setPage] = useState(1);
    const [recordPage, setRecordPage] = useState(16);
    const [provinces, setProvinces] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageGoTo, setPageGoTo] = useState(1);
    const [datas, setDatas] = useState();
    const [visibleSidebar, setVisibleSidebar] = useState(false);
    const [sorting, setSorting] = useState('');
    const [username, setUserName] = useState('');

    useEffect(() => {
        if (role == 'KOLIFL') {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Bạn không có quyền truy cập', life: 3000 });
            window.location.href = '/';
        }
    }, [role]);

    useEffect(() => {
        kolRecruitment
            .getApplyRecruitments({
                page: page,
                recordPage: recordPage,
                sorting: sorting
            })
            .then((data) => {
                if (data?.status == 200) {
                    setDatas(data?.data?.data?.content);
                    setTotalRecords(data?.data?.data?.totalElements);
                }
            })
            .catch((err) => console.error(err));
    }, [page, recordPage, sorting]);

    const handleShowProfile = (data) => {
        if (!data?.username) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Dữ liệu trống', life: 3000 });
            return;
        }
        setUserName(data?.username);
        setVisibleSidebar(true);
    };

    const TemplatePage = (rowData) => {
        return <ItemKol data={rowData} handleShowProfile={handleShowProfile} showSocial={true} />;
    };

    const template1 = {
        layout: 'PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport',
        PrevPageLink: (options) => {
            return (
                <button type="button" className={classNames(options.className, 'border-round')} onClick={options.onClick} disabled={options.disabled}>
                    <span className="p-3">Previous</span>
                    <Ripple />
                </button>
            );
        },
        NextPageLink: (options) => {
            return (
                <button type="button" className={classNames(options.className, 'border-round')} onClick={options.onClick} disabled={options.disabled}>
                    <span className="p-3">Next</span>
                    <Ripple />
                </button>
            );
        },
        PageLinks: (options) => {
            if ((options.view.startPage === options.page && options.view.startPage !== 0) || (options.view.endPage === options.page && options.page + 1 !== options.totalPages)) {
                const className = classNames(options.className, { 'p-disabled': true });

                return (
                    <span className={className} style={{ userSelect: 'none' }}>
                        ...
                    </span>
                );
            }

            return (
                <button type="button" className={options.className} onClick={options.onClick}>
                    {options.page + 1}
                    <Ripple />
                </button>
            );
        },
        CurrentPageReport: (options) => {
            return (
                <span className="mx-3" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                    Go to <InputText disabled={!!options && options.totalPages < 2} min="0" minLength="1" size="2" className="ml-1" value={pageGoTo} onChange={onPageInputChange} />
                    <Button disabled={!!options && options.totalPages < 2} className="ml-2" onClick={() => onPageInputKeyDown(options)}>
                        Go
                    </Button>
                </span>
            );
        }
    };

    const onPageInputChange = (event) => {
        if (event.target.value >= 0) setPageGoTo(event.target.value);
    };

    const onPageInputKeyDown = (options) => {
        const pageGoToChange = parseInt(pageGoTo);
        if (pageGoToChange < 0 || pageGoToChange > options.totalPages) {
            setPage(options.totalPages);
        } else {
            setPage(pageGoToChange);
        }
        setRecordPage(options.rows);
        setChanging(!changing);
    };

    const onPageChange = (event) => {
        setPage(event.page + 1);
        setRecordPage(event.rows);
        setChanging(!changing);
        setIsChangingPaging(true);
    };

    return (
        <>
            <BreadcrumbCustom path={location} />
            <br />
            <Toast ref={toast} />
            <div id="applied-candidates" className="py-5">
                <div className="container">
                    {/* <div className="header-list-koc pl-3 mb-2 flex justify-content-between flex-wrap align-items-center">
                        <div className="select-soft md:w-auto w-full md:mt-0 mt-1 flex align-items-center">
                            <label htmlFor="sorting">Sắp xếp theo:</label>
                            <select
                                value={sorting}
                                className="cursor-pointer outline-none"
                                id="sorting"
                                name="sorting"
                                onChange={(event) => {
                                    setSorting(event?.target?.value);
                                    setPage(1);
                                }}
                            >
                                <option value="">...</option>
                                <option value="avgVideo">Doanh thu/ Video</option>
                                <option value="avgLive">Doanh thu/ Live</option>
                                <option value="followers">Follower</option>
                                <option value="price">Giá booking</option>
                            </select>
                        </div>
                    </div> */}
                    <DataView emptyMessage={'Không có dữ liệu'} value={datas} itemTemplate={TemplatePage} />
                    <Paginator className="md:mt-4" template={template1} first={page * recordPage - 1} rows={recordPage} totalRecords={totalRecords} onPageChange={onPageChange} />
                    <SidebarTiktok username={username} setVisibleSidebar={setVisibleSidebar} visibleSidebar={visibleSidebar} />
                </div>
            </div>
        </>
    );
};
export default AppliedCandidates;
