import React from 'react';
import axios from 'axios';
import './scss/app.scss';
import './scss/style.scss';

import { AuthContext } from './context';
import AppRoutes from './componetns/AppRoutes';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const SearchContext = React.createContext();

function App() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState('');
  const [scroll, setScroll] = React.useState(0);
  const [lockedSearch, setLockedSearch] = React.useState(false);

  const [isAuth, setIsAuth] = React.useState(false);
  const [adminMode, setAdminMode] = React.useState(false);
  const [isBlackFriday, setIsBlackFriday] = React.useState(false);

  const [createSlideMode, setCreateSlideMode] = React.useState(false);
  const [createProductMode, setCreateProductMode] = React.useState(false);
  const [createCompanyMode, setCreateCompanyMode] = React.useState(false);
  const [createTypeMode, setCreateTypeMode] = React.useState(false);

  const [updateSlideMode, setUpdateSlideMode] = React.useState(false);
  const [updateProductMode, setUpdateProductMode] = React.useState(false);
  const [updateCompanyMode, setUpdateCompanyMode] = React.useState(false);
  const [updateTypeMode, setUpdateTypeMode] = React.useState(false);

  const [createAddressMode, setCreateAddressMode] = React.useState(false);
  const [updateAddressMode, setUpdateAddressMode] = React.useState(false);

  const [updateUserMode, setUpdateUserMode] = React.useState(false);
  const [updatePassMode, setUpdatePassMode] = React.useState(false);

  const [imgViewerMode, setImgViewerMode] = React.useState(false);

  const [isLoading, setLoading] = React.useState(true);

  const [productUpdated, setProductUpdated] = React.useState('');
  const [productRemoved, setProductRemoved] = React.useState('');

  const [isPromoPage, setIsPromoPage] = React.useState(false);
  const [firstDateArray, setFirstDateArray] = React.useState([]);
  const [secondDateArray, setSecondDateArray] = React.useState([]);

  const [showConditions, setShowConditions] = React.useState(false);

  const [updatedCart, setUpdatedCart] = React.useState(false);

  const [activeAuthOption, setActiveAuthOption] = React.useState(0);

  const [promoList, setPromoList] = React.useState([]);
  const [lastPromo, setLastPromo] = React.useState('');

  const serverDomain = 'https://bbb-server-a6ji.onrender.com/';
  const imagesCloud = 'https://res.cloudinary.com/bbbptcloud/image/upload/v1699129130/static/';

  /*React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasFbclid = urlParams.has('fbclid');
    const hasRoute = urlParams.has('#');

    if (hasFbclid) {
      console.log('🔄 Facebook click ID detected - cleaning URL');

      if (hasRoute) {
        const hashPart = window.location.href.split('#')[1];
        const cleanUrlWithRoute = 'https://best-buy-beauty.com/#' + hashPart;
        window.location.replace(cleanUrlWithRoute);
        console.log(`Redirected to ${cleanUrlWithRoute}`);
      } else {
        const cleanUrl = 'https://best-buy-beauty.com/';
        window.location.replace(cleanUrl);
        console.log(`Redirected to ${cleanUrl}`);
      }
    }
  }, []);*/

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasFbclid = urlParams.has('fbclid');
    const hasUtm = urlParams.has('utm_source');

    if (hasFbclid || hasUtm) {
      console.log('📱 Instagram redirect detected');

      const cleanUrl = 'https://best-buy-beauty.com/';
      console.log('Redirecting to clean URL:', cleanUrl);

      window.alert(
        'Para o correto funcionamento do site, bem como para realizar e pagar seu pedido, utilize um navegador diferente do Instagram. Agradecemos a sua compreensão.'
      );

      window.location.href = cleanUrl;
    }
  }, []);

  React.useEffect(() => {
    if (localStorage.getItem('auth', 'true')) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
      localStorage.removeItem('auth');
      localStorage.removeItem('user');
    }
    if (localStorage.getItem('adminMode', 'true')) {
      setAdminMode(true);
    } else {
      setAdminMode(false);
      localStorage.removeItem('adminMode');
    }
    setLoading(false);

    if (isAuth) {
      const loginDate = localStorage.getItem('date');
      let result = Date.now() - loginDate;
      if (result > 86399998) {
        if (adminMode) {
          setAdminMode(false);
          localStorage.removeItem('adminMode');
        }
        localStorage.removeItem('user');
        setIsAuth(false);
        localStorage.removeItem('auth');
        localStorage.removeItem('date');
        navigate('/login');
      }
    }
  }, [isAuth, adminMode]);

  React.useEffect(() => {
    axios.get(`${serverDomain}api/promotion`).then(res => {
      setLastPromo(res.data.reverse().slice(-1)[0]);
    });
  }, [serverDomain, isBlackFriday]);

  React.useEffect(() => {
    if (lastPromo) {
      setFirstDateArray(lastPromo.startDate.split('-'));
      setSecondDateArray(lastPromo.finishDate.split('-'));
    }
  }, [serverDomain, lastPromo]);

  React.useEffect(() => {
    if (firstDateArray.length > 0 && secondDateArray.length > 0) {
      /* const startDate = new Date(firstDate).getTime();
      const finishDate = new Date(secondDate).getTime() + 86340000;
      const currentTime = new Date().getTime();*/

      const startDate = new Date(
        firstDateArray[0],
        Number(firstDateArray[1]) - 1,
        firstDateArray[2]
      ).getTime();
      const finishDate =
        new Date(secondDateArray[0], Number(secondDateArray[1]) - 1, secondDateArray[2]).getTime() +
        86340000;
      const currentTime = new Date().getTime();
      if (currentTime >= startDate && currentTime <= finishDate) {
        setIsBlackFriday(true);
      } else {
        setIsBlackFriday(false);
      }
    }
  }, [serverDomain, firstDateArray, secondDateArray, isBlackFriday]);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <AuthContext.Provider
        value={{
          isAuth,
          setIsAuth,
          adminMode,
          setAdminMode,
          isLoading,
          createSlideMode,
          setCreateSlideMode,
          createProductMode,
          setCreateProductMode,
          createCompanyMode,
          setCreateCompanyMode,
          createTypeMode,
          setCreateTypeMode,
          updateSlideMode,
          setUpdateSlideMode,
          updateProductMode,
          setUpdateProductMode,
          updateCompanyMode,
          setUpdateCompanyMode,
          updateTypeMode,
          setUpdateTypeMode,
          createAddressMode,
          setCreateAddressMode,
          updateAddressMode,
          setUpdateAddressMode,
          updateUserMode,
          setUpdateUserMode,
          updatePassMode,
          setUpdatePassMode,
          imgViewerMode,
          setImgViewerMode,
          serverDomain,
          imagesCloud,
          productUpdated,
          setProductUpdated,
          productRemoved,
          setProductRemoved,
          isPromoPage,
          setIsPromoPage,
          isBlackFriday,
          setIsBlackFriday,
          scroll,
          setScroll,
          showConditions,
          setShowConditions,
          updatedCart,
          setUpdatedCart,
          activeAuthOption,
          setActiveAuthOption,
        }}
      >
        <SearchContext.Provider
          value={{
            searchValue,
            setSearchValue,
            lockedSearch,
            setLockedSearch,
          }}
        >
          <AppRoutes />
        </SearchContext.Provider>
      </AuthContext.Provider>
    </>
  );
}

export default App;
