import moment from 'moment';
import getConfig from 'next/config';
import { ReferralsService } from 'demo/service/Referrals';
import { useEffect, useState } from 'react';
import { formatCurrencyVND, DEV_URL } from 'src/commons/Utils';

const PopupRanking = ({ show, setShow }) => {
    const [listRank, setListRank] = useState([]);
    const referrals = new ReferralsService();
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    useEffect(() => {
        if (!show) return;

        referrals
            .ranking()
            .then(({ data }) => {
                if (data?.code == 'success') {
                    setListRank(data?.data);
                }
            })
            .catch((error) => console.error(error));
    }, [show]);

    if (!show) return <></>;

    return (
        <>
            <div id="popupRanking" className="fixed top-0 left-0 w-full flex align-items-center justify-content-center h-full bg-black-alpha-60" style={{ zIndex: '1000' }}>
                <div className="body-popup shadow-1 w-full bg-white">
                    <div className="header-popup p-4 relative">
                        <div className="text-center">
                            <h3 className="font-bold mb-1 text-3xl uppercase text-white">Bảng xếp hạng tháng {moment().format('MM')}</h3>
                            <p className="text-white">Top 10 chiến thần thành công nhất trên MYKOL</p>
                        </div>
                        <span className="absolute cursor-pointer close-popupRanking" onClick={() => setShow(false)}>
                            <img src={`${contextPath}/demo/images/popup-rank/icon-close.png`} width="36" alt="icon close" />
                        </span>
                    </div>
                    <div className="overflow-auto">
                        <div className="list pb-3" style={{ minWidth: '500px' }}>
                            <div className="header-list justify-content-between align-items-center flex">
                                <span>Xếp hạng</span>
                                <span>Người giới thiệu</span>
                                <span>Cấp</span>
                                <span>Hoa hồng</span>
                            </div>
                            {listRank.length > 0 ? (
                                listRank.map((value, index) => {
                                    return (
                                        <div key={index} className="item-list">
                                            <div className="info align-items-center flex justify-content-between">
                                                <span className="img text-left">
                                                    <img src={`${contextPath}/demo/images/popup-rank/top-${index + 1 > 4 ? 5 : index + 1}.png`} width="78" height="50" alt="icon close" />
                                                </span>
                                                <span className="name flex align-items-center">
                                                    {!!value?.resizedAvatarPath ? (
                                                        <img style={{ objectFit: 'cover' }} src={`${DEV_URL + '/' + value?.resizedAvatarPath}`} width="46" height="46" alt="icon close" />
                                                    ) : (
                                                        <img src={`${contextPath}/demo/images/avatar/no-avatar.png`} width="46" height="46" alt="icon close" />
                                                    )}

                                                    <span className="font-bold uppercase pl-1 line-clamp-2 text-left">{value?.name}</span>
                                                </span>
                                                <span className="level">
                                                    <img src={`${contextPath}/demo/images/popup-rank/icon-top-${index + 1 > 4 ? 4 : index + 1}.png`} width="32" alt="icon close" />
                                                </span>
                                                <span className="totalCommission font-bold">{formatCurrencyVND(value?.totalCommission)}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="item-list align-items-start flex justify-content-between">
                                    <span className="w-full">Chưa có dữ liệu</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PopupRanking;
