import React, { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { Avatar } from 'primereact/avatar';
import { DEV_URL } from '../../../src/commons/Utils';

const Introduction = (props) => {
    const toast = useRef(null);
    const fileUploadRef = useRef(null);
    const chooseFileRef = useRef(null);
    const { formik, setImages, images } = props;

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            images.pop();
            images.push(reader.result);
            setImages([...images]);
        };
    };
    const isFormFieldInvalid = (name) => !!(formik?.touched[name] && formik?.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik?.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };

    const pathFieldValue = async (fieldName, value, event) => {
        await formik.setFieldValue(fieldName, value ?? undefined);
        event && (await handleChange(event));
    };

    const onUpload = () => {
        console.log('>>> onUpload');
    };
    const onSelect = async (file) => {
        await pathFieldValue('images', file.files);
    };
    const onError = () => {
        console.log('>>> onError');
    };
    const onClear = () => {
        console.log('>>> onClear');
    };
    const onChooseFiles = () => {
        chooseFileRef.current && chooseFileRef.current.click();
    };

    const headerTemplate = () => {
        return (
            <>
                <div className="header">
                    <div className="keyboard-upload">
                        <div className="avt h-10rem">
                            <input id="profileImage" onChange={(e) => formik.setFieldValue('profileImage', e.currentTarget.files[0])} ref={chooseFileRef} type="file" multiple hidden />
                            {formik?.values?.profileImage ? (
                                <Avatar image={typeof formik.values.profileImage === 'string' ? `${DEV_URL}${formik.values.profileImage}` : URL.createObjectURL(formik.values.profileImage)} size="xlarge" shape="circle" />
                            ) : (
                                ''
                            )}
                            <div className="mark" onClick={onChooseFiles}>
                                <i className="fa-solid fa-camera"></i>
                            </div>
                        </div>
                    </div>
                    <p>{getFormErrorMessage('profileImage')}</p>
                    <h1 className="title">Banner</h1>
                </div>
            </>
        );
    };

    const itemTemplate = (file) => {
        return (
            <span className="upload-item">
                <img alt={file.name} role="presentation" src={file.objectURL} />
            </span>
        );
    };

    const bannerRef = useRef();

    const handleDropImages = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const image = e.dataTransfer.files[0];
            previewFile(image);
            formik.setFieldValue('images', [formik.values.images[0], image]);
        }
    };

    const handleRemoveImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages([...newImages]);

        const newFormikImages = [...formik?.values?.images];
        newFormikImages.splice(index, 1);
        // formik.setFieldValue('images', [...newFormikImages]);
        formik.setFieldValue('images', []);
    };

    return (
        <div>
            <div className={'mb-2'}>
                <div className={'my-2'}>
                    <b>Giới thiệu </b>
                </div>
                <hr />
                <div className="flex flex-column gap-2" id="profile-form">
                    <div className={'grid'}>
                        <div className="col-12 md:col-12">
                            <div className="control-item">
                                <label htmlFor="fileUpload">Ảnh đại diện</label>
                                <FileUpload
                                    ref={fileUploadRef}
                                    name="banner[]"
                                    url="/api/upload"
                                    multiple
                                    accept="image/*"
                                    customUpload
                                    onUpload={onUpload}
                                    onSelect={onSelect}
                                    onError={onError}
                                    onClear={onClear}
                                    headerTemplate={headerTemplate}
                                    itemTemplate={itemTemplate}
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <div id="profile-images" className="flex gap-2">
                                {images?.map((item, index) => (
                                    <div className="img-profile-container" key={index} style={{ width: '100%', height: '300px' }}>
                                        <button className="border-none mt-2 mr-2 p-2 p-button" type="button" onClick={() => handleRemoveImage(index)}>
                                            <i className="pi pi-times"></i>
                                        </button>
                                        <img src={item} style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-12 md:col-12" onDragOver={(e) => e.preventDefault()} onDrop={handleDropImages}>
                            <div className="empty-control-file dotted-spaced" onClick={() => bannerRef.current.click()}>
                                <h1>
                                    Kéo tệp vào đây hoặc <span>tải lên</span>
                                </h1>
                                <p className="sub">Hỗ trợ: PNG, JPG, JPGE,...</p>
                            </div>
                            <input
                                hidden={true}
                                ref={bannerRef}
                                type={'file'}
                                name={'images'}
                                id={'banners'}
                                multiple={false}
                                onChange={(e) => {
                                    const file = e.currentTarget.files[0];
                                    if (file) {
                                        previewFile(file);
                                        formik.setFieldValue('images', [file]);
                                    }
                                }}
                            />
                        </div>

                        <div className={'col-12 p-0 mt-4'}>
                            <div className="flex flex-column gap-2">
                                <Toast ref={toast} />
                                <label htmlFor="name" className={'mb-1'}>
                                    Giới thiệu
                                </label>
                                <InputTextarea
                                    inputid="description"
                                    name="description"
                                    rows={10}
                                    cols={30}
                                    className={classNames({ 'p-invalid': isFormFieldInvalid('description') }, 'w-full')}
                                    value={formik?.values.description ?? ''}
                                    placeholder={'Giới thiệu công ty của bạn'}
                                    onChange={(e) => {
                                        formik.setFieldValue('description', e.target.value);
                                    }}
                                />
                            </div>
                            {getFormErrorMessage('description')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Introduction;
