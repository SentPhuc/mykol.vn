import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useFormik } from 'formik';
import { calculateSerialNumber } from '../../../src/commons/Utils';
import { Toast } from 'primereact/toast';
import AppLayout from '../../../layout/AppLayout';
import { Paginator } from 'primereact/paginator';
import { SubscriptionService } from '../../../demo/service/SubscriptionService';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const Subscription = () => {
    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [editingRows, setEditingRows] = useState(false);

    const service = new SubscriptionService();
    const [changing, setChanging] = useState(false);

    const onPageChange = (event) => {
        setPage(event.page + 1);
        setPageSize(event.rows);
        setChanging(!changing);
    };

    const [packages, setPackages] = useState(null);
    const [statuses] = useState(['ACTIVE', 'INACTIVE']);
    const [types] = useState(['FREE', 'BASIC', 'PRO', 'AGENCY', 'PARTNER']);

    useEffect(() => {
        service
            .getSubscriptionsPackage({
                page: page,
                recordPage: pageSize
            })
            .then((data) => {
                setPackages(data?.data?.data?.content);
                setTotalRecords(data?.data?.data?.totalElements);
            });
    }, [changing, pageSize]);

    const formik = useFormik({
        initialValues: {
            id: '',
            name: '',
            price: '',
            type: '',
            nextPageLimit: '',
            searchLimit: '',
            status: ''
        },
        onSubmit: async (data) => {
            formik.resetForm();
        }
    });

    const getServiceErrorMessage = (name) => {
        if (formik?.errors[name]) {
            return <small className="p-error">{formik?.errors[name]}</small>;
        }
        return <small className="p-error">&nbsp;</small>;
    };

    const addDotsToNumber = (number) => {
        let numberString = number?.toString();
        numberString = numberString?.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return numberString;
    };

    const milisecondToDate = (milisecond) => {
        let date = new Date(milisecond);
        return date.toLocaleDateString('vi-VN')
    };

    const getSeverity = (value) => {
        switch (value) {
            case 'ACTIVE':
                return 'success';
            case 'INACTIVE':
                return 'danger';

            default:
                return null;
        }
    };

    const onRowEditComplete = (e) => {
        let { newData, index } = e;
        let _packages = newData;

        service
            .updateSubscriptions(_packages)
            .then((res) => {
                if (res.data.code !== 'success') {
                    toast.current.show({ severity: 'error', summary: 'Thất bại', detail: res.data.message, life: 3000 });
                } else {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Cập nhật thành công',
                        life: 3000
                    });
                }
                setChanging(!changing);
            })
            .catch((err) => {
                toast.current.show({ severity: 'error', summary: 'Thất bại', detail: 'Cập nhật thất bại', life: 3000 });
                setChanging(!changing);
            });
        setEditingRows(false);
    };

    const onCanelEdit = (e) => {
        setEditingRows(false);
    };

    const onRowEditing = (e) => {
        setEditingRows(true);
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const statusEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statuses}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Chọn trạng thái"
                itemTemplate={(option) => {
                    return <Tag value={option} severity={getSeverity(option)}></Tag>;
                }}
            />
        );
    };

    const typeEditor = (options) => {
        return <Dropdown value={options.value} options={types} onChange={(e) => options.editorCallback(e.value)} placeholder="Chọn loại gói" />;
    };

    const priceEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="VND" />;
    };

    const limitEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} />;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.statusDesc} severity={getSeverity(rowData.status)}></Tag>;
    };

    const typeBodyTemplate = (rowData) => {
        return <Tag value={rowData.type} severity="success"></Tag>;
    };

    const numberSearchTemplate = (rowData) => {
        return addDotsToNumber(rowData.nextPageLimit);
    };
    const numberNextPageTemplate = (rowData) => {
        return addDotsToNumber(rowData.searchLimit);
    };
    
    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rowData.price);
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
                        <Button type="button" icon="pi pi-plus" label="Thêm mới" disabled={editingRows} onClick={() => setVisible(true)} />
                        <Dialog header="Thêm mới gói" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                            <div className="p-fluid p-formgrid p-grid">
                                <div className="p-field p-col-12 p-md-6">
                                    <label htmlFor="name">Tên gói</label>
                                    <InputText
                                        id="name"
                                        type="text"
                                        maxLength={255}
                                        value={formik.values.name}
                                        onChange={(e) => {
                                            formik.setFieldValue('name', e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="p-field p-col-12 p-md-6 mt-2">
                                    <label htmlFor="price">Giá</label>
                                    <InputNumber
                                        id="price"
                                        name="price"
                                        mode="currency"
                                        currency="VND"
                                        placeholder="Nhập giá"
                                        maxLength={12}
                                        value={formik.values.price}
                                        onChange={(e) => {
                                            formik.setFieldValue('price', e.value);
                                        }}
                                    />
                                </div>
                                <div className="p-field p-col-12 p-md-6 mt-2">
                                    <label htmlFor="type">Loại</label>
                                    <Dropdown
                                        id="type"
                                        options={types}
                                        placeholder="Chọn loại gói"
                                        value={formik.values.type}
                                        onChange={(e) => {
                                            formik.setFieldValue('type', e.target.value);
                                        }}
                                    />
                                </div>

                                <div className="p-field p-col-12 p-md-6 mt-2">
                                    <label htmlFor="nextPageLimit">Số lượt next page</label>
                                    <InputNumber
                                        id="nextPageLimit"
                                        size={12}
                                        maxLength={10}
                                        minLength={1}
                                        value={formik.values.nextPageLimit}
                                        onChange={(e) => {
                                            formik.setFieldValue('nextPageLimit', e.value);
                                        }}
                                    />
                                </div>
                                <div className="p-field p-col-12 p-md-6 mt-2">
                                    <label htmlFor="searchLimit">Số lượt search</label>
                                    <InputNumber
                                        id="searchLimit"
                                        maxLength={10}
                                        minLength={1}
                                        size={12}
                                        value={formik.values.searchLimit}
                                        onChange={(e) => {
                                            formik.setFieldValue('searchLimit', e.value);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-content-center">
                                <Button
                                    label="Thêm mới"
                                    className="mt-2"
                                    type="submit"
                                    onClick={() => {
                                        service
                                            .createSubscriptions({
                                                name: formik.values.name,
                                                price: formik.values.price,
                                                type: formik.values.type,
                                                nextPageLimit: formik.values.nextPageLimit,
                                                searchLimit: formik.values.searchLimit
                                            })
                                            .then((res) => {
                                                if (res.data.code !== 'success') {
                                                    toast.current.show({ severity: 'error', summary: 'Thất bại', detail: res.data.message, life: 3000 });
                                                    setVisible(true);
                                                } else {
                                                    toast.current.show({
                                                        severity: 'success',
                                                        summary: 'Thành công',
                                                        detail: 'Thêm mới thành công',
                                                        life: 3000
                                                    });
                                                    setVisible(false);
                                                    setChanging(!changing);
                                                    formik.resetForm();
                                                }

                                                
                                            })
                                            .catch((err) => {
                                                toast.current.show({ severity: 'error', summary: 'Thất bại', detail: 'Thêm mới thất bại', life: 3000 });
                                                setChanging(!changing);
                                                setVisible(false);
                                                formik.resetForm();
                                            });
                                    }}
                                />
                            </div>
                        </Dialog>
                    </div>
                    <hr />
                    <DataTable className="p-datatable-custom" value={packages} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} onRowEditInit={onRowEditing} onRowEditCancel={onCanelEdit} emptyMessage="Không có dữ liệu" scrollable>
                        <Column header="#" body={(rowData, field) => calculateSerialNumber(field?.rowIndex, page, pageSize)} style={{ maxWidth: '40px', minWidth: '40px' }} />
                        <Column field="name" header="Gói dịch vụ" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                        <Column field="price" header="Giá" body={priceBodyTemplate} editor={(options) => priceEditor(options)} style={{ width: '20%' }}></Column>
                        <Column field="type" header="Loại" body={typeBodyTemplate} editor={(options) => typeEditor(options)} style={{ width: '20%' }}></Column>
                        <Column field="nextPageLimit" header="Số lượt next page" body={numberNextPageTemplate} editor={(options) => limitEditor(options)} style={{ width: '20%' }}></Column>
                        <Column field="searchLimit" header="Số lượt search" body={numberSearchTemplate} editor={(options) => limitEditor(options)} style={{ width: '20%' }}></Column>
                        <Column field="updatedTime" header="Thời gian cập nhật" body={(rowData) => milisecondToDate(rowData?.updatedTime)} style={{ width: '10%' }}></Column>
                        <Column header="Cập nhật" rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                    </DataTable>
                    <Paginator rowsPerPageOptions={[5, 10, 20, 50, 100]} first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />
                </div>
            </React.Fragment>
        </>
    );
};
export default Subscription;
