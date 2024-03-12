import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/router';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { RecruitmentService } from '../../../demo/service/RecruitmentService';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { MailServices } from '../../../demo/service/MailService';
import { Editor } from 'primereact/editor';
import { formatCurrencyVND } from '../../../src/commons/Utils';
import moment from 'moment';
import AppLayout from '../../../layout/AppLayout';
import { Menu } from 'primereact/menu';

const VerifiedKOLS = () => {
    const service = new RecruitmentService();
    const mailService = new MailServices();
    const location = useRouter().pathname;
    const [recruitmentList, setRecruitmentList] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [dataDialog, setDataDialog] = useState(false);
    const [nameDialog, setNameDialog] = useState(null);
    const [recruitmentId, setRecruitmentId] = useState(null);
    const [accountName, setAccountName] = useState(null);
    const [contactEmail, setContactEmail] = useState(null);
    const [reason, setReason] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);
    const toast = useRef(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

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
        const res = await service.searchAll({
            keyword: '',
            hasProductSample: null,
            careerCode: null,
            page: page,
            recordPage: pageSize,
            sorting: ''
        });
        // convert data to json
        if (res.data.code === 'success') {
            const content = res.data.data.content;
            setRecruitmentList(content);
        } else {
            setRecruitmentList([]);
        }
        setIsUpdate(false);
    }, [isUpdate]);

    const saveDialogFooter = (
        <>
            <Button label="Xác nhận" icon="pi pi-check" className="p-button-success" onClick={() => updateVerify()} />
            <Button label="Hủy bỏ" icon="pi pi-times" className="p-button-danger" onClick={() => hideDialog()} />
        </>
    );

    const updateVerify = () => {
        let type = nameDialog === 'Xác nhận' ? 1 : 0;
        let title = nameDialog.includes('Xác nhận') ? 'Xác nhận đơn duyệt tuyển dụng' : 'Từ chối đơn tuyển dụng';
        if (reason == null || reason.trim() == '') {
            return showError();
        }
        service.updateVerify(recruitmentId, type);
        showSuccess();
        mailService.sendMailVerify(contactEmail, accountName, title, reason);
        setIsUpdate(true);
        hideDialog();
    };

    const hideDialog = () => {
        setRecruitmentId(null);
        setAccountName(null);
        setContactEmail(null);
        setDataDialog(null);
        setReason(null);
        setSubmitted(false);
        setDataDialog(false);
    };

    const openNew = (nameDialog, id, accountName, contactEmail) => {
        setRecruitmentId(id);
        setAccountName(accountName);
        setContactEmail(contactEmail);
        setNameDialog(nameDialog);
        setSubmitted(false);
        setDataDialog(true);
    };

    const onInputChange = (e) => {
        setReason(e);
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h4 className="m-0">Danh sách tin tuyển dụng cần duyệt</h4>
            </div>
        );
    };

    const jobTitleBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.jobTitle}</span>
            </div>
        );
    };

    const salaryBodyTemplate = (rowData) => {
        return `${formatCurrencyVND(rowData.minimumSalary)} - ${formatCurrencyVND(rowData.maximumSalary)}`;
    };

    const jobDescriptionBodyTemplate = (rowData) => {
        return rowData.jobDescription;
    };

    const renderStatusTemplate = (rowData) => {
        if (rowData.isVerified == true) {
            return (
                <Tag severity="success" value={rowData.status}>
                    Đã duyệt
                </Tag>
            );
        } else {
            return (
                <Tag severity="danger" value={rowData.status}>
                    Chưa được duyệt
                </Tag>
            );
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {(() => {
                    return (
                        <Button
                            size="sm"
                            icon="pi pi-verified"
                            className="mr-2 p-button p-button-success"
                            onClick={() => openNew('Xác nhận duyệt', rowData.id, rowData.jobTitle, rowData.createdBy)}
                            tooltip="Xác nhận duyệt"
                            label="Xác nhận"
                            tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                            disabled={rowData.isVerified}
                        />
                    );
                })()}
            </React.Fragment>
        );
    };

    const header = renderHeader();

    const indexTemplate = (rowData, field) => {
        return field.rowIndex + 1;
    };

    const renderExpirationDate = (rowData) => {
        return moment(rowData.expirationDate).format('DD/MM/YYYY');
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

    const [selectedData, setSelectedData] = useState(null);
    const handleSelectionChange = (e) => {
        const selectedRow = e.value[0];
        setSelectedData(selectedRow);
    };

    const [menuItems, setMenuItems] = useState([
        {
            label: 'Chỉnh sửa',
            icon: 'pi pi-pencil',
            command: () => {}
        },
        {
            label: 'Ẩn tin',
            icon: 'pi pi-eye-slash',
            command: () => {}
        }
    ]);
    const menuRef = useRef(null);
    const router = useRouter();

    const handleMenuActionClick = (event, rowData) => {
        // Hiển thị menu
        menuRef.current.toggle(event);

        // Cập nhật giá trị của item trong menu
        if (menuRef.current) {
            const menuItem1 = menuRef.current.props.model[0];
            menuItem1.command = () => {
                return router.push('/components/create-new-recruitment/?recruitId=' + rowData.id);
            };

            const menuItem2 = menuRef.current.props.model[1];
            menuItem2.command = () => {
                return handleHideRecruiment(rowData.id);
            };
        }
    };

    const handleHideRecruiment = async (recruitmentId) => {
        const res = await service.hideRecruitment(recruitmentId);

        if (res.data.code !== 'success') {
            toast.current.show({
                severity: 'error',
                summary: 'Cập nhật thất bại',
                detail: 'Ẩn không thành công',
                life: 3000
            });
            return;
        }

        toast.current.show({
            severity: 'success',
            summary: 'Cập nhật thành công',
            detail: 'Ẩn thành công',
            life: 3000
        });
    };

    return AppLayout(
        <>
            <React.Fragment>
                <div className="layout-main">
                    <div className="card">
                        <BreadcrumbCustom path={location} />
                        <DataTable
                            className="mt-4"
                            value={recruitmentList}
                            scrollable
                            paginator
                            selection={selectedData}
                            onSelectionChange={handleSelectionChange}
                            header={header}
                            rows={10}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            dataKey="id"
                            emptyMessage="Không có dữ liệu"
                            currentPageReportTemplate="Hiển thị từ {first} đến {last} của {totalRecords} bản ghi"
                        >
                            <Column header="#" body={indexTemplate} style={{ maxWidth: '3rem' }} />
                            <Column sortable sortField="jobTitle" header="Công việc" style={{ minWidth: '20rem' }} body={jobTitleBodyTemplate} />
                            {/* <Column sortable sortField="minimumSalary" header="Mức lương" style={{ minWidth: '10rem' }} body={salaryBodyTemplate} /> */}
                            <Column sortable sortField="contactPhone" header="Ngày hết hạn" style={{ minWidth: '14rem' }} body={renderExpirationDate} />
                            <Column header="Trạng thái" sortable sortField="isVerified" style={{ minWidth: '14rem' }} body={renderStatusTemplate} />
                            <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '3rem' }} />
                            <Column body={(rowData) => <Button icon="pi pi-ellipsis-v" className="p-button-text" onClick={(event) => handleMenuActionClick(event, rowData)} />} />
                        </DataTable>

                        <Menu model={menuItems} popup ref={menuRef} />

                        <Dialog visible={dataDialog} style={{ width: '50%' }} header={nameDialog} modal breakpoints={{ '960px': '75vw', '641px': '100vw' }} className="p-fluid" footer={saveDialogFooter} onHide={hideDialog}>
                            <div className="field">
                                <label className="font-bold" htmlFor="name">
                                    Tin tuyển dụng
                                </label>
                                <InputText id="name" disabled value={accountName} rows={3} cols={20} />
                            </div>
                            <div className="field">
                                <label className="font-bold" htmlFor="reason">
                                    Lý do <span className="primary-color">*</span>
                                </label>
                                <Editor headerTemplate={headerEditor} id="reason" onTextChange={(e) => setReason(e.htmlValue)} required autoFocus style={{ height: '200px' }} />
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
