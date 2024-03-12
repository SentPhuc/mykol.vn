import TabTiktok from './TabTiktok';
import { Sidebar } from 'primereact/sidebar';
import { TabPanel, TabView } from 'primereact/tabview';
import getConfig from 'next/config';

const SidebarTiktok = ({ visibleSidebar, setVisibleSidebar, changing, setChanging, setVisibleRight, username }) => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    
    const headerTabTiktok = (options) => {
        return (
            <div onClick={options.onClick} className={options.className}>
                <img className="mr-2" src={`${contextPath}/demo/images/social/icon-tiktok-tab.svg`} alt="Tiktok" />
                <img className="mr-2 active" src={`${contextPath}/demo/images/social/icon-tiktok-tab-active.svg`} alt="Tiktok" />
                Tiktok
            </div>
        );
    };

    return (
        <Sidebar visible={visibleSidebar} position="right" onHide={() => setVisibleSidebar(false)} className="custom-sidebar">
            <div className="pl-2 md:pl-3 pr-2 md:pr-3 custom relative">
                <TabView>
                    <TabPanel header="Tiktok" headerTemplate={headerTabTiktok} headerClassName="flex align-items-center header-tabs">
                        <TabTiktok key="TabTiktok" setChanging={setChanging} changing={changing} setVisibleRight={setVisibleRight} username={username} visible={visibleSidebar} />
                    </TabPanel>
                </TabView>
                <img className="logoPopup" src={`${contextPath}/layout/images/logo.jpg`} width="70" height={'30'} alt="logo" />
            </div>
        </Sidebar>
    );
};

export default SidebarTiktok;
