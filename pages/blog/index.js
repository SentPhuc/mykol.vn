import React, { useEffect, useState } from 'react';
import { DataView } from 'primereact/dataview';
import { GlobalService } from '../../demo/service/GlobalService';
import { DEV_URL } from '../../src/commons/Utils';
import NewBlog from './NewBlog';

const Blog = () => {
    const service = new GlobalService();
    const [postList, setPostList] = useState(null);

    useEffect(async () => {
        await service
            .searchPost()
            .then((data) => {
                if (data?.data?.code === 'success') {
                    setPostList(data?.data?.data?.content);
                }
            })
            .catch((error) => console.log(error));
    }, []);

    const itemTemplate = (post) => {
        return (
            <div className="w-full item-blog">
                <a className="text-color flex sm:flex-nowrap flex-wrap" href={`/blog/${post?.postShortTitle}`} title={post.postTitle}>
                    <div className="image">
                        <img width="300" height="190" className="max-w-full obj-fit-cover" src={`${DEV_URL}${post?.postImage}`} alt={post?.postTitle} />
                    </div>
                    <div className="info">
                        <div className="w-full">
                            <div className="mb-2">
                                <span className="text-xl font-bold" dangerouslySetInnerHTML={{ __html: post.postTitle }}></span>
                            </div>
                            <div className="text-1xl line-clamp-2 w-full md:w-auto" dangerouslySetInnerHTML={{ __html: post.postContent }}></div>
                        </div>
                    </div>
                </a>
            </div>
        );
    };

    return (
        <>
            <div id="blog-page" className="py-5">
                <div className="container">
                    <h2 className="font-normal mb-3 font-semibold text-center">Danh sách tin tức</h2>
                    <div className="flex md:flex-nowrap align-items-start justify-content-between flex-wrap">
                        <div className="md:col-9 col-12 md:pr-5">
                            <DataView className="custom-blog" value={postList} itemTemplate={itemTemplate} paginator rows={10} rowsPerPageOptions={[3, 6, 9, 15]} />
                            {/* <BannerBlog /> */}
                        </div>
                        <div className="md:col-3 col-12">
                            <div className="box-new-blog">
                                <h2 className="font-normal text-xl font-semibold mb-3">Bài viết mới</h2>
                                <NewBlog postList={postList} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Blog;

export async function getServerSideProps(context) {
    const dataSeo = {
        title: 'Blog - MyKOL - Tìm Kiếm, Booking KOC, KOL, Influencer',
        description: 'Blog - MyKOL - Tìm Kiếm, Booking KOC, KOL, Influencer',
        ogType: 'article'
    };
    return {
        props: {
            dataSeo: dataSeo
        }
    };
}
