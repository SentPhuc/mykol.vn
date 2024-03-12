import React, { useEffect, useRef, useState } from 'react';
import CompanyInformation from './CompanyInformation';
import ContactInformation from './ContactInfomation';
import Introduction from './Introduction';
import { Button } from 'primereact/button';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { AccountService } from '../../../demo/service/AccountService';
import { Toast } from 'primereact/toast';
import { DEV_URL, isValidTaxCode, validateEmail, validatePhone, validateWebsite } from '../../../src/commons/Utils';
import { addCompanyProfile } from '../../../public/reduxConfig/companyProfileSlice';
import { GlobalService } from '../../../demo/service/GlobalService';
import AppLayout from '../../../layout/AppLayout';
import { addProfile } from 'public/reduxConfig/kolsProfileSlice';
import { KolAdditionalInfoService } from 'demo/service/KolAdditionalInfoService';
import { addKolAdditionalProfileProfile } from 'public/reduxConfig/kolInformationSlice';
import isForbiddenKeywordExists from 'src/commons/isForbiddenKeywordExists';

const CompanyProfile = (props) => {
    const location = useRouter().pathname;
    const companyProfile = useSelector((state) => state.companyProfile);
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
    const service = new AccountService();
    const kolAdditionInfoService = new KolAdditionalInfoService();
    const emailAccount = typeof window !== 'undefined' ? localStorage.getItem('email') : null;
    const [profileImage, setProfileImage] = useState('');
    const [accountMask, setAccountMask] = useState('');
    const [accountId, setAccountId] = useState('');
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

    const toast = useRef(null);
    const dispatch = useDispatch();
    const globalService = new GlobalService();

    const formik = useFormik({
        initialValues: {
            profileImage: companyProfile[0]?.profileImage ?? '',
            images: companyProfile[0]?.galleryImages ?? [],
            id: companyProfile[0]?.accountId ?? '',
            email: emailAccount,
            fullName: companyProfile[0]?.companyName ?? '',
            description: companyProfile[0]?.description ?? '',
            careerRequestList: [{}],
            careerFieldRequests: [{}],
            kolsSocialNetworkRequests: [{}],
            contactPhone: companyProfile[0]?.contactPhone ?? '',
            contactEmail: companyProfile[0]?.contactEmail ?? '',
            locationCode: 2,
            kolsInfluencerRequest: {},
            companyRequest: {
                personnelSizeId: parseInt(companyProfile[0]?.personnelSizeCode) ?? '',
                accountId: companyProfile[0]?.accountId ?? '',
                taxCode: companyProfile[0]?.taxCode ?? '',
                website: companyProfile[0]?.website ?? '',
                specificAddress: companyProfile[0]?.specificAddress ?? '',
                name: '',
                contactName: companyProfile[0]?.contactName ?? '',
                accountPhone: '',
                contactPhone: '',
                contactEmail: '',
                description: ''
            },
            kolsServicePriceRequests: {},
            kolsCareerPathRequests: [{}],
            attachmentRequestlist: []
        },
        validate: async (data) => {
            let errors = {};

            if (!data.fullName) {
                errors.fullName = 'Tên công ty không được để trống';
            }

            const checkName = await isForbiddenKeywordExists(data.fullName);
            if (!!data.fullName && checkName?.error) {
                errors.fullName = `Vui lòng không nhập ký tự không phù hợp "${checkName?.message}"`;
            }

            if (!data.companyRequest?.specificAddress) {
                errors.specificAddress = 'Địa chỉ cụ thể không được để trống';
            }
            if (!data.companyRequest?.specificAddress) {
                errors.specificAddress = 'Địa chỉ cụ thể không được để trống';
            } else if (data.companyRequest.specificAddress.trim().length === 0) {
                errors.specificAddress = 'Địa chỉ cụ thể không được để trống';
            } else if (data.companyRequest.specificAddress.trim().length > 1000) {
                errors.specificAddress = 'Địa chỉ cụ thể không được quá 1000 ký tự';
            }

            const checkCompanyRequest = await isForbiddenKeywordExists(data.companyRequest?.specificAddress);
            if (!!data.companyRequest?.specificAddress && checkCompanyRequest?.error) {
                errors.specificAddress = `Vui lòng không nhập ký tự không phù hợp "${checkCompanyRequest?.message}"`;
            }
            if (data.companyRequest.website && !validateWebsite(data.companyRequest.website)) {
                errors.website = 'Link website không đúng định dạng';
            }
            if (data.companyRequest.website.length > 80) {
                errors.website = 'Link website không được quá 80 kí tự';
            }
            if (!data.contactPhone) {
                errors.contactPhone = 'Điện thoại không được để trống';
            }
            if (data.contactPhone && !validatePhone(data.contactPhone)) {
                errors.contactPhone = 'Điện thoại không đúng định dạng';
            }
            if (data.contactEmail && !validateEmail(data.contactEmail)) {
                errors.contactEmail = 'Email không đúng định dạng';
            }
            if (!data.contactEmail) {
                errors.contactEmail = 'Email không được để trống';
            }
            if (data.contactEmail && !validateEmail(data.contactEmail)) {
                errors.contactEmail = 'Email không đúng định dạng';
            }
            if (!data.companyRequest?.contactName) {
                errors.contactName = 'Họ và tên không được để trống';
            }

            if (!data.description) {
                errors.description = 'Giới thiệu không được để trống';
            }
            if (data.description?.length < 70) {
                errors.description = 'Phải nhập ít nhất 70 ký tự';
            }

            const checkDescription = await isForbiddenKeywordExists(data.description);
            if (!!data.description && checkDescription?.error) {
                errors.description = `Vui lòng không nhập ký tự không phù hợp "${checkDescription?.message}"`;
            }
            if (data.profileImage === null || data.profileImage === undefined || data.profileImage === '') {
                errors.profileImage = 'Vui lòng cập nhật ảnh profile';
            }
            if (!!data.profileImage && typeof data.profileImage !== 'string') {
                let checkTypeFile = data.profileImage.type == 'image/jpeg' || data.profileImage.type == 'image/tiff' || data.profileImage.type == 'image/bmp' || data.profileImage.type == 'image/png' || data.profileImage.type == 'image/webp';
                if (Number(data.profileImage.size) > 10485760 || !checkTypeFile) {
                    errors.profileImage = 'Vui lòng chọn ảnh avatar với dung lượng < 10MB và định dạng PNG, JPG, JPEG, BMP, TIFF, WEBP, HEIC, SVG';
                }
            }

            return errors;
        },
        onSubmit: async (data, {}) => {
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
            const res = await service.update(data, file);
            if (res.data.type === 'SUCCESS') {
                const resCompanyGlobal = await globalService.findCompanyInformationByAccountId(companyProfile[0]?.accountId);
                if (resCompanyGlobal.data.code === 'success') {
                    const contentCompanyInformation = resCompanyGlobal.data.data;
                    const action = addCompanyProfile(contentCompanyInformation);
                    dispatch(action);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Thông báo',
                        detail: 'Cập nhật thành công',
                        life: 2000
                    });
                }
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Thông báo',
                    detail: res.data?.message != null ? res.data?.message : 'Có lỗi xảy ra khi update thông tin',
                    life: 2000
                });
            }
        }
    });

    const [images, setImages] = useState([...(companyProfile?.[0]?.galleryImages ? companyProfile?.[0]?.galleryImages?.map((item) => DEV_URL + item) : [])]);

    useEffect(() => {
        let contactName = companyProfile[0]?.contactName ?? '';
        if (contactName === '') {
            contactName = companyProfile[0]?.companyName ?? '';
        }

        formik.setValues({
            profileImage: companyProfile[0]?.profileImage ?? '',
            images: companyProfile[0]?.galleryImages ?? [],
            id: companyProfile[0]?.accountId ?? '',
            email: emailAccount,
            fullName: companyProfile[0]?.companyName ?? '',
            description: companyProfile[0]?.description ?? '',
            careerRequestList: [{}],
            careerFieldRequests: [{}],
            kolsSocialNetworkRequests: [{}],
            contactPhone: companyProfile[0]?.contactPhone ?? '',
            contactEmail: companyProfile[0]?.contactEmail ?? '',
            locationCode: 2,
            kolsInfluencerRequest: {},
            companyRequest: {
                personnelSizeId: parseInt(companyProfile[0]?.personnelSizeCode) ?? '',
                accountId: companyProfile[0]?.accountId ?? '',
                taxCode: companyProfile[0]?.taxCode ?? '',
                website: companyProfile[0]?.website ?? '',
                specificAddress: companyProfile[0]?.specificAddress ?? '',
                name: '',
                contactName: contactName,
                accountPhone: '',
                contactPhone: '',
                contactEmail: '',
                description: ''
            },
            kolsServicePriceRequests: {},
            kolsCareerPathRequests: [{}],
            attachmentRequestlist: []
        });

        formik.setTouched({
            contactPhone: !!companyProfile[0]?.contactPhone,
            contactEmail: !!companyProfile[0]?.contactEmail,
            fullName: !!companyProfile[0]?.companyName,
            description: !!companyProfile[0]?.description
        });
        setImages([...(companyProfile?.[0]?.galleryImages ? companyProfile?.[0]?.galleryImages?.map((item) => DEV_URL + item) : [])]);
    }, [companyProfile]);

    const fetchData = async (data) => {
        const resAccount = await service.findByEmail(data);
        // convert data to json\
        if (resAccount?.data?.code === 'success') {
            const content = resAccount.data.data;
            setProfileImage(content.profileImage);
            setAccountMask(content.mask);
            setAccountId(content.id);
            const resGlobal = await globalService.getDetailKolsProfileUpdate(content.mask, content.id);
            const resCompanyGlobal = await globalService.findCompanyInformationByAccountId(content.id);
            if (resGlobal.data.code === 'success') {
                const contentAccountInformation = resGlobal.data.data;
                const action = addProfile(contentAccountInformation);
                dispatch(action);
            }
            if (resCompanyGlobal.data.code === 'success') {
                const contentCompanyInformation = resCompanyGlobal.data.data;
                const action = addCompanyProfile(contentCompanyInformation);
                dispatch(action);
            }
            if (role == 'KOLIFL') {
                const resKolAdditionalInfo = await kolAdditionInfoService.kolAdditionalInfo(content.id);
                if (resKolAdditionalInfo.data.code === 'success') {
                    const contentKolAdditionalInfo = resKolAdditionalInfo.data.data;
                    const action = addKolAdditionalProfileProfile(contentKolAdditionalInfo);
                    dispatch(action);
                }
            }
        }
    };

    useEffect(async () => {
        const storedToken = localStorage?.getItem('accessToken');
        if (!!isLoggedIn || !!storedToken) {
            await fetchData(localStorage?.getItem('email'));
        }
    }, [isLoggedIn]);

    return AppLayout(
        <>
            <React.Fragment>
                <Toast ref={toast} />
                <form onSubmit={formik.handleSubmit}>
                    <div className="card">
                        <BreadcrumbCustom path={location} />
                        <br />
                        <CompanyInformation formik={formik} />
                        <ContactInformation formik={formik} />
                        <Introduction formik={formik} images={images} setImages={setImages} />
                        <div className={'center-item'}>
                            <Button type="submit" label="Cập nhật" className={'w-20rem'} />
                        </div>
                    </div>
                </form>
            </React.Fragment>
        </>
    );
};

export default CompanyProfile;
