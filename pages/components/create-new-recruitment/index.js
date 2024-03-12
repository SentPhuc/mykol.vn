import React, { useEffect, useRef, useState } from 'react';
import { useFormik, Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Editor } from 'primereact/editor';
import { ConfirmDialog } from 'primereact/confirmdialog';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import { useRouter } from 'next/router';
import { CITY_ENUM, RULE_UPDATE_PROFILE_CREATE_RECRUITMENT, handleOnChangeCareerAndValidateMaxFive, DEV_URL } from '../../../src/commons/Utils';
import { MAJORS_OPTION } from '../../../src/commons/Constant';
import { RecruitmentService } from '../../../demo/service/RecruitmentService';
import { Toast } from 'primereact/toast';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import { Avatar } from 'primereact/avatar';
import AppLayout from '../../../layout/AppLayout';
import { Checkbox } from 'primereact/checkbox';
import getConfig from 'next/config';

const CreateNewRecruitment = (props) => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const fileUploadRef = useRef(null);
    const chooseFileRef = useRef(null);
    const form = useRef(null);
    const [visible, setVisible] = useState(false);
    const companyProfile = useSelector((state) => state.companyProfile);
    const toast = useRef(null);
    const router = useRouter();
    const [recruitId, setRecruitId] = useState(null);
    const recruitmentService = new RecruitmentService();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDisabled, setisDisabled] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(async () => {
        if (!router.isReady) return;
        const { recruitId } = router.query;
        setRecruitId(recruitId);

        if (!recruitId) {
            formik.resetForm();
            return;
        }

        const { data } = await recruitmentService.findById(recruitId);

        if (data.code !== 'success') {
            await router.push('/');
            return;
        }

        const recruit = data.data;

        await formik.setValues({
            recruitmentGallery: [],
            jobTitle: recruit.jobTitle,
            quantity: recruit.quantity,
            hasProductSample: recruit.hasProductSample,
            careerFieldRequests: recruit.careerFields.map((item) => {
                return { name: item.value, careerFieldCode: item.careerFieldCode };
            }),
            locationRequests: recruit.locations.map((item) => {
                return { name: item?.name, code: item?.code };
            }),
            expirationDate: new Date(recruit.expirationDate),
            description: recruit.description,
            links: recruit.links ?? [''],
            imageCover: recruit.imageCover
        });

        if (!!recruit && recruit.careerFields.length > 0) {
            setisDisabled(true);
        }
    }, [router]);

    const show = () => {
        toast.current.show({ severity: 'success', summary: 'Form Submitted', detail: formik.values.value });
    };

    const renderHeaderEditor = () => {
        return (
            <span className="ql-formats">
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
                {/* <button className="ql-list" value="ordered" aria-label="Ordered List"></button> */}
                {/* <button className="ql-list" value="bullet" aria-label="Unordered List"></button> */}
            </span>
        );
    };

    const headerEditor = renderHeaderEditor();

    const acceptUpdateCompanyProfile = () => {
        toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Đang chuyến company profile !!!', life: 3800 });
        window.location.href = '/components/company-profile';
    };

    useEffect(() => {
        if (!!companyProfile[0]) {
            let confirmUpdateCompanyProfile = RULE_UPDATE_PROFILE_CREATE_RECRUITMENT.map((value) => {
                return !!companyProfile[0][value];
            });
            if (!_.every(confirmUpdateCompanyProfile)) {
                setVisible(true);
            }
        }
    }, [companyProfile[0]]);

    const service = new RecruitmentService();

    const location = useRouter().pathname;

    const formik = useFormik({
        initialValues: {
            recruitmentGallery: [],
            jobTitle: '',
            quantity: null,
            hasProductSample: false,
            description: '',
            links: [''],
            imageCover: '',
            expirationDate: '',
            description: '',
            careerFieldRequests: [],
            locationRequests: [],
            careerCodes: [],
            locationCodes: []
        },
        validate: (data) => {
            let errors = {};

            if (!!data.imageCover && typeof data.imageCover !== 'string') {
                const validFileTypes = ['image/jpeg', 'image/tiff', 'image/bmp', 'image/png', 'image/webp', 'image/svg+xml'];
                let checkTypeFile = validFileTypes.includes(data.imageCover.type);
                if (Number(data.imageCover.size) > 10485760 || !checkTypeFile) {
                    errors.imageCover = 'Vui lòng chọn ảnh avatar với dung lượng < 10MB và định dạng PNG, JPG, JPEG, BMP, TIFF, WEBP, HEIC, SVG';
                }
            }

            if (!data.jobTitle) errors.jobTitle = 'Tên tin đăng bắt buộc nhập';

            if (!data.quantity) errors.quantity = 'Số lượng tuyển bắt buộc nhập';

            if (data.quantity <= 0) errors.quantity = 'Số lượng tuyển phải lớn hơn 0';

            if (data.quantity > 500) errors.quantity = 'Số lượng tuyển phải nhỏ hơn hoặc bằng 500';

            if (!Number.isInteger(Number(data.quantity))) errors.quantity = 'Số lượng tuyển phải là số nguyên';

            if (!data.careerFieldRequests || data.careerFieldRequests.length === 0) errors.careerFieldRequests = 'Lĩnh vực bắt buộc nhập';

            if (!data.locationRequests || data.locationRequests.length === 0) errors.locationRequests = 'Địa điểm bắt buộc nhập';

            if (!data.expirationDate) errors.expirationDate = 'Hạn nộp hồ sơ bắt buộc nhập';

            if (!data.description) errors.description = 'Mô tả công việc bắt buộc nhập';

            if (!data.imageCover) errors.imageCover = 'Ảnh đại diện bắt buộc nhập';

            if (Object.keys(errors).length > 0) {
                const firstErrorElement = Object.keys(errors)[0];
                let scrollElement = null;
                scrollElement = document.getElementById(firstErrorElement);

                scrollElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            return errors;
        },
        onSubmit: async (data) => {
            setIsSubmitting(true);
            const careerCodes = data.careerFieldRequests.map((item) => item.careerFieldCode);
            const locationCodes = data.locationRequests.map((item) => item.code);
            data.careerCodes = careerCodes;
            data.locationCodes = locationCodes;
            let res;
            try {
                if (recruitId) {
                    res = await service.update(recruitId, data);
                } else {
                    res = await service.create(data);
                }

                if (res.data.type === 'SUCCESS') {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Thông báo',
                        detail: 'Cập nhật thành công',
                        life: 2000
                    });

                    if (localStorage.getItem('role') === 'ADMINISTRATION') {
                        window.location.href = '/components/verified-recruitment';
                    } else {
                        window.location.href = '/components/list-recruitments';
                    }
                } else {
                    setIsSubmitting(false);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Thông báo',
                        detail: 'Tạo tin tuyển dụng thất bại',
                        life: 2000
                    });
                }
            } catch (error) {
                setIsSubmitting(false);
                toast.current.show({
                    severity: 'error',
                    summary: 'Thông báo',
                    detail: 'Tạo tin tuyển dụng thất bại',
                    life: 2000
                });
            }
        }
    });

    const selectAllTemplate = () => {
        return (
            <div className="p-multiselect-header">
                <div className="p-checkbox w-full">
                    <Checkbox
                        inputId="multiSelectAll"
                        checked={formik.values.locationRequests.length === CITY_ENUM.length}
                        onChange={(e) => {
                            if (e.checked) {
                                formik.setFieldValue('locationRequests', CITY_ENUM);
                            } else {
                                formik.setFieldValue('locationRequests', []);
                            }
                        }}
                    />
                    <label htmlFor="multiSelectAll" className="ml-2">
                        {' '}
                        Chọn tất cả
                    </label>
                </div>
            </div>
        );
    };

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error mt-2 block">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };

    const headerTemplate = () => {
        return (
            <>
                <div className="header">
                    <div className="keyboard-upload" id="imageCover">
                        <div className="avt h-10rem">
                            <input onChange={(e) => formik.setFieldValue('imageCover', e.currentTarget.files[0])} ref={chooseFileRef} type="file" multiple hidden />
                            {formik.values.imageCover ? (
                                <Avatar image={typeof formik.values.imageCover === 'string' ? `${DEV_URL}${formik.values.imageCover}` : URL.createObjectURL(formik.values.imageCover)} size="xlarge" shape="circle" />
                            ) : (
                                <Avatar className="border-circle" image={`${contextPath}/demo/images/avatar/no-avatar.png`} alt={'img'} size="large" />
                            )}
                            <div className="mark" onClick={onChooseFiles}>
                                <i className="fa-solid fa-camera"></i>
                            </div>
                        </div>
                    </div>
                    <p>{getFormErrorMessage('imageCover')}</p>
                </div>
            </>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <span className="upload-item">
                <img alt={file.name} role="presentation" src={file.objectURL} />
            </span>
        );
    };

    const onSelect = async (file) => {
        await pathFieldValue('imageCover', file.files);
    };

    const pathFieldValue = async (fieldName, value, event) => {
        await formik.setFieldValue(fieldName, value ?? undefined);
        event && (await handleChange(event));
    };

    const onChooseFiles = () => {
        chooseFileRef.current && chooseFileRef.current.click();
    };

    const removeLink = (index) => {
        const links = formik.values?.links.filter((link, indexLink) => indexLink != index);
        formik.setFieldValue('links', links);
    };

    const handleAddLinks = () => {
        formik.values?.links?.push('');
        formik.setFieldValue('links', formik.values?.links);
    };

    return AppLayout(
        <>
            <React.Fragment>
                <Toast ref={toast} />
                <ConfirmDialog
                    closable={false}
                    rejectClassName={'hidden'}
                    visible={visible}
                    onHide={() => setVisible(false)}
                    message="Bạn cần cập nhật hồ sơ công ty để tạo tin !!!"
                    header="Confirmation"
                    icon="pi pi-exclamation-triangle"
                    accept={acceptUpdateCompanyProfile}
                />
                <div className="layout-main card">
                    <div>
                        <BreadcrumbCustom path={location} />
                        <br />
                    </div>
                    <div className="flex justify-content-center create-new-recruitment">
                        <form onSubmit={formik.handleSubmit} className="w-full flex flex-column gap-2">
                            <div className={'my-2'}>
                                <b>Thông tin chung</b>
                            </div>
                            {/*<UploadListGallery formik={formik} />*/}
                            <div className={'grid card-container mb-3'} id="profile-form">
                                <div className="col-12 md:col-12">
                                    <div className="control-item">
                                        <label className={classNames({ 'p-error': isFormFieldInvalid('imageCover') }, 'control-label')} htmlFor="imageCover">
                                            Ảnh đại diện <span className="primary-color">*</span>
                                        </label>
                                        <FileUpload ref={fileUploadRef} multiple={false} name="imageCover" url="/api/upload" accept="image/*" customUpload onSelect={onSelect} headerTemplate={headerTemplate} itemTemplate={itemTemplate} />
                                    </div>
                                </div>
                                <div className="field col-12 lg:col-4">
                                    <label htmlFor="name" className={classNames({ 'p-error': isFormFieldInvalid('jobTitle') })}>
                                        Tên tin đăng <span className="primary-color">*</span>
                                    </label>
                                    <InputText
                                        id="jobTitle"
                                        name="jobTitle"
                                        inputid="jobTitle"
                                        value={formik.values.jobTitle}
                                        onChange={(e) => {
                                            formik.setFieldValue('jobTitle', e.target.value);
                                        }}
                                        maxLength={80}
                                        placeholder="Vui lòng nhập"
                                        className={classNames({ 'p-invalid': isFormFieldInvalid('jobTitle') }, 'w-full')}
                                    ></InputText>
                                    {getFormErrorMessage('jobTitle')}
                                </div>
                                <div className="field col-12 lg:col-4">
                                    <label htmlFor="quantity" className={classNames({ 'p-error': isFormFieldInvalid('quantity') })}>
                                        Số lượng tuyển <span className="primary-color">*</span>
                                    </label>
                                    <InputText
                                        id="quantity"
                                        name="quantity"
                                        inputid="quantity"
                                        value={Number(formik.values.quantity)}
                                        type="number"
                                        onChange={(e) => {
                                            formik.setFieldValue('quantity', e.target.value);
                                        }}
                                        placeholder="Vui lòng nhập"
                                        className={classNames({ 'p-invalid': isFormFieldInvalid('quantity') }, 'w-full')}
                                    ></InputText>
                                    {getFormErrorMessage('quantity')}
                                </div>
                                <div className="field col-12 lg:col-4">
                                    <label htmlFor="careerFieldRequests" className={classNames({ 'p-error': isFormFieldInvalid('careerFieldRequests') })}>
                                        Lĩnh vực <span className="primary-color">*</span>
                                    </label>
                                    <MultiSelect
                                        inputId="careerFieldRequests"
                                        name="careerFieldRequests"
                                        value={formik.values.careerFieldRequests}
                                        onChange={(e) => handleOnChangeCareerAndValidateMaxFive(e, toast, formik.setFieldValue)}
                                        options={MAJORS_OPTION}
                                        optionLabel="name"
                                        display="chip"
                                        placeholder="Lĩnh vực *"
                                        className={classNames({ 'p-invalid': isFormFieldInvalid('careerFieldRequests') }, 'w-full')}
                                        showSelectAll={false}
                                    />
                                    {getFormErrorMessage('careerFieldRequests')}
                                </div>
                            </div>

                            <div className={'grid card-container mb-3'}>
                                <div className="field col-12 lg:col-4">
                                    <label htmlFor="locationRequests" className={classNames({ 'p-error': isFormFieldInvalid('locationRequests') })}>
                                        Địa điểm <span className="primary-color">*</span>
                                    </label>
                                    <MultiSelect
                                        inputId="locationRequests"
                                        name="locationRequests"
                                        value={formik.values.locationRequests}
                                        onChange={(e) => {
                                            formik.setFieldValue('locationRequests', e.target.value);
                                        }}
                                        options={CITY_ENUM}
                                        optionLabel="name"
                                        display="chip"
                                        placeholder="Vui lòng chọn"
                                        className={classNames({ 'p-invalid': isFormFieldInvalid('locationRequests') }, 'w-full')}
                                        filter
                                        filterPlaceholder="Tìm kiếm"
                                        panelHeaderTemplate={selectAllTemplate}
                                    />
                                    {getFormErrorMessage('locationRequests')}
                                </div>
                                <div className="field col-12 lg:col-4">
                                    <label htmlFor="expirationDate" className={classNames({ 'p-error': isFormFieldInvalid('expirationDate') })}>
                                        Hạn nộp hồ sơ <span className="primary-color">*</span>
                                    </label>
                                    <Calendar
                                        id="expirationDate"
                                        value={formik.values.expirationDate}
                                        onChange={(e) => formik.setFieldValue('expirationDate', e.target.value)}
                                        showIcon
                                        placeholder="Vui lòng chọn"
                                        minDate={new Date()}
                                        className={classNames({ 'p-invalid': isFormFieldInvalid('expirationDate') }, 'w-full')}
                                    />
                                    {getFormErrorMessage('expirationDate')}
                                </div>
                                <div className="field col-12 justify-content-center lg:col-4 flex align-items-center">
                                    <Checkbox
                                        inputId="hasProductSample"
                                        value={formik.values.hasProductSample}
                                        onChange={(e) => formik.setFieldValue('hasProductSample', e.checked)}
                                        checked={formik.values.hasProductSample}
                                        className={classNames({ 'p-invalid': isFormFieldInvalid('hasProductSample') }, 'primary-color mr-2')}
                                    />
                                    <label htmlFor="hasProductSample" className={classNames({ 'p-error': isFormFieldInvalid('hasProductSample') }, `font-bold text-lg mb-0 cursor-pointer`)}>
                                        Có sản phẩm mẫu miễn phí
                                    </label>

                                    {getFormErrorMessage('hasProductSample')}
                                </div>
                            </div>

                            <hr />
                            <div className={'field col-12'}>
                                <div className={''}>
                                    <b className={classNames({ 'p-error': isFormFieldInvalid('description') })}>
                                        Mô tả công việc <span style={{ color: 'red' }}>*</span>
                                    </b>
                                    <div className={'my-3'}>
                                        <p>Để được duyệt tin, yêu cầu ghi đầy đủ nội dung tin đăng, trình bày rõ ràng các phần như: Mô tả công ty, sản phẩm, yêu cầu, quyền lợi, thông tin liên hệ,…</p>
                                    </div>
                                </div>
                                <Editor
                                    headerTemplate={headerEditor}
                                    value={formik.values.description ?? ''}
                                    onTextChange={(e) => !!e.htmlValue && formik.setFieldValue('description', e.htmlValue)}
                                    style={{ height: '200px' }}
                                    className={classNames({ 'p-invalid': isFormFieldInvalid('description') })}
                                    id="description"
                                    name="description"
                                />
                                {getFormErrorMessage('description')}
                            </div>
                            <div className="field mb-5 col-12 lg:col-4">
                                <label htmlFor="expirationDate" className={classNames({ 'p-error': isFormFieldInvalid('expirationDate') })}>
                                    <b>Link shop, link website, link sản phẩm trên tiktok Shop</b>
                                </label>
                                <div className="w-full mt-2">
                                    {formik.values?.links?.map((link, index) => {
                                        return (
                                            <div key={index} className="item-link mb-3 flex w-full">
                                                <InputText onChange={(e) => formik.setFieldValue(`links.${index}`, e?.target?.value)} className="w-full mr-3" key={index} type="text" value={link} />
                                                <Button className="cursor-pointer" onClick={() => removeLink(index)} type="button" icon="pi pi-delete-left" />
                                            </div>
                                        );
                                    })}
                                </div>
                                {formik.values?.links?.length < 10 && (
                                    <div className="text-center mt-3">
                                        <Button className="cursor-pointer" onClick={handleAddLinks} type="button" label="Thêm link" />
                                    </div>
                                )}
                            </div>
                            <div className={'center-item'}>
                                <Button className="w-180" type="submit" label={!recruitId ? 'Tạo mới' : 'Cập nhật'} loading={isSubmitting} />
                            </div>
                        </form>
                    </div>
                </div>
            </React.Fragment>
        </>
    );
};

export default CreateNewRecruitment;
