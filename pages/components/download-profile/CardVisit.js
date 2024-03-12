import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import ImagesCandidate from '../detail-candidate/ImagesCandidate';
import getConfig from 'next/config';
import { GENDER_ENUM } from '../../../src/commons/Utils';
import { GlobalService } from '../../../demo/service/GlobalService';
import jsPDF from 'jspdf';
import moment from 'moment/moment';
import html2canvas from 'html2canvas';

const CardVisit = () => {
    const [theme, setTheme] = useState('white-theme-kol');
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [initData, setInitData] = useState({});
    const service = new GlobalService();
    const pdfRef = useRef(null);
    const getGenderValue = (key) => {
        const gender = GENDER_ENUM.find(g => g.code === key);
        return gender ? gender.name : '';
    };
    const today = new Date().toLocaleDateString();

    const onSocialNetworkHandler = (item) => {
        const socialNetwork = {
            Youtube: onYoutubeHandler,
            Tiktok: onTiktokHandler,
            Instagram: onInstagramHandler,
            Facebook: onFacebookHandler
        };
        return socialNetwork?.[item.socialNetworkName]?.(item);
    };

    const numberWithDot = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const onTiktokHandler = (e) => {
        return (
            <div class='col col-candidate-tiktok'>
                <div class='col-inner'>
                    <a href='https://www.tiktok.com/@leconghoan0803'>
                        <div
                            class='icon-box featured-box icon-box-left text-left'>
                            <div class='icon-box-img'>
                                <div class='icon'>
                                    <div class='icon-inner'>
                                        <img width='48' height='48'
                                             src='https://kol.vivuxe.com/wp-content/themes/flatsome-child/images/icon-social/icon-tiktok.svg' />
                                    </div>
                                </div>
                            </div>
                            <div class='icon-box-text last-reset'>
                                <p>{e.socialNetworkName}</p>
                                <p>{numberWithDot(e.followers)}</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        );
    };
    const onInstagramHandler = (e) => {
        return (
            <div class='col col-candidate-instagram'>
                <div class='col-inner'>
                    <a href='https://www.instagram.com/_goro.lchoan/'>
                        <div
                            class='icon-box featured-box icon-box-left text-left'>
                            <div class='icon-box-img'>
                                <div class='icon'>
                                    <div class='icon-inner'>
                                        <img width='48' height='48'
                                             src='https://kol.vivuxe.com/wp-content/themes/flatsome-child/images/icon-social/icon-instagram.svg' />
                                    </div>
                                </div>
                            </div>
                            <div class='icon-box-text last-reset'>
                                <p>{e.socialNetworkName}</p>
                                <p>{numberWithDot(e.followers)}</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        );
    };
    const onYoutubeHandler = (e) => {
        return (
            <div class='col col-candidate-youtube'>
                <div class='col-inner'>
                    <a href='https://www.facebook.com/nguoi.phan.boiiii'>
                        <div
                            class='icon-box featured-box icon-box-left text-left'>
                            <div class='icon-box-img'>
                                <div class='icon'>
                                    <div class='icon-inner'>
                                        <img width='48' height='48'
                                             src='https://kol.vivuxe.com/wp-content/themes/flatsome-child/images/icon-social/icon-youtube.svg' />
                                    </div>
                                </div>
                            </div>
                            <div class='icon-box-text last-reset'>
                                <p>{e.socialNetworkName}</p>
                                <p>{numberWithDot(e.followers)}</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        );
    };
    const onFacebookHandler = (e) => {
        return (
            <div class='col col-candidate-facebook'>
                <div class='col-inner'>
                    <a href='https://www.facebook.com/nguoi.phan.boiiii'>
                        <div
                            class='icon-box featured-box icon-box-left text-left'>
                            <div class='icon-box-img'>
                                <div class='icon'>
                                    <div class='icon-inner'>
                                        <img width='48' height='48'
                                             src='https://kol.vivuxe.com/wp-content/themes/flatsome-child/images/icon-social/icon-facebook.svg' />
                                    </div>
                                </div>
                            </div>
                            <div class='icon-box-text last-reset'>
                                <p>{e.socialNetworkName}</p>
                                <p>{numberWithDot(e.followers)}</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        );
    };

    useEffect(async () => {
        try {
            const res = await service.getDetailKols('le-bong', 1);
            if (res.data.code === 'success') {
                const content = res.data?.data;
                setInitData(content);
            } else {
                setInitData([]);
            }
        } catch (e) {
            console.log(e);
        }
    }, []);

    const handleDownload = (data) => {
        const input = pdfRef.current;
        const doc = new jsPDF({
            format: 'a4',
            unit: 'px',
        });

        // Adding the fonts.
        doc.setFont('Inter-Regular', 'normal');

        html2canvas(input, { useCORS: true })
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = doc.internal.pageSize.getWidth();
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                doc.addImage(imgData, 'PNG', 10, 10, imgWidth , imgHeight);
                doc.save(`${data.mask}`);
            });


    };

    return (
        <>
            <React.Fragment>
                    <div ref={pdfRef} >
                        <div className={`download-pdf layout-main page-profile ${theme}`} >
                            <div className={' card-visit'}>
                                <div className='main-content'>
                                    <div className='grid w-full candidate-summary'>
                                        <div className='col-4 image-cover'>
                                            <img src={`${contextPath}/demo/images/candidate/image2.svg`} alt='Kols'
                                                 className='wfa'
                                            />
                                        </div>
                                        <div className='col-8'>
                                            <span className='kol-name mb-8'>{initData.fullName}</span>
                                            <div className='grid flex candidate-social'>
                                                {
                                                    initData.socialNetworks?.map((e) => (
                                                        onSocialNetworkHandler(e)
                                                    ))
                                                }
                                            </div>
                                            <h2 className='font-bold mb-5'>Thông tin cá nhân</h2>
                                            <div className='grid'>
                                                <div className='col-12'>
                                                    <div className='candidate-information mb-4'>
                                                        <div className='card candidate-information-basic'>
                                                            <div className='grid'>
                                                                <div className='col-4'>
                                                                    <p>Giới tính</p>
                                                                    <p>{getGenderValue(initData.gender)}</p>
                                                                </div>
                                                                <div className='col-4'>
                                                                    <p>Số điện thoại</p>
                                                                    <p>{initData.phoneNumber}</p>
                                                                </div>
                                                                <div className='col-4'>
                                                                    <p>Cân nặng</p>
                                                                    <p>{initData.weight} kg</p>
                                                                </div>
                                                                <div className='col-4'>
                                                                    <p>Tuổi</p>
                                                                    <p>{initData.age}</p>
                                                                </div>
                                                                <div className='col-4'>
                                                                    <p>Email</p>
                                                                    <p style={{ wordBreak: 'break-all' }}>{initData.email}</p>
                                                                </div>
                                                                <div className='col-4'>
                                                                    <p>Chiều cao</p>
                                                                    <p>{initData.height} cm</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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

export default CardVisit;