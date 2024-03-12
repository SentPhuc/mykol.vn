import getConfig from 'next/config';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import { GlobalService } from '../../../demo/service/GlobalService';
import { BreadCrumb } from 'primereact/breadcrumb';
import tocbot from 'tocbot';
import { DEV_URL } from 'src/commons/Utils';
import ListKOL from './ListKOL';
import { classNames } from 'primereact/utils';

const Post = () => {
    const service = new GlobalService();
    const [show, setShow] = useState(true);
    const [description, setDescription] = useState('');
    const [initData, setInitData] = useState(false);
    const [post, setPost] = useState({});
    const router = useRouter();
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const items = [
        { label: 'Blog', url: '/blog' },
        { label: post.postTitle, url: `/blog/${post.postShortTitle}` }
    ];
    const home = { icon: 'pi pi-home', url: '/' };

    const slugify = (str) =>
        str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

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

        const elementH2 = document.querySelectorAll('h2');
        const elementH3 = document.querySelectorAll('h3');
        if (elementH2) {
            elementH2.forEach((value) => {
                value.setAttribute('id', slugify(value.innerText));
            });
            setInitData(true);
        }

        if (elementH3) {
            elementH3.forEach((value) => {
                value.setAttribute('id', slugify(value.innerText));
            });
            setInitData(true);
        }
    }, [router]);

    useEffect(() => {
        if (initData) {
            const mainToc = document.getElementById('main-toc');
            if (mainToc) setDescription(mainToc.innerText.slice(0, 275));

            tocbot.init({
                tocSelector: '.js-toc',
                contentSelector: '.js-toc-content',
                headingSelector: 'h1, h2, h3',
                hasInnerContainers: true
            });
        }

        setInitData(false);
    }, [initData]);

    return (
        <>
            <div className="detail-post" id="detail-post">
                <div className="container mt-3 mb-5">
                    <BreadCrumb model={items} home={home} />
                </div>
                <div className="box-detail-post">
                    <h1 className="title-detail-post">{post.postTitle}</h1>
                    <div className="post__user border-bottom-1">
                        <span className="author-avatar shadow-2 overflow-hidden">
                            <img width={48} height={48} src={`${contextPath}/layout/images/logo.jpg`} />
                        </span>
                        <div>
                            <span className="author-name">{post.postAuthor}</span>
                            <div className="author-info">
                                <span className="post-time">vào ngày {moment(post.createdTime).format('DD/MM/YYYY')}</span>
                            </div>
                        </div>
                    </div>

                    <h2 className="line-clamp-3 post__des"> {description}</h2>
                    <div className="menu-heading">
                        <div className="menu-heading__title flex justify-content-between">
                            Xem nhanh{' '}
                            <span onClick={() => setShow((prev) => !prev)} className="cursor-pointer">
                                {show ? '[Ẩn]' : '[Hiện]'}
                            </span>
                        </div>
                        <div className={classNames(show ? 'active' : '', 'js-toc')}></div>
                    </div>
                    <div id="main-toc" className="post-content-detail-post js-toc-content overflow-hidden" dangerouslySetInnerHTML={{ __html: post.postContent }}></div>
                    <div className="entry-author author-box">
                        <div className="flex-row">
                            <div className="mr-5 border-circle">
                                <div className="blog-author-image">
                                    <img width={90} height={90} src={`${contextPath}/layout/images/logo.jpg`} alt="mykol" />
                                </div>
                            </div>
                            <div className="flex-col flex-grow">
                                <h5 className="author-name uppercase pt-half">
                                    <a href="https://www.facebook.com/kingbang32/" title="Anh Tú">
                                        Anh Tú
                                    </a>
                                </h5>
                                <p className="author-desc small">Marketing Manager tại MYKOL - Nền tảng công nghệ hàng đầu, kết nối Nhãn hàng và các KOC, KOL, Influencer</p>

                                <p className="author-social">
                                    <a href="https://www.facebook.com/kingbang32/" title="Facebook" target="_blank" id="facebook">
                                        <i className="pi-facebook pi"></i>
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <ListKOL />
                </div>
            </div>
        </>
    );
};

export default Post;

export async function getServerSideProps(context) {
    const res = await new GlobalService().findByPostShortTitle(context.query.title);
    const dataSeo = {
        title: !!res?.data?.data?.postTitle ? res?.data?.data?.postTitle : '',
        description: res?.data?.data?.postContent?.slice(0, 150) ?? '',
        image: DEV_URL + res?.data?.data?.postImage ?? '',
        ogType: 'article'
    };
    return {
        props: {
            dataSeo: dataSeo
        }
    };
}
