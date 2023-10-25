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
import UpdateSlide from "./Popups/UpdateSlide";

import { setCategoryId } from "../../redux/slices/filterSlice";
import { useDispatch } from "react-redux";

const MainSliderBlock = () => {

  const { isAuth, adminMode, createSlideMode, updateSlideMode, setCreateSlideMode, setUpdateSlideMode, serverDomain, imagesCloud } = React.useContext(AuthContext);
  const [slides, setSlides] = React.useState([]);
  const [id, setId] = React.useState('');
  const [slideItem, setSlideItem] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    setIsLoading(true);
    axios.get(`${serverDomain}api/slide`)
      .then((res) => {
        setSlides(res.data);
        setIsLoading(false);
      });
  }, [serverDomain]);

  React.useEffect(() => {
    if (id) {
      axios.get(`${serverDomain}api/slide/${id}`)
        .then((res) => {
          if (res.data) {
            setSlideItem(res.data); 
            setUpdateSlideMode(true);
            setCreateSlideMode(false);            
          }
        });              
    }
  }, [id, serverDomain, setCreateSlideMode, setUpdateSlideMode]);

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

  React.useEffect(() => {
    if (!updateSlideMode) {
      setId('');
    }
  }, [updateSlideMode]);

  const goToUrl = () => {
    localStorage.removeItem('categoryId');
    localStorage.removeItem('subItems');        
    dispatch(setCategoryId(0));
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
          {isAuth && adminMode && updateSlideMode ? <UpdateSlide slideItem={slideItem} /> : ''}
          <div className="block-main__slider">
            <div className="block-main__swiper swiper">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 10000,
                  disableOnInteraction: false
                }}
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
                          <div className="slide-main-block__image">
                            <div className={isAuth && adminMode ? 'slide-main-block__actions' : 'slide-main-block__actions_hidden'}>
                              <svg className='delete-slide' onClick={() => removeSlide(slide.id)} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                <path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z" />
                              </svg>
                              <svg className='update-slide' onClick={() => setId(slide.id)} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" />
                              </svg>  
                            </div>
                            <Link to={`${slide.url}`}>
                              <img onClick={goToUrl} src={`${imagesCloud}` + slide.img} alt="slide" />
                            </Link>
                          </div>
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