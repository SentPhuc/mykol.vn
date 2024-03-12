import React, {useEffect, useRef, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import {CompanyKolsInfluencerService} from '../../../demo/service/CompanyKolsInfluencerService';
import {useRouter} from 'next/router';
import {Toast} from 'primereact/toast';
import PlatformIcon from '../../../demo/utils/PlatformIcon';
import moment from 'moment';
import {Button} from 'primereact/button';
import ViewContactNow from "./ViewContactNow";
import AppLayout from '../../../layout/AppLayout';
import axios from 'axios';
import FileSaver from 'file-saver';
import {DEV_URL} from '../../../src/commons/Utils';

const SavedCandidates = () => {
    const service = new CompanyKolsInfluencerService();
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const location = useRouter().pathname;
    const toast = useRef(null);
    const [fetching, setFetching] = useState(false);
    const [numberOfSelectedDocument, setNumberOfSelectedDocument] = useState(0);
    const [visibleViewDetailMessage, setVisibleViewDetailMessage] = useState(false);

    useEffect(async () => {
        async function fetchData() {
            const res = await service.savingCandidate({});
            if (res.data.type === 'SUCCESS') {
                let responseData = res.data.data;
                setData(responseData);
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Thông báo',
                    detail: res.data.message,
                    life: 2000
                });
            }
        }

        fetchData();

    }, [fetching]);

    const documentTemplate = (data) => {
        return (<div>
            <PlatformIcon kolName={data.candidateName} kolSocialNetworks={data.socialNetwork} kolAge={data.kolAge}
                          address={data.location} mask={data.mask} kolId={data.candidateId} />
        </div>);
    };

    const savingDateTemplate = (data) => {
        return moment(data.savedDate).format('DD/MM/YYYY');
    };

    const reactionTemplate = () => {
        return (
            <i className="pi pi-heart-fill" style={{ color: 'red' }}/>
        );
    };

    const reactionHeaderTemplate = () => {
        return (
            <i className="pi pi-heart" style={{ color: 'red' }}/>
        );
    };
    useEffect(() => {
        setNumberOfSelectedDocument(selectedItem.length);
    }, [selectedItem]);


    const onSelectedDocument = (e) => {
        setSelectedItem(e.value);
    };

    const showViewDetailMessage = (data) => {
        return (
            <div>
                <ViewContactNow setVisibleViewDetailMessage={setVisibleViewDetailMessage} visibleViewDetailMessage={visibleViewDetailMessage}
                                   data={data || 'Nice to meet you.'}/>
            </div>
        );
    };

    const messageTemplate = (rowData, field) => {
        return (
            <>
                <Button label="Liên hệ ngay"
                        icon="pi pi-phone"
                        iconPos="right" severity="danger"
                        onClick={() => setVisibleViewDetailMessage(rowData.id)}
                />
                {visibleViewDetailMessage && visibleViewDetailMessage === rowData.id && (showViewDetailMessage(rowData))}
            </>
        );
    };

    const exportExcel = () => {
        axios({
            url: `${DEV_URL}/api/kols/report/export-saved-candidate`,
            method: 'GET',
            responseType: 'blob' // important
        })
            .then((res) => {
                const fileType = res.data.type;
                const file = new Blob([res.data], { type: fileType });
                FileSaver.saveAs(file, 'saved-candidates.xlsx');

            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onUnSaveDocument = async () => {
        console.log('onReduceDocument', selectedItem);
        const ids = selectedItem.map(item => item.id);
        let res = await service.unSavingCandidate(ids);
        if (res.data.code === 'success') {
            setFetching(!fetching);
            toast.current.show({
                severity: 'success',
                summary: 'Thông báo',
                detail: res.data.message,
                life: 2000
            });
        } else {
            toast.current.show({
                severity: 'error',
                summary: 'Thông báo',
                detail: res.data.message,
                life: 2000
            });
        }
        setNumberOfSelectedDocument(0);
    };

    return AppLayout(
        <div className="card p-3 lx:p-5 lg:p-5 md:p-5">
            <BreadcrumbCustom path={location}/><br/>
            <Toast ref={toast}/>
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <div>
                    <h4>
                        Hồ sơ đã lưu
                    </h4>
                </div>
                <Button className="p-button-danger p-button-outlined" type="button" label="Tải danh sách"
                        icon="pi pi-file-excel" severity="info" onClick={exportExcel} data-pr-tooltip="XLS"/>
            </div>

            <hr/>
            <div className="card p-2 lx:p-5 lg:p-5 md:p-5">
                <div className="flex flex-wrap gap-2 justify-content-between align-items-center mb-5">
                    <h4 className='lg:mb-0 lx:mb-0 md:mb-0'>Bạn đã chọn <span style={{ color: 'red' }}>{numberOfSelectedDocument}</span> hồ sơ</h4>
                        {data?.length > 0 &&
                            <div className='w-full lg:w-auto lx:w-auto md:w-auto'>
                                <Button label="Bỏ lưu" className='w-full md:w-12rem lg:w-12rem lx:w-12rem' severity="danger" onClick={onUnSaveDocument}/>
                            </div>
                        }
                </div>
                <DataTable value={data}
                            selection={selectedItem}
                           emptyMessage="Không có dữ liệu"
                           onSelectionChange={(e) => onSelectedDocument(e)} paginator rows={5}
                           rowsPerPageOptions={[5, 10, 25, 50]} scrollable tableStyle={{ minWidth: '70rem', width:'100%' }}>
                    <Column selectionMode="multiple" style={{ maxWidth: '50px' }}></Column>
                    <Column body={documentTemplate} header="Tên hồ sơ" style={{ maxWidth: '80%' }}></Column>
                    <Column body={savingDateTemplate} header="Ngày lưu" style={{ maxWidth: '260px' }}></Column>
                    <Column body={messageTemplate} header="Hành động" style={{ maxWidth: '260px' }}></Column>
                    <Column body={reactionTemplate} header={reactionHeaderTemplate} style={{ maxWidth: '50px' }}></Column>
                </DataTable>
            </div>
        </div>
    );
};
export default SavedCandidates;