import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MenuHeader from './UX/MenuHeader';
import Search from './UX/Search';
import { AuthContext } from '../context';

import { useSelector } from 'react-redux';
import { popupAuth } from '../js/script';
import axios from 'axios';
import LogoLoader from './UI/Skeletons/LogoSkeleton';
import LogoTextLoader from './UI/Skeletons/LogoTextSkeleton';

const Header = () => {
  const { isAuth, setIsAuth, adminMode, setAdminMode, imagesCloud, serverDomain} = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [logo, setLogo] = React.useState('');
  const logout = () => {
    if (adminMode) {
      setAdminMode(false);
    }
    localStorage.removeItem('user');
    setIsAuth(false);    
    localStorage.removeItem('auth');
    navigate("/login");
  }

  const data = localStorage.getItem('user');
  const user = JSON.parse(data);

  React.useEffect(() => {
    if (!user) {
      setIsAuth(false);
    }
  }, [user]);

  const { items } = useSelector((state) => state.cart);
  const totalCount = items.reduce((sum, item) => sum + item.count, 0);

  React.useEffect(() => {
    setIsLoading(true);
    axios.get(`${serverDomain}api/logo/1`)
      .then((res) => {
        setLogo(res.data);
        setIsLoading(false);
    })
  }, [serverDomain]);

  return (
    <div className="header">
      <div className="header__boby body-header">
        <div className="body-header__container">
          <Link to="/" className="body-header__logo header-logo">
            <div className="header-logo__image">
              {!isLoading && logo
                ?
                <img src={`${imagesCloud}` + logo.img} alt='logo' />
                :
                <LogoLoader/>
              }
            </div>
            <h3 className="body-header__text">
              {!isLoading && logo ? logo.logoName : <LogoTextLoader/>}
            </h3>
          </Link>
          <Search />
          <div className="body-header__actions">
            <Link to="/cart" className="actions-header__cart _icon-cart">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M352 160v-32C352 57.42 294.579 0 224 0 153.42 0 96 57.42 96 128v32H0v272c0 44.183 35.817 80 80 80h288c44.183 0 80-35.817 80-80V160h-96zm-192-32c0-35.29 28.71-64 64-64s64 28.71 64 64v32H160v-32zm160 120c-13.255 0-24-10.745-24-24s10.745-24 24-24 24 10.745 24 24-10.745 24-24 24zm-192 0c-13.255 0-24-10.745-24-24s10.745-24 24-24 24 10.745 24 24-10.745 24-24 24z"/></svg>
              <span>{totalCount}</span>
            </Link>
            {
              user && isAuth
                ?
                <div className="actions-header__user _icon-user">
                  <svg onClick={popupAuth} className='_icon-user_auth' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/></svg>
                </div> 
                :
                <Link to="/login" className="actions-header__user _icon-user ">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M313.6 304c-28.7 0-42.5 16-89.6 16-47.1 0-60.8-16-89.6-16C60.2 304 0 364.2 0 438.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-25.6c0-74.2-60.2-134.4-134.4-134.4zM400 464H48v-25.6c0-47.6 38.8-86.4 86.4-86.4 14.6 0 38.3 16 89.6 16 51.7 0 74.9-16 89.6-16 47.6 0 86.4 38.8 86.4 86.4V464zM224 288c79.5 0 144-64.5 144-144S303.5 0 224 0 80 64.5 80 144s64.5 144 144 144zm0-240c52.9 0 96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 43.1-96 96-96z"/></svg>
                </Link>                
            }
          </div>
          <div className="body-header__popup popup-header">
            <div className="popup-header__content">
              <ul className="popup-header__list">
                <li className="popup-header__item">
                  <Link to={'/auth'} className="popup-header__link">                    
                    Meu perfil
                  </Link>                    
                </li>                  
                <li onClick={logout} className="popup-header__item">
                  Sair
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z" />
                  </svg>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="header__bottom bottom-header">
        <div className="bottom-header__container">
          <MenuHeader />
        </div>
      </div>
    </div>
  );
};

export default Header;