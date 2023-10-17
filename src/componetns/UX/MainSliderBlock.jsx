import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";

import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context";
import "../../scss/navigation.scss";
import "swiper/scss";
import "../../scss/pagination.scss";
import axios from "axios";
import CreateSlide from "./Popups/CreateSlide";
import SliderSkeleton from "../UI/Skeletons/SliderSkeleton";

const MainSliderBlock = () => {

  const { isAuth, adminMode, createSlideMode, setCreateSlideMode, serverDomain, imagesCloud } = React.useContext(AuthContext);
  const [slides, setSlides] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const navigate = useNavigate();

  React.useEffect(() => {
    setIsLoading(true);
    axios.get(`${serverDomain}api/slide`)
      .then((res) => {
        setSlides(res.data);
        setIsLoading(false);
      });
  }, [serverDomain]);

  const removeSlide = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir o slide?')) {
      axios.delete(`${serverDomain}api/slide?id=${id}`)
        .then(() => {
          window.alert('O slide foi excluído com sucesso!');
        })
      navigate('/auth');
      window.scrollTo(0, 0);      
    } else {
      window.alert('Cancelar exclusão.');
    }
  }

  return (
      <section className="main__block block-main">
        <div className="block-main__container">
        <div className="block-main__body">
          {isAuth && adminMode && createSlideMode ? <CreateSlide /> : ""}
            {isAuth && adminMode && !createSlideMode ? 
              <button className="block-main__create" onClick={setCreateSlideMode}>Criar novo slide</button>
              : ''
            }
          <div className="block-main__slider">
            <div className="block-main__swiper swiper">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={true}
                spaceBetween={10}
                slidesPerView={1}
                speed={2000}
                loop={true}
              >
                {slides.length ? slides.map((slide) =>
                  <SwiperSlide key={slide.id}>
                    <div className="block-main__slide slide-main-block">
                      <div className="slide-main-block__content">
                        {isLoading
                          ?
                            <img src={`${imagesCloud}noSlide.png`} alt="slide" />
                          : 
                          <Link to="#" className="slide-main-block__image">
                            <div className={isAuth && adminMode ? 'slide-main-block__actions' : 'slide-main-block__actions_hidden'}>
                              <svg className='delete-slide' onClick={() => removeSlide(slide.id)} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                <path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z" />
                              </svg>
                            </div>
                            <img src={`${imagesCloud}` + slide.img} alt="slide" />
                          </Link>
                        }
                      </div>
                    </div>
                  </SwiperSlide>
                )
                  :
                  <div className="block-main__slide slide-main-block">
                    <div className="slide-main-block__content">
                      <div className="slide-main-block__image">
                        <SliderSkeleton />                        
                      </div>
                    </div>
                  </div>
                }
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainSliderBlock;