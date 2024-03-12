import { useEffect, useState, useRef } from 'react';
import { Avatar } from 'primereact/avatar';
import { GlobalService } from 'demo/service/GlobalService';
import getConfig from 'next/config';
import { DEV_URL, BANKSNAPAS, formatNumberThousands, formatPriceVnd, calculateAndCutomChartForInteract, calculateEngagementRate, defineTypeChart, formatUrlExact } from 'src/commons/Utils';
import { Message } from 'primereact/message';
import { Chip } from 'primereact/chip';
import { Tooltip } from 'primereact/tooltip';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { TabView, TabPanel } from 'primereact/tabview';
import ChartLine from './chart/ChartLine';
import ChartDoughnut from './chart/ChartDoughnut';
import ChartDoughnutMultiData from './chart/ChartDoughnutMultiData';
import { Carousel } from 'primereact/carousel';
import { Toast } from 'primereact/toast';
import { isMobile } from 'react-device-detect';
import { InputText } from 'primereact/inputtext';
import { KolAdditionalInfoService } from 'demo/service/KolAdditionalInfoService';
import moment from 'moment';
import _ from 'lodash';
import { FraudReportService } from '../../../../demo/service/FraudReportService';

const TabTiktok = ({ dataKols, visible }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [videos, setVideos] = useState([]);
    const [infoKol, setInfoKol] = useState([]);
    const [total, setTotal] = useState(0);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const userName = dataKols?.url?.split('@')?.[1];
    const toastTopLeft = useRef(null);
    const toastCopy = useRef(null);
    const [showEmailDetails, setShowEmailDetails] = useState(false);
    const globalService = new GlobalService();
    const kolAdditionInfoService = new KolAdditionalInfoService();
    const fraudReportService = new FraudReportService();

    useEffect(async () => {
        // Các xử lý khác
        if (!visible) return;
        setLoading(true);

        if (dataKols.kolId != null) {
            // Lấy trạng thái hiện tại
            const resGetCurrentStatus = await fraudReportService.getCurrentStatus({
                reportedPersonId: dataKols.kolId
            });
            if (resGetCurrentStatus.data.code === 'SUCCESS' && resGetCurrentStatus.data.data.id != null) {
                setReport(resGetCurrentStatus.data.data.isReported == 1 ? true : false);
            }

            // Lấy tổng số lượng báo cáo
            const resCountTotalReport = await fraudReportService.countTotalReport({
                reportedPersonId: dataKols.kolId
            });
            if (resCountTotalReport.data.code === 'SUCCESS') {
                setTotal(resCountTotalReport.data.data);
            }
            try {
                if (!!userName) {
                    const res = await globalService.getDetailTiktokKols(userName);
                    if (!!res.data) {
                        setData(res.data);
                        const dataVideos = await globalService.getVideosTiktokKols(res?.data?.id);
                        if (!!dataVideos?.data) {
                            setVideos(dataVideos?.data);
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }

            try {
                const res = await kolAdditionInfoService.getMoreInfo({
                    jobId: dataKols.jobId,
                    kolId: dataKols.kolId
                });

                if (res.data.code === 'success') {
                    const data = res.data.data;
                    setInfoKol(data);
                } else {
                    setInfoKol([]);
                }
            } catch (error) {
                console.log(error);
            }
        }
        setLoading(false);
    }, [visible, userName, total, report]);

    const handleReport = async () => {
        // Hủy / báo cáo oke
        const data = report ? 0 : 1;
        const resGetCurrentStatus = await fraudReportService.saveOrUpdate({
            reportedPersonId: dataKols.kolId,
            isReported: data
        });
        if (resGetCurrentStatus.data.code === 'SUCCESS') {
            setReport(data);
        }
        toastTopLeft.current.show({ severity: 'success', summary: 'Thông báo', detail: !!report ? 'Hủy báo cáo gian lận' : 'Báo cáo tài khoản gian lận thành công', life: 3000 });
    };

    const findBankNameByCode = (code) => {
        const bank = BANKSNAPAS.find((b) => b.code === code);
        return bank ? bank.vn_name : null;
    };

    const onCopyHandler = async (email) => {
        await navigator.clipboard.writeText(email);
        toastCopy.current.show({ severity: 'success', summary: 'Thành công', detail: 'Copy to clipboard', life: 3000 });
    };

    const careerFieldsOther = (value) => {
        return (
            <>
                <Chip className="custom-target-icon cursor-pointer" data-pr-tooltip={value} data-pr-position="bottom" data-pr-at="center top-28" data-pr-my="center" key="5" label="+1" />
                <Tooltip target=".custom-target-icon" />
            </>
        );
    };

    const templateAvatar = (profileImage) => {
        if (!!profileImage) {
            return !loading ? <Avatar image={DEV_URL + profileImage} shape="circle" alt="Influx" /> : <Skeleton shape="circle" size="5rem"></Skeleton>;
        } else {
            return <Avatar image={`${contextPath}/demo/images/avatar/no-avatar.png`} shape="circle" alt="Influx" />;
        }
    };
    const TemplateHeaderSocial = (value) => {
        return (
            <>
                <div className="header-social-kols-detail section-social-kols-detail">
                    <div className="top-header-social">
                        <div className="grid">
                            <div className="images text-center col col-12 md:col-4">
                                {templateAvatar(value?.profileImage)}
                                <br />
                                <a className="text-primary underline font-bold" target="_blank" href={formatUrlExact(value?.url)} title="Xem kênh">
                                    Xem kênh
                                </a>
                            </div>
                            <div className="info col col-12 md:col-8 py-0">
                                <h3 className="title-section title-name capitalize block">
                                    {!!dataKols?.mask && !!dataKols?.kolId ? (
                                        <a href={`/components/detail-candidate?mask=${dataKols?.mask}&id=${dataKols?.kolId}`} target="_blank" title={value?.fullName}>
                                            {value?.fullName}
                                        </a>
                                    ) : (
                                        value?.fullName
                                    )}
                                </h3>
                                <div className="box-careerFields">
                                    {!isMobile && !!value?.careerFields && value?.careerFields?.slice(0, 4)?.map((item, key) => <Chip className="mr-2 mb-2 cursor-pointer" key={key} label={item.value} />)}
                                    {!isMobile && !!value?.careerFields && value?.careerFields.length > 4 && careerFieldsOther(value?.careerFields?.[4].value)}
                                    {!!isMobile && !!value?.careerFields && value?.careerFields?.map((item, key) => <Chip className="mr-2 mb-2 cursor-pointer" key={key} label={item.value} />)}
                                </div>
                                <div className="box-social-of-kols mt-2">
                                    {!!value?.zalo && (
                                        <a className="cursor-pointer mr-4" target="_blank" href={`https://zalo.me/${value?.zalo}`} title="Zalo">
                                            <img src={`${contextPath}/demo/images/kolInfo/zalo.svg`} alt="zalo" className="w-full" />
                                        </a>
                                    )}
                                    {!!value?.email && (
                                        <a className="cursor-pointer mr-4" target="_blank" onClick={() => setShowEmailDetails(!showEmailDetails)} title="Email">
                                            <img src={`${contextPath}/demo/images/kolInfo/gmail.svg`} alt="gmail" className="w-full" />
                                        </a>
                                    )}
                                    {!!value?.messener && (
                                        <a className="cursor-pointer" target="_blank" href={value?.messener} title="messenger">
                                            <img src={`${contextPath}/demo/images/kolInfo/message.svg`} alt="message" className="w-full" />
                                        </a>
                                    )}

                                    {showEmailDetails && value?.email && (
                                        <div className="grid w-full align-items-center">
                                            <div className="col-2">
                                                <div className="text-left ">Email:</div>
                                            </div>
                                            <div className="col-10 -w-full">
                                                <div className="box-copy shadow-2 flex align-items-center">
                                                    <div className="pl-0 url-copy">
                                                        <InputText value={value?.email} disabled className={'w-full'}></InputText>
                                                    </div>
                                                    <div className="btn-copy-inner" onClick={() => onCopyHandler(value?.email)}>
                                                        <i className="pi pi-copy" style={{ fontSize: '1rem' }}></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bottom-header-social flex md:flex-nowrap flex-wrap align-items-end">
                        <Button onClick={() => handleReport()} label={report === true ? `Hủy báo cáo gian lận` : `Báo cáo gian lận`} severity="danger" />
                        <div className="helper-report">
                            <Tooltip target=".custom-target-circle" />
                            <i
                                className="pi pi-info-circle custom-target-circle mt-2 md:mt-0 mr-1 cursor-pointer"
                                data-pr-tooltip="Báo cáo gian lận là việc báo cáo các hành vi không trung thực của influencer như : làm giả số lượt xem, lượt thích, lượt bình luận, lượt chia sẽ. Việc báo cáo sẽ giúp bạn phân loại nhanh Influencer trong tương lai."
                                data-pr-position="bottom"
                                data-pr-at="center+100 top-37"
                                data-pr-my="center"
                            ></i>
                            Đã có {total} lượt báo cáo
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const TempalteItemsInteraction = ({ dataChartDoughnut }) => {
        return (
            <div className="border-round-xl col col-12 md:col-6">
                <div className={`items-interaction p-3 ${dataChartDoughnut?.data?.style}`}>
                    <div className="header-interaction text-center">
                        <i className={`pi ${dataChartDoughnut?.icon} mr-2`}></i>
                        {dataChartDoughnut?.title}
                    </div>
                    <div className="info-interaction">
                        <div className="grid align-items-center">
                            <div className="col col-8 py-0 info-interaction-left font-bold text-center">
                                {parseFloat(dataChartDoughnut?.valuePercent)}%
                                <br />
                                <span className={`text-${dataChartDoughnut?.style}-500`}>{dataChartDoughnut?.titlePercentType}</span>
                            </div>
                            <div className="col col-4 py-0 info-interaction-right">
                                <ChartDoughnut data={{ data: dataChartDoughnut?.value, style: dataChartDoughnut?.style }} />
                            </div>
                        </div>
                    </div>
                    <span className="sub-title text-center block">{dataChartDoughnut?.totalPercent} là số liệu trung bình</span>
                </div>
            </div>
        );
    };

    const TempalteItemsFollowers = ({ dataChartDoughnutMulti }) => {
        return (
            <div key={dataChartDoughnutMulti?.element} className="items-followers col col-12 md:col-6">
                <ChartDoughnutMultiData key={`${dataChartDoughnutMulti?.element}-TempalteItemsFollowers`} dataKey={dataChartDoughnutMulti?.element} data={dataChartDoughnutMulti} />
            </div>
        );
    };

    const responsiveOptions = [
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    const videosTemplate = (video) => {
        return (
            <div className="item-videos cursor-pointer">
                <a href={video?.url} title={video?.title} className="text-color" target="_blank">
                    <div className="grid">
                        <div className="col col-12 md:col-4">
                            <img
                                style={{ maxHeight: '130px', objectFit: 'contain' }}
                                src={video?.imgThumbnailUrl ? `${process.env.API_URL}${video?.imgThumbnailUrl}` : `${contextPath}/layout/images/logo.jpg`}
                                alt={video?.title}
                                className="w-full border-1 border-solid surface-border border-round"
                            />
                        </div>
                        <div className="col col-12 md:col-8">
                            <h4 className="mb-2 text-lg line-height-3 cut-line-2">{video?.title}</h4>
                            <div className="social-video">
                                <span className="mr-3 inline-block">
                                    <i className="pi mr-2 vertical-align-middle pi-eye"></i>
                                    {formatNumberThousands(video?.totalViewsCount)}
                                </span>
                                <span className="mr-3 inline-block">
                                    <i className="pi mr-2 vertical-align-middle pi-heart-fill"></i>
                                    {video?.totalLikesCount}
                                </span>
                                <span>
                                    <i className="pi mr-2 vertical-align-middle pi-comment"></i>
                                    {video?.totalCommentsCount}
                                </span>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        );
    };

    const TemplateInfoSocial = (value) => {
        const dataLineChartviews = [];
        const dataLineChartlikes = [];
        const dataLineChartComments = [];
        const labelsChart = [];

        const totalAvgLive = (((value?.liveGpmMinimal + value?.liveGpmMaximum) / 2) * value?.liveAvg) / 1000;
        const totalLiveRevenue = totalAvgLive * value?.totalLive;

        const totalAvgVideo = (((value?.videoGpmMinimal + value?.videoGpmMaximum) / 2) * value?.videoAvg) / 1000;
        const totalVideoRevenue = totalAvgVideo * value?.totalVideo;
        const totalRevenue = totalVideoRevenue + totalLiveRevenue;

        if (value?.profileMeasurements.length > 0) {
            _.orderBy(value?.profileMeasurements, ['timestamp'], ['asc'])?.map((value) => {
                labelsChart.push(moment.unix(value?.timestamp).format('DD/MM'));
                dataLineChartviews.push(value?.viewsCount);
                dataLineChartlikes.push(value?.likesCount);
                dataLineChartComments.push(value?.commentsCount);
            });
        }

        const totalVideos = value?.totalVideosCount > 15 ? 15 : value?.totalVideosCount;
        const averageViews = value?.totalViewsCount / totalVideos;
        const dataLikesPerViews = calculateAndCutomChartForInteract(!!value?.totalViewsCount ? value?.totalLikesCount / value?.totalViewsCount : 0, defineTypeChart?.likeView);
        const dataSharesPerViews = calculateAndCutomChartForInteract(!!value?.totalViewsCount ? value?.totalSharesCount / value?.totalViewsCount : 0, defineTypeChart?.shareView);
        const dataCommentsPerViews = calculateAndCutomChartForInteract(!!value?.totalViewsCount ? value?.totalCommentsCount / value?.totalViewsCount : 0, defineTypeChart?.commentView);
        const dataViewsPerFollowers = calculateAndCutomChartForInteract(!!value?.totalViewsCount ? averageViews / value?.totalFollowersCount : 0, defineTypeChart?.viewFollower);

        return (
            <>
                <div className="section-social-kols-detail block-Statistical-social text-white">
                    <div className="grid">
                        <div className="items-Statistical col col-12 md:col-4 text-center">
                            Followers
                            <br />
                            <strong className="block">{formatNumberThousands(value?.totalFollowersCount)}</strong>
                        </div>
                        <div className="items-Statistical col col-12 md:col-4 text-center">
                            Tỉ lệ tương tác
                            <i
                                className="pi pi-info-circle custom-target-persent ml-2 mr-1 cursor-pointer"
                                data-pr-tooltip="Tỉ lệ tương tác: Tổng số lượt thích, bình luận, chia sẽ/ Tổng số lượt  xem của 15 video gần nhất"
                                data-pr-position="bottom"
                                data-pr-at="center top-38"
                                data-pr-my="center"
                            ></i>
                            <Tooltip target=".custom-target-persent" />
                            <br />
                            <strong className="block">{calculateEngagementRate(value?.totalLikesCount, value?.totalCommentsCount, value?.totalSharesCount, value?.totalViewsCount)}</strong>
                        </div>
                        <div className="items-Statistical col col-12 md:col-4 text-center">
                            View trung bình
                            <i
                                className="pi pi-info-circle custom-target-persent-view-video ml-2 mr-1 cursor-pointer"
                                data-pr-tooltip="Lượt view trung bình của 15 video gần nhất của Influencer."
                                data-pr-position="bottom"
                                data-pr-at="center top-38"
                                data-pr-my="center"
                            ></i>
                            <Tooltip target=".custom-target-persent-view-video" />
                            <br />
                            <strong className="block">{formatNumberThousands(value?.totalViewsCount / totalVideos) ?? 'N/A'}</strong>
                        </div>
                    </div>
                </div>
                <div className="section-social-kols-detail block-sales-social">
                    <h3 className="title-section block">Chỉ số bán hàng</h3>
                    <div className="grid">
                        <div className="col col-12 md:col-4 text-center">
                            <div className="items-sales py-4 border-2 border-round-lg border-primary">
                                <b>Tổng doanh thu kênh</b>
                                <i
                                    className="pi pi-info-circle total-channel-revenue ml-2 mr-1 cursor-pointer"
                                    data-pr-tooltip="Tổng doanh thu của toàn kênh Tiktok trong 30 ngày gần nhất"
                                    data-pr-position="bottom"
                                    data-pr-at="center top-25"
                                    data-pr-my="center"
                                ></i>
                                <Tooltip target=".total-channel-revenue" />
                                <br />
                                <span className="block">{totalRevenue ? formatPriceVnd(totalRevenue) : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="col col-12 md:col-4 text-center">
                            <div className="items-sales py-4 border-2 border-round-lg border-primary">
                                <b>Tổng doanh thu Video</b>
                                <i
                                    className="pi pi-info-circle total-video-revenue ml-2 mr-1 cursor-pointer"
                                    data-pr-tooltip="Tổng doanh thu của Video Tiktok có gắn sản phẩm trong 30 ngày gần nhất"
                                    data-pr-position="bottom"
                                    data-pr-at="center top-25"
                                    data-pr-my="center"
                                ></i>
                                <Tooltip target=".total-video-revenue" />
                                <br />
                                <span className="block">{totalVideoRevenue ? formatPriceVnd(totalVideoRevenue) : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="col col-12 md:col-4 text-center">
                            <div className="items-sales py-4 border-2 border-round-lg border-primary">
                                <b>Tổng doanh thu Live</b>
                                <i
                                    className="pi pi-info-circle total-live-revenue ml-2 mr-1 cursor-pointer"
                                    data-pr-tooltip="Tổng doanh thu của Livestream Tiktok có gắn sản phẩm trong 30 ngày gần nhất"
                                    data-pr-position="bottom"
                                    data-pr-at="center top-25"
                                    data-pr-my="center"
                                ></i>
                                <Tooltip target=".total-live-revenue" />
                                <br />
                                <span className="block">{totalLiveRevenue ? formatPriceVnd(totalLiveRevenue) : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="col col-12 md:col-4 text-center">
                            <div className="items-sales py-4 border-2 border-round-lg border-primary">
                                <b>Tổng lượt bán</b>
                                <i
                                    className="pi pi-info-circle total-sales ml-2 mr-1 cursor-pointer"
                                    data-pr-tooltip="Tổng số sản phẩm đã bán bởi Tiktok Influencer cho đến hiện tại"
                                    data-pr-position="bottom"
                                    data-pr-at="center top-25"
                                    data-pr-my="center"
                                ></i>
                                <Tooltip target=".total-sales" />
                                <br />
                                <span className="block">{value?.totalProductsSoldCount ?? 'N/A'}</span>
                            </div>
                        </div>
                        <div className="col col-12 md:col-4 text-center">
                            <div className="items-sales py-4 border-2 border-round-lg border-primary">
                                <b>Doanh thu / Video</b>
                                <i
                                    className="pi pi-info-circle total-avg-video ml-2 mr-1 cursor-pointer"
                                    data-pr-tooltip="Doanh thu trung bình của 1 Video Tiktok có gắn sản phẩm trong 30 ngày gần nhất"
                                    data-pr-position="bottom"
                                    data-pr-at="center top-25"
                                    data-pr-my="center"
                                ></i>
                                <Tooltip target=".total-avg-video" />
                                <br />
                                <span className="block">{totalAvgVideo ? formatPriceVnd(totalAvgVideo) : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="col col-12 md:col-4 text-center">
                            <div className="items-sales py-4 border-2 border-round-lg border-primary">
                                <b>Doanh thu / Live</b>
                                <i
                                    className="pi pi-info-circle total-avg-live ml-2 mr-1 cursor-pointer"
                                    data-pr-tooltip="Doanh thu trung bình của 1 phiên Livestream Tiktok có gắn sản phẩm trong 30 ngày gần nhất"
                                    data-pr-position="bottom"
                                    data-pr-at="center top-25"
                                    data-pr-my="center"
                                ></i>
                                <Tooltip target=".total-avg-live" />
                                <br />
                                <span className="block">{totalAvgLive ? formatPriceVnd(totalAvgLive) : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section-social-kols-detail block-trend-social">
                    <h3 className="title-section block">Xu hướng</h3>
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
                    </TabView>
                </div>
                <div className="section-social-kols-detail block-interaction-index-social">
                    <h3 className="title-section block">Chỉ số tương tác</h3>
                    <div className="box-interaction">
                        <div className="grid">
                            <TempalteItemsInteraction
                                dataChartDoughnut={{
                                    icon: 'pi-eye',
                                    title: defineTypeChart?.viewFollower,
                                    ...dataViewsPerFollowers
                                }}
                            />
                            <TempalteItemsInteraction
                                dataChartDoughnut={{
                                    icon: 'pi-heart',
                                    title: defineTypeChart?.likeView,
                                    ...dataLikesPerViews
                                }}
                            />
                            <TempalteItemsInteraction
                                dataChartDoughnut={{
                                    icon: 'pi-comments',
                                    title: defineTypeChart?.commentView,
                                    ...dataCommentsPerViews
                                }}
                            />
                            <TempalteItemsInteraction
                                dataChartDoughnut={{
                                    icon: 'pi-share-alt',
                                    title: defineTypeChart?.shareView,
                                    ...dataSharesPerViews
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="section-social-kols-detail block-followers-social">
                    <h3 className="title-section block mb-4">Follower của influencer</h3>
                    <div className="box-followers">
                        <div className="grid">
                            <TempalteItemsFollowers
                                key="chartDoughnutGender"
                                dataChartDoughnutMulti={{
                                    element: 'chartDoughnutGender',
                                    icon: 'pi-user',
                                    label: 'Giới tính',
                                    data: [
                                        {
                                            value: value?.genderFemaleRatio,
                                            name: 'Nữ',
                                            className: 'chart-bg-indigo-500',
                                            meta: 'Nữ'
                                        },
                                        {
                                            value: value?.genderMaleRatio,
                                            name: 'Nam',
                                            className: 'chart-bg-blue-500',
                                            meta: 'Nam'
                                        }
                                    ]
                                }}
                            />

                            <TempalteItemsFollowers
                                key="chartDoughnutAge"
                                dataChartDoughnutMulti={{
                                    element: 'chartDoughnutAge',
                                    icon: 'pi-stopwatch',
                                    label: 'Độ tuổi',
                                    data: [
                                        {
                                            value: value?.age1824Ratio,
                                            name: '18-24',
                                            className: 'chart-bg-indigo-500',
                                            meta: '18-24'
                                        },
                                        {
                                            value: value?.age2534Ratio,
                                            name: '25-34',
                                            className: 'chart-bg-blue-500',
                                            meta: '25-34'
                                        },
                                        {
                                            value: value?.ageOver35Ratio,
                                            name: '35 trở lên',
                                            className: 'chart-bg-green-500',
                                            meta: '35 trở lên'
                                        }
                                    ]
                                }}
                            />
                        </div>
                    </div>
                </div>
                {videos.length > 0 && (
                    <div className="section-social-kols-detail block-videos-social">
                        <h3 className="title-section block mb-4">Video mới nhất</h3>
                        <div className="box-videos">
                            <Carousel
                                value={videos}
                                autoplayInterval={3000}
                                showNavigators={false}
                                showIndicators={false}
                                numVisible={2}
                                numScroll={1}
                                orientation={isMobile ? `horizontal` : `vertical`}
                                verticalViewPortHeight="300px"
                                itemTemplate={videosTemplate}
                                responsiveOptions={responsiveOptions}
                            />
                        </div>
                    </div>
                )}
            </>
        );
    };

    const InfoBankTempalte = () => {
        return (
            <>
                {!!infoKol && !!infoKol.bankAccountResponse && (
                    <div className="section-social-kols-detail">
                        <h3 className="title-section block mb-4">Thông tin thanh toán</h3>
                        {infoKol.bankAccountResponse?.map((e, index) => (
                            <div>
                                <div className="grid" key={e.accountNumber}>
                                    <div className="col-6">
                                        <div className="text-left ">Ngân hàng:</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="text-right ">{findBankNameByCode(e?.bankCode)}</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="text-left ">Số tài khoản:</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="text-right ">{e?.accountNumber}</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="text-left ">Tên tài khoản:</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="text-right ">{e?.accountName}</div>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        ))}
                    </div>
                )}

                {!!infoKol && (
                    <div className="section-social-kols-detail">
                        <h3 className="title-section block mb-4">Địa chỉ nhận hàng review</h3>
                        <div className="grid">
                            <div className="col-6">
                                <div className="text-left ">Người nhận:</div>
                            </div>
                            <div className="col-6">
                                <div className="text-right ">{infoKol?.consigneeName}</div>
                            </div>
                            <div className="col-6">
                                <div className="text-left ">Số điện thoại:</div>
                            </div>
                            <div className="col-6">
                                <div className="text-right ">{infoKol?.deliveryPhone}</div>
                            </div>
                            <div className="col-6">
                                <div className="text-left ">Địa chỉ:</div>
                            </div>
                            <div className="col-6">
                                <div className="text-right ">
                                    {infoKol?.specificAddress} {infoKol?.ward}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <>
            <Toast ref={toastTopLeft} position="top-left" />
            <Toast ref={toastCopy} position="top-left" />
            {TemplateHeaderSocial(dataKols)}
            {!data && <Message severity="warn" text="Không có dữ liệu" className="w-full mt-3 justify-content-start" />}
            {!!data && TemplateInfoSocial(data)}
            {InfoBankTempalte()}
        </>
    );
};

export default TabTiktok;
