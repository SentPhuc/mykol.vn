import React, { useEffect, useState } from 'react';
import 'primereact/resources/primereact.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';

import { EffectCoverflow, Navigation, Pagination } from 'swiper';

const ImagesRecruitment = () => {
    const [startSlide, setStartSlide] = useState(3);

    return (
        <>
            <div className='list-picture-candidate-recruitment'>
                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    coverflowEffect={{
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true
                    }}
                    initialSlide={startSlide}
                    pagination={{
                        clickable: true
                    }}
                    navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
                    modules={[Pagination, Navigation, EffectCoverflow]}
                    className='mySwiper'
                >
                    <SwiperSlide>
                        <img src='https://swiperjs.com/demos/images/nature-1.jpg' />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src='https://swiperjs.com/demos/images/nature-2.jpg' />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src='https://swiperjs.com/demos/images/nature-3.jpg' />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src='https://swiperjs.com/demos/images/nature-4.jpg' />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src='https://swiperjs.com/demos/images/nature-5.jpg' />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src='https://swiperjs.com/demos/images/nature-6.jpg' />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src='https://swiperjs.com/demos/images/nature-7.jpg' />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src='https://swiperjs.com/demos/images/nature-8.jpg' />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src='https://swiperjs.com/demos/images/nature-9.jpg' />
                    </SwiperSlide>
                </Swiper>
            </div>
        </>
    );
};

export default ImagesRecruitment;
