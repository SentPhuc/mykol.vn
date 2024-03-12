import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import getConfig from 'next/config';
import { Tag } from 'primereact/tag';
import { DataView } from 'primereact/dataview';
import moment from 'moment';
import Link from 'next/link';
import { GlobalService } from '../../../../demo/service/GlobalService';
import { DEV_URL } from '../../../../src/commons/Utils';

const BlogItem = () => {
    const service = new GlobalService();
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [postList, setPostList] = useState({});
    const [isUpdate, setIsUpdate] = useState(false);

    useEffect(async () => {
        // declare the async data fetching function
        // get the data from the api
        const res = await service.findTopThreeOrderByDateDesc();
        // convert data to json
        if (res.data.code === 'success') {
            const content = res.data.data;
            setPostList(content);
        } else {
            setPostList([]);
        }
    }, []);

    const itemBody = (data) => {
        return (
            <div className="col-12 xl:col-4 md:col-12 sm:col-12 p-2">
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-tag"></i>
                            <span className="font-semibold">Tin mới</span>
                        </div>
                        <Tag value={moment(data.postDate).format('DD/MM/YYYY')} severity="info"></Tag>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <Link
                            href={{
                                pathname: '/components/post/[title]',
                                query: { title: data.postShortTitle }
                            }}
                        >
                            <img className="w-12 shadow-2 border-round image_hover_darker obj-fit-cover" src={`${DEV_URL}${data.postImage}`} alt={data.postTitle} />
                        </Link>

                        <Link
                            href={{
                                pathname: '/components/post/[title]',
                                query: { title: data.postShortTitle }
                            }}
                        >
                            <div className="text-2xl font-bold image_hover_darker">
                                {data.postTitle.length > 35 ? <span dangerouslySetInnerHTML={{ __html: data.postTitle.slice(0, 35) }} className="my-4"></span> : <span dangerouslySetInnerHTML={{ __html: data.postTitle }} className="my-4"></span>}
                                {data.postTitle.length > 35 && <span>...</span>}
                            </div>
                        </Link>

                        <span className="text-l line-height-4 min-h-111">
                            <div>
                                {data.postContent.length > 300 ? (
                                    <span dangerouslySetInnerHTML={{ __html: data.postContent.slice(0, 300) }} className="my-4"></span>
                                ) : (
                                    <span dangerouslySetInnerHTML={{ __html: data.postContent }} className="my-4"></span>
                                )}
                                {data.postContent.length > 300 && <span>...</span>}
                            </div>
                        </span>
                    </div>
                    <div className="flex flex-column">
                        <Link
                            href={{
                                pathname: '/components/post',
                                query: { title: data.postShortTitle }
                            }}
                        >
                            <Button icon="pi pi-arrow-right align-item-right " label="Xem chi tiết" className="p-button-rounded align-self-end"></Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="col-12 p-2">
                <DataView value={postList} itemTemplate={itemBody} />
            </div>
        </>
    );
};

export default BlogItem;
