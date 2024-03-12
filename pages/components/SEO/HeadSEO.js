import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
const HeadSEO = ({ dataSeo }) => {
    const route = useRouter();
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const fullLink = getConfig().publicRuntimeConfig?.siteSEO + route?.asPath;
    const checkEnv = process.env.APP_ENV !== 'production';
    return (
        <Head>
            <meta name="robots" content={checkEnv ? 'noindex, nofollow' : 'index, follow'} />
            <title>{dataSeo?.title ?? 'MyKOL - Tìm Kiếm, Booking KOC, KOL, Influencer'}</title>
            <meta charSet="UTF-8" />
            <meta name="description" content={dataSeo?.description ?? 'Booking KOC, KOL, Influencer, Reviewer trên Tiktok, Facebook, Youtube'} />
            <meta property="og:title" content={dataSeo?.title ?? 'MyKOL - Tìm Kiếm, Booking KOC, KOL, Influencer'} />
            <meta property="og:description" content={dataSeo?.description ?? 'Booking KOC, KOL, Influencer, Reviewer trên Tiktok, Facebook, Youtube'} />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta property="og:image" href={dataSeo?.image ?? `${contextPath}/layout/images/logo.jpg`} />
            <meta property="og:image:alt" content={dataSeo?.title ?? 'MyKOL - Tìm Kiếm, Booking KOC, KOL, Influencer'} />
            <meta name="viewport" content="initial-scale=1, width=device-width" />
            <meta name="copyright" content="MyKOL - Tìm Kiếm, Booking KOC, KOL, Influencer" />
            <meta name="author" content="MyKOL - Tìm Kiếm, Booking KOC, KOL, Influencer" />
            <meta name="GENERATOR" content="MyKOL - Tìm Kiếm, Booking KOC, KOL, Influencer" />
            <meta httpEquiv="audience" content="General" />
            <meta name="resource-type" content="Document" />
            <meta name="distribution" content="Global" />
            <meta name="revisit-after" content="1 days" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
            <meta httpEquiv="content-language" content="vi" />
            <meta name="theme-color" content="#FD4C5C" />
            /* Facebook */
            <meta property="og:url" content={!!fullLink ? fullLink : undefined} />
            <meta property="og:site_name" content="mykol.vn" />
            <meta property="og:type" content={dataSeo?.ogType ?? 'website'} />
            <meta property="og:locale" content="vi_VN" />
            {/* <meta property="fb:app_id" content="1234567890" /> */}
            /* twitter */
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={dataSeo?.title ?? 'MyKOL - Tìm Kiếm, Booking KOC, KOL, Influencer'} />
            <meta name="twitter:description" content={dataSeo?.description ?? 'Booking KOC, KOL, Influencer, Reviewer trên Tiktok, Facebook, Youtube'} />
            <meta name="twitter:site" content="@mykol.vn" />
            <meta name="twitter:creator" content="@Mykol" />
            <meta name="twitter:image" content={dataSeo?.image ?? `${contextPath}/layout/images/logo.jpg`} />
            /* Schema.org markup for Google+ */
            <meta itemProp="name" content={dataSeo?.title ?? 'MyKOL - Tìm Kiếm, Booking KOC, KOL, Influencer'} />
            <meta itemProp="description" content={dataSeo?.description ?? 'Booking KOC, KOL, Influencer, Reviewer trên Tiktok, Facebook, Youtube'} />
            <meta itemProp="image" content={dataSeo?.image ?? `${contextPath}/layout/images/logo.jpg`} />
            <link rel="canonical" href={!!fullLink ? fullLink : undefined} />
            <link href={`${contextPath}/favicon.png`} rel="shortcut icon" type="image/x-icon" />
            <link href={`${contextPath}/favicon.png`} rel="apple-touch-icon" />
            <link href={`${contextPath}/favicon.png`} rel="apple-touch-icon-precomposed" />
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-G8JK3LZZ0F"></script>
            <script
                dangerouslySetInnerHTML={{
                    __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date()); gtag('config', 'G-G8JK3LZZ0F');`
                }}
            />
            {/* {dataSeo?.showChat && (
                <>
                    <script
                        type="text/javascript"
                        dangerouslySetInnerHTML={{
                            __html: `var zigzag_api = {};zigzag_api.verify = "https://zigzag.vn/verify.html";`
                        }}
                    />
                    <script defer data-tahc="6Rrnzx4l4_TtCcQ" src="//zigzag.vn/js/zook.js" type="text/javascript"></script>
                </>
            )} */}
        </Head>
    );
};

export default HeadSEO;
