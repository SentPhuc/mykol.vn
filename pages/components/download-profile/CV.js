import React, {useContext, useEffect, useRef, useState} from 'react';
import getConfig from "next/config";
import {useRouter} from "next/router";
import {GlobalService} from "../../../demo/service/GlobalService";
import {DEV_URL, GENDER_ENUM} from "../../../src/commons/Utils";
import {Button} from "primereact/button";
import {Chip} from "primereact/chip";
import ImagesCandidate from "../detail-candidate/ImagesCandidate";
import {AccountService} from "../../../demo/service/AccountService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CV = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const accountService = new AccountService();
    const location = useRouter().pathname;
    const router = useRouter();
    const [initData, setInitData] = useState({});
    const service = new GlobalService();
    const [infoLink, setInfoLink] = useState('');
    const pdfRef = useRef(null);

    useEffect(async () => {
        const resAccount = await accountService.findByEmail(window.localStorage.getItem("email"));
        if (resAccount?.data?.code === 'success') {
            try {
                const contentAccount = resAccount.data.data;
                const res = await service.getDetailKols(contentAccount.mask, contentAccount.id);
                if (res.data.code === 'success') {
                    const content = res.data?.data;
                    setInitData(content);
                    setInfoLink(!!document.URL && document.URL);
                } else {
                    setInitData([]);
                }

            } catch (e) {
                console.log(e);
            }
        }
    }, []);

    const [theme, setTheme] = useState('white-theme-kol');


    const handleDownload = (data) => {
        const input = pdfRef.current;
        const doc = new jsPDF({
            format: 'a4',
            unit: 'px',
        });
        // Adding the fonts.
        doc.setFont('Inter-Regular', 'normal');
        html2canvas(input, {useCORS: true})
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = doc.internal.pageSize.getWidth();
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
                doc.save(`${data.mask}`);
            });


    };

    const onSocialNetworkHandler = (item) => {
        const socialNetwork = {
            Youtube: onYoutubeHandler,
            Tiktok: onTiktokHandler,
            Instagram: onInstagramHandler,
            Facebook: onFacebookHandler
        };
        return socialNetwork?.[item.socialNetworkName]?.(item);
    };
    const onTiktokHandler = (e) => {
        return (
            <div className="col col-candidate-tiktok">
                <div className="col-inner">
                    <a href="https://www.tiktok.com/@leconghoan0803">
                        <div
                            className="icon-box featured-box icon-box-left text-left">
                            <div className="icon-box-img">
                                <div className="icon">
                                    <div className="icon-inner">
                                        <img width="48" height="48"
                                             src="https://kol.vivuxe.com/wp-content/themes/flatsome-child/images/icon-social/icon-tiktok.svg"/>
                                    </div>
                                </div>
                            </div>
                            <div className="icon-box-text last-reset">
                                <p>{e.socialNetworkName}</p>
                                <p>{e.followers?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        );
    };
    const onInstagramHandler = (e) => {
        return (
            <div className="col col-candidate-instagram">
                <div className="col-inner">
                    <a href="https://www.instagram.com/_goro.lchoan/">
                        <div
                            className="icon-box featured-box icon-box-left text-left">
                            <div className="icon-box-img">
                                <div className="icon">
                                    <div className="icon-inner">
                                        <img width="48" height="48"
                                             src="https://kol.vivuxe.com/wp-content/themes/flatsome-child/images/icon-social/icon-instagram.svg"/>
                                    </div>
                                </div>
                            </div>
                            <div className="icon-box-text last-reset">
                                <p>{e.socialNetworkName}</p>
                                <p>{e.followers?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        );
    };
    const onYoutubeHandler = (e) => {
        return (
            <div className="col col-candidate-youtube">
                <div className="col-inner">
                    <a href="https://www.facebook.com/nguoi.phan.boiiii">
                        <div
                            className="icon-box featured-box icon-box-left text-left">
                            <div className="icon-box-img">
                                <div className="icon">
                                    <div className="icon-inner">
                                        <img width="48" height="48"
                                             src="https://kol.vivuxe.com/wp-content/themes/flatsome-child/images/icon-social/icon-youtube.svg"/>
                                    </div>
                                </div>
                            </div>
                            <div className="icon-box-text last-reset">
                                <p>{e.socialNetworkName}</p>
                                <p>{e.followers?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        );
    };
    const onFacebookHandler = (e) => {
        return (
            <div className="col col-candidate-facebook">
                <div className="col-inner">
                    <a href="https://www.facebook.com/nguoi.phan.boiiii">
                        <div
                            className="icon-box featured-box icon-box-left text-left">
                            <div className="icon-box-img">
                                <div className="icon">
                                    <div className="icon-inner">
                                        <img width="48" height="48"
                                             src="https://kol.vivuxe.com/wp-content/themes/flatsome-child/images/icon-social/icon-facebook.svg"/>
                                    </div>
                                </div>
                            </div>
                            <div className="icon-box-text last-reset">
                                <p>{e.socialNetworkName}</p>
                                <p>{e.followers?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        );
    };

    const getGenderValue = (key) => {
        const gender = GENDER_ENUM.find(g => g.code === key);
        return gender ? gender.name : '';
    };

    return (
        <>
            <React.Fragment>
                <div className={`layout-main page-profile ${theme}`}>
                    <div className={'card gradient-bg'}>
                        <div className="main-content">
                            <div ref={pdfRef}>
                                <div className="grid w-10 candidate-summary">
                                    <div className="col-3 image-cover">
                                        {initData.profileImage != null ?
                                            <img src={DEV_URL + initData.profileImage} alt="Kols"
                                                 className="wfa"
                                            />
                                            :
                                            <img src={`${contextPath}/demo/images/avatar/no-avatar.png`}
                                                 className="my-3 mx-0 avt-img wfa"
                                                 alt={'img'}
                                            />
                                        }

                                    </div>
                                    <div className="col-8 col-offset-1">
                                        <span className="kol-name mb-8">{initData.fullName}</span>
                                        <div className="grid flex candidate-social">
                                            {
                                                initData.socialNetworks?.map((e) => (
                                                    onSocialNetworkHandler(e)
                                                ))
                                            }
                                        </div>
                                        <div className="pl-2 mt-3" style={{borderLeft: '2px solid #FF7581'}}>
                                            {initData.description}
                                        </div>
                                        <div className="mt-4">
                                            {
                                                initData.careerFields?.map((e) => (
                                                    <Chip className="text-base mr-2" label={e.value}/>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                                <ImagesCandidate images={initData.galleryImages}/>
                                <div className="w-9 card my-0 mx-auto kol-detail-infor-card">
                                    <div className="grid">
                                        <div className="col-12">
                                            <div className="candidate-information mb-4">
                                                <h2 className="font-bold mb-5">Thông tin cá nhân</h2>
                                                <div className="card candidate-information-basic">
                                                    <div className="grid">
                                                        <div className='col-12 sm:col-6 md:col-4'>
                                                            <p>Giới tính</p>
                                                            <p>{getGenderValue(initData.gender)}</p>
                                                        </div>
                                                        <div className='col-12 sm:col-6 md:col-4'>
                                                            <p>Số điện thoại</p>
                                                            <p>{initData.phoneNumber}</p>
                                                        </div>
                                                        <div className='col-12 sm:col-6 md:col-4'>
                                                            <p>Cân nặng</p>
                                                            <p>{initData.weight} kg</p>
                                                        </div>
                                                        <div className='col-12 sm:col-6 md:col-4'>
                                                            <p>Tuổi</p>
                                                            <p>{initData.age}</p>
                                                        </div>
                                                        <div className='col-12 sm:col-6 md:col-4'>
                                                            <p>Email</p>
                                                            <p style={{ wordBreak: 'break-all' }}>{initData.email}</p>
                                                        </div>
                                                        <div className='col-12 sm:col-6 md:col-4'>
                                                            <p>Chiều cao</p>
                                                            <p>{initData.height} cm</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid">
                                                <div className="col-6 candidate-field">
                                                    <h2 className="font-bold mb-5">Lĩnh Vực</h2>
                                                    {
                                                        initData?.careerFields?.map((e) => (
                                                            <Chip label={e?.value}/>
                                                        ))
                                                    }
                                                </div>
                                            </div>

                                            {initData?.careerServices != null &&
                                                <div className="candidate-price-service">
                                                    <h2 className="font-bold mt-4">Bảng giá dịch vụ</h2>
                                                    <ul className="list-candidate-price-service-content">
                                                        <li>
                                                            <p>{initData?.careerServices?.serviceName}</p>
                                                            <p>{initData?.careerServices?.servicePrice}</p>
                                                        </li>
                                                    </ul>
                                                </div>
                                            }
                                        </div>
                                        {/*<div className="col-4 col-offset-1">*/}
                                        {/*    <div className="box-campaign px-8 py-4 my-4">*/}
                                        {/*        <h3 className="text-center">Đã tham gia</h3>*/}
                                        {/*        <div className="box-campain-content">*/}
                                        {/*            <div className="box-campain-content-inner">*/}
                                        {/*                <p>*/}
                                        {/*                    35*/}
                                        {/*                </p>*/}
                                        {/*                <p>*/}
                                        {/*                    Chiến dịch*/}
                                        {/*                </p>*/}
                                        {/*            </div>*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='center-item mt-4'>
                    <Button icon='pi pi-download' label='Tải xuống'
                            className='p-button'
                            onClick={() => handleDownload(initData)}>
                    </Button>
                </div>
            </React.Fragment>
        </>
    );
};

export default CV;
