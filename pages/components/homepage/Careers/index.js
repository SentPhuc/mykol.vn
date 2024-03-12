import { DataView } from 'primereact/dataview';
import ItemKol from '../search-kol/ItemKol';
import { GlobalService } from 'demo/service/GlobalService';
import SidebarTiktok from '../recruitment/SidebarTiktok';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
export default function Careers() {
    const [visibleSidebar, setVisibleSidebar] = useState(false);
    const [userName, setUserName] = useState('');
    const [dataFashion, setDataFashion] = useState([]);
    const [dataBeautify, setDataBeautify] = useState([]);
    const [dataCuisine, setDataCuisine] = useState([]);
    const global = new GlobalService();
    const router = useRouter();

    const idFashion = 3;
    const idBeautify = 2;
    const idCuisine = 1;

    useEffect(() => {
        //Thời trang
        global
            .getKolsInfluencerForCareers(idFashion)
            .then((data) => {
                if (data?.data?.code === 'success') {
                    setDataFashion(data?.data?.data.slice(0, 4));
                }
            })
            .catch((error) => console.error(error));

        //Làm đẹp
        global
            .getKolsInfluencerForCareers(idBeautify)
            .then((data) => {
                if (data?.data?.code === 'success') {
                    setDataBeautify(data?.data?.data.slice(0, 4));
                }
            })
            .catch((error) => console.error(error));

        //Ẩm thực
        global
            .getKolsInfluencerForCareers(idCuisine)
            .then((data) => {
                if (data?.data?.code === 'success') {
                    setDataCuisine(data?.data?.data.slice(0, 4));
                }
            })
            .catch((error) => console.error(error));
    }, []);

    const handleShowProfile = (data) => {
        if (!data?.username) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Dữ liệu trống', life: 3000 });
            return;
        }
        setUserName(data?.username);
        setVisibleSidebar(true);
    };

    const TemplatePage = (rowData) => {
        return <ItemKol data={rowData} handleShowProfile={handleShowProfile} />;
    };

    return (
        <>
            <div id="careers" className="w-full">
                {!!dataFashion && dataFashion.length > 0 && (
                    <div className="item-careers bg-white">
                        <div className="container">
                            <div className="card md:pb-6 pb-3 pl-3 pr-3 shadow-1 md:mt-6 mt-3 md:mb-3 my-3 border-round-2xl w-full">
                                <div className="header-careers">
                                    <div className="title-gradient-careers">Thời trang</div>
                                    <p>Tìm influencer trong lĩnh vực thời trang</p>
                                </div>
                                <DataView value={dataFashion} itemTemplate={TemplatePage} />
                                <div className="text-right mt-4 mr-3">
                                    <a className="view-all-koc inline-block cursor-pointer" onClick={() => router.push(`/components/search-kocs?careerCodes=${idFashion}`)} title="Xem tất cả">
                                        <span>
                                            Xem tất cả <i className="pi pi-angle-double-right"></i>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!!dataBeautify && dataBeautify.length > 0 && (
                    <div className="item-careers bg-white">
                        <div className="container">
                            <div className="card md:pb-6 pb-3 pl-3 pr-3 shadow-1 md:mt-6 mt-3 md:mb-3 my-3 border-round-2xl w-full">
                                <div className="header-careers">
                                    <div className="title-gradient-careers">Làm đẹp</div>
                                    <p>Tìm influencer trong lĩnh vực làm đẹp</p>
                                </div>
                                <DataView value={dataBeautify} itemTemplate={TemplatePage} />
                                <div className="text-right mt-4 mr-3">
                                    <a className="view-all-koc inline-block cursor-pointer" onClick={() => router.push(`/components/search-kocs?careerCodes=${idBeautify}`)} title="Xem tất cả">
                                        <span>
                                            Xem tất cả <i className="pi pi-angle-double-right"></i>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {!!dataCuisine && dataCuisine.length > 0 && (
                    <div className="item-careers bg-white">
                        <div className="container">
                            <div className="card md:pb-6 pb-3 pl-3 pr-3 shadow-1 md:mt-6 mt-3 md:mb-3 my-3 border-round-2xl w-full">
                                <div className="header-careers">
                                    <div className="title-gradient-careers">Ẩm thực</div>
                                    <p>Tìm influencer trong lĩnh vực ẩm thực</p>
                                </div>
                                <DataView value={dataCuisine} itemTemplate={TemplatePage} />
                                <div className="text-right mt-4 mr-3">
                                    <a className="view-all-koc inline-block cursor-pointer" onClick={() => router.push(`/components/search-kocs?careerCodes=${idCuisine}`)} title="Xem tất cả">
                                        <span>
                                            Xem tất cả <i className="pi pi-angle-double-right"></i>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <SidebarTiktok username={userName} setVisibleSidebar={setVisibleSidebar} visibleSidebar={visibleSidebar} />
        </>
    );
}
