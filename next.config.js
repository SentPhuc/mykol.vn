/** @type {import('next').NextConfig} */
const dotenv = require('dotenv');
dotenv.config();

const nextConfig = {
    reactStrictMode: false,
    // trailingSlash: true,
    publicRuntimeConfig: {
        contextPath: '',
        uploadPath: '/api/upload',
        url: process.env.API_URL,
        siteSEO: 'https://mykol.vn',
        path: '/api/kols/',
        pathV2: '/api/v2/kols/'
    },
    env: {
        APP_ENV: process.env.APP_ENV,
        APP_URL: process.env.SITE_URL,
        API_URL: process.env.API_URL,
        MEDIA_URL: process.env.MEDIA_URL
    },
    compiler: {
        removeConsole: process.env.APP_ENV === 'production'
    }
};

module.exports = nextConfig;
