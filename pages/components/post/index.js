import React, { useContext, useEffect, useRef, useState } from 'react';
import getConfig from 'next/config';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { useRouter } from 'next/router';
import moment from 'moment';
import { GlobalService } from '../../../demo/service/GlobalService';
import { DEV_URL } from '../../../src/commons/Utils';

const Blog = () => {
    const service = new GlobalService();
    const [post, setPost] = useState({});
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const { layoutConfig } = useContext(LayoutContext);
    const menuRef = useRef();
    const today = new Date().toLocaleDateString();
    const router = useRouter();

    const rawMarkup = (data) => {
        return { __html: data };
    };

    useEffect(async () => {
        if (!router.isReady) {
            return;
        }
        const data = router.query;
        const res = await service.findByPostShortTitle(data.title);
        // convert data to json
        if (res.data.code === 'success') {
            const content = res.data.data;
            setPost(content);
        } else {
            setPost([]);
        }
    }, [router]);
    
    return (
        <>
            <div className='surface-0 flex justify-content-center'>
                <div id='home' className='landing-wrapper overflow-hidden p-3 md:p-0'>
                    <div
                        id='hero'
                        className='flex flex-column pt-4 px-4 lg:px-8 overflow-hidden w-full'
                        style={{
                            background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #EEEFAF 0%, #C3E3FA 100%)',
                            clipPath: 'ellipse(150% 87% at 93% 13%)'
                        }}>
                        <div className='mx-0 md:mx-8 mt-0 md:mt-4'>
                            <h1 className='md:text-6xl text-xl font-bold text-gray-900 line-height-2'>
                                <span className='font-light block'>Chào mừng mọi người quay lại với </span>InfluX
                            </h1>
                            <p className='font-normal md:text-2xl text-base line-height-3 md:mt-3 mb-3 md:mb-0 text-gray-700'>Blog về nền tảng
                                Review sản phẩm
                            </p>
                        </div>
                        <div className='flex justify-content-center md:justify-content-end'>
                            <img src={`${contextPath}/demo/images/landing/img-01.png`} alt='Kols'
                                 className='w-auto max-w-full' />
                        </div>
                    </div>

                    <div className='detail-post card py-3 px-3 lg:px-8 mt-5 mx-0 lg:mx-8'>
                        <img
                            className='md:col-4 col-12 max-w-full m-auto md:ml-0 flex justify-content-center md:justify-content-end '
                            src={`${DEV_URL}${post.postImage}`}
                            alt={post.postTitle}
                        />
                        <h1 className='col-12 lg:text-4xl md:text-3xl sm:text-2xl text-xl font-bold lg:mt-12 md:mt-8 mt-3'>
                            {post.postTitle}
                        </h1>
                        <div className='text-left mb-2 flex align-items-center md:text-base text-sm md:mx-0'>
                            <svg className='m-1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 122.88 122.89'
                                 width='18px' height='18px'>
                                <title>
                                    date
                                </title>
                                <path
                                    d='M81.61,4.73C81.61,2.12,84.19,0,87.38,0s5.77,2.12,5.77,4.73V25.45c0,2.61-2.58,4.73-5.77,4.73s-5.77-2.12-5.77-4.73V4.73ZM66.11,105.66c-.8,0-.8-10.1,0-10.1H81.9c.8,0,.8,10.1,0,10.1ZM15.85,68.94c-.8,0-.8-10.1,0-10.1H31.64c.8,0,.8,10.1,0,10.1Zm25.13,0c-.8,0-.8-10.1,0-10.1H56.77c.8,0,.8,10.1,0,10.1Zm25.13,0c-.8,0-.8-10.1,0-10.1H81.9c.8,0,.8,10.1,0,10.1Zm25.14-10.1H107c.8,0,.8,10.1,0,10.1H91.25c-.8,0-.8-10.1,0-10.1ZM15.85,87.3c-.8,0-.8-10.1,0-10.1H31.64c.8,0,.8,10.1,0,10.1ZM41,87.3c-.8,0-.8-10.1,0-10.1H56.77c.8,0,.8,10.1,0,10.1Zm25.13,0c-.8,0-.8-10.1,0-10.1H81.9c.8,0,.8,10.1,0,10.1Zm25.14,0c-.8,0-.8-10.1,0-10.1H107c.8,0,.8,10.1,0,10.1Zm-75.4,18.36c-.8,0-.8-10.1,0-10.1H31.64c.8,0,.8,10.1,0,10.1Zm25.13,0c-.8,0-.8-10.1,0-10.1H56.77c.8,0,.8,10.1,0,10.1ZM29.61,4.73C29.61,2.12,32.19,0,35.38,0s5.77,2.12,5.77,4.73V25.45c0,2.61-2.58,4.73-5.77,4.73s-5.77-2.12-5.77-4.73V4.73ZM6.4,43.47H116.47v-22a3,3,0,0,0-.86-2.07,2.92,2.92,0,0,0-2.07-.86H103a3.2,3.2,0,0,1,0-6.4h10.55a9.36,9.36,0,0,1,9.33,9.33v92.09a9.36,9.36,0,0,1-9.33,9.33H9.33A9.36,9.36,0,0,1,0,113.55V21.47a9.36,9.36,0,0,1,9.33-9.33H20.6a3.2,3.2,0,1,1,0,6.4H9.33a3,3,0,0,0-2.07.86,2.92,2.92,0,0,0-.86,2.07v22Zm110.08,6.41H6.4v63.67a3,3,0,0,0,.86,2.07,2.92,2.92,0,0,0,2.07.86H113.55a3,3,0,0,0,2.07-.86,2.92,2.92,0,0,0,.86-2.07V49.88ZM50.43,18.54a3.2,3.2,0,0,1,0-6.4H71.92a3.2,3.2,0,1,1,0,6.4Z'></path>
                            </svg>
                            <span className='text-left text-xl md:text-3xl'>
                                {moment(post.createdTime).format('DD/MM/YYYY')}
                            </span>
                        </div>
                        <div className='post-content-detail-post' dangerouslySetInnerHTML={rawMarkup(post.postContent)}></div>
                    </div>

                    <div id='highlights' className='overflow-hidden py-4 px-4 lg:px-8 mx-0 md:my-6 lg:mx-8'>
                        <div className='grid md:mt-8 pb-2 md:pb-8'>
                            <div
                                className='col-12 p-2 md:p-8'
                                style={{
                                    borderRadius: '20px',
                                    background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #EFE1AF 0%, #C3DCFA 100%)'
                                }}>
                                <div
                                    className='flex flex-column justify-content-center align-items-center text-center px-3 py-3 md:py-0'>
                                    <img src={`${DEV_URL}${post.postImage}`} alt='InfluX' height='30' />
                                    <p className='text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-4'
                                       style={{ maxWidth: '800px' }}>
                                        “Hiện tôi đang support và hỗ trợ những người anh em này khởi nghiệp, dành thời
                                        gian ghé qua, biết đâu bạn tìm đc thứ mình cần: <a style={{wordBreak:'break-all'}} target='blank' href='https://www.facebook.com/influxcompany'>https://www.facebook.com/influxcompany</a>”
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Blog;
