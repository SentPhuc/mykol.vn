import React, { useEffect, useState } from 'react';
import 'primereact/resources/primereact.min.css';
import { Carousel } from 'primereact/carousel';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import { DEV_URL } from '../../../src/commons/Utils';
import { Chip } from 'primereact/chip';
import { GlobalService } from '../../../demo/service/GlobalService';
import Link from 'next/link';
import getConfig from 'next/config';

const RelatedCandidates = () => {
    const [data, setData] = useState([]);
    const router = useRouter();
    const service = new GlobalService();
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const responsiveOptions = [
        {
            breakpoint: '1199px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '991px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    const dataviewGridItem = (data) => {
        return (
            <div className="col-12 lg:col-3 sm:col-12 md:col-6 filter-candidate">
                <div className="card m-3 border-0 candidate-infor-item">
                    <div className="flex flex-column align-items-center text-center mb-3">
                        <div className="boxed">
                            <Link
                                href={{
                                    pathname: '/components/detail-candidate',
                                    query: { mask: data.mask, id: data.kolsInfluencerId }
                                }}
                            >
                                <div className="boxed">
                                    {data.profileImage != null ? (
                                        <img src={`${DEV_URL}${data.profileImage}`} className="my-3 mx-0 avt-img" alt={'img'} />
                                    ) : (
                                        <img src={`${contextPath}/demo/images/avatar/no-avatar.png`} className="my-3 mx-0 avt-img" alt={'img'} />
                                    )}
                                </div>
                            </Link>
                        </div>
                        <div className="text-2xl font-bold">{data.kolsInfluencerName}</div>
                    </div>
                    <div className="flex align-items-center flex-wrap gap-1 justify-content-center mt-2">{data?.careerFields ? data.careerFields.slice(0, 3).map((e) => <Chip className="text-base mr-2" label={e.value} />) : <></>}</div>
                </div>
            </div>
        );
    };

    useEffect(async () => {
        const res = await service.search({ page: 0, recordPage: 12 });
        if (res.data.code === 'success') {
            let content = res.data.data.content;
            setData(content);
        } else {
            setData([]);
        }
    }, []);

    return (
        <>
            <Carousel circular value={data} numScroll={1} numVisible={5} autoplayInterval={3000} responsiveOptions={responsiveOptions} itemTemplate={dataviewGridItem} />
            <Button
                icon="pi pi-arrow-right"
                label="Xem tất cả"
                className="p-button-text"
                onClick={() => {
                    router.push('/components/search-candidates/');
                }}
            ></Button>
        </>
    );
};

export default RelatedCandidates;
