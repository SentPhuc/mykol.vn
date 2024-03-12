export default function BrandWoking() {
    const listWoking = [
        {
            name: 'Trải nghiệm tuyệt vời',
            desc: 'Trước đây mình hay tìm và làm việc với KOC, KOL thông qua các group facebook. Tuy nhiên, khi biết đến MYKOL, mọi thứ minh bạch hơn, dễ dàng hơn, hiệu quả cao hơn,.. và tuyệt vời hơn rất nhiều!',
            creater: 'Nguyễn Tân - Marketing Manager tại Cassia Cosmetic'
        },
        {
            name: 'Tiết kiệm chi phí',
            desc: 'Công ty tôi thay vì trước đây cần 3 nhân sự để triển khai chiến dịch Influencer Marketing, thì giờ với MYKOL chỉ cần 1 nhân sự duy nhất. Tinh gọn, tiết kiệm tiền bạc và thời gian.',
            creater: 'Phạm Thương - PR Manager tại Laneige'
        },
        {
            name: 'Công nghệ tân tiến',
            desc: 'Thay vì ngồi hàng giờ trên Tiktok, Facebook để tìm người có ảnh hưởng và mất công đi hỏi giá từng bạn. Thì giờ tôi chỉ cần 2, 3 click trên MYKOL. Khá là bất ngờ!',
            creater: 'Minh Thư - Brand Manager tại mỹ phẩm Hàn Quốc Innisfree'
        }
    ];

    return (
        <div id="brand-woking" className="w-full">
            <div className="container">
                <h3 className="title-home">800+ Nhãn hàng đã làm việc cùng người có ảnh hưởng trên MYKOL</h3>
                <div className="box-brand-woking">
                    <div className="flex md:flex-row flex-column bg-white">
                        {listWoking.map((value, index) => {
                            return (
                                <div key={index} className="w-full item-brand-woking">
                                    <h3>{value.name}</h3>
                                    <div>{value.desc}</div>
                                    <p className="mb-0">{value.creater}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
