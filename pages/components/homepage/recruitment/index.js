import { useState, useRef, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { GlobalService } from 'demo/service/GlobalService';
import SidebarTiktok from './SidebarTiktok';
import getConfig from 'next/config';

const Recruitment = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const getStorage = typeof window !== 'undefined' ? localStorage : {};
    const toast = useRef(null);
    const global = new GlobalService();
    const [keyword, setKeyWord] = useState('');
    const [listSearch, setListSearch] = useState([]);
    const [visibleSidebar, setVisibleSidebar] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [userName, setUserName] = useState('');

    const showWarn = () => {
        toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Hiện KOC này chưa có sẵn dữ liệu, chúng tôi đang tiến hành update, vui lòng chờ 3-5p và kiểm tra lại', life: 3000 });
    };

    const handleChangeKeyword = async (event) => setKeyWord(event.target.value);

    const handleSearchKol = async () => {
        if (!keyword) return;

        await global
            .searchKolsHomePage(keyword)
            .then((res) => {
                if (res?.data?.code == 'success') {
                    setListSearch(res?.data?.data);
                }
            })
            .catch((error) => console.error(error));
        setIsSearch(true);
    };

    useEffect(() => {
        if (!isSearch) return;

        // if (getStorage?.role === 'KOLIFL') {
        //     confirmDialog({
        //         message: 'Để mua gói dịch vụ này, bạn cần đăng nhập hoặc đăng ký bằng tài khoản  Nhà tuyển dụng. Hoặc liên hệ  hỗ trợ qua sđt/zalo: 0383050533',
        //         header: 'Vui lòng đăng nhập tài khoản "Nhà Tuyển dụng"',
        //         rejectLabel: 'Đóng',
        //         className: 'custom-confirmDialog-pricing'
        //     });
        //     return;
        // }

        if ((!!listSearch && listSearch.length == 0) || (getStorage?.role === 'REC' && !listSearch && listSearch.length == 0)) {
            showWarn();
            const crawl = async () => await global.getDetailTiktokProfileNotLogin(keyword);
            crawl();
            return;
        }

        if (!getStorage.getItem('accountId') || getStorage.getItem('accountId')) {
            setUserName(listSearch?.[0]);
            setVisibleSidebar(true);
            return;
        }

        return () => {
            setIsSearch(false);
        };
    }, [listSearch, isSearch]);

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div id="herro-search" className="text-center w-full py-4 md:py-7">
                <div className="box">
                    <div className="title">
                        Kiểm tra
                        <span className="inline-block pl-3">Influencer</span>
                    </div>
                    <div className={`box-search z-1 relative`}>
                        <img className="absolute" src={`${contextPath}/demo/images/home/icon-search-home.png`} alt="search" />
                        <input autoComplete="off" className="input-search" placeholder="Nhập username Tiktok (Ví dụ: lebong85)" type="text" name="search" value={keyword} onChange={handleChangeKeyword} />
                        <button className="btn-search" onClick={() => handleSearchKol()}>
                            Kiểm tra
                        </button>
                        {/* {listSearch.length > 0 && (
                            <ul className="list-search">
                                {listSearch.map((item) => (
                                    <li key={item.username} className="py-2 text-xl cursor-pointer">
                                        <img className="mr-2 vertical-align-middle" width="17" height="17" src={`${contextPath}/demo/images/social/icon-tiktok.svg`} />
                                        {item.username}
                                    </li>
                                ))}
                            </ul>
                        )} */}
                    </div>
                </div>
            </div>
            <SidebarTiktok username={userName} setVisibleSidebar={setVisibleSidebar} visibleSidebar={visibleSidebar} />
        </>
    );
};

export default Recruitment;
