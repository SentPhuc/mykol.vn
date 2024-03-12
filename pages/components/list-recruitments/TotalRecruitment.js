import React, { useEffect, useState } from 'react';
import { RecruitmentService } from '../../../demo/service/RecruitmentService';

const TotalRecruitment = (props) => {
    const service = new RecruitmentService();
    const [isExpiredSum, setIsExpiredSum] = useState(0);
    const [totalAppliedSum, setTotalAppliedSum] = useState(0);
    const { totalElements, data } = props;
    useEffect(async () => {
        const res = await service.getTotalRecruitment({});
        if (res.data.code === 'success') {
            const data = res.data.data;
            setIsExpiredSum(data?.isExpiredSum);
            setTotalAppliedSum(data?.totalAppliedSum);
        } else {
            setData([]);
        }
    }, []);

    return (
        <div className="mb-3 grid total-infor-section">
            <div className="flex-auto col-12 lg:col-4 md:col-12">
                <div className="card mb-0">
                    <div className="flex justify-content-between">
                        <div>
                            <span className="block text-500 font-medium mb-3">Tổng số tin đăng</span>
                            <div className="text-900 font-medium text-2xl">{totalElements}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '4rem', height: '4rem' }}>
                            <i className="pi pi-file text-blue-500 text-2xl" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-auto col-12 lg:col-4 md:col-12">
                <div className="card mb-0">
                    <div className="flex justify-content-between">
                        <div>
                            <span className="block text-500 font-medium mb-3">Tin đang hoạt động</span>
                            <div className="text-900 font-medium text-2xl">{isExpiredSum}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '4rem', height: '4rem' }}>
                            <i className="pi pi-dollar text-orange-500 text-2xl" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-auto col-12 lg:col-4 md:col-12">
                <div className="card mb-0">
                    <div className="flex justify-content-between">
                        <div>
                            <span className="block text-500 font-medium mb-3">Tổng số lượt ứng tuyển</span>
                            <div className="text-900 font-medium text-2xl">{totalAppliedSum}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '4rem', height: '4rem' }}>
                            <i className="pi pi-apple text-cyan-500 text-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TotalRecruitment;
