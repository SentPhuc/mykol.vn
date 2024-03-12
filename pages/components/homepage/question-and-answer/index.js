import getConfig from 'next/config';
import { classNames } from 'primereact/utils';
import React, { useRef, useState } from 'react';

const listOther = [
    {
        name: 'Influencer Marketing là gì?',
        desc: 'Influencer Marketing là hình thức tiếp thị bằng cách sử dụng sức ảnh hưởng của người trong xã hội để truyền tải thông tin của doanh nghiệp đến với khách hàng mục tiêu.'
    },
    {
        name: 'Tại sao công ty/nhãn hàng nên áp dụng influencer marketing?',
        desc: '92% người tiêu dùng tin tưởng vào sự giới thiệu của người quen trong khi chỉ có 33% tin vào quảng cáo online truyền thống. Thông qua influencer marketing, nhãn hàng và nhà quảng cáo có thể tăng nhận diện thương hiệu, xây dựng niềm tin và thúc đẩy doanh số bán hàng.'
    },
    {
        name: 'Ai là người ảnh hưởng (influencer)?',
        desc: 'Người ảnh hưởng là những người có một sự ảnh hưởng với một lượng fan/follower đáng kể trên mạng xã hội. Nền tảng MYKOL tập trung vào người có ảnh hưởng trên nền tảng Tiktok.'
    },
    {
        name: 'Tìm người có ảnh hưởng như thế nào?',
        desc: 'Bắt đầu bằng cách xác định đối tượng mục tiêu của bạn và nền tảng họ sử dụng. Sau đó, sử dụng công cụ tiếp thị người ảnh hưởng MYKOL để tìm kiếm những người có ảnh hưởng trong lĩnh vực của bạn. Sử dụng giới tính, giá cả, vị trí và các bộ lọc khác để thu hẹp những người có ảnh hưởng có liên quan càng nhiều càng tốt. Sau khi tìm thấy người có ảnh hưởng mà bạn muốn hợp tác, bạn chỉ cần mua một trong các gói dịch vụ trực tiếp qua hồ sơ của họ.'
    },
    {
        name: 'Chi phí một chiến dịch Influencer Marketing là bao nhiêu?',
        desc: 'Chi phí cho việc tiếp thị người ảnh hưởng rất khác nhau tùy thuộc vào các yếu tố như phạm vi tiếp cận, vị trí thích hợp và tỷ lệ tương tác của người ảnh hưởng. Những người có ảnh hưởng vi mô với lượng người theo dõi nhỏ hơn có thể tính phí ít hơn những người có ảnh hưởng vĩ mô hoặc người nổi tiếng. Một số người có ảnh hưởng có thể làm việc theo từng bài đăng, trong khi những người khác lại thích quan hệ đối tác liên tục. Nếu bạn đã cân nhắc ngân sách, hãy cân nhắc sử dụng các bộ lọc giá có trong công cụ tìm kiếm của MYKOL để thu hẹp những người có ảnh hưởng phù hợp với ngân sách của bạn, điều này sẽ giúp bạn tiết kiệm thời gian trong quá trình khám phá người có ảnh hưởng.'
    },
    {
        name: 'Chi phí bao nhiêu khi dùng MYKOL?',
        desc: 'Chi phí do bạn trực tiếp thảo luận cùng người có ảnh hưởng, MYKOL chỉ thu phí % nền tảng, ngoài ra không phát sinh bất cứ chi phí nào khác.'
    }
];

export default function QuestionAndAnswer() {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const contentHeight = useRef();
    const [activeIndex, setActiveIndex] = useState(null);

    const handleItemClick = (index) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };
    return (
        <div id="question-and-answer" className="w-full">
            <div className="container">
                <div className="box-question-and-answer">
                    {listOther.map((item, index) => (
                        <div key={index} className="box overflow-hidden">
                            <div className={classNames(activeIndex === index ? 'active' : '', 'button-container p-2 cursor-pointer select-none')} onClick={() => handleItemClick(index)}>
                                <div className="shadow-1 flex justify-content-between align-items-center border-round-3xl bg-white">
                                    <p className="title">{item.name}</p>
                                    <img className={classNames(activeIndex === index ? 'active' : '', '')} src={contextPath + '/demo/images/home/icon-plus.png'} alt="plus" />
                                </div>
                            </div>

                            <div ref={contentHeight} className={'desc-container bg-white'} style={activeIndex === index ? { height: 'auto' } : { height: '0px' }}>
                                <p className="desc-content">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
