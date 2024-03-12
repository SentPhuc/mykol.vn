import { DataView } from 'primereact/dataview';
import { GlobalService } from 'demo/service/GlobalService';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import SidebarTiktok from 'pages/components/homepage/recruitment/SidebarTiktok';
import { Toast } from 'primereact/toast';
import ItemKol from 'pages/components/homepage/search-kol/ItemKol';

const ListKOL = () => {
    const global = new GlobalService();
    const [visibleSidebar, setVisibleSidebar] = useState(false);
    const [userName, setUserName] = useState('');
    const toast = useRef(null);
    const formRef = useRef(null);
    const [datas, setDatas] = useState();

    useEffect(() => {
        global
            .getKOL()
            .then((data) => {
                if (data?.data?.code === 'success') {
                    setDatas(data?.data?.data);
                }
            })
            .catch((error) => console.error(error));

        const handleClickEvent = (event) => {
            if (!!formRef && !!formRef.current && !formRef?.current?.contains(event?.target)) {
                setShowCareer(false);
                setShowBookingPrice(false);
            }
        };

        document.body.addEventListener('click', handleClickEvent);

        return () => {
            document.body.removeEventListener('click', (e) => handleClickEvent(e));
        };
    }, []);

    const handleShowProfile = (data) => {
        if (!data?.username) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Dữ liệu trống', life: 3000 });
            return;
        }
        setUserName(data?.username);
        setVisibleSidebar(true);
    };

    if (datas?.length == 0) return <></>;

    const TemplatePage = (rowData) => {
        return <ItemKol data={rowData} handleShowProfile={handleShowProfile} template={3} />;
    };

    return (
        <>
            <Toast ref={toast} />
            <div id="search-kol-home" className="w-full bg-white">
                <div className="container">
                    <div className="card pb-3 pl-0 pr-0 pt-0 shadow-1 mt-0 md:mb-5 mb-3 border-round-2xl w-full">
                        <DataView value={datas} itemTemplate={TemplatePage} />
                        <div className="text-right mt-0 mr-3">
                            <a className="view-all-koc inline-block" href="/components/search-kocs" title="Xem tất cả">
                                <span>
                                    Xem tất cả <i className="pi pi-angle-double-right"></i>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <SidebarTiktok username={userName} setVisibleSidebar={setVisibleSidebar} visibleSidebar={visibleSidebar} />
        </>
    );
};

export default ListKOL;
