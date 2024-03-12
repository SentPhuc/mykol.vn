import React, {useEffect, useRef, useState} from 'react';
import 'primereact/resources/primereact.min.css';
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import Link from 'next/link';
import {RecruitmentService} from '../../../demo/service/RecruitmentService';
import moment from 'moment';
import {DEV_URL} from '../../../src/commons/Utils';
import {Chip} from 'primereact/chip';
import {KolRecruitmentService} from '../../../demo/service/KolRecruitmentService';
import {Toast} from 'primereact/toast';
import {Paginator} from 'primereact/paginator';
import {InputTextarea} from 'primereact/inputtextarea';

const InvitationToApply = (props) => {
    const {
        openInvitationToApplyPopup,
        setOpenInvitationToApplyPopup,
        initData
    } = props;

    const dialogRef = useRef(null);
    const scrollToTop = () => {
        const contentElement = dialogRef.current.getContent();
        if (contentElement) {
            contentElement.scrollTop = 0;
        }
    };

    const [jobs, setJobs] = useState([]);
    const [openInputMessage, setOpenInputMessage] = useState({});

    const toast = useRef(null);

    const [messages, setMessages] = useState({});

    const [validate, setValidate] = useState({});
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const [fieldName, recruitmentId] = name.split('_');

        setMessages((prevMessages) => ({
            ...prevMessages,
            [recruitmentId]: {
                ...prevMessages[recruitmentId],
                [fieldName]: value,
            },
        }));

    };

    const fetchJobs = async (page = 1) => {
        try {
            const recruitmentService = new RecruitmentService();
            const response = await recruitmentService.findRecruitmentWithInvitedJob(initData.accountId, page);
            if (response.data.code !== 'success') throw response.data.code;

            setJobs(response.data.data.data.content);
            setPage(response.data.data.data.page);
            setTotalRecords(response.data.data.data.totalElements);

            scrollToTop();
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(async () => {
        if (!openInvitationToApplyPopup) return;

        await fetchJobs();

    }, [openInvitationToApplyPopup])

    const renderHeader = (data) => {
        return (
            <b>Mời ứng tuyển: <span style={{color: "red"}}>{initData.fullName}</span></b>
        )
    }

    const socialNetworkHandler = (param) => {
        const socialNetwork = {
            Facebook: <i className="fab fa-square-facebook mr-3" key={param.key}/>,
            Tiktok: <i className="fab fa-tiktok mr-3" key={param.key}/>,
            Youtube: <i className="fab fa-youtube mr-3" key={param.key}/>,
            Instagram: <i className="fab fa-instagram mr-3" key={param.key}/>
        };
        return socialNetwork[param];
    };

    const onBtnInviteClick = (id) => {
        if (!openInputMessage[id]) {
            setOpenInputMessage({...openInputMessage, [id]: true});
        } else {
            setOpenInputMessage({...openInputMessage, [id]: !openInputMessage});
        }
        setMessages({});
        setValidate({});
    };

    const sendInvitedJob = async (recruitmentId, accountId, message) => {
        const kolRecruitmentService = new KolRecruitmentService();

        if (!message){
            setValidate((prevValidate) => ({
                ...prevValidate,
                [recruitmentId]: 'Nội dung không được để trống',
            }));
        } else {
            try {
                const response = await kolRecruitmentService.inviteJob(recruitmentId, accountId, message);

                if (response.data.code !== 'success') {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Thông báo',
                        detail: response.data.message,
                        life: 2000
                    });

                    return;
                }

                const jobIndex = jobs.findIndex((job) => job.recruitmentId === recruitmentId);
                jobs[jobIndex].isInvited = true;

                setJobs([...jobs]);

                toast.current.show({
                    severity: 'success',
                    summary: 'Thông báo',
                    detail: response.data.message,
                    life: 2000
                });
            } catch (error) {

            }
        }
    };

    const renderJobs = jobs.map(job =>
        <div key={job.recruitmentId} className="col-12 sm:col-12 lg:col-12 xl:col-12 px-1 filter-recruiment-col">
            <div className="flex flex-column md:flex-row align-items-center p-3 w-full shadow-one-recruiment mb-2">
                <Link
                    href={{
                        pathname: '/components/company/recruitment-detail/[mask]/[id]',
                        query: {mask: job.mask, id: job.recruitmentId}
                    }}
                >
                    <img src={`${DEV_URL}${job.profileImage}`} alt={'Loading'} width={116} height={116}
                         className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5 cursor-pointer obj-fit-cover"/>
                </Link>
                <div className="flex-1 flex flex-column  md:text-left">
                    <div className="recruitment-title-wrapper">
                        <Link
                            href={{
                                pathname: '/components/company/recruitment-detail/[mask]/[id]',
                                query: {mask: job.mask, id: job.recruitmentId}
                            }}
                        >
                            <a target="_blank" className="font-bold mb-2 text-2xl cursor-pointer recruitment-title">
                                {job.jobTitle}
                            </a>
                        </Link>
                    </div>
                    <div
                        className="flex align-items-center mt-2 mb-2 text-2xl">{job.recSocialNetworks?.map((e) => socialNetworkHandler(e.value))}</div>
                    <div className="flex align-items-center mt-2">
                        {job.recLocations?.slice(0, 1).map((e) => (
                            <Chip className="mr-2" key={`${e.key}`} label={e.value}/>
                        ))}
                        <Chip className="mr-2"
                              label={'Hạn nộp hồ sơ: ' + moment(job.expirationDate).format('DD/MM/YYYY')}/>
                    </div>
                </div>
                <div className="btn-invite-container align-content-start">
                    <Button label={job.isInvited ? 'Đã Mời' : 'Mời'} disabled={job.isInvited}
                            className={'btn-job-invite p-button px-6'} onClick={() => {
                        onBtnInviteClick(job.recruitmentId)
                    }}/>
                </div>
            </div>
            {(!job.isInvited && openInputMessage[job.recruitmentId]) && (
                <div>
                    <div className='field mt-3'>
                        <label htmlFor='message'>
                            Gửi lời nhắn đến KOL <span className='primary-color'>*</span>
                        </label>
                        <div className='p-inputgroup'>
                            <InputTextarea
                                id={`message_${job.recruitmentId}`}
                                name={`message_${job.recruitmentId}`}
                                rows={4}
                                placeholder="Nhập nội dung"
                                value={messages[job.recruitmentId]?.message || ''}
                                onChange={handleInputChange}
                                autoFocus
                                maxLength={5000}
                                className={validate [job.recruitmentId] ? 'p-invalid' : ''}
                            />
                        </div>
                        <span className="font-normal text-sm">
                             {validate[job.recruitmentId] && (
                                 <small className="p-error">{validate[job.recruitmentId]}</small>
                             )}
                            <p className="text-right">{messages[job.recruitmentId]?.message?.length || 0}/5000</p>
                        </span>
                    </div>
                    <div className={'flex flex-wrap align-items-center justify-content-end sm:mt-4'}>
                        <Button icon='pi pi-send' label='Mời'
                                className='w-full sm:w-auto p-button send-email-button center-item sm:mr-2'
                                type='submit'
                                onClick={() => sendInvitedJob(job.recruitmentId, initData.accountId, messages[job.recruitmentId]?.message)}
                        />
                        <Button className='w-full sm:w-auto mt-2 sm:mt-0 p-button-secondary mr-0' label='Hủy bỏ'
                                type='button'
                                icon='pi pi-times'
                                onClick={() => {
                                    setOpenInputMessage({...openInputMessage, [job.recruitmentId]: false});
                                    setMessages({});
                                    setValidate({});
                                }}/>
                    </div>
                </div>
            )}
        </div>
    );

    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);

    const onPageChange = (event) => {
        fetchJobs(event.page + 1);
    };

    return (
        <>
            <Toast ref={toast}/>

            <Dialog header={renderHeader} visible={openInvitationToApplyPopup} maximizable onHide={() => {
                setOpenInvitationToApplyPopup(false);
                setOpenInputMessage({});
                scrollToTop()
            }}
                    ref={dialogRef}
                    style={{width: '65vw'}} breakpoints={{'960px': '75vw', '641px': '100vw'}}>
                <p className='m-0 mb-5'>
                    Danh sách các tin tuyển dụng của bạn
                </p>

                {renderJobs}

                <Paginator
                    first={page * 5 - 1}
                    rows={5}
                    totalRecords={totalRecords}
                    onPageChange={onPageChange}
                />

                <div className='center-item mt-4'>
                    <Link href={"/components/create-new-recruitment/"}>
                        <Button icon='pi pi-plus' className='center-item p-button send-email-button'
                                label='Tạo tin tuyển dụng'/>
                    </Link>
                </div>
            </Dialog>
        </>
    );
};

export default InvitationToApply;