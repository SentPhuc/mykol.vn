import { Sidebar } from 'primereact/sidebar';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { TikTokSaveListService } from 'demo/service/TikTokSaveListService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Tooltip } from 'primereact/tooltip';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox';
import { TikTokProfileService } from 'demo/service/TikTokProfileService';
import { useSelector } from 'react-redux';

const SidebarInfluencer = ({ visibleRight, setVisibleRight, changing, setChanging, dataTiktoker }) => {
    const toast = useRef(null);
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
    const tikTokSaveListService = new TikTokSaveListService();
    const tikTokProfileService = new TikTokProfileService();
    const [dataSaveList, setDataSaveList] = useState([]);
    const [listIdChecks, setListIdChecks] = useState([]);
    
    useEffect(() => {
        setListIdChecks(dataTiktoker?.tiktokSaveListIds ?? []);
    }, [dataTiktoker]);

    const formikInsert = useFormik({
        initialValues: {
            name: '',
            tikTokProfileId: ''
        },
        onSubmit: async (data) => {
            if (!!data && data.name == '') {
                toast.current.show({
                    severity: 'error',
                    summary: 'Thông báo',
                    detail: 'Không thể nhập giá trị rỗng',
                    life: 2000
                });
                return;
            }
            const isNameExists = dataSaveList.some((item) => item.name === data.name);
            if (isNameExists) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Thông báo',
                    detail: 'Đã tồn tại ' + data.name + ' trong danh sách',
                    life: 2000
                });
            } else {
                const res = await tikTokSaveListService.saveOrUpdate({
                    name: data.name,
                    tikTokProfileId: data.tikTokProfileId
                });
                toast.current.show({
                    severity: 'success',
                    summary: 'Thông báo',
                    detail: 'Thêm mới danh sách ' + data.name + ' thành công',
                    life: 2000
                });

                if (!!res) {
                    await tikTokProfileService
                        .CheckTiktokSaveList(data.tikTokProfileId, res?.data?.data?.id)
                        .then((data) => {
                            setVisibleRight(false);
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }

                if (res?.data?.code == 'success') {
                    const res = await tikTokSaveListService.search({});
                    if (res?.data?.code == 'success') {
                        setDataSaveList(res?.data?.data);
                    }
                }
                formikInsert.resetForm();
            }
        }
    });

    useEffect(async () => {
        if(!isLoggedIn) return;
        
        const res = await tikTokSaveListService.search({});
        if (res?.data?.code == 'success') {
            setDataSaveList(res?.data?.data);
        }
    }, [formikInsert.values.name, changing, isLoggedIn]);

    const renderHeaderName = () => {
        return (
            <div className="pb-2 pt-2">
                <p>
                    Lưu người ảnh hưởng vào danh sách <i className="pi pi-info-circle save_influencer_to_list ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
                </p>
                <Tooltip target=".save_influencer_to_list">Lưu người ảnh hưởng vào danh sách</Tooltip>
            </div>
        );
    };

    const renderNameSaveList = (rowData) => {
        return <div style={{ wordBreak: 'break-all' }}>{rowData?.name}</div>;
    };

    const handleCheckBox = async (e) => {
        let _listIDs = [...listIdChecks];
        if (e.checked) {
            await tikTokProfileService
                .CheckTiktokSaveList(dataTiktoker?.id, e?.target?.value)
                .then((data) => {
                    if (data?.data?.code === 'success') {
                        _listIDs.push(e?.target?.value);
                        toast.current.show({
                            severity: 'success',
                            summary: 'Thông báo',
                            detail: 'Lưu vào danh sách thành công',
                            life: 2000
                        });
                        setVisibleRight(false);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            await tikTokProfileService
                .UnCheckTiktokSaveList(dataTiktoker?.id, e?.target?.value)
                .then((data) => {
                    if (data?.data?.code === 'success') {
                        _listIDs.splice(_listIDs.indexOf(e.value), 1);
                        toast.current.show({
                            severity: 'success',
                            summary: 'Thông báo',
                            detail: data?.data?.message,
                            life: 2000
                        });
                        setVisibleRight(false);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        // Nếu có 1 hoặc 0 gọi lại API list tiktok
        if (_listIDs.length == 0 || _listIDs.length == 1) {
            setChanging(!changing);
        }
        setListIdChecks(_listIDs);
    };

    const renderIsSavedSaveList = (rowData) => {
        return <Checkbox name="list" onChange={handleCheckBox} value={rowData?.idTiktokSaveList} checked={listIdChecks?.includes(rowData?.idTiktokSaveList)}></Checkbox>;
    };

    return (
        <>
            <Toast ref={toast} position="top-left" />
            <Sidebar className="w-full custom-sidebar-lists" visible={visibleRight} position="right" showCloseIcon={false} onHide={() => setVisibleRight(false)}>
                <DataTable value={dataSaveList} emptyMessage="Không có dữ liệu" scrollable>
                    <Column className="pt-1 pb-1" body={renderNameSaveList} header={renderHeaderName} style={{ maxWidth: '80%' }}></Column>
                    <Column className="pt-1 pb-1" body={renderIsSavedSaveList} header={null} style={{ maxWidth: '50px' }}></Column>
                </DataTable>
                <div className="sticky z-5 bg-white flex justify-content-between bottom-custom-sidebar-lists">
                    <InputText id="name" name="name" value={formikInsert.values.name} onChange={(e) => formikInsert.setFieldValue('name', e.target.value)} placeholder="Nhập tên danh sách muốn lưu" />
                    <Button
                        icon="pi pi-check"
                        className="p-button-success"
                        type="submit"
                        onClick={() => {
                            formikInsert.setFieldValue('tikTokProfileId', dataTiktoker?.id);
                            formikInsert.handleSubmit();
                            setChanging(!changing);
                        }}
                    />
                </div>
                <div className="text-center mt-2">
                    <Button onClick={() => window.open('/components/saved-tiktok-candidates', '_blank')} label="Xem Danh sách lưu" />
                </div>
            </Sidebar>
        </>
    );
};
export default SidebarInfluencer;
