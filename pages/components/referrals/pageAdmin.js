import { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ReferralsService } from 'demo/service/Referrals';
import { listMonth, formatPriceVnd } from 'src/commons/Utils';
import { ListYear } from 'src/commons/ListYear';
import { useFormik } from 'formik';
import { PAGE_SIZE_DEFAULT } from 'src/commons/Constant';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import moment from 'moment';
import { InputText } from 'primereact/inputtext';

const PageAdmin = () => {
    const referrals = new ReferralsService();
    const [datas, setDatas] = useState([]);
    const [changing, setChanging] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
    const [totalRecords, setTotalRecords] = useState(0);
    const [listStatus, setListStatus] = useState([]);
    const toast = useRef(null);

    const formik = useFormik({
        initialValues: {
            searchKeyword: '',
            year: 0,
            month: 0,
            status: null
        },
        onSubmit: async (data) => {
            const params = {
                year: data?.year,
                month: data?.month,
                status: data?.status,
                searchKeyword: data?.searchKeyword,
                page: page,
                recordPage: pageSize
            };

            if (!data?.month) delete params.month;

            const res = await referrals.managements(params);
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
            searchKeyword: formik?.values?.searchKeyword,
            page: page,
            recordPage: pageSize
        };

        if (!formik?.values?.month) delete params.month;

        const res = await referrals.managements(params);
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

    const handleUpdateStatus = (data) => {
        if (!data) return;

        referrals
            .updateStatus(data)
            .then(({ data }) => {
                if (data?.code == 'success') {
                    toast?.current?.show({
                        severity: 'success',
                        summary: 'Thông báo',
                        detail: 'Cập nhật trạng thái thành công',
                        life: 2000
                    });
                    setChanging(!changing);
                }
            })
            .catch((error) => console.error(error));
    };

    const templateStatus = (rowData) => {
        return (
            <Dropdown
                onChange={(value) =>
                    handleUpdateStatus({
                        status: value?.value,
                        id: Number(rowData?.id)
                    })
                }
                inputId="status"
                name="status"
                value={rowData.status}
                options={listStatus}
                optionLabel="name"
                optionValue="code"
                placeholder="Trạng thái"
                emptyMessage="Không có dữ liệu"
            />
        );
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="card md:p-5 p-2" id="referrals-page">
                <form className="mb-6" onSubmit={formik.handleSubmit}>
                    <h4 className="font-bold text-xl md:text-4xl mb-4 w-full">Trình quản lý Admin</h4>
                    <div className="align-items-center flex flex-wrap gap-3 mb-3">
                        <InputText
                            inputid="searchKeyword"
                            name="searchKeyword"
                            value={formik.values.searchKeyword}
                            placeholder="Nhập từ khóa"
                            onChange={(e) => {
                                formik.setFieldValue('searchKeyword', e.target.value);
                            }}
                            style={{ width: '300px' }}
                        />
                        <Button type="submit" label="Tìm kiếm" icon="pi pi-search" className="ml-3 white-space-nowrap" style={{ width: '120px' }} onClick={() => setPage(1)} />
                    </div>
                    <h4 className="font-bold text-xl md:text-4xl mb-4 w-full">Bộ lọc</h4>
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
                    <Button icon="pi pi-reply" onClick={handleRemoveAllFilter} label="Xóa chọn" className="p-button remove-filter ml-4" />
                </form>
                <DataTable scrollable value={datas} dataKey="id" className="p-datatable-custom" emptyMessage="Không có dữ liệu">
                    <Column header="#" body={(rowData, field) => field.rowIndex + 1} style={{ maxWidth: '3rem' }} />
                    <Column header="Tên tài khoản" style={{ minWidth: '10rem', wordBreak: 'break-all' }} body={(rowData, field) => rowData.name} />
                    <Column header="Email" style={{ minWidth: '10rem' }} body={(rowData, field) => rowData.email} />
                    <Column header="Số điện thoại" style={{ minWidth: '10rem' }} body={(rowData, field) => rowData.phone} />
                    <Column header="Tháng / Năm" style={{ minWidth: '10rem' }} body={(rowData, field) => rowData.month + '/' + rowData.year} />
                    <Column header="Hoa hồng" style={{ minWidth: '10rem' }} body={(rowData, field) => formatPriceVnd(rowData.totalCommission)} />
                    <Column header="Trạng thái" style={{ minWidth: '10rem' }} body={templateStatus} />
                </DataTable>
                <Paginator first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />
            </div>
        </>
    );
};

export default PageAdmin;
