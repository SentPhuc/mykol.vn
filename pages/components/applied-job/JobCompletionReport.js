import getConfig from 'next/config';
import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useFormik } from 'formik';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { RecruitmentReportService } from '../../../demo/service/RecruitmentReportService';
import { ACTIVITY_PLATFORM_ENUM } from 'src/commons/Utils';

const JobCompletionReport = (props) => {
    const { openJobCompletionReportPopup, setJobCompletionReportPopup, chooseKolRecId, recSocialNetworks, setIsSubmit, isSubmit } = props;

    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error font-italic">{formik.errors[name]}</small>;
    };

    const service = new RecruitmentReportService();
    const toast = useRef(null);
    const formik = useFormik({
        initialValues: {
            facebookLink: '',
            tiktokLink: '',
            youtubeLink: '',
            instagramLink: ''
        },
        validateOnMount: true,
        validate: (data) => {
            let errors = {};
            if (data.facebookLink == '' && data.tiktokLink == '' && data.youtubeLink == '' && data.instagramLink == '') {
                errors.facebookLink = 'Không được bỏ trống cả 4 URL';
                errors.tiktokLink = 'Không được bỏ trống cả 4 URL';
                errors.youtubeLink = 'Không được bỏ trống cả 4 URL';
                errors.instagramLink = 'Không được bỏ trống cả 4 URL';
            }
            if (data.tiktokLink != '' && data.tiktokLink.toLowerCase().indexOf('tiktok.com/@') == -1) {
                errors.tiktokLink = 'Vui lòng nhập đúng link Tiktok';
            }
            return errors;
        },
        onSubmit: async (data) => {
            const kolReport = {
                1: [data.facebookLink],
                2: [data.tiktokLink],
                3: [data.youtubeLink],
                4: [data.instagramLink]
            };
            const submitData = {
                kolRecId: chooseKolRecId,
                kolReport
            };
            const res = await service.kolReport(JSON.stringify(submitData));
            if (res.data.code == 'success') {
                toast.current.show({
                    severity: 'success',
                    summary: 'Thông báo',
                    detail: 'Báo cáo kết quả công việc thành công',
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
            setIsSubmit(!isSubmit);
            setJobCompletionReportPopup(false);
            formik.resetForm();
        }
    });

    const handleHide = () => {
        formik.resetForm();
        setJobCompletionReportPopup(false);
    };

    /**
     * recSocialNetworks.length > 1 get tiktok else get social other
     */
    const checkRecSocialNetworks = (platform, code) => {
        const result = recSocialNetworks?.map((social) => platform !== social?.value && social.code !== code);
        return recSocialNetworks?.length > 1 ? result?.[1] : result?.[0];
    };

    return (
        <React.Fragment>
            <Toast ref={toast} />
            <div>
                <Dialog header="Báo cáo hoàn thành công việc" visible={openJobCompletionReportPopup} style={{ width: '756px' }} breakpoints={{ '756px': '95vw', '95vw': '95vw' }} onHide={handleHide}>
                    <div className="form-demo">
                        <div className="justify-content-center">
                            <form onSubmit={formik.handleSubmit} className="p-fluid">
                                <div className="field ">
                                    <label htmlFor="facebookLink" className={classNames({ 'p-error': isFormFieldValid('facebookLink') })}>
                                        Link Facebook
                                    </label>
                                    <InputText
                                        id="facebookLink"
                                        name="facebookLink"
                                        placeholder="Link Facebook"
                                        value={formik.values.facebookLink}
                                        onChange={formik.handleChange}
                                        disabled={checkRecSocialNetworks(ACTIVITY_PLATFORM_ENUM[0]?.name, ACTIVITY_PLATFORM_ENUM[0]?.code)}
                                        autoFocus
                                        className={classNames({ 'p-invalid': isFormFieldValid('facebookLink') })}
                                    />
                                    {getFormErrorMessage('facebookLink')}
                                </div>

                                <div className="field ">
                                    <label htmlFor="tiktokLink" className={classNames({ 'p-error': isFormFieldValid('tiktokLink') })}>
                                        Link Tiktok
                                    </label>
                                    <InputText
                                        id="tiktokLink"
                                        name="tiktokLink"
                                        placeholder="Link Tiktok"
                                        value={formik.values.tiktokLink}
                                        onChange={formik.handleChange}
                                        disabled={checkRecSocialNetworks(ACTIVITY_PLATFORM_ENUM[1]?.name, ACTIVITY_PLATFORM_ENUM[1]?.code)}
                                        autoFocus
                                        className={classNames({ 'p-invalid': isFormFieldValid('tiktokLink') })}
                                    />
                                    {getFormErrorMessage('tiktokLink')}
                                </div>

                                <div className="field ">
                                    <label htmlFor="youtubeLink" className={classNames({ 'p-error': isFormFieldValid('youtubeLink') })}>
                                        Link Youtube
                                    </label>
                                    <InputText
                                        id="youtubeLink"
                                        name="youtubeLink"
                                        value={formik.values.youtubeLink}
                                        placeholder="Link Youtube"
                                        onChange={formik.handleChange}
                                        disabled={checkRecSocialNetworks(ACTIVITY_PLATFORM_ENUM[3]?.name, ACTIVITY_PLATFORM_ENUM[3]?.code)}
                                        autoFocus
                                        className={classNames({ 'p-invalid': isFormFieldValid('youtubeLink') })}
                                    />
                                    {getFormErrorMessage('youtubeLink')}
                                </div>

                                <div className="field ">
                                    <label htmlFor="instagramLink" className={classNames({ 'p-error': isFormFieldValid('instagramLink') })}>
                                        Link Instagram
                                    </label>
                                    <InputText
                                        id="instagramLink"
                                        name="instagramLink"
                                        placeholder="Link Instagram"
                                        value={formik.values.instagramLink}
                                        onChange={formik.handleChange}
                                        disabled={checkRecSocialNetworks(ACTIVITY_PLATFORM_ENUM[2]?.name, ACTIVITY_PLATFORM_ENUM[2]?.code)}
                                        autoFocus
                                        className={classNames({ 'p-invalid': isFormFieldValid('instagramLink') })}
                                    />
                                    {getFormErrorMessage('instagramLink')}
                                </div>

                                <div className="flex justify-content-end">
                                    <Button className="p-button w-6 mr-2" label="Cập nhật kết quả" icon="pi pi-save" type="submit" autoFocus />
                                    <Button
                                        type="button"
                                        className="p-button-secondary mr-0 w-6"
                                        label="Hủy bỏ"
                                        icon="pi pi-times"
                                        onClick={() => {
                                            setJobCompletionReportPopup(false);
                                            formik.resetForm();
                                        }}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </Dialog>
            </div>
        </React.Fragment>
    );
};
export default JobCompletionReport;
