import React, { useEffect, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { useFormik } from 'formik';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import { KolRecEvaluationService } from '../../../demo/service/KolRecEvaluationService';
import { KolRecruitmentService } from '../../../demo/service/KolRecruitmentService';

const ReviewCandidateForm = (props) => {
    const { fullName, kolId, openReviewDialog, setOpenReviewDialog, hasNewComment, setHasNewComment } = props;

    const [recruitmentList, setRecruitmentList] = useState([]);
    const service = new KolRecEvaluationService();
    const recruitmentService = new KolRecruitmentService();
    const toast = useRef(null);

    const headerDiaglog = () => {
        return (
            <>
                <p>
                    Đánh giá:
                    <span className="primary-color"> {fullName}</span>
                </p>
            </>
        );
    };
    useEffect(async () => {
        if (openReviewDialog == true) {
            const res = await recruitmentService.findRecruitmentApprovedKOL(kolId);
            if (res.data.code === 'success') {
                let content = res.data.data;
                setRecruitmentList(content);
            } else {
                setRecruitmentList([]);
            }
        }
    }, [openReviewDialog]);

    const formik = useFormik({
        initialValues: {
            referenceId: '',
            recruitmentId: '',
            evaluationType: 0,
            starRating: '',
            evaluation: ''
        },
        validate: (data) => {
            let errors = {};
            if (!data.starRating) {
                errors.starRating = 'Vui lòng chọn số sao đánh giá';
            }
            if (!data.recruitmentId) {
                errors.recruitmentId = 'Vui lòng chọn chiến dịch';
            }
            return errors;
        },
        onSubmit: async (data) => {
            data.referenceId = kolId;
            const res = await service.createNewEvaluate(data);
            if (res.data.type === 'SUCCESS') {
                toast.current.show({
                    severity: 'success',
                    summary: 'Thông báo',
                    detail: 'Đánh giá thành công',
                    life: 2000,
                    style: { textAlign: 'left' }
                });
                formik.resetForm();
                setOpenReviewDialog(false);
                setHasNewComment(!hasNewComment);
            } else if (res.data.code === 'warning') {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Thông báo',
                    detail: 'Đánh giá đã tồn tại',
                    life: 2000,
                    style: { textAlign: 'left' }
                });
            }
        }
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    return (
        <React.Fragment>
            <Toast ref={toast} />
            <Dialog
                header={headerDiaglog()}
                visible={openReviewDialog}
                style={{ width: '50rem' }}
                breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                onHide={() => {
                    setOpenReviewDialog(false);
                    formik.resetForm();
                }}
            >
                <div className="w-full surface-card">
                    <div className="">Hãy cho chúng tôi biết cảm nhận của bạn khi làm cùng {fullName}</div>
                    <div className="form-demo">
                        <div className="justify-content-center">
                            <form onSubmit={formik.handleSubmit} className="p-fluid">
                                <div className={'card-review mt-5'}>
                                    <div className={'flex justify-content-center'}>
                                        <Rating
                                            value={formik.values.starRating}
                                            offIcon={<i className={'pi pi-star mr-3 ml-3'} style={{ fontSize: '3rem' }} />}
                                            onIcon={<i className={'pi pi-star-fill mr-3 ml-3'} style={{ color: 'rgb(251, 191, 36)', fontSize: '3rem' }} />}
                                            onChange={(e) => formik.setFieldValue('starRating', e.value)}
                                            cancel={false}
                                            style={{ fontSize: '300rem' }}
                                        />
                                    </div>
                                    <span className={'flex justify-content-center mt-5'}>{getFormErrorMessage('starRating')}</span>
                                </div>
                                <div>
                                    <span>Chọn chiến dịch</span>
                                    <Dropdown
                                        value={formik.values.recruitmentId}
                                        emptyMessage={'Không có dữ liêụ'}
                                        onChange={(e) => formik.setFieldValue('recruitmentId', e.value)}
                                        options={recruitmentList}
                                        optionLabel="jobTitle"
                                        optionValue={'recruitmentId'}
                                        placeholder="-"
                                        className="w-full"
                                    />
                                    {getFormErrorMessage('recruitmentId')}
                                </div>
                                <div className={'mt-4'}>
                                    <span>Nhận xét</span>
                                    <InputTextarea autoResize value={formik.values.evaluation} onChange={(e) => formik.setFieldValue('evaluation', e.target.value)} rows={10} cols={40} />
                                </div>
                                <Button label="Hoàn tất" className="text-xl mt-4" type={'submit'}></Button>
                            </form>
                        </div>
                    </div>
                </div>
            </Dialog>
        </React.Fragment>
    );
};
export default ReviewCandidateForm;
