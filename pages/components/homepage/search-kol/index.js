import { DataView } from 'primereact/dataview';
import { GlobalService } from 'demo/service/GlobalService';
import { useEffect, useState, useRef } from 'react';
import { CATEGORY_ENUM, BOOKKING_FILTER_ENUM } from 'src/commons/Utils';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import SidebarTiktok from '../recruitment/SidebarTiktok';
import { Toast } from 'primereact/toast';
import ItemKol from './ItemKol';

const SearchKOL = () => {
    const global = new GlobalService();
    const [visibleSidebar, setVisibleSidebar] = useState(false);
    const [userName, setUserName] = useState('');
    const [showCareer, setShowCareer] = useState(false);
    const [showBookingPrice, setShowBookingPrice] = useState(false);
    const [nameCareer, setNameCareer] = useState('');
    const [nameBookingPrice, setNameBookingPrice] = useState('');
    const router = useRouter();
    const toast = useRef(null);
    const formRef = useRef(null);
    const [datas, setDatas] = useState();

    const formikFilter = useFormik({
        initialValues: {
            careerCodes: '',
            bookingPrice: ''
        },
        onSubmit: async (data) => {
            let url = '';
            if (data?.careerCodes) {
                url = '?careerCodes=' + data?.careerCodes;
            }

            if (data?.bookingPrice) {
                url = '?bookingPrice=' + data?.bookingPrice;
            }

            if (data?.bookingPrice && data?.careerCodes) {
                url = '?careerCodes=' + data?.careerCodes + '&bookingPrice=' + data?.bookingPrice;
            }
            if (url) router.push(`/components/search-kocs${url}`);
        }
    });

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
        return <ItemKol data={rowData} handleShowProfile={handleShowProfile} />;
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="form-search text-center md:my-6 my-2">
                <div className="title-gradient">Tìm Kiếm Influencer</div>
                <div className="title-form-search shadow-1">Tìm kiếm người có ảnh hưởng trên Tiktok để quảng bá cho nhãn hàng của bạn</div>
                <form ref={formRef} className="flex bg-white shadow-1 relative z-5 align-items-center justify-content-between flex-wrap" onSubmit={formikFilter.handleSubmit}>
                    <div className="item-form-search select-none careerCodes cursor-pointer text-left relative">
                        <div
                            className="absolute w-full h-full left-0 top-0"
                            style={{ zIndex: 15 }}
                            onClick={() => {
                                setShowCareer((pre) => !pre);
                                setShowBookingPrice(false);
                            }}
                        ></div>
                        <label className="cursor-pointer">Lĩnh vực</label>
                        <span>{nameCareer ? nameCareer : 'Chọn lĩnh vực'}</span>
                        {showCareer && (
                            <ul className="box-careerCodes">
                                {CATEGORY_ENUM.map((value, index) => {
                                    return (
                                        <li
                                            key={index + 1}
                                            onClick={(e) => {
                                                setShowCareer(false);
                                                setNameCareer(value?.name);
                                                formikFilter.setFieldValue('careerCodes', value?.careerFieldCode);
                                            }}
                                        >
                                            {value?.name}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                    <div className="item-form-search bookingPrice cursor-pointer text-left relative">
                        <div
                            className="absolute w-full h-full left-0 top-0"
                            style={{ zIndex: 15 }}
                            onClick={() => {
                                setShowBookingPrice((pre) => !pre);
                                setShowCareer(false);
                            }}
                        ></div>
                        <label className="cursor-pointer">Giá booking</label>
                        <span>{nameBookingPrice ? nameBookingPrice : 'Chọn giá Booking'}</span>
                        {showBookingPrice && (
                            <ul className="box-careerCodes box-bookingPrice">
                                {BOOKKING_FILTER_ENUM.map((value, index) => {
                                    return (
                                        <li
                                            key={index + 1}
                                            onClick={(e) => {
                                                formikFilter.setFieldValue('bookingPrice', value?.value);
                                                setShowBookingPrice(false);
                                                setNameBookingPrice(value?.name);
                                            }}
                                        >
                                            {value?.name}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                    <button className="btn cursor-pointer" type="submit"></button>
                </form>
            </div>
            <div id="search-kol-home" className="w-full bg-white">
                <div className="container">
                    <div className="card md:pb-6 pb-3 pl-3 pr-3 shadow-1 md:mt-6 mt-3 md:mb-3 my-3 border-round-2xl w-full">
                        <DataView value={datas} itemTemplate={TemplatePage} />
                        <div className="text-right mt-4 mr-3">
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

export default SearchKOL;
