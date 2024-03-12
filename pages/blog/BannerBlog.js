import React from 'react';
import getConfig from 'next/config';

const BannerBlog = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    return (
        <>
            <React.Fragment>
                <div id="highlights" className="overflow-hidden py-4 px-4 lg:px-8 mx-0 md:my-6 lg:mx-8">
                    <div className="grid md:mt-8 pb-2 md:pb-8">
                        <div
                            className="col-12 p-2 md:p-8"
                            style={{
                                borderRadius: '20px',
                                background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #EFE1AF 0%, #C3DCFA 100%)'
                            }}
                        >
                            <div className="flex flex-column justify-content-center align-items-center text-center px-3 py-3 md:py-0">
                                <img src={`${contextPath}/layout/images/logo.jpg`} alt="InfluX" height="30" />
                                <p className="text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-4" style={{ maxWidth: '800px' }}>
                                    “Hiện tôi đang support và hỗ trợ những người anh em này khởi nghiệp, dành thời gian ghé qua, biết đâu bạn tìm đc thứ mình cần:{' '}
                                    <a style={{ wordBreak: 'break-all' }} target="blank" href="https://www.facebook.com/influxcompany">
                                        https://www.facebook.com/influxcompany
                                    </a>
                                    ”
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        </>
    );
};

export default BannerBlog;
