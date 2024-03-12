import React, { useState } from 'react';
import 'primereact/resources/primereact.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';

import { EffectCoverflow, Navigation, Pagination, FreeMode } from 'swiper';
import { DEV_URL } from '../../../src/commons/Utils';

const ImagesCandidate = (props) => {
    const { images,title } = props;
    const [startSlide, setStartSlide] = useState(1);
    
    return (
        <>{images!=null &&
            <div className="list-picture-candidate lx:mb-8 lg:mb-8 mb-4">
                <Swiper
                    freemode="false"
                    effect={'coverflow'}
                    grabCursor={true}
                    loop={false}
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
                    modules={[Pagination, Navigation, EffectCoverflow,FreeMode]}
                    className="mySwiper"
                >
                    {
                        images?.map((e, index) => (
                            <SwiperSlide key={`ImagesCandidate-${index}`}>
                                <img src={DEV_URL + e} alt={title}/>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
            }
        </>
    );
};

export default ImagesCandidate;
