import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Paginator } from 'primereact/paginator';
import { Column } from 'primereact/column';
import { Tooltip } from 'primereact/tooltip';
import { Button } from 'primereact/button';
import AppLayout from 'layout/AppLayout';
import { defineSocialIcon, formatNumberThousands, formatPriceVnd } from 'src/commons/Utils';
import { useRouter } from 'next/router';
import { Toast } from 'primereact/toast';
import UploadCampaign from './UploadCampaign';
import { CampaignService } from 'demo/service/CampaignService';
import { calculateSerialNumber, calculateEngagementRate } from 'src/commons/Utils';
import BreadcrumbCustom from 'pages/commons/BreadcrumbCustom';

const CampaignReport = () => {
    const router = useRouter();
    const location = router.pathname;
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [changing, setChanging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reports, setReports] = useState([]);
    const [visibleUploadCampaign, setVisibleUploadCampaign] = useState(false);
    const toastNotiViewDetail = useRef(null);

    useEffect(async () => {
        try {
            setLoading(true);
            const { data } = await new CampaignService().getCampaigns({
                page: page,
                recordPage: pageSize
            });
            if (data.type === 'SUCCESS') {
                setReports(data.data.content);
            }
            setTotalRecords(data.data.totalElements);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    }, [changing, visibleUploadCampaign]);

    const onPageChange = (event) => {
        setPage(event.page + 1);
        setPageSize(event.rows);
        setChanging(!changing);
    };

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="header-left-table-report">
                <i className="pi pi-file text-2xl mr-3"></i>
                <span className="text-2xl text-900 font-bold">Báo cáo chiến dịch</span>
            </div>
            <div className="header-right-table-report">
                <Button onClick={() => setVisibleUploadCampaign(true)} label="Tải lên chiến dịch" />
                <i className="pi pi-info-circle custom-target-persent ml-2 mr-1 cursor-pointer" data-pr-tooltip="Bạn có thể tải lên và đo lường tối đa 3 chiến dịch." data-pr-position="right" data-pr-at="left top-40" data-pr-my="center"></i>
                <Tooltip target=".custom-target-persent" />
            </div>
        </div>
    );

    const PlatformBodyTemplate = (rowData) => {
        switch (rowData.socialNetworkCode) {
            case 1:
                return <div dangerouslySetInnerHTML={{ __html: defineSocialIcon['facebook'] }} />;
            case 2:
                return <div dangerouslySetInnerHTML={{ __html: defineSocialIcon['tiktok'] }} />;
            case 3:
                return <div dangerouslySetInnerHTML={{ __html: defineSocialIcon['instagram'] }} />;
            case 4:
                return <div dangerouslySetInnerHTML={{ __html: defineSocialIcon['youtube'] }} />;
            default:
                return <div dangerouslySetInnerHTML={{ __html: defineSocialIcon['tiktok'] }} />;
        }
    };

    const HeaderInteractionRate = (
        <>
            Tỉ lệ
            <br />
            tương tác
            <i
                className="pi pi-info-circle custom-target-persent ml-2 cursor-pointer vertical-align-middle	"
                data-pr-tooltip="Tỉ lệ tương tác = (Lượt thích + Lượt bình luận + Lượt chia sẽ) / tổng số view của tất cả video."
                data-pr-position="bottom"
                data-pr-at="center top-38"
                data-pr-my="center"
            ></i>
            <Tooltip target=".custom-target-persent" />
            <br />
        </>
    );

    const HeaderNumberInfluencer = (
        <>
            Số influencer
            <i
                className="pi pi-info-circle custom-target-persent ml-2 cursor-pointer vertical-align-middle"
                data-pr-tooltip="Số influencer đã được duyệt tham gia công việc."
                data-pr-position="bottom"
                data-pr-at="center top-38"
                data-pr-my="center"
            ></i>
            <Tooltip target=".custom-target-persent" />
            <br />
        </>
    );

    const handleViewsDetail = (rowData) => {
        if (rowData.socialNetworkCode == 2 || rowData.socialNetworkCode == null) {
            return router.push({
                pathname: '/components/campaign-report/detail/[id]',
                query: { id: rowData.id }
            });
        } else {
            return toastNotiViewDetail.current.show({ severity: 'warn', summary: 'Thông báo', detail: 'Tính năng chưa được phát triển', life: 3000 });
        }
    };

    const ViewDetailBodyTemplate = (rowData) => {
        return <Button onClick={() => handleViewsDetail(rowData)} className="text-sm px-1 py-2 lg:text-sm lg:px-2 lg:py-2" label="Xem chi tiết" />;
    };

    return AppLayout(
        <>
            <div className="layout-main">
                <div className="mb-4">
                    <BreadcrumbCustom path={location} />
                </div>
                <Toast ref={toastNotiViewDetail} position="top-right" />
                <UploadCampaign setReports={setReports} reports={reports} visibleUploadCampaign={visibleUploadCampaign} setVisibleUploadCampaign={setVisibleUploadCampaign} />
                <div className="card p-3 md:p-5">
                    <DataTable value={reports} header={header} loading={loading} scrollable tableStyle={{ minWidth: '70rem', width: '100%' }}>
                        <Column style={{ maxWidth: '40px' }} field="stt" header="#" body={(rowData, field) => calculateSerialNumber(field.rowIndex, page, pageSize)}></Column>
                        <Column style={{ maxWidth: '16%', flexBasis: '100%' }} header="Công việc" field="jobTitle"></Column>
                        <Column style={{ maxWidth: '100px' }} header="Nền tảng" body={PlatformBodyTemplate} headerClassName="justify-content-center text-center" bodyClassName="justify-content-center text-center"></Column>
                        <Column body={(rowData) => formatPriceVnd(rowData?.cost)} header="Chi tiêu chiến dịch" headerClassName="justify-content-center text-center" bodyClassName="justify-content-center text-center"></Column>
                        <Column
                            style={{ maxWidth: '200px' }}
                            body={(rowData) => (!!rowData?.totalViews ? formatNumberThousands(rowData?.totalViews) : 'n/a')}
                            header="Tổng lượt xem"
                            headerClassName="justify-content-center text-center"
                            bodyClassName="justify-content-center text-center"
                        ></Column>
                        <Column
                            header={HeaderInteractionRate}
                            body={(rowData) => calculateEngagementRate(rowData?.totalLikes, rowData?.totalComments, rowData?.totalShares, rowData?.totalViews)}
                            field="interactRate"
                            headerClassName="justify-content-center text-center"
                            bodyClassName="justify-content-center text-center"
                        ></Column>
                        <Column
                            header="Số bài đăng"
                            body={(rowData) => (!!rowData.totalPost ? rowData?.totalPost : 'n/a')}
                            field="totalPost"
                            headerClassName="justify-content-center text-center"
                            bodyClassName="justify-content-center text-center"
                        ></Column>
                        <Column
                            style={{ maxWidth: '200px' }}
                            header={HeaderNumberInfluencer}
                            body={(rowData) => (!!rowData.totalInfluencers ? rowData?.totalInfluencers : 'n/a')}
                            field="totalInfluencers"
                            headerClassName="justify-content-center text-center"
                            bodyClassName="justify-content-center text-center"
                        ></Column>
                        <Column style={{ maxWidth: '200px' }} header="" body={ViewDetailBodyTemplate} headerClassName="justify-content-center text-center" bodyClassName="justify-content-center text-center"></Column>
                    </DataTable>
                    <Paginator rowsPerPageOptions={[5, 10, 25, 50]} first={page * pageSize - 1} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />
                </div>
            </div>
        </>
    );
};

export default CampaignReport;
