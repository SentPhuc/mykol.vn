import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useFormik } from 'formik';
import { calculateSerialNumber } from '../../../src/commons/Utils';
import { Toast } from 'primereact/toast';
import AppLayout from '../../../layout/AppLayout';
import { Paginator } from 'primereact/paginator';
import { SubscriptionService } from '../../../demo/service/SubscriptionService';
import { GlobalService } from '../../../demo/service/GlobalService';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import classNames from 'classnames';

const Subscription = () => {
    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [recruiters, setRecruiters] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [packages, setPackages] = useState(null);

    const [allRecruiters, setAllRecruiters] = useState(null);

    const service = new SubscriptionService();
    const globalService = new GlobalService();
    const [changing, setChanging] = useState(false);

    const onPageChange = (event) => {
        setPage(event.page + 1);
        setPageSize(event.rows);
        setChanging(!changing);
    };

    useEffect(() => {
        globalService.getAllSubscriptionsPackage().then((data) => {
            setPackages(data?.data?.data);
        });

        service
            .getRecruiter({
                page: page,
                recordPage: pageSize,
                keyword: seachForm.values.keyword
            })
            .then((data) => {
                setRecruiters(data?.data?.data?.content);
                setTotalRecords(data?.data?.data?.totalElements);
            });
    }, [changing, pageSize, page]);

    const search = () => {
        setPage(1);
        setChanging(!changing);
    };

    const seachForm = useFormik({
        initialValues: {
            keyword: ''
        },
        onSubmit: async (data) => {
            setPage(1);
            setChanging(!changing);
        }
    });

    const formik = useFormik({
        initialValues: {
            id: '',
            subPackageId: '',
            searchLimit: '',
            nextPageLimit: '',
            keyword: '',
            item: '',
            package: '',
            recruiter: ''
        },
        validate: (data) => {
            let errors = {};

            if (!data.recruiter) {
                errors.recruiter = 'Hãy chọn nhà tuyển dụng.';
            }

            if (!data.package) {
                errors.package = 'Hãy chọn gói dịch vụ.';
            }

            return errors;
            // validateData(data);
        },
        onSubmit: async (data) => {
            if (!data.recruiter) {
                errors.recruiter = 'Hãy chọn nhà tuyển dụng.';
            }

            if (!data.package) {
                errors.package = 'Hãy chọn gói dịch vụ.';
            }

            let _data = {
                recruiterId: data.recruiter?.id,
                subPackageId: data.package?.id
            };
            if (!isSubmitting) {
                setIsSubmitting(true);
                service.activateSubscription(_data).then((res) => {
                    if (res.data.code !== 'success') {
                        toast.current.show({
                            severity: 'error',
                            summary: 'Thất bại',
                            detail: res.data.message,
                            life: 3000
                        });
                        setIsSubmitting(false);
                    } else {
                        toast.current.show({
                            severity: 'success',
                            summary: 'Thành công',
                            detail: 'Cập nhật thành công',
                            life: 3000
                        });
                        closeModal();
                        setChanging(!changing);
                    }
                });
            }
        }
    });

    const packageEditor = (options) => (
        <React.Fragment>
            <Dropdown
                id="subPackageId"
                name="subPackageId"
                value={options.rowData.subPackageId}
                options={packages}
                onChange={(e) => {
                    options.editorCallback(e.value);
                }}
                placeholder="Chọn gói"
                optionLabel="name"
                optionValue="id"
            />
        </React.Fragment>
    );

    const packageBodyTemplate = (rowData) => {
        if (rowData.subPackageId === null || rowData.subPackageId === undefined || rowData.subPackageId === '' || packages === null || packages === undefined) return 'Chưa chọn gói';
        return packages.find((x) => x.id === rowData.subPackageId)?.name;
    };

    const milisecondToDate = (milisecond) => {
        if (!!milisecond) {
            let date = new Date(milisecond);
            return date.toLocaleDateString('vi-VN');
        }

        return 'N/A';
    };

    const numberSearchCalculate = (rowData) => {
        if (!!rowData.searchLimit) return addDotsToNumber(rowData.searchLimit - rowData?.availableSearchLimit);
        return 'N/A';
    };

    const numberNextPageCalculate = (rowData) => {
        if (!!rowData.nextPageLimit) return addDotsToNumber(rowData.nextPageLimit - rowData?.availableNextPageLimit);
        return 'N/A';
    };

    const renderEmail = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.email}</span>
            </div>
        );
    };

    const renderPhone = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.contactPhone}</span>
            </div>
        );
    };

    const addDotsToNumber = (number) => {
        let numberString = number?.toString();
        numberString = numberString?.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return numberString;
    };

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };

    const openModal = () => {
        service.getAllRecruiter().then((data) => {
            setAllRecruiters(data?.data?.data);
        });
        setVisible(true);
        //set scroll can not scroll
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        formik.resetForm();
        setVisible(false);
        document.body.style.overflow = 'unset';
    };

    return AppLayout(
        <>
            <React.Fragment>
                <br />
                <Toast ref={toast} />
                <div className="card p-3 md:p-5">
                    <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                        <h4 className="m-0">
                            Tổng số nhà tuyển dụng <span className={'primary-color'}>({totalRecords})</span>
                        </h4>
                        <div className="flex gap-2">
                            <Button type="button" icon="pi pi-plus" label="Thêm mới" onClick={() => openModal()} />
                            <Dialog header="Gia hạn thủ công" visible={visible} style={{ width: '40rem' }} breakpoints={{ '40rem': '40rem' }} onHide={() => closeModal()}>
                                <div className="w-full surface-card">
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className="p-fluid p-formgrid p-grid">
                                            <div className="p-field p-col-12 p-md-6">
                                                <label className="font-bold" htmlFor="name">
                                                    Nhà tuyển dụng
                                                </label>
                                                <Dropdown
                                                    filter
                                                    filterMatchMode="contains"
                                                    filterPlaceholder="Tìm kiếm"
                                                    inputId="recruiter"
                                                    name="recruiter"
                                                    options={allRecruiters}
                                                    value={formik.values.recruiter}
                                                    onChange={(e) => {
                                                        formik.setFieldValue('recruiter', e.target.value);
                                                    }}
                                                    optionLabel="name"
                                                    placeholder="Chọn nhà tuyển dụng"
                                                    className={classNames({ 'p-invalid': isFormFieldInvalid('recruiter') }, 'mt-2')}
                                                />
                                                {getFormErrorMessage('recruiter')}
                                            </div>

                                            <div className="p-field p-col-12 p-md-6 mt-2">
                                                <label className="font-bold" htmlFor="type">
                                                    Gói dịch vụ
                                                </label>
                                                <Dropdown
                                                    inputId="package"
                                                    name="package"
                                                    options={packages}
                                                    value={formik.values.package}
                                                    onChange={(e) => {
                                                        formik.setFieldValue('package', e.target.value);
                                                    }}
                                                    placeholder="Chọn gói dịch vụ"
                                                    optionLabel="name"
                                                    className={classNames({ 'p-invalid': isFormFieldInvalid('package') }, 'mt-2')}
                                                />
                                                {getFormErrorMessage('package')}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap align-items-center justify-content-end">
                                            <Button label="Xác nhận" className="mt-2" type="submit" className="p-button-success" icon="pi pi-save" />
                                        </div>
                                    </form>
                                </div>
                            </Dialog>
                        </div>
                    </div>
                    <hr />
                    <div className="flex gap-2 mt-2">
                        <InputText id="keyword" name="keyword" placeholder="Nhập từ khóa" className="w-64" value={seachForm.values.keyword} onChange={seachForm.handleChange} />
                        <Button label="Tìm kiếm" icon="pi pi-search" onClick={() => search()} />
                    </div>
                    <hr />
                    <DataTable value={recruiters} editMode="row" dataKey="id" emptyMessage="Không có dữ liệu" scrollable>
                        <Column header="#" body={(rowData, field) => calculateSerialNumber(field?.rowIndex, page, pageSize)} style={{ maxWidth: '40px', minWidth: '40px' }} />
                        <Column field="name" header="Tên nhà tuyển dụng" style={{ minWidth: '14rem' }}></Column>
                        <Column field="email" header="Email" style={{ minWidth: '14rem' }} body={renderEmail}></Column>
                        <Column field="contactPhone" header="Số điện thoại" style={{ minWidth: '14rem' }} body={renderPhone}></Column>
                        <Column field="subPackageId" header="Gói đang sử dụng" body={packageBodyTemplate} editor={(options) => packageEditor(options)} style={{ minWidth: '15%' }}></Column>
                        <Column field="availableNextPageLimit" header="Next page đã dùng" body={numberNextPageCalculate} style={{ minWidth: '10rem' }}></Column>
                        <Column field="availableSearchLimit" header="Search đã dùng" body={numberSearchCalculate} style={{ minWidth: '10rem' }}></Column>
                        <Column field="expiredTime" header="Ngày đăng ký" body={(rowData) => milisecondToDate(rowData?.startTime)} style={{ width: '14rem' }}></Column>
                        <Column field="expiredTime" header="Thời gian hết hạn" body={(rowData) => milisecondToDate(rowData?.expiredTime)} style={{ width: '14rem' }}></Column>
                        {/* <Column header="Cập nhật" rowEditor headerStyle={{ minWidth: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column> */}
                    </DataTable>
                    <Paginator rowsPerPageOptions={[5, 10, 20, 50, 100]} first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />
                </div>
            </React.Fragment>
        </>
    );
};
export default Subscription;
