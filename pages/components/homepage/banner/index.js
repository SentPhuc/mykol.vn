import React from 'react';
import getConfig from 'next/config';
import { Button } from 'primereact/button';

const BannerHomePage = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    return (
        <>
            <div className='col-12 banner-homepage'>
                <img className='banner-image' src={`${contextPath}/demo/images/banner/banner.svg`} alt='Logo' />
                <a href={'https://www.facebook.com/influxcompany'} target={'_blank'}>
                    <img className='icon-fb-banner' src={`${contextPath}/demo/images/banner/facebook-icon.svg`} alt='Logo' />
                </a>
            </div>
        </>
    );
};

export default BannerHomePage;