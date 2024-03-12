import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useFormik } from 'formik';
import { calculateSerialNumber } from '../../../src/commons/Utils';
import { Toast } from 'primereact/toast';
import AppLayout from '../../../layout/AppLayout';
import { Paginator } from 'primereact/paginator';
import { KolsSalesService } from '../../../demo/service/KolsSalesService';
import { InputText } from 'primereact/inputtext';
import { formatUrlExact } from 'src/commons/Utils';

const UpdateKolSales = () => {
    const router = useRouter();
    const toast = useRef(null);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const [dataContent, setDataContent] = useState([]);
    const service = new KolsSalesService();
    const [changing, setChanging] = useState(false);

    const formik = useFormik({
        initialValues: {
            id: '',
            totalSales: '',
            keyword: ''
        },
        onSubmit: async (data) => {
            formik.resetForm();
        }
    });

    const updateKolsTotalSales = async (kolRecruitId, totalSales) => {
        const response = await service.updateKolSales(kolRecruitId, totalSales);
        if (response.data.code !== 'success') {
            toast.current.show({
                severity: 'error',
                summary: 'Thông báo',
                detail: response.data.message,
                life: 2000
            });
            return;
        }

        toast.current.show({
            severity: 'success',
            summary: 'Thông báo',
            detail: response.data.message,
            life: 2000
        });

        // Update
        const itemIndex = dataContent.findIndex((item) => item.id === kolRecruitId);
        const newData = [...dataContent];
        newData[itemIndex].note = note;
        setDataContent(newData);
    };

    useEffect(async () => {
        async function fetchData() {
            const res = await service.getKols({
                keyword: formik.values.keyword,
                page: page,
                recordPage: pageSize
            });
            if (res.data.code === 'success') {
                const data = res.data.data;
                if (data?.content?.length > 0) {
                    setDataContent(data.content);
                } else {
                    setDataContent([]);
                }
                setTotalRecords(res.data.data.totalElements);
            } else {
                setDataContent([]);
            }
        }
        fetchData();
    }, [formik.values, changing, pageSize]);

    const updateKolSales = async (id, totalSales) => {
        const response = await service.updateTotalSales({ id: id, totalSales: totalSales });
        if (response.data.code !== 'success') {
            toast.current.show({
                severity: 'error',
                summary: 'Thông báo',
                detail: response.data.message,
                life: 2000
            });
            return;
        }

        toast.current.show({
            severity: 'success',
            summary: 'Thông báo',
            detail: response.data.message,
            life: 2000
        });

        // Update
        const itemIndex = dataContent.findIndex((item) => item.id === id);
        const newData = [...dataContent];
        newData[itemIndex].totalSales = totalSales;
        setDataContent(newData);
    };

    const onPageChange = (event) => {
        setPage(event.page + 1);
        setPageSize(event.rows);
        setChanging(!changing);
    };

    const isPositiveInteger = (val) => {
        let str = String(val);

        str = str.trim();

        if (!str) {
            str = '0';
        }

        str = str.replace(/^0+/, '') || '0';
        let n = Math.floor(Number(str));

        return n !== Infinity && String(n) === str;
    };

    const onCellEditComplete = (e) => {
        let { rowData, newValue, field, originalEvent: event } = e;

        switch (field) {
            case 'totalSales':
                console.log('newValue', newValue);
                if (isPositiveInteger(newValue)) {
                    rowData[field] = newValue;
                    updateKolSales(rowData.id, newValue);
                } else {
                    event.preventDefault();
                }
                break;

            default:
                if (newValue.trim().length > 0) {
                    rowData[field] = newValue;
                    updateKolSales(rowData.id, newValue);
                } else {
                    rowData[field] = 0;
                    event.preventDefault();
                }
                break;
        }
    };

    const cellEditor = (options) => {
        return <InputText value={options.value} onChange={(e) => options.editorCallback(e.target.value)} maxLength={10} />;
    };

    const totalSalesTemplate = (rowData) => {
        if (rowData?.totalSales) {
            return <>{rowData?.totalSales}</>;
        } else {
            return <>Chưa cập nhật</>;
        }
    };

    const linkTiktokTemplate = (rowData) => {
        return (
            <a className="text-primary cursor-pointer underline font-bold" target="_blank" href={formatUrlExact('https://www.tiktok.com/@' + rowData?.username)} title={rowData?.username}>
                {rowData?.username}
            </a>
        );
    };
    return AppLayout(
        <>
            <React.Fragment>
                {/* <BreadcrumbCustom path={location} /> */}
                <br />
                <Toast ref={toast} />

                <div className="card p-3 md:p-5">
                    <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                        <h4 className="m-0">
                            Tổng số tài khoản Tiktok <span className={'primary-color'}>({totalRecords})</span>
                        </h4>
                    </div>
                    <p>Cập nhật số lượt bán của Kols</p>
                    <hr />
                    <div className="field col-12 lg:col-4">
                        <label htmlFor="name" className="w-full">
                            Tài khoản Tiktok
                        </label>
                        <span className="p-input-icon-left mr-4 w-full">
                            <i className="pi pi-search" />
                            <InputText
                                id="tiktokAccount"
                                name="tiktokAccount"
                                value={formik.values.keyword}
                                onChange={(e) => {
                                    formik.setFieldValue('keyword', e.target.value);
                                }}
                                inputid="tiktokAccount"
                                maxLength={20}
                                placeholder="Tìm kiếm"
                            ></InputText>
                        </span>
                    </div>
                    <hr />
                    <DataTable className="p-datatable-custom" editMode="cell" value={dataContent} emptyMessage="Không có dữ liệu" scrollable>
                        <Column header="#" body={(rowData, field) => calculateSerialNumber(field?.rowIndex, page, pageSize)} style={{ maxWidth: '40px', minWidth: '40px' }} />
                        <Column style={{ minWidth: '150px', maxWidth: '50%', whiteSpace: 'nowrap' }} body={linkTiktokTemplate} header="Tài khoản Tiktok" />
                        <Column
                            style={{ minWidth: '150px', maxWidth: '150%', whiteSpace: 'nowrap' }}
                            body={totalSalesTemplate}
                            header="Số lượt bán"
                            field="totalSales"
                            editor={(options) => cellEditor(options)}
                            onCellEditComplete={onCellEditComplete}
                        />
                    </DataTable>
                    <Paginator rowsPerPageOptions={[5, 10, 20, 50, 100, 200, 500]} first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />
                </div>
            </React.Fragment>
        </>
    );
};
export default UpdateKolSales;
