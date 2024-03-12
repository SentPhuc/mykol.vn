import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Divider } from 'primereact/divider';
import { useFormik } from 'formik';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { CommonUtils } from '../../../src/utilities/common/common-utils';
import { MAJORS_OPTION } from '../../../src/commons/Constant';
import { InputSwitch } from 'primereact/inputswitch';
import { FileUpload } from 'primereact/fileupload';
import { Avatar } from 'primereact/avatar';
import { AccountService } from '../../../demo/service/AccountService';
import { GlobalService } from '../../../demo/service/GlobalService';
import { Provider, useDispatch } from 'react-redux';
import store from '../../../public/reduxConfig/profileStore';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { addProfile } from '../../../public/reduxConfig/kolsProfileSlice';
import { handleOnChangeCareerAndValidateMaxFive, DEV_URL, validatePhone } from '../../../src/commons/Utils';
import { KolAdditionalInfoService } from '../../../demo/service/KolAdditionalInfoService';
import { BANKSNAPAS, CITY_ENUM, SERVICE_ENUM } from '../../../src/commons/Utils';
import { useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import getConfig from 'next/config';
import isForbiddenKeywordExists from 'src/commons/isForbiddenKeywordExists';

const AccountProfileForm = (props) => {
    const service = new AccountService();
    const globalService = new GlobalService();
    const fileUploadRef = useRef(null);
    const chooseFileRef = useRef(null);
    const location = useRouter().pathname;
    // const [openAvatarEditor, setOpenAvatarEditor] = useState(false);
    const toast = useRef(null);
    const { accountProfile } = props;
    const emailAccount = typeof window !== 'undefined' ? localStorage.getItem('email') : null;
    const dispatch = useDispatch();
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    // const [isPreview, setIsPreview] = useState(false);
    const [isValidate, setIsValidate] = useState(false);

    const formatNumberWithCommas = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const personalServices = props?.accountProfile?.[0]?.personalServices?.map((item) => {
        return {
            serviceName: item.serviceName,
            price: formatNumberWithCommas(item.price?.toString().replace(/,/g, '')),
            description: item.description
        };
    });
    const [services, setServices] = useState(!!personalServices ? JSON.parse(JSON.stringify(personalServices)) : [{ serviceName: SERVICE_ENUM?.[0]?.code, price: '', description: '', diplayPrice: '' }]);

    const handleServiceChange = (index, key, value) => {
        const newServices = JSON.parse(JSON.stringify(services));
        newServices[index][key] = value;
        if (key === 'price') {
            newServices[index][key] = formatNumberWithCommas(value?.toString().replace(/,/g, ''));
        }
        setServices(newServices);
        formik.setFieldValue('personalServices', newServices);
    };

    const handleAddService = () => {
        //check last service is  not empty then add new service
        const lastService = services[services.length - 1];
        if (lastService?.serviceName === '' || lastService?.price === '') {
            formik.setFieldValue('personalServices', services);
            return;
        }
        //check if >4 services then return
        if (services.length >= 4) {
            return;
        }

        const newServices = [...services, { serviceName: SERVICE_ENUM[0].code, price: '', description: '' }];
        setServices(newServices);
        formik.setFieldValue('personalServices', newServices);
    };

    const handleDeleteService = (index) => {
        const newServices = [...services];
        newServices.splice(index, 1);
        setServices(newServices);
        formik.setFieldValue('personalServices', newServices);
    };

    const serviceAdd = new KolAdditionalInfoService();
    const kolAdditionalProfile = useSelector((state) => state.kolAdditionalProfile);
    const accountId = typeof window !== 'undefined' ? localStorage.getItem('accountId') : null;
    const handleCityChange = (e) => {
        const selectedCityCode = e.value;
        formik.setFieldValue('cityCode', selectedCityCode);
    };

    useEffect(() => {
        if (kolAdditionalProfile.length === 0) return;
        initFormik();
    }, [kolAdditionalProfile]);

    // useEffect(async () => {
    //     if (kolAdditionalProfile[0]?.citizenIdCardFront != null && kolAdditionalProfile[0]?.citizenIdCardBackside) {
    //         try {
    //             const response = await service.kolAdditionalInfoImage(accountId, kolAdditionalProfile[0]?.citizenIdCardFront.split('/')[4]);
    //             setImageFront(URL.createObjectURL(response.data));
    //             const responseBack = await service.kolAdditionalInfoImage(accountId, kolAdditionalProfile[0]?.citizenIdCardBackside.split('/')[4]);
    //
    //             setImageBack(URL.createObjectURL(responseBack.data));
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    // }, [kolAdditionalProfile]);

    const formik = useFormik({
        initialValues: {
            profileImage: accountProfile?.[0]?.profileImage,
            // images: accountProfile?.[0]?.galleryImages ?? [],
            id: accountProfile?.[0]?.accountId,
            email: emailAccount,
            fullName: accountProfile?.[0]?.fullName,
            description: accountProfile?.[0]?.description,
            careerRequestList: accountProfile?.[0]?.careers.map((careers) => ({
                careerCode: careers.careerCode,
                name: careers.value
            })),
            careerFieldRequests: accountProfile?.[0]?.careerFields.map((careerField) => ({
                careerFieldCode: careerField.careerFieldCode,
                name: careerField.value
            })),

            tiktokUrl: accountProfile?.[0]?.tiktokUrl,
            contactPhone: accountProfile?.[0]?.phoneNumber,
            contactEmail: accountProfile?.[0]?.email,
            // messenger: accountProfile?.[0]?.messenger,
            locationCode: 2,
            kolsInfluencerRequest: {
                birthYear: parseInt(accountProfile?.[0]?.birthYear),
                gender: accountProfile?.[0]?.gender,
                height: accountProfile?.[0]?.height,
                weight: accountProfile?.[0]?.weight,
                isPublicContactEmail: accountProfile?.[0]?.isPublicContactEmail,
                isPublicPhone: accountProfile?.[0]?.isPublicPhone,
                isVerified: true,
                theme: 0
            },
            companyRequest: {},
            // kolsServicePriceRequests: {
            //     kolsPriceCode: accountProfile?.[0]?.careerServices?.kolsPriceCode,
            //     serviceName: accountProfile?.[0]?.careerServices?.serviceName
            // },
            kolsCareerPathRequests: [{}],
            attachmentRequestlist: [],

            // citizenIdCardFront: kolAdditionalProfile[0]?.citizenIdCardFront,
            // citizenIdCardBackside: kolAdditionalProfile[0]?.citizenIdCardBackside,
            bankAccountRequest: !!accountProfile?.[0]?.bankAccountResponse
                ? accountProfile?.[0]?.bankAccountResponse?.map((bankAccountResponse) => ({
                      bankCode: bankAccountResponse.bankCode,
                      accountNumber: bankAccountResponse.accountNumber,
                      accountName: bankAccountResponse.accountName
                  }))
                : [],

            cityCode: accountProfile?.[0]?.cityCode,
            personalServices: services
        },
        onSubmit: async (data, {}) => {
            setIsValidate(true);

            // create list file upload
            const file = [];
            const imageGallery = [];
            data.images?.forEach((item) => {
                if (typeof item == 'string') {
                    imageGallery.push(item);
                    return;
                }

                file.push(item);
            });
            data.imageGallery = imageGallery;

            if (data.tiktokUrl != '') {
                let url = data.tiktokUrl.substring(data.tiktokUrl.indexOf('tiktok.com'));
                url = 'https://www.' + url;
                if (url.includes('?')) {
                    url = url.substring(0, url.indexOf('?'));
                }
                data.tiktokUrl = url;
            }
            if (data.personalServices) {
                //change price to number in personalServices
                const personalServices = data.personalServices.map((item) => {
                    return {
                        serviceName: item.serviceName,
                        price: item.price?.toString().replace(/,/g, ''),
                        description: item.description
                    };
                });
                data.personalServices = personalServices;
            }

            const [res] = await Promise.all([
                service.update(data, file)
                // , serviceAdd.create(data)
            ]);

            const newProfile = res.data.data;
            const resGlobal = await globalService.getDetailKolsProfileUpdate(newProfile?.mask, newProfile?.id);
            localStorage.setItem('accountMask', newProfile?.mask);

            if (resGlobal.data.code === 'success') {
                const contentAccountInformation = resGlobal.data.data;
                const action = addProfile(contentAccountInformation);
                dispatch(action);
            }
            formik.setValues(data);
            if (res?.data?.code != 'success') {
                toast.current.show({
                    severity: 'success',
                    summary: 'Thông báo',
                    detail: 'Cập nhật không thành công ' + res?.data?.message,
                    life: 2000
                });
            } else {
                toast.current.show({
                    severity: 'success',
                    summary: 'Thông báo',
                    detail: 'Cập nhật thành công',
                    life: 2000
                });
                setTimeout(() => window.open(`/components/detail-candidate/?mask=${newProfile?.mask}&id=${newProfile?.id}`, '_blank'), 500);
            }
        },
        validateOnMount: true,
        validate: async (data) => {
            let errors = {};
            if (data.fullName === null || data.fullName === undefined || data.fullName === '') {
                errors.fullName = 'Vui lòng nhập họ và tên';
            }

            const checkFullname = await isForbiddenKeywordExists(data.fullName);
            if (!!data.fullName && checkFullname?.error) {
                errors.fullName = `Vui lòng không nhập ký tự không phù hợp "${checkFullname?.message}"`;
            }
            if (data.profileImage === null || data.profileImage === undefined || data.profileImage === '') {
                errors.profileImage = 'Vui lòng cập nhật ảnh profile';
            }

            if (!!data.profileImage && typeof data.profileImage !== 'string') {
                const validFileTypes = ['image/jpeg', 'image/tiff', 'image/bmp', 'image/png', 'image/webp', 'image/svg+xml'];
                let checkTypeFile = validFileTypes.includes(data.profileImage.type);
                if (Number(data.profileImage.size) > 10485760 || !checkTypeFile) {
                    errors.profileImage = 'Vui lòng chọn ảnh avatar với dung lượng < 10MB và định dạng PNG, JPG, JPEG, BMP, TIFF, WEBP, HEIC, SVG';
                }
            }

            if (data.kolsInfluencerRequest.birthYear == null || data.kolsInfluencerRequest.birthYear == undefined || Number.isNaN(data.kolsInfluencerRequest.birthYear) == true) {
                errors.birthYear = 'Vui lòng nhập năm sinh';
            }
            if (data.kolsInfluencerRequest.gender == null || data.kolsInfluencerRequest.gender == undefined) {
                errors.gender = 'Vui lòng nhập giới tính';
            }

            if (!data.cityCode) {
                errors.cityCode = 'Vui lòng nhập tỉnh thành phố';
            }

            if (data?.description?.length > 240) {
                errors.description = 'Vui lòng không nhập quá giới hạn cho phép';
            }

            const checkDescription = await isForbiddenKeywordExists(data.description);
            if (!!data.description && checkDescription?.error) {
                errors.description = `Vui lòng không nhập ký tự không phù hợp "${checkDescription?.message}"`;
            }

            if (!data.careerFieldRequests || data.careerFieldRequests.length === 0) {
                errors.careerFieldRequests = 'Vui lòng chọn Lĩnh vực';
            }

            if (!data.tiktokUrl) {
                errors.kolsSocialNetworkRequestsTiktok = 'Vui lòng nhập link Tiktok';
            }

            if (data.tiktokUrl?.toLowerCase().indexOf('tiktok.com/@') == -1) {
                errors.kolsSocialNetworkRequestsTiktok = 'Vui lòng nhập đúng link Tiktok';
            }

            if (!data.contactPhone) {
                errors.contactPhone = 'Vui lòng nhập zalo';
            }
            if (data.contactPhone && !validatePhone(data.contactPhone)) {
                errors.contactPhone = 'Điện thoại không đúng định dạng';
            }
            if (!data.contactEmail) {
                errors.contactEmail = 'Vui lòng nhập email';
            }

            if (!data.bankAccountRequest[0]?.bankCode || !data.bankAccountRequest[0]?.accountNumber || !data.bankAccountRequest[0]?.accountName) {
                errors.bankAccountRequest = 'Vui lòng nhập tên ngân hàng';
            }

            if (!data.personalServices || data.personalServices.length === 0) {
                errors.personalServices = 'Vui lòng nhập dịch vụ';
            }

            if (data.personalServices) {
                data.personalServices.forEach((item) => {
                    if (!item.serviceName || !item.price) {
                        errors.personalServices = 'Vui lòng nhập đầy đủ thông tin dịch vụ';
                    }
                    //check if price < 300.000
                    // if (item.price && item.price < 300000) {
                    // errors.personalServices = 'Giá dịch vụ không được nhỏ hơn 300.000';
                    // }
                });
            }

            if (data.personalServices.length) {
                for (let index = 0; index < data.personalServices.length; index++) {
                    const checkPersonalServicesDescription = await isForbiddenKeywordExists(data.personalServices?.[index]?.description);
                    if (!!data.personalServices?.[index]?.description && checkPersonalServicesDescription?.error) {
                        errors.personalServices = `Vui lòng không nhập ký tự không phù hợp "${checkPersonalServicesDescription?.message}"`;
                    }
                }
            }

            if (Object.keys(errors).length > 0 && isValidate) {
                const firstErrorElement = Object.keys(errors)[0];
                let scrollElement = null;
                scrollElement = document.getElementById(firstErrorElement);

                scrollElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                setIsValidate(false);
            }

            return errors;
        }
    });

    const initFormik = () => {
        formik.setValues({
            profileImage: accountProfile?.[0]?.profileImage,
            // images: accountProfile?.[0]?.galleryImages ?? [],
            id: accountProfile?.[0]?.accountId,
            email: emailAccount,
            fullName: accountProfile?.[0]?.fullName,
            description: accountProfile?.[0]?.description,
            careerRequestList: accountProfile?.[0]?.careers.map((careers) => ({
                careerCode: careers.careerCode,
                name: careers.value
            })),
            //get only 3 careerField from accountProfile
            careerFieldRequests: accountProfile?.[0]?.careerFields.slice(0, 3).map((careerField) => ({
                careerFieldCode: careerField.careerFieldCode,
                name: careerField.value
            })),

            tiktokUrl: accountProfile?.[0]?.tiktokUrl,
            contactPhone: accountProfile?.[0]?.phoneNumber,
            contactEmail: accountProfile?.[0]?.email,
            // messenger: accountProfile?.[0]?.messenger,
            locationCode: 2,
            kolsInfluencerRequest: {
                birthYear: parseInt(accountProfile?.[0]?.birthYear),
                gender: accountProfile?.[0]?.gender,
                height: accountProfile?.[0]?.height,
                weight: accountProfile?.[0]?.weight,
                isPublicContactEmail: accountProfile?.[0]?.isPublicContactEmail,
                isPublicPhone: accountProfile?.[0]?.isPublicPhone,
                isVerified: true,
                theme: 0
            },
            companyRequest: {},
            kolsServicePriceRequests: {
                kolsPriceCode: accountProfile?.[0]?.careerServices?.kolsPriceCode,
                serviceName: accountProfile?.[0]?.careerServices?.serviceName
            },
            kolsCareerPathRequests: [{}],
            attachmentRequestlist: [],
            bankAccountRequest: !!accountProfile?.[0]?.bankAccountResponse
                ? accountProfile?.[0]?.bankAccountResponse?.map((bankAccountResponse) => ({
                      bankCode: bankAccountResponse.bankCode,
                      accountNumber: bankAccountResponse.accountNumber,
                      accountName: bankAccountResponse.accountName
                  }))
                : [],

            cityCode: accountProfile?.[0]?.cityCode,
            personalServices: services
        });
    };

    // const [images, setImages] = useState([...(accountProfile?.[0]?.galleryImages ? accountProfile?.[0]?.galleryImages?.map((item) => DEV_URL + item) : [])]);

    // const previewFile = (file) => {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onloadend = () => {
    //         images.push(reader.result);
    //         setImages([...images]);
    //     };
    // };

    const isFormFieldInvalid = (name) => {
        if (name === 'weight' || name === 'height') {
            return formik?.errors[name];
        }
        return !!(formik?.touched[name] && formik?.errors[name]);
    };

    const getFormErrorMessage = (name) => {
        if (isFormFieldInvalid(name)) {
            return <small className="p-error">{formik?.errors[name]}</small>;
        }
        return <small className="p-error">&nbsp;</small>;
    };

    const getServiceErrorMessage = (name) => {
        if (formik?.errors[name]) {
            return <small className="p-error">{formik?.errors[name]}</small>;
        }
        return <small className="p-error">&nbsp;</small>;
    };

    const getFollowerErrorMessage = (name, field) => {
        return <small className="p-error mt-2">{formik.errors[field]}</small>;
    };

    const inputTiktok = () => {
        return (
            <InputText
                id="tiktokUrl"
                name={'tiktokUrl'}
                value={formik.values.tiktokUrl ?? ''}
                onChange={(e) => formik.setValues({ ...formik.values, tiktokUrl: e.target.value })}
                onInput={(e) => formik.setValues({ ...formik.values, tiktokUrl: e.target.value })}
                placeholder="Ex: https://www.example.com"
                className="control-action"
            />
        );
    };

    const inputSocialnetworkFollower = (socialCode) => {
        const index = formik.values.kolsSocialNetworkRequests.findIndex((item) => item.socialNetworkCode == socialCode);
        const socialValues = ['Facebook', 'Tiktok', 'Instagram', 'Youtube'];

        const string = 'kolsSocialNetworkRequests[' + index + '].followers';
        return (
            <InputNumber
                id="followFacebook"
                value={formik.values?.kolsSocialNetworkRequests[index]?.followers ?? ''}
                onChange={(e) => {
                    formik.setFieldValue(string, e?.value);
                }}
                placeholder={`Lượt follower ${socialValues[socialCode - 1]}`}
                min={0}
                onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
            />
        );
    };

    // const changeAvatar = (avatar) => {
    //     setOpenAvatarEditor(true);
    //     avatarEditor(avatar);
    // };

    // const renderActionActivity = (rowData, event) => {
    //     return (
    //         <>
    //             <span className="control-action" onClick={() => onRemoveActivity(rowData, event)}>
    //                 <i className="fa-solid fa-trash-can ic-trash"></i>
    //             </span>
    //         </>
    //     );
    // };

    const onSelect = async (file) => {
        await pathFieldValue('images', file.files);
    };

    const onChooseFiles = () => {
        chooseFileRef.current && chooseFileRef.current.click();
    };

    const headerTemplate = () => {
        return (
            <>
                <div className="header">
                    <div className="keyboard-upload" id="profileImage">
                        <div className="avt h-10rem">
                            <input onChange={(e) => formik.setFieldValue('profileImage', e.currentTarget.files[0])} ref={chooseFileRef} type="file" multiple hidden />
                            {formik.values.profileImage ? (
                                <Avatar image={typeof formik.values.profileImage === 'string' ? `${DEV_URL}${formik.values.profileImage}` : URL.createObjectURL(formik.values.profileImage)} size="xlarge" shape="circle" />
                            ) : (
                                <Avatar className="border-circle" image={`${contextPath}/demo/images/avatar/no-avatar.png`} alt={'img'} size="large" />
                            )}
                            <div className="mark" onClick={onChooseFiles}>
                                <i className="fa-solid fa-camera"></i>
                            </div>
                        </div>
                    </div>
                    <p>{getFormErrorMessage('profileImage')}</p>
                    {/*<h1 className="title mt-3 ">Album ảnh</h1>*/}
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

    // const bannerRef = useRef();
    //
    // const handleDropImages = (e) => {
    //     e.preventDefault();
    //     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    //         const images = Array.from(e.dataTransfer.files).map((file) => {
    //             return file;
    //         });
    //         images.map((file) => previewFile(file));
    //         formik.setFieldValue('images', [...formik.values.images, ...images]);
    //     }
    // };

    const isFormFieldValid = (name) => !!formik.errors[name];

    // const handleRemoveImage = (index) => {
    //     const newImages = [...images];
    //     newImages.splice(index, 1);
    //     setImages([...newImages]);
    //
    //     const newFormikImages = [...formik.values.images];
    //     newFormikImages.splice(index, 1);
    //     formik.setFieldValue('images', [...newFormikImages]);
    // };

    //------------------------------------------- ADD -----------------------------------------------------

    const pathFieldValue = async (fieldName, value, event) => {
        await formik.setFieldValue(fieldName, value ?? undefined);
        event && (await handleChange(event));
    };

    // const renderTemplate1 = (rowData, event) => {
    //     const { rowIndex, field } = event;
    //     const string = 'bankAccountRequest[' + rowIndex + '].bankCode';
    //     return (
    //         <>
    //             <Dropdown
    //                 name='address'
    //                 value={formik.values.bankAccountRequest[rowIndex].bankCode}
    //                 onChange={(e) => {
    //                     formik.setFieldValue(string, parseInt(e.target.value));
    //                 }}
    //                 options={BANKSNAPAS}
    //                 optionLabel='vn_name'
    //                 optionValue='code'
    //                 display='chip'
    //                 placeholder='Vui lòng chọn'
    //                 className='w-full'
    //             />
    //         </>
    //     );
    // };

    const renderTemplate1 = (rowData, event) => {
        const { rowIndex, field } = event;
        const string = 'bankAccountRequest[' + rowIndex + '].bankCode';

        const [searchValue, setSearchValue] = useState('');

        const filteredOptions = BANKSNAPAS.filter((option) => {
            const vn_name = option.vn_name ? option.vn_name.toLowerCase() : '';
            const lowerSearchValue = searchValue ? searchValue.toLowerCase() : '';

            return vn_name.includes(lowerSearchValue);
        });

        return (
            <>
                <Dropdown
                    id="bankAccountRequest"
                    name="address"
                    value={formik.values.bankAccountRequest[rowIndex]?.bankCode}
                    onChange={(e) => {
                        formik.setFieldValue(string, parseInt(e.target.value));
                    }}
                    options={filteredOptions}
                    optionLabel="vn_name"
                    optionValue="code"
                    display="chip"
                    placeholder="Vui lòng chọn"
                    className="w-full"
                    filter
                    filterMatchMode="contains"
                    filterPlaceholder="Tìm kiếm"
                    onFilter={(e) => setSearchValue(e.query)}
                />
            </>
        );
    };

    const renderTemplate2 = (rowData, event) => {
        const { rowIndex, field } = event;
        const string = 'bankAccountRequest[' + rowIndex + '].accountNumber';
        return (
            <>
                <InputText
                    type="text"
                    id="minimumIncome"
                    placeholder="Vui lòng nhập"
                    name="name"
                    value={formik.values.bankAccountRequest[rowIndex]?.accountNumber ?? ''}
                    onChange={(e) => {
                        formik.setFieldValue(string, e.target.value ?? '');
                    }}
                    className={classNames({ 'p-invalid': isFormFieldInvalid('minimumIncome') }, 'w-full')}
                />
            </>
        );
    };

    const renderTemplate3 = (rowData, event) => {
        const { rowIndex, field } = event;
        const string = 'bankAccountRequest[' + rowIndex + '].accountName';
        return (
            <>
                <InputText
                    type="text"
                    id="minimumIncome"
                    placeholder="Vui lòng nhập"
                    name="name"
                    value={formik.values.bankAccountRequest[rowIndex]?.accountName ?? ''}
                    onChange={(e) => {
                        formik.setFieldValue(string, e.target.value.toUpperCase() ?? '');
                    }}
                    className={classNames({ 'p-invalid': isFormFieldInvalid('minimumIncome') }, 'w-full')}
                />
            </>
        );
    };

    // const renderActionService = (rowData, event) => {
    //     return (
    //         <>
    //             <span className="control-action" onClick={() => onRemoveService(rowData, event)}>
    //                 <i className="fa-solid fa-trash-can ic-trash"></i>
    //             </span>
    //         </>
    //     );
    // };

    // const onInsertService = async () => {
    //     const lstServiceDetail = formik.values.bankAccountRequest;
    //     lstServiceDetail.push({
    //         bankCode: '',
    //         accountNumber: '',
    //         accountName: ''
    //     });
    //     await pathFieldValue('bankAccountRequest', lstServiceDetail);
    // };

    // const onRemoveService = async (rowData, event) => {
    //     const lstServiceDetail = formik.values.bankAccountRequest;
    //     const { rowIndex } = event;
    //     rowIndex !== -1 && lstServiceDetail.splice(rowIndex, 1);
    //     await pathFieldValue('bankAccountRequest', lstServiceDetail);
    // };

    // const onPreview = () => {
    // setIsValidate(true);
    // setIsPreview(true);
    // };

    //------------------------------------------- ADD -----------------------------------------------------

    return (
        <Provider store={store}>
            <Toast ref={toast} />
            <>
                <div className="layout-main page-profile">
                    <div>
                        <BreadcrumbCustom path={location} />
                        <br />
                    </div>
                    <div className={'card md:p-5 p-3'}>
                        <div className="main-content">
                            <form id="profile-form" onSubmit={formik.handleSubmit}>
                                <div className="heading-title">
                                    <h1>Thông tin cá nhân</h1>
                                </div>
                                <Divider />
                                <div className="grid">
                                    <div className="col-12 md:col-12">
                                        <div className="control-item">
                                            <label className={classNames({ 'p-error': isFormFieldValid('profileImage') }, 'control-label')} htmlFor="profileImage">
                                                Ảnh đại diện <span className="primary-color">*</span>
                                            </label>
                                            <FileUpload ref={fileUploadRef} name="banner[]" url="/api/upload" multiple accept="image/*" customUpload onSelect={onSelect} headerTemplate={headerTemplate} itemTemplate={itemTemplate} />
                                        </div>
                                    </div>
                                    {/*<div className="col-12">*/}
                                    {/*<div id="profile-images" className="flex gap-2">*/}
                                    {/*{images.map((item, index) => (*/}
                                    {/*<div className="img-profile-container" key={index}>*/}
                                    {/*<button className="border-none mt-2 mr-2 p-2 p-button" type="button" onClick={() => handleRemoveImage(index)}>*/}
                                    {/*<i className="pi pi-times"></i>*/}
                                    {/*</button>*/}
                                    {/*<img src={item} width={300} height={150} />*/}
                                    {/*</div>*/}
                                    {/*))}*/}
                                    {/*</div>*/}
                                    {/*</div>*/}
                                    {/*<div className="col-12 md:col-12" onDragOver={(e) => e.preventDefault()} onDrop={handleDropImages}>*/}
                                    {/*<div className="empty-control-file dotted-spaced" onClick={() => bannerRef.current.click()}>*/}
                                    {/*<h1>*/}
                                    {/*Kéo tệp vào đây hoặc <span>tải lên</span>*/}
                                    {/*</h1>*/}
                                    {/*<p className="sub">Hỗ trợ: PNG, JPG, JPGE,...</p>*/}
                                    {/*</div>*/}
                                    {/*<input*/}
                                    {/*hidden={true}*/}
                                    {/*ref={bannerRef}*/}
                                    {/*type={'file'}*/}
                                    {/*name={'images'}*/}
                                    {/*id={'banners'}*/}
                                    {/*multiple={true}*/}
                                    {/*onChange={(e) => {*/}
                                    {/*const images = Array.from(e.currentTarget.files).map((file) => {*/}
                                    {/*return file;*/}
                                    {/*});*/}
                                    {/*images.map((file) => previewFile(file));*/}
                                    {/*formik.setFieldValue('images', [...formik.values.images, ...images]);*/}
                                    {/*}}*/}
                                    {/*/>*/}
                                    {/*</div>*/}
                                    <div className="col-12 md:col-4">
                                        <div className="control-item">
                                            <label className={classNames({ 'p-error': isFormFieldValid('fullName') }, 'control-label')} htmlFor="fullName">
                                                Họ và tên <span className="primary-color">*</span>
                                            </label>
                                            <InputText
                                                id="fullName"
                                                value={formik.values.fullName ?? ''}
                                                onChange={(e) => formik.setFieldValue('fullName', e.target.value)}
                                                placeholder="Họ tên đầy đủ"
                                                className={classNames({ 'p-invalid': isFormFieldValid('fullName') }, 'w-full')}
                                                maxLength={80}
                                            />
                                        </div>
                                        {getFormErrorMessage('fullName')}
                                    </div>
                                    <div className="col-12 md:col-4">
                                        <div className="control-item">
                                            <label className={classNames({ 'p-error': isFormFieldValid('birthYear') }, 'control-label')} htmlFor="birthYear">
                                                Năm sinh <span className="primary-color">*</span>
                                            </label>
                                            <Dropdown
                                                id="birthYear"
                                                name="birthYear"
                                                value={formik.values.kolsInfluencerRequest.birthYear}
                                                onChange={(e) => formik.setFieldValue('kolsInfluencerRequest.birthYear', e.target.value)}
                                                options={CommonUtils.getRangeBirthYearCustom()}
                                                className={classNames({ 'p-invalid': isFormFieldValid('birthYear') }, 'w-full')}
                                                optionLabel="label"
                                                optionValue="value"
                                                placeholder="Năm sinh"
                                            />
                                        </div>
                                        {getFormErrorMessage('birthYear')}
                                    </div>
                                    <div className="col-12 md:col-4">
                                        <div className="control-item">
                                            <label className={classNames({ 'p-error': isFormFieldValid('gender') }, 'control-label')} htmlFor="gender" id="gender">
                                                Giới tính<span className="primary-color">*</span>
                                            </label>
                                            <div className="radio-group flex gap-2 align-items-end" style={{ lineHeight: '40px' }} id="genderObject.keys(errors)[0]">
                                                <div className="flex align-items-center mr-5 md:mr-0">
                                                    <RadioButton
                                                        inputId="male"
                                                        name="gender"
                                                        value="1"
                                                        onChange={(e) => {
                                                            formik.setFieldValue('kolsInfluencerRequest.gender', e.target.value);
                                                        }}
                                                        checked={formik.values.kolsInfluencerRequest.gender == 1}
                                                    />
                                                    <label className="font-medium ml-3" htmlFor="male">
                                                        Nam
                                                    </label>
                                                </div>
                                                <div className="flex align-items-center">
                                                    <RadioButton
                                                        inputId="female"
                                                        name="gender"
                                                        value="2"
                                                        onChange={(e) => {
                                                            formik.setFieldValue('kolsInfluencerRequest.gender', e.target.value);
                                                        }}
                                                        checked={formik.values.kolsInfluencerRequest.gender == 2}
                                                    />
                                                    <label className="font-medium ml-3" htmlFor="female">
                                                        Nữ
                                                    </label>
                                                </div>
                                            </div>
                                            <p>{getFormErrorMessage('gender')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid">
                                    <div className="col-12 md:col-4">
                                        <div className="control-item">
                                            <label htmlFor="address" id="cityCode" className={classNames({ 'p-error': isFormFieldInvalid('cityCode') }, 'label-profile')}>
                                                Tỉnh/Thành phố
                                            </label>
                                            <Dropdown
                                                inputId="address"
                                                name="address"
                                                value={formik.values.cityCode ?? ''}
                                                onChange={handleCityChange}
                                                options={CITY_ENUM.map((city) => ({ label: city.name, value: city.code }))}
                                                display="chip"
                                                placeholder="Vui lòng chọn"
                                                className="w-full"
                                            />
                                            {getFormErrorMessage('cityCode')}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid">
                                    <div className="col-12">
                                        <div className="control-item">
                                            <label className="control-label justify-content-between " htmlFor="description">
                                                Giới thiệu bản thân
                                                <span className="font-normal">{formik.values.description?.length}/240</span>
                                            </label>
                                            <InputTextarea id="description" value={formik.values.description ?? ''} onChange={formik.handleChange} rows={4} maxLength={240} className={classNames({ 'p-invalid': isFormFieldInvalid('description') })} />
                                            {getFormErrorMessage('description')}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid">
                                    <div className="col-12 md:col-6">
                                        <div className="control-item">
                                            <label className={classNames({ 'control-label': true, 'p-error': isFormFieldInvalid('careerFieldRequests') })} htmlFor="majors">
                                                Lĩnh vực <span className="primary-color">*</span>
                                            </label>
                                            <MultiSelect
                                                id="careerFieldRequests"
                                                value={formik.values.careerFieldRequests}
                                                onChange={(e) => handleOnChangeCareerAndValidateMaxFive(e, toast, formik.setFieldValue)}
                                                options={MAJORS_OPTION}
                                                optionLabel="name"
                                                display="chip"
                                                placeholder="Lĩnh vực"
                                                className="w-full"
                                                showSelectAll={false}
                                            />
                                            {getFormErrorMessage('careerFieldRequests')}
                                        </div>
                                    </div>
                                </div>
                                <div className="heading-title">
                                    <h1>Nền tảng hoạt động</h1>
                                </div>
                                <Divider />

                                <div className="grid" name={'kolsSocialNetworkRequests'}>
                                    <div className="col-12 md:col-10" id="kolsSocialNetworkRequestsTiktok">
                                        <div className="control-item">
                                            <label className="control-label" htmlFor="tiktokLink">
                                                Tiktok
                                            </label>
                                            {inputTiktok()}
                                        </div>
                                        {getFollowerErrorMessage('kolsSocialNetworkRequests', 'kolsSocialNetworkRequestsTiktok')}
                                    </div>
                                </div>

                                <div className="heading-title">
                                    <h1>Thông tin liên hệ</h1>
                                </div>
                                <Divider />
                                <div className="grid">
                                    <div className="col-12 md:col-6">
                                        <div className="grid">
                                            <div className="col-9 md:col-9">
                                                <div className="control-item">
                                                    <label className="control-label" htmlFor="contactPhone">
                                                        Zalo <sup className="primary-color">*</sup>
                                                    </label>
                                                    <InputText
                                                        id="contactPhone"
                                                        value={formik.values.contactPhone ?? ''}
                                                        onChange={(e) => formik.setFieldValue('contactPhone', e.target.value)}
                                                        placeholder="Nhập số điện thoại"
                                                        keyfilter={'num'}
                                                        maxLength={12}
                                                        className={classNames({ 'p-invalid': isFormFieldInvalid('contactPhone') })}
                                                    />
                                                    {getFormErrorMessage('contactPhone')}
                                                </div>
                                            </div>
                                            <div className="col-3 md:col-3">
                                                <div className="control-item">
                                                    <label className="control-label" htmlFor="publicPhoneNumber">
                                                        Công khai
                                                    </label>
                                                    <div className="flex align-items-center radio-group">
                                                        <InputSwitch id="publicPhoneNumber" checked={formik.values.kolsInfluencerRequest.isPublicPhone} onChange={(e) => formik.setFieldValue('kolsInfluencerRequest.isPublicPhone', e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-6">
                                        <div className="grid">
                                            <div className="col-9 md:col-9">
                                                <div className="control-item">
                                                    <label className="control-label" htmlFor="contactEmail">
                                                        Email <sup className="primary-color">*</sup>
                                                    </label>
                                                    <InputText
                                                        id="contactEmail"
                                                        placeholder="Nhập email"
                                                        value={formik.values.contactEmail ?? ''}
                                                        onChange={(e) => formik.setFieldValue('contactEmail', e.target.value)}
                                                        className={classNames({ 'p-invalid': isFormFieldInvalid('contactEmail') })}
                                                    />
                                                    {getFormErrorMessage('contactEmail')}
                                                </div>
                                            </div>
                                            <div className="col-3 md:col-3">
                                                <div className="control-item">
                                                    <label className="control-label" htmlFor="publicEmail">
                                                        Công khai
                                                    </label>
                                                    <div className="flex align-items-center radio-group">
                                                        <InputSwitch
                                                            id="publicEmail"
                                                            checked={formik.values.kolsInfluencerRequest.isPublicContactEmail}
                                                            onChange={(e) => formik.setFieldValue('kolsInfluencerRequest.isPublicContactEmail', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="heading-title">
                                    <h1>
                                        Thông tin thanh toán <span className="primary-color">*</span>
                                    </h1>
                                </div>
                                <Divider />
                                <div className={'my-3'}>
                                    <label className={classNames({ 'p-error': isFormFieldValid('bankAccountRequest') }, 'control-label')} htmlFor="bankAccountRequest">
                                        Hãy điền đầy đủ thông tin thanh toán
                                    </label>
                                </div>
                                <div className={'grid table-bank'}>
                                    <DataTable emptyMessage={'Không có dữ liêụ'} value={formik.values.bankAccountRequest.length === 0 ? [{}] : formik.values.bankAccountRequest} tableStyle={{ width: '100%' }}>
                                        <Column field="serviceId" header="Ngân hàng" body={renderTemplate1}></Column>
                                        <Column field="rangePrice" header="Số tài khoản" body={renderTemplate2}></Column>
                                        <Column field="rangePrice" header="Chủ tài khoản" body={renderTemplate3}></Column>
                                    </DataTable>
                                </div>

                                <div className="heading-title" id="personalServices">
                                    <h1>
                                        Gói dịch vụ <span className="primary-color">*</span>
                                    </h1>
                                    {getFormErrorMessage('personalServices')}
                                </div>
                                <Divider />
                                <div className="box-service-profile">
                                    <div key={0} style={{ minWidth: '700px' }}>
                                        <div className={'grid'}>
                                            <div className="col-1" align="center">
                                                <label htmlFor="STT">STT</label>
                                            </div>

                                            <div className="col-2">
                                                <label htmlFor="serviceName" className={'label-profile'}>
                                                    Tên dịch vụ <span className="primary-color">*</span>
                                                </label>
                                            </div>
                                            <div className="col-2">
                                                <label htmlFor="servicePrice" className={'label-profile'}>
                                                    Giá<span className="primary-color">*</span>
                                                </label>
                                            </div>
                                            <div className="col" style={{ minWidth: '200px' }}>
                                                <label htmlFor="desc" className={'label-profile'}>
                                                    Mô tả
                                                </label>
                                            </div>
                                            <div className="col-1">
                                                <label htmlFor="action" className={'label-profile'}>
                                                    {' '}
                                                </label>
                                            </div>
                                        </div>
                                        {services.map((service, index) => (
                                            <>
                                                <div key={index + 1} className={'grid'}>
                                                    <div className="col-1" align="center">
                                                        <span>{index + 1}</span>
                                                    </div>
                                                    <div className="col-2">
                                                        <Dropdown
                                                            inputId={'serviceName' + index}
                                                            name="serviceName"
                                                            value={service.serviceName}
                                                            onChange={(e) => handleServiceChange(index, 'serviceName', e.target.value)}
                                                            options={SERVICE_ENUM.map((s) => ({ label: s.name, value: s.code }))}
                                                            display="chip"
                                                            placeholder="Vui lòng chọn"
                                                            disabled={index !== services.length - 1}
                                                            className={classNames({ 'p-invalid': isFormFieldInvalid('personalServices') }, 'w-full')}
                                                        />
                                                    </div>
                                                    <div className="col-2">
                                                        <InputText
                                                            id={'servicePrice' + index}
                                                            placeholder="Vui lòng nhập"
                                                            name="servicePrice"
                                                            value={service.price}
                                                            onChange={(e) => handleServiceChange(index, 'price', e.target.value.replace(/\D/g, ''))}
                                                            className={classNames({ 'p-invalid': isFormFieldInvalid('personalServices') }, 'w-full')}
                                                            mode="currency"
                                                            currency="VND"
                                                        />
                                                    </div>
                                                    <div className="col">
                                                        <InputTextarea
                                                            id={'desc' + index}
                                                            className="w-full"
                                                            placeholder="Vui lòng nhập"
                                                            name="desc"
                                                            value={service.description}
                                                            onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                                                            maxLength={150}
                                                        />
                                                    </div>
                                                    <div className="col-1">
                                                        <label htmlFor="action" className={'label-profile'}></label>
                                                        <Button onClick={() => handleDeleteService(index)} className="label-profile">
                                                            <i className="fa-solid fa-trash-can ic-trash"></i>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </>
                                        ))}
                                        <span className="w-100 underline primary-color cursor-pointer" onClick={handleAddService}>
                                            + Thêm dịch vụ
                                        </span>
                                    </div>
                                </div>
                                <div className={'center-item mt-4'}>
                                    <Button className="w-180" type="submit" label="Cập nhật" onClick={(event) => setIsValidate(true)} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        </Provider>
    );
};

export default AccountProfileForm;
