import { GlobalService } from 'demo/service/GlobalService';
import { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { DataView } from 'primereact/dataview';
import { Paginator } from 'primereact/paginator';
import { classNames } from 'primereact/utils';
import { Ripple } from 'primereact/ripple';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import TitleRecruitment from 'pages/components/homepage/TitleRecruitment';
import ItemRecruitments from './ItemRecruitments';
import { CATEGORY_ENUM } from 'src/commons/Utils';
import { useDispatch } from 'react-redux';
import { openPopupLogin } from 'public/reduxConfig/loginSlice';
import { Toast } from 'primereact/toast';

const Recruitments = () => {
    const formRef = useRef(null);
    const toast = useRef(null);
    const dispatch = useDispatch();
    const [recruitments, setRecruitments] = useState();
    const [showCareer, setShowCareer] = useState(false);
    const [isProductSample, setIsProductSample] = useState(false);
    const [nameCareer, setNameCareer] = useState('');
    const [changing, setChanging] = useState(false);
    const [page, setPage] = useState(1);
    const [pageGoTo, setPageGoTo] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const getStorage = typeof window !== 'undefined' ? localStorage : {};
    const global = new GlobalService();

    useEffect(() => {
        const handleClickEvent = (event) => {
            if (!!formRef && !!formRef.current && !formRef?.current?.contains(event?.target)) {
                setShowCareer(false);
            }
        };

        document.body.addEventListener('click', handleClickEvent);

        return () => {
            document.body.removeEventListener('click', (e) => handleClickEvent(e));
        };
    }, []);

    const getData = (data, page, pageSize) => {
        global
            .getRecruitments({
                keyword: data?.keyword,
                hasProductSample: data?.hasProductSample,
                careerCode: data?.careerCode,
                page: page,
                recordPage: pageSize,
                sorting: ''
            })
            .then((data) => {
                if (data?.data?.type == 'SUCCESS') {
                    setRecruitments(data?.data?.data?.content);
                    setTotalRecords(data?.data?.data?.totalElements);
                }
            })
            .catch((err) => console.log(err));
    };

    const formikFilter = useFormik({
        initialValues: {
            keyword: '',
            hasProductSample: false,
            careerCode: null,
            page: page,
            recordPage: pageSize,
            sorting: ''
        },
        onSubmit: async (data) => {
            getData(formikFilter?.values, page, pageSize);
            toast.current.show({
                severity: 'success',
                summary: 'Thông báo',
                detail: 'Tìm kiếm thành công',
                life: 2000
            });
        }
    });

    useEffect(() => {
        getData(formikFilter?.values, page, pageSize);
        if (isProductSample) {
            toast.current.show({
                severity: 'success',
                summary: 'Thông báo',
                detail: 'Tìm kiếm thành công',
                life: 2000
            });
        }
    }, [changing, pageSize, page, isProductSample]);

    const onPageChange = (event) => {
        setPage(event.page + 1);
        setPageSize(event.rows);
        setChanging(!changing);
    };

    const template1 = {
        layout: 'PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport',
        PrevPageLink: (options) => {
            return (
                <button type="button" className={classNames(options.className, 'border-round')} onClick={options.onClick} disabled={options.disabled}>
                    <span className="p-3">Previous</span>
                    <Ripple />
                </button>
            );
        },
        NextPageLink: (options) => {
            return (
                <button type="button" className={classNames(options.className, 'border-round')} onClick={options.onClick} disabled={options.disabled}>
                    <span className="p-3">Next</span>
                    <Ripple />
                </button>
            );
        },
        PageLinks: (options) => {
            if ((options.view.startPage === options.page && options.view.startPage !== 0) || (options.view.endPage === options.page && options.page + 1 !== options.totalPages)) {
                const className = classNames(options.className, { 'p-disabled': true });

                return (
                    <span className={className} style={{ userSelect: 'none' }}>
                        ...
                    </span>
                );
            }

            return (
                <button type="button" className={options.className} onClick={options.onClick}>
                    {options.page + 1}
                    <Ripple />
                </button>
            );
        },
        CurrentPageReport: (options) => {
            return (
                <span className="mx-3" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                    Go to <InputText disabled={!!options && options.totalPages < 2} min="0" minLength="1" size="2" className="ml-1" value={pageGoTo} onChange={onPageInputChange} />
                    <Button disabled={!!options && options.totalPages < 2} className="ml-2" onClick={() => onPageInputKeyDown(options)}>
                        Go
                    </Button>
                </span>
            );
        }
    };

    const onPageInputChange = (event) => {
        if (event.target.value >= 0) setPageGoTo(event.target.value);
    };

    const onPageInputKeyDown = (options) => {
        const pageGoToChange = parseInt(pageGoTo);
        if (pageGoToChange < 0 || pageGoToChange > options.totalPages) {
            setPage(options.totalPages);
        } else {
            setPage(pageGoToChange);
        }
        setPageSize(options.rows);
        setChanging(!changing);
    };

    const handleRemoveAllFilter = () => {
        setPage(1);
        setNameCareer('');
        setChanging((pre) => !pre);
        formikFilter.resetForm();
    };

    const TemplatePage = (rowData) => {
        return <ItemRecruitments data={rowData} />;
    };

    const handleCreatePost = () => {
        if (getStorage && !getStorage.accountId) {
            dispatch(openPopupLogin());
            return;
        }

        if (getStorage.role !== 'REC') {
            toast.current.show({
                severity: 'error',
                summary: 'Thông báo',
                detail: 'Bạn cần đăng nhập tài khoản nhà tuyển dụng để được tạo tin đăng',
                life: 2000
            });

            return;
        }

        window.location.href = '/components/create-new-recruitment';
    };

    // useEffect(() => {
    //     formikFilter.setFieldValue('hasProductSample', isProductSample);
    //     getData(formikFilter?.values, page, pageSize);
    //     toast.current.show({
    //         severity: 'success',
    //         summary: 'Thông báo',
    //         detail: 'Tìm kiếm thành công',
    //         life: 2000
    //     });
    // }, [isProductSample]);

    return (
        <div id="recruitments" className="pt-4">
            <Toast ref={toast} />
            <div className="container">
                <TitleRecruitment />
                <form ref={formRef} className="form-recruitments md:mt-5 my-2 md:mb-8 flex align-items-center justify-content-between flex-wrap" onSubmit={formikFilter.handleSubmit}>
                    <div className="input-keyword">
                        <i className="pi pi-search"></i>
                        <input type="text" value={formikFilter.values.keyword} placeholder="Nhập nội dung cần tìm..." onChange={(e) => formikFilter.setFieldValue('keyword', e?.target?.value)} />
                    </div>
                    <div className="item-form-search shadow-1 select-none careerCodes cursor-pointer text-left relative">
                        <div
                            className="absolute w-full h-full left-0 top-0"
                            style={{ zIndex: 15 }}
                            onClick={() => {
                                setShowCareer((pre) => !pre);
                            }}
                        ></div>
                        <label className="cursor-pointer">
                            <img src="/demo/images/home/icon-career-filter.png" alt="Lĩnh vực" />
                            {nameCareer ? nameCareer : 'Lĩnh vực'} <i className="pi pi-angle-down"></i>
                        </label>
                        {showCareer && (
                            <ul className="box-careerCodes">
                                {CATEGORY_ENUM.map((value, index) => {
                                    return (
                                        <li
                                            key={index + 1}
                                            onClick={(e) => {
                                                setShowCareer(false);
                                                setNameCareer(value?.name);
                                                formikFilter.setFieldValue('careerCode', value?.careerFieldCode);
                                            }}
                                        >
                                            {value?.name}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                    <Button type="submit" label="Tìm kiếm" />
                    <Button type="button" icon="pi pi-reply" onClick={handleRemoveAllFilter} label="Xóa chọn" />
                </form>
                <div className="flex px-4 footer-search mb-3 justify-content-between align-content-center flex-wrap">
                    <div className="title-free-product flex align-items-center">
                        <span>Hiển thị: </span>
                        <div
                            onClick={() => {
                                formikFilter.setFieldValue('hasProductSample', !formikFilter?.values?.hasProductSample);
                                setIsProductSample((pre) => !pre);
                            }}
                            className={classNames(formikFilter?.values?.hasProductSample ? 'active' : '', 'flex align-items-center')}
                        >
                            <img src="/demo/images/home/icon-free-product.png" alt="free product" /> Sản phẩm mẫu miễn phí
                        </div>
                    </div>
                    <Button onClick={handleCreatePost} className="py-2" type="button" label="Tạo tin đăng" icon="pi pi-plus" />
                </div>
                <DataView value={recruitments} itemTemplate={TemplatePage} />
                <Paginator template={template1} first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />
            </div>
        </div>
    );
};

export default Recruitments;
