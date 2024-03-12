import { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ReferralsService } from 'demo/service/Referrals';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { listCommissionRank, listMonth, formatPriceVnd } from 'src/commons/Utils';
import { ListYear } from 'src/commons/ListYear';
import { useFormik } from 'formik';
import { PAGE_SIZE_DEFAULT } from 'src/commons/Constant';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import moment from 'moment';
import PopupRanking from './popupRanking';
import BannerReferrals from './bannerReferrals';

const PageNotAdmin = () => {
    const referrals = new ReferralsService();
    const [datas, setDatas] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [changing, setChanging] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
    const [totalRecords, setTotalRecords] = useState(0);
    const [listStatus, setListStatus] = useState([]);
    const toast = useRef(null);
    const [statistic, setStatistic] = useState({
        totalAmount: 0,
        totalCommission: 0,
        totalReferral: 0
    });
    const [currentRank, setCurrentRank] = useState({});
    const [percentRank, setPercentRank] = useState(0);

    useEffect(() => {
        referrals
            .getStatisticReferrals()
            .then(({ data }) => {
                if (data?.code === 'success') {
                    setStatistic(data?.data);
                }
            })
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        if (showPopup) document.body.classList.add('overflow-hidden');
        else document.body.classList.remove('overflow-hidden');
    }, [showPopup]);

    const formik = useFormik({
        initialValues: {
            year: 0,
            month: 0,
            status: null
        },
        onSubmit: async (data) => {
            const params = {
                year: data?.year,
                month: data?.month,
                status: data?.status,
                page: page,
                recordPage: pageSize
            };

            if (!data?.month) delete params.month;

            const res = await referrals.search(params);
            setTotalRecords(res?.data?.data?.totalElements);
            setDatas(res?.data?.data?.content);

            toast.current.show({
                severity: 'success',
                summary: 'Thông báo',
                detail: 'Lọc theo điều kiện thành công',
                life: 2000
            });
        }
    });

    useEffect(async () => {
        const res = await referrals.getStatusReferrals();
        if (res?.status == 200) {
            setListStatus(res?.data?.data);
        }
    }, []);

    useEffect(async () => {
        const params = {
            year: formik?.values?.year,
            month: formik?.values?.month,
            status: formik?.values?.status,
            page: page,
            recordPage: pageSize
        };

        if (!formik?.values?.month) delete params.month;

        const res = await referrals.search(params);
        setDatas(res?.data?.data.content);
        setTotalRecords(res?.data?.data.totalElements);
    }, [changing, page, pageSize]);

    const handleRemoveAllFilter = () => {
        formik.resetForm();
        setPage(1);
        setPageSize(PAGE_SIZE_DEFAULT);
    };

    const onPageChange = (event) => {
        setPage(event.page + 1);
        setPageSize(event.rows);
        setChanging(!changing);
    };

    useEffect(async () => {
        for (let index = 0; index < listCommissionRank.length; index++) {
            const rankCost = listCommissionRank?.[index]?.value;
            if (rankCost?.[0] <= statistic?.totalAmount && statistic?.totalAmount <= rankCost?.[1]) {
                setCurrentRank(listCommissionRank?.[index]);
                return;
            }

            setCurrentRank(listCommissionRank?.[index]);
        }
    }, [statistic]);

    useEffect(async () => {
        if (currentRank?.value?.[1] == 0) {
            setPercentRank(100);
            return;
        }

        setPercentRank(Math.floor((statistic?.totalAmount / currentRank?.value?.[1]) * 100));
    }, [currentRank, statistic]);

    return (
        <>
            <Toast ref={toast} />
            <div className="card md:p-5 p-2" id="referrals-page">
                <BannerReferrals />
                <div className="flex flex-wrap justify-content-between mt-5 mb-6">
                    <div className="total-holder">
                        <div className="total-num">{statistic.totalReferral}</div>
                        <div className="total-title-holder">
                            <div className="total-title">Tổng nhãn hàng</div>
                        </div>
                    </div>
                    <div className="total-holder">
                        <div className="total-num">{formatPriceVnd(statistic.totalAmount)}</div>
                        <div className="total-title-holder">
                            <div className="total-title">Đã chi tiêu</div>
                        </div>
                    </div>
                    <div className="total-holder">
                        <div className="total-num">{formatPriceVnd(statistic.totalCommission)}</div>
                        <div className="total-title-holder">
                            <div className="total-title">Tổng hoa hồng</div>
                        </div>
                    </div>
                </div>
                <div style={{ maxWidth: '1200px', margin: 'auto' }}>
                    <div className="box-chart-circle border-round-sm border-3 border-solid">
                        <h3 className="font-bold text-xl md:text-4xl mb-7">Thứ hạng và Hoa hồng</h3>
                        <div className="flex justify-content-between flex-wrap align-items-start">
                            <div className="flex flex-wrap tabel-rank">
                                <div className="header-table-rank w-full flex">
                                    <span className="w-3 block px-4 py-3">Hạng</span>
                                    <span className="w-6 block px-4 py-3">Nhãn hàng chi tiêu</span>
                                    <span className="w-3 block px-4 py-3">Hoa hồng</span>
                                </div>
                                {listCommissionRank.map((value, index) => {
                                    return (
                                        <div key={index} className="row-table-rank w-full flex">
                                            <span className="w-3 block px-4 py-3">{value?.rank}</span>
                                            <span className="w-6 block px-4 py-3">{value?.spendingBrand}</span>
                                            <span className="w-3 block px-4 py-3">{value?.commissionSale}</span>
                                        </div>
                                    );
                                })}

                                <div className="w-full mt-4 text-center">
                                    <Button onClick={() => setShowPopup(true)} label="Bảng xếp hạng" />
                                </div>
                            </div>
                            <div className="relative ml-auto mr-auto mt-3 md:mt-0 chart-circle p-4 pb-5" style={{ maxWidth: '300px', backgroundColor: '#161D31' }}>
                                <CircularProgressbar
                                    value={percentRank}
                                    styles={buildStyles({
                                        rotation: 0.5 + (1 - percentRank / 100) / 2,
                                        pathColor: '#00B57B',
                                        trailColor: '#222',
                                        strokeLinecap: 'butt'
                                    })}
                                    strokeWidth={7}
                                />
                                <div className="percentInfo">
                                    <span>Cấp hiện tại</span>
                                    <p>{currentRank?.rank}</p>
                                </div>
                                <div className="percentChart">{percentRank}%</div>
                            </div>
                        </div>
                    </div>
                    <form className="my-6" onSubmit={formik.handleSubmit}>
                        <h4 className="font-bold text-xl md:text-4xl mb-4 w-full">Thống kê hoa hồng</h4>
                        <Toast ref={toast} />
                        <div className="align-items-center flex flex-wrap gap-3 mb-3">
                            <Dropdown
                                inputId="year"
                                name="year"
                                value={formik.values.year}
                                options={ListYear}
                                optionLabel="name"
                                optionValue="code"
                                placeholder="Năm"
                                emptyMessage="Không có danh sách nào được tạo"
                                onChange={(e) => {
                                    setPageSize(PAGE_SIZE_DEFAULT);
                                    setPage(1);
                                    formik.setFieldValue('year', e.target.value);
                                }}
                            />
                            <Dropdown
                                inputId="month"
                                name="month"
                                value={formik.values.month}
                                options={listMonth}
                                optionLabel="name"
                                optionValue="code"
                                placeholder="Tháng"
                                emptyMessage="Không có dữ liệu"
                                onChange={(e) => {
                                    setPageSize(PAGE_SIZE_DEFAULT);
                                    setPage(1);
                                    formik.setFieldValue('month', e.target.value);
                                }}
                            />

                            <Dropdown
                                inputId="status"
                                name="status"
                                value={formik.values.status}
                                options={listStatus}
                                optionLabel="name"
                                optionValue="code"
                                placeholder="Trạng thái"
                                emptyMessage="Không có dữ liệu"
                                onChange={(e) => {
                                    setPageSize(PAGE_SIZE_DEFAULT);
                                    setPage(1);
                                    formik.setFieldValue('status', e.target.value);
                                }}
                            />
                        </div>
                        <Button type="submit" label="Tìm kiếm" icon="pi pi-search" />
                        <Button icon="pi pi-reply" onClick={handleRemoveAllFilter} label="Xóa chọn" className="p-button remove-filter ml-4"></Button>
                    </form>
                    <DataTable scrollable value={datas} dataKey="id" className="p-datatable-custom" emptyMessage="Không có dữ liệu">
                        <Column header="Stt" body={(rowData, field) => field.rowIndex + 1} style={{ maxWidth: '3rem' }} />
                        <Column header="Thời gian" style={{ minWidth: '10rem', wordBreak: 'break-all' }} body={(rowData, field) => moment(rowData.registrationTime).format('DD/MM/YYYY')} />
                        <Column header="Mã đơn hàng" style={{ minWidth: '10rem' }} body={(rowData, field) => rowData.orderId} />
                        <Column header="Số tiền đơn hàng" style={{ minWidth: '10rem' }} body={(rowData, field) => formatPriceVnd(rowData.amount)} />
                        <Column header="Hoa hồng" style={{ minWidth: '10rem' }} body={(rowData, field) => formatPriceVnd(rowData.commission)} />
                        <Column header="Trạng thái" style={{ minWidth: '10rem' }} body={(rowData, field) => rowData.statusName} />
                    </DataTable>
                    <Paginator first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />
                </div>
            </div>
            <PopupRanking show={showPopup} setShow={setShowPopup} />
        </>
    );
};

export default PageNotAdmin;
