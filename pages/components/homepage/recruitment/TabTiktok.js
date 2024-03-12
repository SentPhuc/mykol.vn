import { useEffect, useState, useRef } from 'react';
import { Avatar } from 'primereact/avatar';
import { GlobalService } from 'demo/service/GlobalService';
import getConfig from 'next/config';
import { formatNumberThousands, formatPriceVnd, calculateAndCutomChartForInteract, defineTypeChart } from 'src/commons/Utils';
import { Message } from 'primereact/message';
import { Chip } from 'primereact/chip';
import { Tooltip } from 'primereact/tooltip';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { TabView, TabPanel } from 'primereact/tabview';
import ChartLine from './chart/ChartLine';
import ChartDoughnut from './chart/ChartDoughnut';
import ChartDoughnutMultiData from './chart/ChartDoughnutMultiData';
import { Toast } from 'primereact/toast';
import { isMobile } from 'react-device-detect';
import moment from 'moment';
import _ from 'lodash';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useSelector, useDispatch } from 'react-redux';
import { openPopupLogin } from 'public/reduxConfig/loginSlice';
import { SubscriptionService } from 'demo/service/SubscriptionService';
import SidebarInfluencer from 'pages/components/search-tiktok-candidates/SidebarInfluencer';

const TabTiktok = ({ username, visible, setVisibleSidebar }) => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
    const [infoPackage, setInfoPackage] = useState();
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingRefres, setLoadingRefres] = useState(false);
    const [refresData, setRefresData] = useState(false);
    const [videos, setVideos] = useState([]);
    const [total, setTotal] = useState(0);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const toastTopLeft = useRef(null);
    const toastCopy = useRef(null);
    const [showEmailDetails, setShowEmailDetails] = useState(false);
    const [showZalo, setShowZalo] = useState(false);
    const subscription = new SubscriptionService();
    const globalService = new GlobalService();
    const [isLogin, setIsLogin] = useState(false);
    const getStorage = typeof window !== 'undefined' ? localStorage : {};
    const [dataTiktoker, setDataTiktoker] = useState([]);
    const [changing, setChanging] = useState(false);
    const [visibleRight, setVisibleRight] = useState(false);

    useEffect(() => {
        // if (getStorage?.role == 'KOLIFL') {
        //     setVisibleSidebar(false);
        // }
        setIsLogin(isLoggedIn);
    }, [isLoggedIn]);

    useEffect(async () => {
        if (!visible) return;
        setLoading(true);
        try {
            if (!!username) {
                const res = await globalService.getDetailTiktokProfileNotLogin(username);
                if (res.data.code == 'success') {
                    setDataTiktoker(res?.data?.data);
                    setData(res?.data?.data);
                    if (res?.data?.data?.tiktokProfileVideos) {
                        setVideos(res?.data?.data?.tiktokProfileVideos);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    }, [visible, username, total, refresData, changing]);

    useEffect(() => {
        if (!isLoggedIn) return;
        subscription
            .getMySubscriptionsPackage()
            .then((data) => {
                if (data?.data?.code === 'success') {
                    setInfoPackage(data?.data?.data);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, [isLoggedIn]);

    const onCopyHandler = async (email, isEmailCopy) => {
        if (isEmailCopy) {
            setShowEmailDetails(!showEmailDetails);
        } else {
            setShowZalo(!showZalo);
        }

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

    const templateAvatar = (resizedAvatarPath) => {
        if (!!resizedAvatarPath) {
            return !loading ? <Avatar image={process.env.MEDIA_URL + '/' + resizedAvatarPath} shape="circle" alt="Influx" /> : <Skeleton shape="circle" size="5rem"></Skeleton>;
        } else {
            return <Avatar image={`${contextPath}/demo/images/avatar/no-avatar.png`} shape="circle" alt="Influx" />;
        }
    };

    const getUrl = (username) => {
        return `https://www.tiktok.com/@${username}`;
    };

    const handleRefreshData = () => {
        const today = moment(new Date()).format('YYYY-MM-DD');
        const lastCrawlTime = moment(data?.lastCrawlTime).format('YYYY-MM-DD');
        if ((!!data?.lastCrawlTime && moment(today).isSameOrBefore(lastCrawlTime)) || !data?.username) return <></>;

        const refreshData = () => {
            setLoadingRefres(true);
            globalService
                .refreshTiktokProfiles(data?.username)
                .then((res) => {
                    if (res?.data?.code == 'success') {
                        setRefresData(!refreshData);
                        toastTopLeft.current.show({ severity: 'success', summary: 'Thông báo', detail: 'Dữ liệu đang được cập nhật, vui lòng chờ 3-5 phút', life: 3000 });
                    }
                })
                .catch((error) => {
                    console.error(error);
                    toastTopLeft.current.show({ severity: 'error', summary: 'Thông báo', detail: 'Làm mới thấy bại', life: 3000 });
                })
                .finally(() => setLoadingRefres(false));
        };
        return (
            <div className="mb-5 font-bold flex align-items-center flex-wrap">
                Dữ liệu được cập nhật đến ngày {moment(data?.lastCrawlTime).format('DD/MM/YYYY')} <Button disabled={loadingRefres} loading={loadingRefres} onClick={() => refreshData()} className="py-2 ml-2" label="Làm mới" />
            </div>
        );
    };

    const reject = () => (window.location.href = '/components/service-packages-and-payments/');

    const handleSave = () => {
        if (getStorage && !getStorage.accountId) {
            dispatch(openPopupLogin());
            return;
        }
        setVisibleRight(true);
    };

    const TemplateHeaderSocial = () => {
        const handleShowInfoSocial = (data, type) => {
            if (!isLoggedIn) {
                dispatch(openPopupLogin());
                return;
            }

            if (!!infoPackage && infoPackage?.name == 'Trải nghiệm') {
                setVisibleDialog(true);
                return;
            }
            if (type == 'zalo') {
                setShowZalo(data);
                return;
            }
            setShowEmailDetails(data);
        };

        return (
            <>
                <div className="header-social-kols-detail section-social-kols-detail">
                    <div className="top-header-social">
                        <div className="grid">
                            <div className="images text-center col col-12 md:col-4">
                                {templateAvatar(data?.resizedAvatarPath)}
                                <br />
                                <a className="text-primary underline font-bold" target="_blank" href={getUrl(data?.username)} title="Xem kênh">
                                    Xem kênh
                                </a>
                                <div className="text-center mt-2">{data?.bio}</div>
                                <a className="text-center underline" target="_blank" href={data?.bioUrl} title={data?.bioUrl}>
                                    {data?.bioUrl}
                                </a>
                            </div>
                            <div className="info col col-12 md:col-6 py-0">
                                <h3 className="title-section title-name capitalize block text-primary">{data?.fullName}</h3>
                                <div className="box-careerFields">
                                    {!isMobile &&
                                        !!data?.profileCategories &&
                                        data?.profileCategories?.slice(0, 4)?.map((item, mainIndustryStarlingKey) => <Chip className="mr-2 mb-2 cursor-pointer" key={mainIndustryStarlingKey} label={item.name} />)}
                                    {!isMobile && !!data?.profileCategories && data?.profileCategories.length > 4 && careerFieldsOther(data?.profileCategories?.[4].value)}
                                    {!!isMobile && !!data?.profileCategories && data?.profileCategories?.map((item, mainIndustryStarlingKey) => <Chip className="mr-2 mb-2 cursor-pointer" key={mainIndustryStarlingKey} label={item.name} />)}
                                </div>
                            </div>
                            {isLoggedIn && (
                                <div className="col col-12 md:col-2">
                                    <Button label={`${data?.tiktokSaveListIds?.length > 0 ? 'Đã lưu' : 'Lưu'}`} className="cbutton-raisedt" onClick={() => handleSave()} />
                                </div>
                            )}
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

    const TemplateHiddenForNotLogin = () => {
        if (!!isLogin || getStorage?.role == 'REC') return <></>;

        return (
            <div className="box-hidden-data">
                <div className="box p-4 border-round">
                    <h3>Vui lòng đăng nhập tài khoản "Nhà Tuyển Dụng"</h3>
                    <span>Đăng nhập tài khoản Nhà tuyển dụng để xem miễn phí dữ liệu chi tiết</span>
                    <div className="mt-3">
                        <Button onClick={() => dispatch(openPopupLogin())} label="Đăng nhập ngay" />
                    </div>
                </div>
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

        if (value?.profileMeasurements?.length > 0) {
            _.orderBy(value?.profileMeasurements, ['timestamp'], ['asc'])?.map((value) => {
                labelsChart.push(moment.unix(value?.timestamp).format('DD/MM'));
                dataLineChartviews.push(value?.viewsCount);
                dataLineChartlikes.push(value?.likesCount);
                dataLineChartComments.push(value?.commentsCount);
            });
        }

        const totalViewsCount = value?.profileMeasurements?.reduce((a, b) => a + b?.viewsCount, 0);
        const totalLikesCount = value?.profileMeasurements?.reduce((a, b) => a + b?.likesCount, 0);
        const totalCommentsCount = value?.profileMeasurements?.reduce((a, b) => a + b?.commentsCount, 0);

        const dataLikesPerViews = calculateAndCutomChartForInteract(!!totalViewsCount ? totalLikesCount / totalViewsCount : 0, defineTypeChart?.likeView);
        const dataCommentsPerViews = calculateAndCutomChartForInteract(!!totalViewsCount ? totalCommentsCount / totalViewsCount : 0, defineTypeChart?.commentView);

        return (
            <>
                <div className="section-social-kols-detail block-Statistical-social text-white">
                    <div className="grid">
                        <div className="items-Statistical col col-12 md:col-6 text-center">
                            Followers
                            <br />
                            <strong className="block">{formatNumberThousands(value?.totalFollowersCount)}</strong>
                        </div>

                        <div className="items-Statistical col col-12 md:col-6 text-center">
                            Tổng doanh thu kênh
                            <i
                                className="pi pi-info-circle custom-target-persent-view-video ml-2 mr-1 cursor-pointer"
                                data-pr-tooltip="Lượt view trung bình của 15 video gần nhất của Influencer."
                                data-pr-position="bottom"
                                data-pr-at="center top-38"
                                data-pr-my="center"
                            ></i>
                            <Tooltip target=".custom-target-persent-view-video" />
                            <br />
                            <strong className="block">{totalRevenue ? formatPriceVnd(totalRevenue) : 'N/A'}</strong>
                        </div>
                    </div>
                </div>
                <div className="section-social-kols-detail block-sales-social">
                    <h3 className="title-section block">Chỉ số bán hàng</h3>
                    <div className="grid">
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
                                <b>View trung bình / Video</b>
                                <i
                                    className="pi pi-info-circle total-channel-revenue ml-2 mr-1 cursor-pointer"
                                    data-pr-tooltip="Lượt xem trung bình của 1 Video Tiktok có gắn sản phẩm trong 30 ngày gần nhất"
                                    data-pr-position="bottom"
                                    data-pr-at="center top-25"
                                    data-pr-my="center"
                                ></i>
                                <Tooltip target=".total-channel-revenue" />
                                <br />
                                <span className="block">{value?.videoAvg ? formatNumberThousands(value?.videoAvg) : 'N/A'}</span>
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
                        <div className="col col-12 md:col-4 text-center">
                            <div className="items-sales py-4 border-2 border-round-lg border-primary">
                                <b>View trung bình / Live</b>
                                <i
                                    className="pi pi-info-circle total-sales ml-2 mr-1 cursor-pointer"
                                    data-pr-tooltip="Lượt xem trung bình của 1 phiên Livestream Tiktok có gắn sản phẩm trong 30 ngày gần nhất"
                                    data-pr-position="bottom"
                                    data-pr-at="center top-25"
                                    data-pr-my="center"
                                ></i>
                                <Tooltip target=".total-sales" />
                                <br />
                                <span className="block">{value?.liveAvg ? formatNumberThousands(value?.liveAvg) : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <TemplateHiddenForNotLogin />
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
                    {data?.tiktokProfileVideos?.length > 0 && (
                        <div className="section-social-kols-detail block-videos-social mb-3">
                            <h3 className="title-section block mb-4">Video có gắn sản phẩm</h3>
                            <div className="box-videos">
                                {data?.tiktokProfileVideos.map((video, index) => {
                                    return (
                                        <div key={index} className="item-videos cursor-pointer">
                                            <a href={video?.url} title={video?.title} className="text-color" target="_blank">
                                                <div className="grid">
                                                    <div className="col col-12 md:col-4" style={{ height: '130px' }}>
                                                        <div className="relative h-full">
                                                            <img
                                                                style={{ objectFit: 'contain' }}
                                                                src={video?.thumbnailUrl ? `${process.env.MEDIA_URL}/${video?.thumbnailUrl}` : `${contextPath}/layout/images/logo.jpg`}
                                                                alt={video?.title}
                                                                height={130}
                                                                className="w-full border-1 border-solid surface-border border-round overflow-hidden h-full absolute left-0 top-0"
                                                            />
                                                        </div>
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
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </>
        );
    };

    return (
        <>
            <SidebarInfluencer setChanging={setChanging} changing={changing} dataTiktoker={dataTiktoker} visibleRight={visibleRight} setVisibleRight={setVisibleRight} />
            <Toast ref={toastTopLeft} position="top-left" />
            <Toast ref={toastCopy} position="top-left" />
            <ConfirmDialog
                style={{ maxWidth: '320px' }}
                visible={visibleDialog}
                onHide={() => setVisibleDialog(false)}
                header="Bạn cần đăng ký gói trả phí để xem thông tin liên hệ"
                rejectClassName="m-auto"
                acceptClassName="hidden"
                rejectLabel="Xem bảng giá"
                reject={reject}
            />
            {TemplateHeaderSocial()}
            {!data && <Message severity="warn" text="Không có dữ liệu" className="w-full mt-3 justify-content-start mb-3" />}
            {!!data && TemplateInfoSocial(data)}
            {handleRefreshData()}
            <blockquote className="block-pink mb-0">
                <span className="font-bold text-red-500">Lưu ý:</span> Các số liệu được ước tính dựa trên các thuật toán của chúng tôi và chỉ mang tính chất tham khảo.
            </blockquote>
        </>
    );
};

export default TabTiktok;
