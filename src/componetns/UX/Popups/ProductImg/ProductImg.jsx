import React from 'react';
import { AuthContext } from '../../../../context';
import styles from './ProductImg.module.scss';
import { SwiperSlide, Swiper } from 'swiper/react';
import { Navigation, Pagination } from "swiper";

import "../../../../scss/navigation.scss";
import "swiper/scss";
import "../../../../scss/pagination.scss";

const ProductImg = ({productImg, popupSlides}) => {

    const { imagesCloud, setImgViewerMode } = React.useContext(AuthContext);

    const activeSlide = popupSlides.find((slide) => slide === productImg);
    const nextSlides = popupSlides.filter((slide) => slide !== productImg);

    return (
        <div className={styles.popupBlock}>
            <div className={styles.popupImage}>
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    spaceBetween={10}
                    slidesPerView={1}
                    speed={1000}
                    loop={true}
                >
                    <SwiperSlide>
                        <div className={styles.image}>
                            <img src={`${imagesCloud}` + activeSlide} alt="slide"/>
                        </div>                                 
                    </SwiperSlide>

                    {nextSlides.length
                        ?
                        nextSlides.map((slide, slideIndex) => 
                            <SwiperSlide key={slideIndex}>
                                <div className={styles.image}>
                                    <img src={`${imagesCloud}` + slide} alt="slide"/>
                                </div>                                 
                            </SwiperSlide>
                        )
                        :
                        ''
                    }
                </Swiper>
                <svg onClick={() => setImgViewerMode(false)} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 352 512">
                    <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
                </svg> 
            </div>                
        </div>
    );
};

export default ProductImg;