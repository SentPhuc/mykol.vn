import React from 'react';
import getConfig from 'next/config';
import BlogItem from './BlogItem';
import { Button } from 'primereact/button';
import Link from 'next/link';

const BlogHomePage = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    return (
        <>
            <div className='col-12 blog-home-page-col p-0'>
                <div className='card blog-home-page'>
                    <div className='mb-4 center-item'>
                        <h1 className='fs-80'>Cẩm nang nghề nghiệp</h1>
                    </div>
                    <BlogItem />
                    <div className='mt-4 center-item'>
                        <Link href={{
                            pathname: '/components/blog'
                        }}
                        >
                            <Button icon='pi pi-arrow-right' label='Xem tất cả'
                                    className='p-button-text'></Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogHomePage;