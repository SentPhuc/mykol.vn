import React, { useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { useFormik } from 'formik';
import { Toast } from 'primereact/toast';
import { DataView } from 'primereact/dataview';
import { DEV_URL, convertAcronym, formatUrlExact, convertToSlug } from '../../../src/commons/Utils';
import { Chip } from 'primereact/chip';
import { isMobile } from 'react-device-detect';
import Link from 'next/link';

const ParticipatedJobs = (props) => {
    const { participatedJobs, openParticipatedJobPopup, setOpenParticipatedJobPopup } = props;
    const toast = useRef();
    const formik = useFormik({
        initialValues: {
            referenceId: '',
            recruitmentId: '',
            evaluationType: 0,
            starRating: '',
            evaluation: ''
        },
        validate: (data) => {
        },
        onSubmit: async (data) => {
            data.referenceId = kolId;
            const res = await service.createNewEvaluate(data);
            if (res.data.type === 'SUCCESS') {
                toast.current.show({
                    severity: 'success',
                    summary: 'Thông báo',
                    detail: 'Đánh giá thành công',
                    life: 2000
                });
                formik.resetForm();
                setOpenReviewDialog(false);
            } else if (res.data.code === 'warning') {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Thông báo',
                    detail: 'Đánh giá đã tồn tại',
                    life: 2000
                });
            }
        }
    });
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const priceSplitter = (number) => number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const socialNetworkHandler = (param) => {
        const socialNetwork = {
            Facebook: <i className="fab fa-square-facebook mr-3" key={param.key} />,
            Tiktok: <i className="fab fa-tiktok mr-3" key={param.key} />,
            Youtube: <i className="fab fa-youtube mr-3" key={param.key} />,
            Instagram: <i className="fab fa-instagram mr-3" key={param.key} />
        };
        return socialNetwork[param];
    };

    const socialNetworkResponseHandler = (code, url) => {
        if (url === '') {
            return;
        }

        const socialNetwork = {
            1: <i className="fab fa-square-facebook mr-3" />,
            2: <i className="fab fa-tiktok mr-3" />,
            3: <i className="fab fa-youtube mr-3" />,
            4: <i className="fab fa-instagram mr-3" />
        };
        
        return <a target='_blank' href={formatUrlExact(url)}>{socialNetwork[code]}</a>;
    };

    const headerDiaglog = () => {
        return (
            <>
                <p>Công việc đã tham gia</p>
            </>
        );
    };

    const itemTemplate = (participatedJob) => {
        if (!participatedJob) {
            return;
        }
        return gridItem(participatedJob);
    };

    const gridItem = (data) => {
        return (
            <div className="col-12 sm:col-12 lg:col-12 xl:col-12 filter-recruiment-col filter-recruiment-col-detail filter-recruiment-col-detail-participatedJobs">
                <div className="flex align-items-start flex-wrap lg:p-3 p-3 sm:px-0 px-0 w-full justify-content-between border-bottom-1 border-300">
                    <img src={`${DEV_URL}${data.pathImage}`} alt={'Loading'} width={116} height={116} className="images shadow-1 mr-3 cursor-pointer" />
                    <div className="info w-full sm:w-auto mt-3 sm:mt-0 flex-1 flex flex-column  md:text-left">
                        <Link
                            href={{
                                pathname: '/components/company/recruitment-detail/[mask]/[id]',
                                query: { mask: convertToSlug(data.mask), id: data.recruitmentId }
                            }}
                        >
                            <a target="_blank" className="font-bold mb-2 text-base cursor-pointer recruitment-title mr-3">
                                {data.jobTitle.slice(0, 100)}
                                {data.jobTitle.length > 45 && <span>...</span>}
                            </a>
                        </Link>
                        <div className="flex align-items-center mt-2 mb-2 text-2xl">{data.recSocialNetworks?.map((e) => socialNetworkHandler(e.value))}</div>
                        {!isMobile && (
                            <div className="flex align-items-center mt-2">
                                {
                                    data.recLocations?.length == 63 ?
                                        <Chip className="mr-2 text-sm mb-2" key={`all`} label={'Tất cả tỉnh thành'} /> :
                                        data.recLocations?.slice(0, 1).map((e) => (
                                            <Chip className="mr-2 text-sm mb-2" key={`${e.key}`} label={convertAcronym(e.value)} />
                                        ))
                                }
                                <Chip className="mr-2 text-sm mb-2" label={priceSplitter(data.minimumSalary) + ' - ' + priceSplitter(data.maximumSalary)} />
                                {data.recCareerFields?.slice(0, 1).map((e) => (
                                    <Chip className="mr-2 text-sm mb-2" key={`${e.key}`} label={e.value} />
                                ))}
                            </div>
                        )}
                    </div>
                    {isMobile && (
                        <div className="filter-recruiment-col-detail-tags w-full mt-2">
                            <div className="block sm:flex align-items-center mt-2">
                                {
                                    data.recLocations?.length == 63 ?
                                        <Chip className="mr-2 text-sm mb-2" key={`all`} label={'Tất cả tỉnh thành'} /> :
                                        data.recLocations?.slice(0, 1).map((e) => (
                                            <Chip className="mr-2 text-sm mb-2" key={`${e.key}`} label={convertAcronym(e.value)} />
                                        ))
                                }
                                <Chip className="mr-2 text-sm mb-2" label={priceSplitter(data.minimumSalary) + ' - ' + priceSplitter(data.maximumSalary)} />
                                {data.recCareerFields?.slice(0, 1).map((e) => (
                                    <Chip className="mr-2 text-sm mb-2" key={`${e.key}`} label={e.value} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div style={{ minWidth: '110px' }}>
                        <p className='font-bold'>Kết quả</p>
                        {data.socialNetworkReportRes?.length > 0 ?
                            data.socialNetworkReportRes.map((item) => socialNetworkResponseHandler(item.socialNetworkCode, item.reportUrl)) : ''}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <React.Fragment>
            <Toast ref={toast} />
            <Dialog className="bg-white" header={headerDiaglog()} visible={openParticipatedJobPopup} style={{ width: '100%', maxWidth: '944px' }} breakpoints={{ '944px': '95vw', '95vw': '95vw' }} onHide={() => setOpenParticipatedJobPopup(false)}>
                <div className="w-full surface-card">
                    <div className="col-12 p-0 search-recruitment">
                        <DataView value={participatedJobs} emptyMessage={'KOL này chưa tham gia công việc nào'} itemTemplate={itemTemplate} paginator rows={5}></DataView>
                    </div>
                </div>
            </Dialog>
        </React.Fragment>
    );
};
export default ParticipatedJobs;
