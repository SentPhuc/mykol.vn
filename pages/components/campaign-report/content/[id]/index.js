import { useEffect, useState } from 'react';
import { classNames } from 'primereact/utils';
import { DataView } from 'primereact/dataview';
import { useRouter } from 'next/router';
import AppLayout from 'layout/AppLayout';
import getConfig from 'next/config';
import { CampaignService } from 'demo/service/CampaignService';
import _ from 'lodash';
import { DEV_URL, formartDate, formatNumberThousands } from 'src/commons/Utils';
import { Message } from 'primereact/message';

const CampaignReportContent = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [datas, setDatas] = useState([]);
    const [dataGroup, setDataGroup] = useState([]);
    const router = useRouter();
    const checkTabWidthRoute = () => {
        return router.route === '/components/campaign-report/content/[id]';
    };

    useEffect(async () => {
        try {
            if (!router?.query?.id) return;
            const { data } = await new CampaignService().getCampaignsVideos(router?.query?.id);
            setDatas(data);
        } catch (error) {
            console.error(error);
        }
    }, [router?.query?.id]);

    useEffect(() => {
        // Tạo một đối tượng Map để nhóm các mục theo ngày
        const groupedData = new Map();
        for (let i = 0; i < datas.length; i++) {
            const date = datas[i]?.createdAt.split('T')[0];
            if (groupedData.has(date)) {
                groupedData.get(date).push(datas[i]);
            } else {
                groupedData.set(date, [datas[i]]);
            }
        }
        const result = {};
        groupedData.forEach((value, key) => {
            result[key] = value;
        });
        setDataGroup(groupedData);
    }, [datas]);

    const itemTemplateDataView = (data) => {
        return (
            <div className="col-12 sm:col-6 xl:col-3 px-2 pb-3 items-contents">
                <a href={data?.url} title={data?.title} target="_blank" className="text-color">
                    <div className="mb-3 img text-center">
                        <img style={{ maxWidth: '100%', aspectRatio: '4/5', objectFit: 'contain' }} src={data?.imgThumbnailUrl ? DEV_URL + data?.imgThumbnailUrl : `${contextPath}/layout/images/logo.jpg`} alt={data?.title} />
                    </div>
                    <div>
                        <h4 className="mb-2 flex flex-wrap align-items-center name">
                            {!!data?.avatar && <img className="border-circle mr-3" src={data?.avatar} alt={data?.title} />}
                            <span className="text-base">{data?.title}</span>
                        </h4>
                        {!!data?.createdAt && <h6 className="mt-1 mb-3 font-normal text-500">{formartDate(data?.createdAt)}</h6>}
                        {!!data?.description && <div className="mt-2 text-900 text-xl mb-2">{data?.description}</div>}
                        <div className="flex">
                            <div className="social-video">
                                <span className="mr-3 inline-block">
                                    <i className="pi mr-2 vertical-align-middle text-indigo-500 pi-eye"></i>
                                    {formatNumberThousands(data?.totalViewsCount)}
                                </span>
                                <span className="mr-3 inline-block">
                                    <i className="pi mr-2 vertical-align-middle text-indigo-500 pi-heart-fill"></i>
                                    {formatNumberThousands(data?.totalLikesCount)}
                                </span>
                                <span>
                                    <i className="pi mr-2 vertical-align-middle text-indigo-500 pi-comment"></i>
                                    {data?.totalCommentsCount}
                                </span>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        );
    };

    const TemplateContent = (index, data) => {
        return (
            <div className="items-campaign-report-content pb-4" key={`content-${index}`}>
                <h3 className="text-xl">{index}</h3>
                <DataView value={data} itemTemplate={itemTemplateDataView} layout="grid" />
            </div>
        );
    };
    return AppLayout(
        <div className="card p-3 md:p-5">
            <div className="header-campaign-report-detail header-campaign-report-content grid w-full justify-content-between align-items-end border-bottom-1 border-300 mb-3">
                <div className="header-campaign-report-detail-left col-12 xl:col-6 pb-0 pl-0 relative">
                    <a href={'/components/campaign-report/detail/' + router?.query?.id} title="Báo Cáo chi tiết">
                        <i className="pi pi-chart-bar"></i> Báo Cáo chi tiết
                    </a>
                    <a className={classNames({ active: checkTabWidthRoute })} href={'/components/campaign-report/content/' + router?.query?.id} title="Báo cáo nội dung">
                        <i className="pi pi-file"></i> Báo cáo nội dung
                    </a>
                </div>
            </div>
            <div className="body-campaign-report-content">
                {dataGroup.size > 0 ? (
                    Array.from(dataGroup.entries(), ([index, data]) => {
                        return <div key={`content-${index}`}>{!_.isEmpty(data) ? TemplateContent(index, data) : <Message severity="warn" text="Không có dữ liệu" className="w-full mt-3 justify-content-start" />}</div>;
                    })
                ) : (
                    <Message severity="warn" text="Không có dữ liệu" className="w-full mt-3 justify-content-start" />
                )}
            </div>
        </div>
    );
};
export default CampaignReportContent;
