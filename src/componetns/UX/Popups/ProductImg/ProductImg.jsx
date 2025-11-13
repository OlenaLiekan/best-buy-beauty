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
    const [increasedImg, setIncreasedImg] = React.useState(false);

    const activeSlide = popupSlides.find((slide) => slide === productImg);
    const nextSlides = popupSlides.filter((slide) => slide !== productImg);

    return (
        <div className={styles.popupBlock}>
            <div className={increasedImg ? styles.popupImageIncreased : styles.popupImage}>
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
                <div className={styles.increaseBtn} onClick={() => setIncreasedImg(increasedImg === true ? false : true)}>
                    {increasedImg
                        ?
                        <>
                            <svg className={styles.increaseBtnIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M304 192v32c0 6.6-5.4 12-12 12H124c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm201 284.7L476.7 505c-9.4 9.4-24.6 9.4-33.9 0L343 405.3c-4.5-4.5-7-10.6-7-17V372c-35.3 27.6-79.7 44-128 44C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208c0 48.3-16.4 92.7-44 128h16.3c6.4 0 12.5 2.5 17 7l99.7 99.7c9.3 9.4 9.3 24.6 0 34zM344 208c0-75.2-60.8-136-136-136S72 132.8 72 208s60.8 136 136 136 136-60.8 136-136z" />
                            </svg>
                            <div className={styles.tip}>Reduzir imagem</div>
                        </>
                        :
                        <>
                            <svg className={styles.increaseBtnIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M304 192v32c0 6.6-5.4 12-12 12h-56v56c0 6.6-5.4 12-12 12h-32c-6.6 0-12-5.4-12-12v-56h-56c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h56v-56c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v56h56c6.6 0 12 5.4 12 12zm201 284.7L476.7 505c-9.4 9.4-24.6 9.4-33.9 0L343 405.3c-4.5-4.5-7-10.6-7-17V372c-35.3 27.6-79.7 44-128 44C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208c0 48.3-16.4 92.7-44 128h16.3c6.4 0 12.5 2.5 17 7l99.7 99.7c9.3 9.4 9.3 24.6 0 34zM344 208c0-75.2-60.8-136-136-136S72 132.8 72 208s60.8 136 136 136 136-60.8 136-136z" />
                            </svg>
                            <div className={styles.tip}>Ampliar imagem</div>
                        </>
                    }
                </div>
                <svg onClick={() => setImgViewerMode(false)} className={styles.closePopupBtn} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 352 512">
                    <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
                </svg> 
            </div>                
        </div>
    );
};

export default ProductImg;