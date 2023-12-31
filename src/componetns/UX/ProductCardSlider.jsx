import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper";

import "../../scss/navigation.scss";
import { AuthContext } from "../../context";
import ProductImg from "./Popups/ProductImg/ProductImg";

const ProductCardSlider = ({ img, slides, popupSlides }) => {
    const [thumbsSwiper, setThumbsSwiper] = React.useState(null);
    const { imagesCloud, imgViewerMode, setImgViewerMode } = React.useContext(AuthContext);

    const [productImg, setProductImg] = React.useState('');

    const showSlideImg = (slideImg) => {
        setProductImg(slideImg.slideImg);
        setImgViewerMode(true);
        window.scrollTo(0, 0);
    }

    const showImg = (img) => {
        setProductImg(img);
        setImgViewerMode(true);
        window.scrollTo(0, 0);
    }

    return (
        <>
            <div className="images-product__thumbs thumbs-images">
                <div className="thumbs-images__swiper">
                    <Swiper 
                        modules={[Thumbs]} 
                        thumbs={{ swiper: thumbsSwiper }}
                        slidesPerView={1}
                        spaceBetween={10}
                        loop={true}
                    >
                        <SwiperSlide onClick={() => showImg(img)}>
                            <div className="thumbs-images__slide slide-thumbs">
                                <div className="slide-thumbs__media">
                                    <img src={`${imagesCloud}` + img} alt="slide"/>                                  
                                </div>
                            </div>          
                        </SwiperSlide>
                        { slides ?
                            slides.map((slideImg, i) =>
                                <SwiperSlide onClick={() => showSlideImg(slideImg)} key={i} value={slideImg}>
                                    <div className="thumbs-images__slide slide-thumbs">
                                        <div className="slide-thumbs__media">
                                            <img src={`${imagesCloud}` + slideImg.slideImg} alt="slide"/>                                    
                                        </div>
                                    </div>          
                                </SwiperSlide>                            
                            )
                            : 
                            ''
                        }
                    </Swiper>
                </div>
                {productImg && imgViewerMode ? <ProductImg productImg={productImg} popupSlides={popupSlides} /> : ''}
            </div>
            <div className="images-product__slider">
                <div className="images-product__swiper">                
                    <Swiper
                        modules={[Thumbs]}
                        watchSlidesProgress
                        onSwiper={setThumbsSwiper}
                        speed={2000}
                        breakpoints={{
                            280: {
                                direction: 'horizontal',
                                slidesPerView: 2,
                                spaceBetween: 5
                            },

                            319: {
                                direction: 'horizontal',
                                slidesPerView: 3,
                                spaceBetween: 5
                            },

                            479: {
                                direction: 'vertical',
                                slidesPerView: 3,
                                spaceBetween: 10
                            },

                            768: {                            
                                direction: 'vertical',
                                slidesPerView: 3,
                                spaceBetween: 10
                            },

                            992: {                           
                                direction: 'vertical',
                                slidesPerView: 3,
                                spaceBetween: 10
                            },

                            1200: {
                                direction: 'vertical',
                                slidesPerView: 3,
                                spaceBetween: 10
                            },
                        }}
                    >
                        <SwiperSlide>
                            <div className="images-product__slide slide-product">
                                <div className="slide-product__media">
                                    <img src={`${imagesCloud}` + img} alt="slide"/>                                    
                                </div>
                            </div>                        
                        </SwiperSlide>
                        { slides ?
                            slides.map((slideImg, index) => 
                                <SwiperSlide key={index} value={slideImg}>
                                    <div className="images-product__slide slide-product">
                                        <div className="slide-product__media">
                                            <img src={`${imagesCloud}` + slideImg.slideImg} alt="slide"/>                                    
                                        </div>
                                    </div>                        
                                </SwiperSlide>                            
                            )
                            :
                            ''
                        }                 
                    </Swiper>                    
                </div>
            </div>
        </>
    );
};

export default ProductCardSlider;