//pages/sitemap.xml.js
import moment from 'moment';
import { GlobalService } from 'demo/service/GlobalService';

const generateSiteMap = (blogs) => {
    return `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
        <url>
            <loc>${process.env.APP_URL}/</loc>
            <lastmod>${moment().format()}</lastmod>
            <changefreq>daily</changefreq>
            <priority>1.00</priority>
        </url>
        <url>
            <loc>${process.env.APP_URL}/landing/introduce</loc>
            <lastmod>${moment().format()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.90</priority>
        </url>
        <url>
            <loc>${process.env.APP_URL}/landing/privacy-policy</loc>
            <lastmod>${moment().format()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.90</priority>
        </url>
        <url>
            <loc>${process.env.APP_URL}/components/contact</loc>
            <lastmod>${moment().format()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.90</priority>
        </url>
        <url>
            <loc>${process.env.APP_URL}/landing/terms-of-use</loc>
            <lastmod>${moment().format()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.90</priority>
        </url>
        <url>
            <loc>${process.env.APP_URL}/landing/answer-and-question</loc>
            <lastmod>${moment().format()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.90</priority>
        </url>
        <url>
            <loc>${process.env.APP_URL}/landing/dispute-resolution</loc>
            <lastmod>${moment().format()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.90</priority>
        </url>
        <url>
            <loc>${process.env.APP_URL}/landing/operating-regulations</loc>
            <lastmod>${moment().format()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.90</priority>
        </url>
        <url>
            <loc>${process.env.APP_URL}/landing/instructions-creating-profile</loc>
            <lastmod>${moment().format()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.90</priority>
        </url>
        <url>
            <loc>${process.env.APP_URL}/landing/refund-policy</loc>
            <lastmod>${moment().format()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.90</priority>
        </url>
        <url>
            <loc>${process.env.APP_URL}/blog</loc>
            <lastmod>${moment().format()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.90</priority>
        </url>
        ${blogs
            .map((value, index) => {
                return `
            <url>
                <loc>${`${process.env.APP_URL}/blog/${value.postShortTitle}`}</loc>
                <lastmod>${moment().format()}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.90</priority>
            </url>
          `;
            })
            .join('')}
    </urlset>
 `;
};
export default function SiteMap() {}

export async function getServerSideProps({ res }) {
    // We make an API call to gather the URLs for our site
    const blogs = await new GlobalService()
        .searchPost()
        .then((data) => {
            if (data?.data?.code === 'success') {
                return data?.data?.data?.content;
            }
        })
        .catch((error) => console.log(error));

    // We generate the XML sitemap with the posts data
    const sitemap = generateSiteMap(blogs);

    res.setHeader('Content-Type', 'text/xml');
    // we send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
        props: {}
    };
}
