import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { KolsInfluencerService } from '../../../demo/service/KolsInfluencerService';
import { MailServices } from '../../../demo/service/MailService';
import { useRouter } from 'next/router';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Editor } from 'primereact/editor';
import { Paginator } from 'primereact/paginator';
import AppLayout from '../../../layout/AppLayout';
import { PAGE_SIZE_DEFAULT } from '../../../src/commons/Constant';
import Link from 'next/link';
import { convertToSlug } from '../../../src/commons/Utils';
import { useFormik } from 'formik';

const VerifiedKOLS = () => {
    const service = new KolsInfluencerService();
    const mailService = new MailServices();
    const location = useRouter().pathname;
    const [kolsList, setKolsList] = useState([]);
    const [dataDialog, setDataDialog] = useState(false);
    const [nameDialog, setNameDialog] = useState(null);
    const [kolAccountId, setKolAccountId] = useState(null);
    const [kolName, setKolName] = useState(null);
    const [kolEmail, setKolEmail] = useState(null);
    const [reason, setReason] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);
    const toast = useRef(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
    const [changing, setChanging] = useState(false);

    const showError = () => {
        toast.current.show({
            severity: 'error',
            summary: 'Cập nhật thất bại',
            detail: 'Vui lòng nhập lí do !!!',
            life: 3000
        });
    };

    const showSuccess = () => {
        toast.current.show({
            severity: 'success',
            summary: 'Thông báo',
            detail: 'Cập nhật trạng thái thành công',
            life: 3000
        });
    };

    useEffect(async () => {
        const res = await service.search({ page: page, recordPage: pageSize, keyword: seachForm.values.keyword });
        // convert data to json
        if (res.data.code === 'success') {
            const content = res.data.data?.content;
            setKolsList(content);
            setTotalRecords(res.data.data?.totalElements);
        } else {
            setKolsList([]);
        }
        setIsUpdate(false);
    }, [page, isUpdate,changing]);

    const saveDialogFooter = (
        <>
            <Button label="Xác nhận" icon="pi pi-check" className="p-button-success" onClick={() => updateVerify()} />
            <Button label="Hủy bỏ" icon="pi pi-times" className="p-button-danger" onClick={() => hideDialog()} />
        </>
    );

    const updateVerify = () => {
        if (reason == null || reason.trim() == '') {
            return showError();
        }
        let type = nameDialog.includes('Khóa') ? 0 : 1;
        let title = nameDialog.includes('Khóa') ? 'Khóa tài khoản KOLS của bạn' : 'Mở lại tài khoản KOLS của bạn';
        service.updateVerify(kolAccountId, type);
        //Change kolEmail and kolName to name and email
        mailService.sendMailVerify('hieupikas2606@gmail.com', 'ADMIN', title, reason);
        showSuccess();
        setIsUpdate(true);
        hideDialog();
    };

    const hideDialog = () => {
        setKolAccountId(null);
        setKolName(null);
        setKolEmail(null);
        setDataDialog(null);
        setDataDialog(false);
    };

    const openNew = (nameDialog, accountId, kolName, kolEmail) => {
        setNameDialog(nameDialog);
        setKolAccountId(accountId);
        setKolName(kolName);
        setKolEmail(kolEmail);
        setDataDialog(true);
        setReason(emailTemplate(nameDialog, kolName));
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

      const search = () => {
        setPage(1);
        setChanging(!changing);
    };

    const emailTemplate = (nameDialog, kolName) => {
        if (nameDialog.includes('Khóa')) {
            return (
                '\t<p>Dear ' +
                kolName +
                ',</p>\n' +
                '\t<p>Chúng tôi nhận được thông tin rằng tài khoản của bạn đã bị khóa do vi phạm quy định của chúng tôi. Để được mở lại tài khoản, vui lòng liên hệ với chúng tôi để được hỗ trợ.</p>\n' +
                '\t<p>Chúng tôi sẽ kiểm tra lại tình trạng của tài khoản của bạn và hướng dẫn bạn về các bước cần thiết để mở lại tài khoản. Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào, vui lòng không ngần ngại liên hệ với chúng tôi.</p>\n' +
                '\t<p>Chân thành cảm ơn vì đã quan tâm đến hệ thống của chúng tôi.</p>\n' +
                '\t<p>Trân trọng,</p>\n'
            );
        } else {
            return (
                '\t<p>Dear ' +
                kolName +
                ',</p>\n' +
                '<p>Chúng tôi xin thông báo rằng tài khoản của bạn đã được mở lại sau khi đã kiểm tra và xử lý các vấn đề liên quan.</p>\n' +
                '\t<p>Bạn có thể đăng nhập vào tài khoản của mình bằng thông tin đăng nhập đã được cung cấp trước đó. Nếu bạn vẫn gặp bất kỳ vấn đề gì khi đăng nhập hoặc sử dụng tài khoản của mình, vui lòng liên hệ với chúng tôi để được hỗ trợ.</p>\n' +
                '\t<p>Chúng tôi rất trân trọng sự hợp tác của bạn và xin cảm ơn đã sử dụng dịch vụ của chúng tôi.</p>\n' +
                '\t<p>Trân trọng,</p>'
            );
        }
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h4 className="m-0">Danh sách Kols chưa duyệt</h4>
            </div>
        );
    };

    const profileBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <Link
                    href={{
                        pathname: '/components/detail-candidate/',
                        query: {
                            mask: convertToSlug(rowData?.mask),
                            id: rowData.accountId
                        }
                    }}
                >
                    <a target="_blank" className="font-bold mb-2 cursor-pointer underline">
                        Xem profile
                    </a>
                </Link>
            </div>
        );
    };

    const kolPhoneBodyTemplate = (rowData) => {
        return (
            <div className="flex align-itemsm-center gap-2">
                <span>{rowData.kolPhone}</span>
            </div>
        );
    };

    const kolProfileBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.contactPhone}</span>
            </div>
        );
    };

    const kolNameBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.kolName}</span>
            </div>
        );
    };

    const kolEmailBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.kolEmail}</span>
            </div>
        );
    };

    const renderStatusTemplate = (rowData) => {
        if (rowData.isVerified == true) {
            return (
                <Tag severity="success" value={rowData.status}>
                    Đang hoạt động
                </Tag>
            );
        } else {
            return (
                <Tag severity="danger" value={rowData.status}>
                    Tạm ngưng hoạt động
                </Tag>
            );
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {(() => {
                    if (rowData.isVerified === false) {
                        return (
                            <Button
                                size="sm"
                                icon="pi pi-lock-open"
                                className="mr-2 p-button p-button-rounded p-button-success"
                                onClick={() => openNew('Mở lại tài khoản: ' + rowData.kolName, rowData.accountId, rowData.kolName, rowData.kolEmail)}
                                tooltip="Mở lại tài khoản"
                                tooltipOptions={{
                                    position: 'bottom',
                                    mouseTrack: true,
                                    mouseTrackTop: 15
                                }}
                            />
                        );
                    } else {
                        return (
                            <Button
                                size="sm"
                                icon="pi pi-lock"
                                className="mr-2 p-button p-button-rounded p-button-warning"
                                onClick={() => openNew('Khóa tài khoản: ' + rowData.kolName, rowData.accountId, rowData.kolName, rowData.kolEmail)}
                                tooltip="Khóa tài khoản"
                                tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                            />
                        );
                    }
                })()}
            </React.Fragment>
        );
    };

    const header = renderHeader();

    const indexTemplate = (rowData, field) => {
        return field.rowIndex + 1;
    };

    const onPageChange = (event) => {
        console.log(event.page + 1);
        setPage(event.page + 1);
        setPageSize(event.rows);
    };

    const renderHeaderEditor = () => {
        return (
            <span className="ql-formats">
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
                <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
                <button className="ql-list" value="bullet" aria-label="Unordered List"></button>
                <button className="ql-link" aria-label="Insert Link"></button>
            </span>
        );
    };

    const headerEditor = renderHeaderEditor();

    return AppLayout(
        <>
            <React.Fragment>
                <div className="layout-main">
                    <div className="card">
                        <BreadcrumbCustom path={location} />
                        <div className="flex gap-2 mt-2">
                            <InputText id="keyword" name="keyword" placeholder="Nhập từ khóa" className="w-64" 
                            value={seachForm.values.keyword} 
                            onChange={seachForm.handleChange} />
                            <Button label="Tìm kiếm" icon="pi pi-search" onClick={() => search()} />
                        </div>
                        <hr />
                        <DataTable
                            className="mt-4"
                            scrollable
                            value={kolsList}
                            header={header}
                            rows={10}
                            rowsPerPageOptions={[10, 25, 50]}
                            dataKey="id"
                            emptyMessage="Không có dữ liệu"
                            currentPageReportTemplate="Hiển thị từ {first} đến {last} của {totalRecords} bản ghi"
                        >
                            <Column header="#" body={indexTemplate} style={{ maxWidth: '3rem' }} />
                            <Column sortable sortField="kolName" header="Tên" style={{ minWidth: '14rem' }} body={kolNameBodyTemplate} />
                            <Column sortable sortField="kolEmail" header="Email" style={{ minWidth: '14rem' }} body={kolEmailBodyTemplate} />
                            <Column sortable sortField="kolPhone" header="Số điện thoại" style={{ minWidth: '14rem' }} body={kolPhoneBodyTemplate} />
                            <Column sortable sortField="kolProfile" header="Profile công khai" style={{ minWidth: '14rem' }} body={profileBodyTemplate} />
                            <Column header="Trạng thái" sortable sortField="isVerified" style={{ minWidth: '14rem' }} body={renderStatusTemplate} />
                            <Column body={actionBodyTemplate} exportable={false} style={{ maxWidth: '10rem' }} />
                        </DataTable>
                        <Paginator first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />

                        <Dialog visible={dataDialog} style={{ width: '30%' }} header={nameDialog} modal className="p-fluid" footer={saveDialogFooter} onHide={hideDialog}>
                            <div className="field">
                                <label className="font-bold" htmlFor="name">
                                    Tên Kol
                                </label>
                                <InputText id="name" disabled value={kolName} rows={3} cols={20} />
                            </div>
                            <div className="field">
                                <label className="font-bold" htmlFor="reason">
                                    Lý do <span className="primary-color">*</span>
                                </label>
                                <Editor headerTemplate={headerEditor} value={reason} id="reason" onTextChange={(e) => setReason(e.htmlValue)} required autoFocus style={{ height: '200px' }} />
                            </div>
                        </Dialog>
                        <Toast ref={toast} />
                    </div>
                </div>
            </React.Fragment>
        </>
    );
};
export default VerifiedKOLS;
