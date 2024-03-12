import { useEffect, useState } from 'react';
import { CampaignService } from 'demo/service/CampaignService';

const PostRffect = ({ campaignId, url }) => {
    const [issetData, setIssetData] = useState(false);
    const campaignService = new CampaignService();
    useEffect(async () => {
        try {
            if (!campaignId) return;
            const { data } = await campaignService.getCampaignDetailPerformance(campaignId,{
                startDate: null,
                endDate: null
            });
            if (data.code == 'success') {
                setIssetData(data?.data?.totalPost > 0 && data?.data?.measurementResponseList?.length > 0);
            }
        } catch (error) {
            console.error(error);
        }
    }, [campaignId]);

    const TemplateView = () => {
        if (issetData && url != null) {
            return (
                <a href={`/components/campaign-report/detail/${campaignId}/`} title="Xem báo cáo" className='text-blue-400 underline' target='_blank'>
                    Xem báo cáo
                </a>
            );
        }
        return 'Chưa có báo cáo';
    };
    return <TemplateView />;
};

export default PostRffect;
