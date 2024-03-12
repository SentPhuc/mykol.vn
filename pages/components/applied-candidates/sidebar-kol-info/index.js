import { TabView, TabPanel } from 'primereact/tabview';
import TabTiktok from './TabTiktok';
import { GlobalService } from 'demo/service/GlobalService';
import getConfig from 'next/config';
import { useEffect,useState } from 'react';
import { ACTIVITY_PLATFORM_ENUM } from 'src/commons/Utils';

const SidebarKOLInfo = ({ dataKolsDetail,visible }) => {
    const [dataTiktok, setDataTiktok] = useState([]);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    
    useEffect(async () => {
        try {
            const res = await new GlobalService().getDetailKolsIgnorePublic(dataKolsDetail.mask, dataKolsDetail.kolId);
            if (res.data.code === 'success') {
                const data = res.data.data;
                const url = data?.socialNetworks?.filter((value) => !!value.url && ACTIVITY_PLATFORM_ENUM?.[1]?.code == value.socialNetworkCode);
                setDataTiktok({
                    zalo: data?.phoneNumber,
                    email: data?.email,
                    fullName: data?.fullName,
                    profileImage: data?.profileImage,
                    url: url?.[0]?.url ?? '',
                    careerFields: data?.careerFields,
                    messener: data?.messenger,
                    mask: dataKolsDetail?.mask,
                    kolId: dataKolsDetail?.kolId,
                    jobId: dataKolsDetail?.jobId,
                });
            }

            if (res.data.data == null) {
                setDataTiktok({
                    fullName: dataKolsDetail?.kolName,
                });
            }
        } catch (error) {
            console.log(error);
        }
    },[!!visible]);

    const headerTabTiktok = (options) => {
        return (
            <div onClick={options.onClick} className={options.className}>
                <img className="mr-2" src={`${contextPath}/demo/images/social/icon-tiktok-tab.svg`} alt="Tiktok" />
                <img className="mr-2 active" src={`${contextPath}/demo/images/social/icon-tiktok-tab-active.svg`} alt="Tiktok" />
                Tiktok
            </div>
        );
    };

    const headerTabFacebook = (options) => {
        return (
            <div onClick={options.onClick} className={options.className}>
                <i className="pi pi-facebook mr-2"></i>
                Facebook
            </div>
        );
    };

    const headerTabInstagram = (options) => {
        return (
            <div onClick={options.onClick} className={options.className}>
                <i className="pi pi-instagram mr-2"></i>
                Instagram
            </div>
        );
    };

    const headerTabYoutube = (options) => {
        return (
            <div onClick={options.onClick} className={options.className}>
                <i className="pi pi-youtube mr-2"></i>
                Youtube
            </div>
        );
    };

    return (
        <div className="pl-2 md:pl-3 pr-2 md:pr-3 custom">
            <TabView>
                <TabPanel header="Tiktok" headerTemplate={headerTabTiktok} headerClassName="flex align-items-center header-tabs">
                    <TabTiktok key='TabTiktok' dataKols={dataTiktok} visible={visible} />
                </TabPanel>
                <TabPanel header="Facebook" headerTemplate={headerTabFacebook} headerClassName="flex align-items-center header-tabs">
                    Pending for Facebook
                </TabPanel>
                <TabPanel header="Instagram" headerTemplate={headerTabInstagram} headerClassName="flex align-items-center header-tabs">
                    Pending for Instagram
                </TabPanel>
                <TabPanel header="Youtube" headerTemplate={headerTabYoutube} headerClassName="flex align-items-center header-tabs">
                    Pending for Youtube
                </TabPanel>
            </TabView>
        </div>
    );
};

export default SidebarKOLInfo;
