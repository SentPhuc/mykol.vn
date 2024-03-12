import { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Bookings } from 'demo/service/Bookings';
import { useFormik } from 'formik';
import { PAGE_SIZE_DEFAULT } from 'src/commons/Constant';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { formatPriceVnd } from 'src/commons/Utils';

const PageAdmin = () => {
    const bookings = new Bookings();
    const [datas, setDatas] = useState([]);
    const [changing, setChanging] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
    const [totalRecords, setTotalRecords] = useState(0);
    const [listStatus, setListStatus] = useState([]);
    const toast = useRef(null);

    const formik = useFormik({
        initialValues: {
            status: null
        },
        onSubmit: async (data) => {
            const params = {
                status: data?.status,
                page: page,
                recordPage: pageSize
            };

            if (!data?.month) delete params.month;

            const res = await bookings.trackingBooking(params);
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
        const res = await bookings.getBookingStatus();
        if (res?.status == 200) {
            setListStatus(res?.data?.data);
        }
    }, []);

    useEffect(async () => {
        const params = {
            status: formik?.values?.status,
            page: page,
            recordPage: pageSize
        };

        if (!formik?.values?.month) delete params.month;

        const res = await bookings.trackingBooking(params);
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


    return (
        <>
            <Toast ref={toast} />
            <div className="card md:p-5 p-2" id="booking-page">
                <form className="mb-6" onSubmit={formik.handleSubmit}>
                    <h4 className="font-bold text-xl md:text-4xl mb-4 w-full">Theo dõi đơn hàng</h4>
                    <div className="align-items-center flex flex-wrap gap-3 mb-3">
                    
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
                    <Button icon="pi pi-reply" onClick={handleRemoveAllFilter} label="Xóa chọn" className="p-button remove-filter ml-4" />
                </form>
                <DataTable scrollable value={datas} dataKey="id" className="p-datatable-custom" emptyMessage="Không có dữ liệu">
                    <Column header="#" body={(rowData, field) => field.rowIndex + 1} style={{ maxWidth: '3rem' }} />
                    <Column header="Mail NTD" style={{ minWidth: '10rem', wordBreak: 'break-all' }} body={(rowData, field) => rowData.recruiterMail} />
                    <Column header="Mail KOC" style={{ minWidth: '10rem' }} body={(rowData, field) => rowData.kocMail} />
                    <Column header="Giá trị đơn hàng" style={{ minWidth: '10rem' }} body={(rowData, field) => formatPriceVnd(rowData.totalAmount)} />
                    <Column header="Trạng thái" style={{ minWidth: '10rem' }} body={(rowData, field) => rowData.status} />
                    <Column header="Thời gian phát sinh" style={{ minWidth: '10rem' }} body={(rowData, field) => rowData.createdTime} />
                </DataTable>
                <Paginator first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />
            </div>
        </>
    );
};

export default PageAdmin;
