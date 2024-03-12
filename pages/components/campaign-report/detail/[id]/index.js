import { useEffect, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { TabView, TabPanel } from 'primereact/tabview';
import { formatCurrencyVND, formatNumberThousands, calculateAndCutomChartForInteract, defineTypeChart, calculateEngagementRate, defineSocialIcon } from 'src/commons/Utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Avatar } from 'primereact/avatar';
import ChartLine from 'pages/components/applied-candidates/sidebar-kol-info/chart/ChartLine';
import ChartDoughnut from 'pages/components/applied-candidates/sidebar-kol-info/chart/ChartDoughnut';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { classNames } from 'primereact/utils';
import AppLayout from 'layout/AppLayout';
import { CampaignService } from 'demo/service/CampaignService';
import _ from 'lodash';
import { Paginator } from 'primereact/paginator';
import React from 'react';
import CalendarFilter from '../../CalendarFilter';

const CampaignReportDetail = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(null);
    const [isPrint, setIsPrint] = useState(false);
    const [dataReports, setDataReports] = useState(null);
    const [dataDetail, setDataDetail] = useState(null);
    const [dataListJobs, setDataListJobs] = useState(null);
    const [dataRows, setDataRows] = useState(10);
    const [showPaginator, setshowPaginator] = useState(true);
    const campaignService = new CampaignService();
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [changing, setChanging] = useState(false);
    
    const onPageChange = (event) => {
        setPage(event.page + 1);
        setPageSize(event.rows);
        setChanging(!changing);
    };

    useEffect(async () => {
        setLoading(true);
        try {
            if (!router?.query?.id) return;
            const { data } = await campaignService.getCampaignDetailPerformance(router?.query?.id, {
                startDate: date?.start,
                endDate: date?.end
            });
            const res = await campaignService.getCampaignInfluencersPerformance(router?.query?.id, {
                page: page,
                recordPage: pageSize,
                startDate: date?.start,
                endDate: date?.end
            });

            if (data.code == 'success') {
                setDataDetail(data?.data);
                setDataListJobs([
                    {
                        titleJob: data?.data?.jobTitle,
                        platfrom: 'Tiktok',
                        campaignSpending: data?.data?.cost ?? 0,
                        posts: data?.data?.totalPost,
                        Influencer: data?.data?.totalInfluencers
                    }
                ]);
            }
            if (res.data.code == 'success') {
                setDataReports(res?.data?.data?.content);
                setTotalRecords(res?.data?.data?.totalElements);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }, [router?.query?.id, changing, pageSize, date]);

    const checkTabWidthRoute = () => {
        return router.route === '/components/campaign-report/detail/[id]';
    };

    function formatDateToDDMM(inputDate) {
        const parts = inputDate.split('/'); // Tách chuỗi thành mảng các phần tử dựa trên dấu '/'
        const day = parts[0]; // Lấy ngày
        const month = parts[1]; // Lấy tháng
        return `${day}/${month}`; // Kết hợp ngày và tháng thành chuỗi "DDMM"
    }

    const dataLikesPerViews = calculateAndCutomChartForInteract(!!dataDetail?.totalViews ? dataDetail?.totalLikes / dataDetail?.totalViews : 0, defineTypeChart.likeView);
    const dataSharesPerViews = calculateAndCutomChartForInteract(!!dataDetail?.totalViews ? dataDetail?.totalShares / dataDetail?.totalViews : 0, defineTypeChart.shareView);
    const dataCommentsPerViews = calculateAndCutomChartForInteract(!!dataDetail?.totalViews ? dataDetail?.totalComments / dataDetail?.totalViews : 0, defineTypeChart.commentView);

    const dataLineChartviews = [];
    const dataLineChartlikes = [];
    const dataLineChartComments = [];
    const dataLineChartShares = [];
    const labelsChart = [];

    if (dataDetail?.measurementResponseList.length > 0) {
        const data = dataDetail?.measurementResponseList;
        var startDateForCalendar = null;
        var endDateForCalendar = null;

        // Tạo một đối tượng để lưu trữ tổng viewsCount cho mỗi ngày
        const viewsByDate = {};
        const commentsByDate = {};
        const likesByDate = {};
        const sharesByDate = {};

        data.forEach((item) => {
            const timestamp = item.timestamp * 1000; // Đổi timestamp thành miliseconds
            const date = new Date(timestamp);
            const formattedDate = date.toLocaleDateString('en-GB'); // Format ngày thành dạng DD/MM/YYYY

            if (!viewsByDate[formattedDate]) {
                viewsByDate[formattedDate] = item.viewsCount || 0;
                commentsByDate[formattedDate] = item.commentsCount || 0;
                likesByDate[formattedDate] = item.likesCount || 0;
                sharesByDate[formattedDate] = item.sharesCount || 0;
            } else {
                // Nếu formattedDate đã tồn tại, cộng viewsCount vào tổng viewsCount hiện có
                viewsByDate[formattedDate] += item.viewsCount || 0;
                commentsByDate[formattedDate] = item.commentsCount || 0;
                likesByDate[formattedDate] = item.likesCount || 0;
                sharesByDate[formattedDate] = item.sharesCount || 0;
            }
        });

        const result = Object.keys(viewsByDate).map((date) => ({
            date: formatDateToDDMM(date),
            viewsCount: viewsByDate[date],
            commentsCount: commentsByDate[date],
            likesCount: likesByDate[date],
            sharesCount: sharesByDate[date]
        }));

        _.orderBy(result)?.map((value) => {
            labelsChart.push(value?.date);
            dataLineChartviews.push(value?.viewsCount);
            dataLineChartlikes.push(value?.likesCount);
            dataLineChartComments.push(value?.commentsCount);
            dataLineChartShares.push(value?.sharesCount);
        });
    }

    const handlePrintPDF = () => {
        setshowPaginator(false);
        setIsPrint(true);
        setDataRows(10000);
    };

    useEffect(() => {
        if (showPaginator === false && isPrint === true) window.print();
    }, [showPaginator, isPrint]);

    if (typeof window !== 'undefined') {
        window.addEventListener('afterprint', (event) => {
            setshowPaginator(true);
            setIsPrint(false);
            setDataRows(2);
        });
    }

    const headerPostTemplate = (rowData) => {
        return (
            <div className="text-center">
                <span>Bài đăng</span>
                <br />
                <a className="underline text-blue-400 font-normal" href={`/components/campaign-report/content/${dataDetail?.id}/`} title="Xem tất cả">
                    Xem tất cả
                </a>
            </div>
        );
    };

    const bodyPostTemplate = (rowData) => {
        return (
            <>
                <a href={rowData?.url ?? '#'} target="_blank" title="Detail" className="hover:underline">
                    Link bài viết
                </a>
            </>
        );
    };

    const bodyNameTemplate = (rowData) => {
        return (
            <div className="text-center">
                {!!rowData?.avatar && <Avatar imageAlt={rowData?.username} className="custom-avatar-campaign-report vertical-align-middle mr-2" image={rowData?.avatar} shape="circle" />}
                <span>{rowData?.username}</span>
            </div>
        );
    };

    // const renderKolName = (rowData) => {
    //     return (
    //         <div className="text-center">
    //             <span>{rowData?.kolName ?? '-'}</span>
    //         </div>
    //     );
    // };

    const TempalteTotalValueStatistics = (dataDetail) => {
        const classNameCustom = !!isPrint ? 'mb-3' : 'md:col-6';
        return (
            <div className="grid">
                <div className={`col-12 ${classNameCustom}`}>
                    Tổng lượt xem: <b>{formatNumberThousands(dataDetail?.totalViews)}</b>
                </div>
                <div className={`col-12 ${classNameCustom}`}>
                    Tổng lượt bình luận: <b>{formatNumberThousands(dataDetail?.totalComments)}</b>
                </div>
                <div className={`col-12 ${classNameCustom}`}>
                    Tổng lượt thích: <b>{formatNumberThousands(dataDetail?.totalLikes)}</b>
                </div>
                <div className={`col-12 ${classNameCustom}`}>
                    Tổng lượt share: <b>{formatNumberThousands(dataDetail?.totalShares)}</b>
                </div>
            </div>
        );
    };

    const TempalteItemsInteraction = ({ dataChartDoughnut }) => {
        const classNameCustom = !!isPrint ? 'col-4' : 'col col-12 md:col-6 lg:col-4';
        const classNameCustomPadding = !!isPrint ? 'px-3 py-2' : 'p-3';
        return (
            <div className={`border-round-xl ${classNameCustom}`}>
                <div className={`items-interaction ${classNameCustomPadding}`}>
                    <div className="header-interaction text-center">
                        <i className={`pi ${dataChartDoughnut?.icon} mr-2`}></i>
                        {dataChartDoughnut?.title}
                    </div>
                    <div className="info-interaction">
                        <div className="grid align-items-center">
                            {!isPrint ? (
                                <>
                                    <div className="col col-8 py-0 info-interaction-left font-bold text-center">
                                        {parseFloat(dataChartDoughnut?.valuePercent)}%
                                        <br />
                                        <span className={`text-${dataChartDoughnut?.style}-500`}>{dataChartDoughnut?.titlePercentType}</span>
                                    </div>
                                    <div className="col col-4 py-0 info-interaction-right">
                                        <ChartDoughnut data={{ data: dataChartDoughnut?.value, style: dataChartDoughnut?.style }} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="col-12 info-interaction-left font-bold text-center">
                                        {parseFloat(dataChartDoughnut?.valuePercent)}%
                                        <br />
                                        <span className={`text-${dataChartDoughnut?.style}-500`}>{dataChartDoughnut?.titlePercentType}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <span className="sub-title text-center block">{dataChartDoughnut?.totalPercent ?? 0} là số liệu trung bình</span>
                </div>
            </div>
        );
    };

    const TemplateWorkPlatform = () => {
        return <div dangerouslySetInnerHTML={{ __html: defineSocialIcon['tiktok'] }} />;
    };

    const TemplateTableWork = (listJobs) => {
        console.log(listJobs);
        return (
            <DataTable tableClassName="mb-4 custom-table-work" value={listJobs} scrollable tableStyle={{ minWidth: '70rem', width: '100%' }}>
                <Column header="Công việc" field="titleJob" style={{ flexBasis: '14%' }}></Column>
                <Column body={TemplateWorkPlatform} header="Nền tảng" className="text-center" style={{ flexBasis: '10%', justifyContent: 'center' }}></Column>
                <Column header="Chi tiêu chiến dịch" field="campaignSpending" body={(rowData) => formatCurrencyVND(rowData?.campaignSpending)} className="text-center" style={{ flexBasis: '12%', justifyContent: 'center' }}></Column>
                <Column header="Số bài đăng" field="posts" className="text-center" style={{ flexBasis: '12%', justifyContent: 'center' }}></Column>
                <Column header="Số Influencer" field="Influencer" className="text-center" style={{ flexBasis: '12%', justifyContent: 'center' }}></Column>
            </DataTable>
        );
    };

    const TemplateCampaignReportStatistics = () => {
        return (
            <div className="grid align-items-start">
                <div className="col-12 xl:col-6">
                    <h3 className="title-section-campaign-report-detail block mb-4">Biểu đồ lượt tương tác</h3>
                    <TabView>
                        <TabPanel header="Lượt xem">
                            <ChartLine
                                dataChartLine={{
                                    data: dataLineChartviews,
                                    label: 'Lượt xem',
                                    labels: labelsChart
                                }}
                            />
                        </TabPanel>
                        <TabPanel header="Lượt like">
                            <ChartLine
                                dataChartLine={{
                                    data: dataLineChartlikes,
                                    label: 'Lượt like',
                                    labels: labelsChart
                                }}
                            />
                        </TabPanel>
                        <TabPanel header="Lượt bình luận">
                            <ChartLine
                                dataChartLine={{
                                    data: dataLineChartComments,
                                    label: 'Lượt bình luận',
                                    labels: labelsChart
                                }}
                            />
                        </TabPanel>
                        <TabPanel header="Lượt Chia sẻ">
                            <ChartLine
                                dataChartLine={{
                                    data: dataLineChartShares,
                                    label: 'Lượt Chia sẻ',
                                    labels: labelsChart
                                }}
                            />
                        </TabPanel>
                    </TabView>
                </div>
                <div className="col-12 xl:col-6">
                    <h3 className="title-section-campaign-report-detail block mb-4">Mức độ hiệu quả chiến dịch</h3>
                    <div className="block-Statistical-social border-primary border-1 text-white">
                        <div className="grid">
                            <div className="items-Statistical col col-12 md:col-4 text-center">
                                Số bài đăng
                                <br />
                                <strong className="block">{formatNumberThousands(dataDetail?.totalPost)}</strong>
                            </div>
                            <div className="items-Statistical col col-12 md:col-4 text-center">
                                Tỉ lệ tương tác
                                <i
                                    className="pi pi-info-circle custom-target-persent ml-2 mr-1 cursor-pointer"
                                    data-pr-tooltip="Tổng số lượt thích, bình luận, chia sẻ/ Tổng số lượt xem của toàn bộ chiến dịch."
                                    data-pr-position="bottom"
                                    data-pr-at="center top-38"
                                    data-pr-my="center"
                                ></i>
                                <Tooltip target=".custom-target-persent" />
                                <br />
                                <strong className="block">{calculateEngagementRate(dataDetail?.totalLikes, dataDetail?.totalComments, dataDetail?.totalShares, dataDetail?.totalViews)}</strong>
                            </div>
                            <div className="items-Statistical col col-12 md:col-4 text-center">
                                View trung bình
                                <i
                                    className="pi pi-info-circle custom-target-persent-view-video ml-2 mr-1 cursor-pointer"
                                    data-pr-tooltip="Lượt xem trung bình của toàn bộ video có trong chiến dịch."
                                    data-pr-position="bottom"
                                    data-pr-at="center top-38"
                                    data-pr-my="center"
                                ></i>
                                <Tooltip target=".custom-target-persent-view-video" />
                                <br />
                                <strong className="block">{formatNumberThousands(dataDetail?.totalViews / dataDetail?.totalVideos)}</strong>
                            </div>
                        </div>
                    </div>
                    <div className="section-social-campaign-report-detail block-interaction-index-social mt-4">
                        <div className="box-interaction">
                            <div className="grid">
                                <TempalteItemsInteraction
                                    dataChartDoughnut={{
                                        icon: 'pi-heart',
                                        title: 'Likes/Views',
                                        ...dataLikesPerViews
                                    }}
                                />
                                <TempalteItemsInteraction
                                    dataChartDoughnut={{
                                        icon: 'pi-comments',
                                        title: 'Comments/Views',
                                        ...dataCommentsPerViews
                                    }}
                                />
                                <TempalteItemsInteraction
                                    dataChartDoughnut={{
                                        icon: 'pi-share-alt',
                                        title: 'Shares/Views',
                                        ...dataSharesPerViews
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    const TemplateCampaignReportStatisticsPrint = () => {
        return (
            <>
                <h3 className="title-section-campaign-report-detail block mb-4">Mức độ hiệu quả chiến dịch</h3>
                <div className="grid align-items-start mb-3">
                    <div className="col-4">
                        <div className="p-3 box-total-value-statistics-print shadow-1">{TempalteTotalValueStatistics(dataDetail)}</div>
                    </div>
                    <div className="col-8">
                        <div className="block-Statistical-social bg-white shadow-1 text-white">
                            <div className="grid">
                                <div className="items-Statistical col-4 text-center text-color">
                                    Số bài đăng
                                    <br />
                                    <strong className="block">{formatNumberThousands(dataDetail?.totalPost)}</strong>
                                </div>
                                <div className="items-Statistical col-4 text-center text-color">
                                    Tỉ lệ tương tác
                                    <i
                                        className="pi pi-info-circle custom-target-persent ml-2 mr-1 cursor-pointer"
                                        data-pr-tooltip="Tổng số lượt thích, bình luận, chia sẻ/ Tổng số lượt xem của 15 video gần nhất."
                                        data-pr-position="bottom"
                                        data-pr-at="center top-38"
                                        data-pr-my="center"
                                    ></i>
                                    <Tooltip target=".custom-target-persent" />
                                    <br />
                                    <strong className="block">{calculateEngagementRate(dataDetail?.totalLikes, dataDetail?.totalComments, dataDetail?.totalShares, dataDetail?.totalViews)}</strong>
                                </div>
                                <div className="items-Statistical col-4 text-center text-color">
                                    View trung bình
                                    <br />
                                    <strong className="block">{formatNumberThousands(dataDetail?.totalViews / dataDetail?.totalVideos)}</strong>
                                </div>
                            </div>
                        </div>
                        <div className="section-social-campaign-report-detail block-interaction-index-social mt-3">
                            <div className="box-interaction">
                                <div className="grid">
                                    <TempalteItemsInteraction
                                        dataChartDoughnut={{
                                            icon: 'pi-heart',
                                            title: 'Likes/Views',
                                            ...dataLikesPerViews
                                        }}
                                    />
                                    <TempalteItemsInteraction
                                        dataChartDoughnut={{
                                            icon: 'pi-comments',
                                            title: 'Comments/Views',
                                            ...dataCommentsPerViews
                                        }}
                                    />
                                    <TempalteItemsInteraction
                                        dataChartDoughnut={{
                                            icon: 'pi-share-alt',
                                            title: 'Shares/Views',
                                            ...dataSharesPerViews
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const TempalteHeaderInteractRate = () => {
        return (
            <div>
                Tỉ lệ tương tác
                <i
                    className="pi pi-info-circle custom-target-persent-interact-rate ml-2 mr-1 cursor-pointer"
                    data-pr-tooltip="Tổng số lượt thích, bình luận, chia sẻ/ Lượt xem của video."
                    data-pr-position="bottom"
                    data-pr-at="center top-38"
                    data-pr-my="center"
                ></i>
                <Tooltip target=".custom-target-persent-interact-rate" />
            </div>
        );
    };

    return AppLayout(
        <>
            <div className={classNames({ 'main-print': !!isPrint }, 'card p-3 md:p-5')}>
                {!!isPrint && (
                    <div className="pb-3 text-center banner-pdf">
                        <img src={`${contextPath}/layout/images/logo.jpg`} alt="InfluX" width="200" className="max-w-full" />
                    </div>
                )}
                <div className="header-campaign-report-detail grid w-full justify-content-between align-items-end border-bottom-1 border-300 mb-3">
                    <div className="header-campaign-report-detail-left col-12 xl:col-6 pb-0 pl-0 relative">
                        <a href="/components/campaign-report/" title="Back">
                            <i className="pi pi-arrow-left"></i>
                        </a>
                        <a className={classNames({ active: checkTabWidthRoute }, 'btn-detail-campaign')} href={`/components/campaign-report/detail/${dataDetail?.id}`} title="Báo Cáo chi tiết">
                            <i className="pi pi-chart-bar"></i> Báo Cáo chi tiết
                        </a>
                        <a className="btn-content" href={`/components/campaign-report/content/${dataDetail?.id}`} title="Báo cáo nội dung">
                            <i className="pi pi-file"></i> Báo cáo nội dung
                        </a>
                    </div>
                    <div className="header-campaign-report-detail-right flex flex-wrap col-12 xl:col-6 justify-content-start xl:justify-content-end">
                        <CalendarFilter startDate={startDateForCalendar} endDate={endDateForCalendar} setDate={setDate} />
                        {!isPrint && <Button disabled={loading} loading={loading} onClick={() => handlePrintPDF()} label="Tải báo cáo" className="ml-4" />}
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                    <h4 className="m-0">Chiến dịch: {dataDetail?.jobTitle}</h4>
                </div>
                <hr />
                <div className="body-campaign-report-detail">
                    {!isPrint ? (
                        <div className="campaign-report-detail-statistics mb-3">
                            <div className="grid">
                                <div className="col md:col-6">{TempalteTotalValueStatistics(dataDetail)}</div>
                            </div>
                        </div>
                    ) : (
                        TemplateTableWork(dataListJobs)
                    )}
                    <div className="campaign-report-detail-statistics">{!isPrint ? TemplateCampaignReportStatistics() : TemplateCampaignReportStatisticsPrint()}</div>
                </div>
                <div className="table-campaign-report-detail">
                    <h3 className="title-section-campaign-report-detail block mb-4">Báo cáo hiệu quả Influencer</h3>
                    <DataTable value={dataReports} loading={loading} rows={dataRows} scrollable tableStyle={{ minWidth: '70rem', width: '100%' }}>
                        <Column body={(rowData, field) => field.rowIndex + 1} header="#" style={{ maxWidth: '3rem' }}></Column>
                        {/*<Column header="Tên Influencer" body={renderKolName} style={{ flexBasis: '20%' }}></Column>*/}
                        <Column header="Tài khoản Tiktok" body={bodyNameTemplate} style={{ flexBasis: '20%' }}></Column>
                        <Column body={(rowData) => (rowData?.totalFollower != null ? formatNumberThousands(rowData?.totalFollower) : 'n/a')} header="Số follower" className="text-center" style={{ flexBasis: '10%', justifyContent: 'center' }}></Column>
                        <Column body={(rowData) => formatNumberThousands(rowData?.totalView)} header="Lượt xem" className="text-center" style={{ flexBasis: '10%', justifyContent: 'center' }}></Column>
                        <Column body={(rowData) => formatNumberThousands(rowData?.totalLike)} header="Lượt thích" className="text-center" style={{ flexBasis: '10%', justifyContent: 'center' }}></Column>
                        <Column body={(rowData) => formatNumberThousands(rowData?.totalComment)} header="Lượt bình luận" className="text-center" style={{ flexBasis: '10%', justifyContent: 'center' }}></Column>
                        <Column body={(rowData) => formatNumberThousands(rowData?.totalShare)} header="Lượt chia sẻ" className="text-center" style={{ flexBasis: '10%', justifyContent: 'center' }}></Column>
                        <Column
                            field="interactRate"
                            body={(rowData) => calculateEngagementRate(rowData?.totalLike, rowData?.totalComment, rowData?.totalShare, rowData?.totalView)}
                            header={TempalteHeaderInteractRate}
                            className="text-center"
                            style={{ flexBasis: '6%', justifyContent: 'center' }}
                        ></Column>
                        <Column body={(rowData) => (rowData?.bookingPrice != null ? formatCurrencyVND(rowData?.bookingPrice) : 'n/a')} header="Giá booking" className="text-center" style={{ flexBasis: '10%', justifyContent: 'center' }}></Column>
                        <Column header={headerPostTemplate} body={bodyPostTemplate} style={{ flexBasis: '8%' }}></Column>
                    </DataTable>
                    <Paginator rowsPerPageOptions={[5, 10, 25, 50]} first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />
                </div>
            </div>
        </>
    );
};
export default CampaignReportDetail;
