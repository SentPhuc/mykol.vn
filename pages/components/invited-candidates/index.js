import React, {useEffect, useRef, useState} from 'react';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import {Button} from 'primereact/button';
import {useRouter} from 'next/router';
import {useFormik} from 'formik';
import {Toast} from 'primereact/toast';
import {Dropdown} from 'primereact/dropdown';
import {Column} from 'primereact/column';
import {DataTable} from 'primereact/datatable';
import {KolRecruitmentService} from '../../../demo/service/KolRecruitmentService';
import PlatformIcon from '../../../demo/utils/PlatformIcon';
import MaskingText from './MaskingText';
import moment from 'moment/moment';
import ViewDetailMessage from "./ViewDetailMessage";
import AppLayout from '../../../layout/AppLayout';
import axios from 'axios';
import FileSaver from 'file-saver';
import { DEV_URL } from '../../../src/commons/Utils';

const InvitedCandidates = () => {
    const location = useRouter().pathname;
    const [data, setData] = useState([]);
    const [selectedJob, setSelectedJob] = useState([]);
    const toast = useRef(null);
    const service = new KolRecruitmentService();
    const [visibleViewDetailMessage, setVisibleViewDetailMessage] = useState(false);

    const formik = useFormik({
        initialValues: {
            jobId: ''
        },
        validate: (data) => {
            return {};
        },
        onSubmit: (data) => {
        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> :
            <small className="p-error">&nbsp;</small>;
    };

    // export Excel file ----------------------------------------------------------------------------------------------------
    const exportExcel = () => {
        axios({
            url: `${DEV_URL}/api/kols/report/export-invited-candidate`,
            method: 'GET',
            responseType: 'blob' // important
        })
            .then((res) => {
                const fileType = res.data.type;
                const file = new Blob([res.data], { type: fileType });
                FileSaver.saveAs(file, 'invited-candidates.xlsx');

            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        async function fetchData() {
            const res = await service.getInvitedJobOfCandidates({...formik.values});
            if (res.data.code === 'success') {
                const data = res.data.data;
                console.log(data)
                setData(data);
            } else {
                setData([]);
            }
        }

        fetchData();
    }, [formik.values]);

    const messageTemplate = (rowData, field) => {
        console.log(rowData)
        return (
            <>
                <Button icon='pi pi-comment' className={'ml-4 mb-2'}
                        style={{ borderColor: 'gray', backgroundColor: 'white', color: 'gray' }}
                        onClick={() => setVisibleViewDetailMessage(rowData.kolId + '-' + rowData.jobId)}
                />
                {visibleViewDetailMessage && visibleViewDetailMessage === (rowData.kolId + '-' + rowData.jobId) && (
                    <ViewDetailMessage setVisibleViewDetailMessage={setVisibleViewDetailMessage}
                                       visibleViewDetailMessage={visibleViewDetailMessage}
                                       data={rowData || 'Nice to meet you.'}
                    />
                )}
            </>
        );
    };

    useEffect(() => {
        async function fetchData() {
            const res = await service.getInvitedJobOfCandidatesNoFilter({});
            if (res.data.code === 'success') {
                const data = res.data.data;
                toSelectedJob(data);
            } else {
                setSelectedJob([])
            }
        }

        fetchData();
    }, []);

    const toSelectedJob = (data) => {
        const uniqueJobs = Array.from(new Set(data.map(item => item.jobId)))
            .map(jobId => {
                const jobTitle = data.find(item => item.jobId === jobId).jobTitle;
                return {jobId, jobTitle};
            });
        uniqueJobs.unshift({
            'jobId': '',
            'jobTitle': 'Tất cả tin tuyển dụng'
        });
        setSelectedJob(uniqueJobs);
    };

    const handleRemoveAllFilter = () => {
        formik.resetForm();
    };

    const kolsDocumentTemplate = (data) => {
        return (
            <div>
                <PlatformIcon kolName={data.kolName} kolSocialNetworks={data.kolSocialNetworks} kolAge={data.kolAge}
                              address={data.kolLocationName} mask={data.mask} kolId={data.kolId}/>
            </div>
        );
    };

    const jobNameTemplate = (data) => {
        return (
            <div>
                <MaskingText text={data.jobTitle}/>
            </div>
        );
    };

    const invitedDateTemplate = (data) => {
        return moment(data.invitedDate).format('DD/MM/YYYY');
    };

    return AppLayout(
        <>
            <React.Fragment>
                <BreadcrumbCustom path={location}/><br/>
                <div className="card p-3 md:p-5">
                    <Toast ref={toast}/>
                    <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                        <h4 className="m-0">Ứng viên đã mời tham gia <span
                            style={{color: 'red'}}>( {data.length} ứng viên)</span></h4>
                        <Button className="p-button-danger p-button-outlined" type="button" label="Tải danh sách"
                                icon="pi pi-file-excel" severity="info" onClick={exportExcel} data-pr-tooltip="XLS"/>
                    </div>
                    <hr/>
                    <div>
                        <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2">
                            <Toast ref={toast}/>
                            <div className="flex">
                                <div
                                    className="flex align-items-center justify-content-center mr-4 lg:col-3 md:col-5 col-6 p-0">
                                    <Dropdown
                                        inputId="city"
                                        name="city"
                                        value={formik.values.jobId}
                                        options={selectedJob}
                                        optionLabel="jobTitle"
                                        placeholder="Chọn công việc"
                                        className={'w-full'}
                                        optionValue={'jobId'}
                                        onChange={(e) => {
                                            formik.setFieldValue('jobId', e.value);
                                        }}
                                    />
                                </div>
                                <div
                                    className="flex align-items-center justify-content-center">
                                    <Button icon="pi pi-reply" onClick={handleRemoveAllFilter} label="Xóa chọn"
                                            className="p-button remove-filter"></Button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <hr/>
                    <div>
                        <DataTable
                            value={data} paginator rows={5} tableStyle={{ width: '100%' }}
                            emptyMessage='Không có dữ liệu'
                            scrollable
                        >
                            <Column body={kolsDocumentTemplate} header="Tên hồ sơ" style={{minWidth: '20rem'}}></Column>
                            <Column body={jobNameTemplate} header='Tên công việc'
                                    style={{minWidth: '30rem'}}></Column>
                            <Column body={invitedDateTemplate} header="Ngày mời"></Column>
                            <Column body={messageTemplate} header="Lời nhắn"></Column>
                        </DataTable>
                    </div>
                </div>
            </React.Fragment>
        </>
    );
};
export default InvitedCandidates;