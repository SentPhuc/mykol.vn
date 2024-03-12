import React from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import FabButton from './components/homepage/fab';
import Script from 'next/script';

export default function MyApp({ Component, pageProps }) {
    if (Component.getLayout) {
        const getLayout = Component.getLayout || ((page) => page);
        return (
            <LayoutProvider>
                {getLayout(<Component {...pageProps} />)}
                {!!pageProps && pageProps?.dataSeo?.showChat && (
                    <>
                        <Script
                            dangerouslySetInnerHTML={{
                                __html: `var zigzag_api = {};zigzag_api.verify = "https://zigzag.vn/verify.html";`
                            }}
                        />
                        <Script async data-tahc="6Rrnzx4l4_TtCcQ" src="//zigzag.vn/js/zook.js" />
                    </>
                )}
                <FabButton />
            </LayoutProvider>
        );
    } else {
        return (
            <LayoutProvider>
                <Layout>
                    <Component {...pageProps} />
                    {!!pageProps && pageProps?.dataSeo?.showChat && (
                        <>
                            <Script
                                dangerouslySetInnerHTML={{
                                    __html: `var zigzag_api = {};zigzag_api.verify = "https://zigzag.vn/verify.html";`
                                }}
                            />
                            <Script async data-tahc="6Rrnzx4l4_TtCcQ" src="//zigzag.vn/js/zook.js" />
                        </>
                    )}

                    <FabButton />
                </Layout>
            </LayoutProvider>
        );
    }
}
