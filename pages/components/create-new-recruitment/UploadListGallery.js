import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';

const UploadListGallery = (props) => {
    const {formik} = props;
    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);

    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;
        const filesArray = Array.from(e.files)
        filesArray.map((file,index) => formik.setFieldValue("recruitmentGallery[" + index +"]",file));
        Object.keys(files).forEach( (key) => {
            _totalSize += files[key].size || 0;
            formik.setFieldValue("recruitmentGallery[" + key +"]",files[key]);
        });
        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current.show({ severity: 'info', summary: 'Thành công', detail: 'Tải ảnh lên thành công' });
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, cancelButton } = options;
        const value = totalSize / 50000000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className}
                 style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {cancelButton}
                <div className='flex align-items-center gap-3 ml-auto custom-progressBar'>
                    <span>{formatedValue} / 50 MB</span>
                    <ProgressBar
                    value={value}
                    showValue={false}
                    style={{ width: '10rem', height: '12px' }}
                    ></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div className='flex align-items-center flex-wrap item-fileupload'>
                <div className='flex align-items-center avatar-fileupload' style={{ width: '40%' }}>
                    <img alt={file.name} role='presentation' src={file.objectURL} width={100} />
                    <span className='flex flex-column text-left ml-3'>
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity='warning' className='px-3 py-2 tag-fileupload' />
                <Button type='button' icon='pi pi-times'
                        className='p-button-outlined p-button-rounded p-button-danger ml-auto'
                        onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className='flex align-items-center flex-column'>
                <i className='pi pi-image mt-3 p-5' style={{
                    fontSize: '5em',
                    borderRadius: '50%',
                    backgroundColor: 'var(--surface-b)',
                    color: 'var(--surface-d)'
                }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className='my-5'>
                    Kéo và thả hình ảnh vào đây
                </span>
            </div>
        );
    };

    const chooseOptions = {
        icon: 'pi pi-fw pi-images',
        className: 'custom-choose-btn p-button-rounded p-button-outlined',
        label: 'Chọn ảnh'
    };
    const cancelOptions = {
        icon: 'pi pi-fw pi-times',
        className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined',
        label: 'Xóa tất cả'
    };

    return (
        <div className='mb-3'>
            <Toast ref={toast}></Toast>
            <Tooltip target='.custom-choose-btn' content='Chọn ảnh' position='bottom' />

            <Tooltip target='.custom-cancel-btn' content='Xóa ảnh' position='bottom' />

            <FileUpload ref={fileUploadRef}
                        name='demo[]'
                        url='/api/upload'
                        multiple accept='image/*'
                        maxFileSize={50000000}
                        onUpload={onTemplateUpload}
                        onSelect={onTemplateSelect}
                        onError={onTemplateClear}
                        onClear={onTemplateClear}
                        headerTemplate={headerTemplate}
                        itemTemplate={itemTemplate}
                        emptyTemplate={emptyTemplate}
                        chooseOptions={chooseOptions}
                        cancelOptions={cancelOptions}
                        invalidFileSizeMessageSummary="Vui lòng không tải ảnh quá 50MB"
                        invalidFileSizeMessageDetail=""
                        className="custom-FileUpload"
            />
        </div>
    );
};

export default UploadListGallery;
