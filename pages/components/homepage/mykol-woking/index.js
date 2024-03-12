import getConfig from 'next/config';

export default function MykolWoking() {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const listWoking = [
        {
            name: 'Tìm kiếm Influencers',
            desc: 'Tìm kiếm hàng nghìn người có ảnh hưởng trên Tiktok, với đầy đủ số liệu doanh thu, xu hướng,...',
            image: contextPath + '/demo/images/home/action-1.png'
        },
        {
            name: 'Giao dịch an toàn',
            desc: 'Giao dịch an toàn thông qua MYKOL. Chúng tôi giữ khoản thanh toán cho tới khi công việc được hoàn thành.',
            image: contextPath + '/demo/images/home/action-2.png'
        },
        {
            name: 'Kết quả chất lượng',
            desc: 'Kết quả là những video đạt chất lượng như kỳ vọng cùng hệ thống báo cáo, thống kê số liệu tự động.',
            image: contextPath + '/demo/images/home/action-3.png'
        }
    ];

    const listOther = [
        {
            name: 'Không chi phí ẩn',
            desc: 'Tìm kiếm miễn phí, không chi phí ẩn, chỉ trả tiền khi nhận kết quả.',
            image: contextPath + '/demo/images/home/icon-dollar.png'
        },
        {
            name: 'Ứng viên chất lượng',
            desc: 'Mọi người có ảnh hưởng đều được chúng tôi xem xét kỹ lưỡng, đảm bảo chất lượng, chuyên nghiệp.',
            image: contextPath + '/demo/images/home/icon-check.png'
        },
        {
            name: 'Giao dịch an toàn',
            desc: 'Tiền của nhãn hàng được giữ an toàn cho đến khi nhận được kết quả chất lượng',
            image: contextPath + '/demo/images/home/icon-lock.png'
        }
    ];

    return (
        <div id="mykol-woking" className="w-full">
            <div className="container">
                <h3 className="title-home">MYKOL hoạt động như thế nào?</h3>
                <p className="desc-home">Mọi thứ bạn cần để triển khai chiến dịch marketing với người có ảnh hưởng</p>
                <div className="flex md:flex-row flex-column box-mykol-woking">
                    {listWoking.map((value, index) => {
                        return (
                            <div key={index} className="relative item-woking cursor-pointer w-full">
                                <div className="hover-zoom image">
                                    <img className="max-w-full w-full" alt={value.name} src={value.image} />
                                </div>
                                <div className="info absolute">
                                    <h3>{value.name}</h3>
                                    <div>{value.desc}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex md:flex-row flex-column box-mykol-other">
                    {listOther.map((value, index) => {
                        return (
                            <div key={index} className="relative item-other cursor-pointer w-full">
                                <h3 className="flex align-items-center">
                                    {value.name} <img className="ml-2" alt={value.name} src={value.image} />
                                </h3>
                                <div>{value.desc}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
