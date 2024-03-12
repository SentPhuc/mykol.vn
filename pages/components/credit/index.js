import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useFormik } from 'formik';
import { calculateSerialNumber } from '../../../src/commons/Utils';
import { Toast } from 'primereact/toast';
import AppLayout from '../../../layout/AppLayout';
import { Paginator } from 'primereact/paginator';
import { SubscriptionService } from '../../../demo/service/SubscriptionService';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const Credit = () => {
    const toast = useRef(null);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [subscriptions, setSubscriptions] = useState(null);


    const service = new SubscriptionService();
    const [changing, setChanging] = useState(false);

    const onPageChange = (event) => {
        setPage(event.page + 1);
        setPageSize(event.rows);
        setChanging(!changing);
    };

    useEffect(() => {

        service
            .getAllCredits({
                page: page,
                recordPage: pageSize,
                keyword: formik.values.keyword
            })
            .then((data) => {
                setSubscriptions(data?.data?.data?.content);
                setTotalRecords(data?.data?.data?.totalElements);
            });
    }, [changing, pageSize]);

    const formik = useFormik({
        initialValues: {
            id: '',
            subPackageId: '',
            searchLimit: '',
            nextPageLimit: '',
            keyword: ''
        },
        onSubmit: async (data) => {
            setChanging(!changing);
        }
    });



    const milisecondToDate = (milisecond) => {
        if (!!milisecond) {
            let date = new Date(milisecond);
            return date.toLocaleDateString('vi-VN');
        }

        return 'N/A';
    };


    return AppLayout(
        <>
            <React.Fragment>
                <br />
                <Toast ref={toast} />
                <div className="card p-3 md:p-5">
                    <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                        <h4 className="m-0">
                            Tổng số gói <span className={'primary-color'}>({totalRecords})</span>
                        </h4>
                        <div className="flex gap-2">
                            <InputText id="keyword" name="keyword" placeholder="Nhập từ khóa" className="w-64" value={formik.values.keyword} onChange={formik.handleChange} />
                            <Button label="Tìm kiếm" icon="pi pi-search" onClick={formik.handleSubmit} />
                        </div>
                    </div>
                    <hr />
                    <DataTable className="p-datatable-custom" value={subscriptions} dataKey="id"  emptyMessage="Bạn chưa đăng ký gói" scrollable>
                        <Column header="#" body={(rowData, field) => calculateSerialNumber(field?.rowIndex, page, pageSize)} style={{ maxWidth: '40px', minWidth: '40px' }} />
                        <Column field="name" header="Tên gói" style={{ minWidth: '15%' }}></Column>
                        <Column field="nextPageLimit" header="Số lượt next page"   style={{ minWidth: '20%' }}></Column>
                        <Column field="searchLimit" header="Số lượt search" style={{ minWidth: '20%' }}></Column>
                        <Column field="searchLimitUpdateTime" header="Thời gian nạp" body={(rowData) => milisecondToDate(rowData?.nextPageLimitUpdateTime)} style={{ minWidth: '10%' }}></Column>
                    </DataTable>
                    <Paginator rowsPerPageOptions={[5, 10, 20, 50, 100]} first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />
                </div>
            </React.Fragment>
        </>
    );
};
export default Credit;
