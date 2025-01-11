import React from 'react';
import './scss/app.scss';
import './scss/style.scss';

import { AuthContext } from './context';
import AppRoutes from './componetns/AppRoutes';
import { useDispatch } from 'react-redux';

export const SearchContext = React.createContext();

function App() {
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

  const [showConditions, setShowConditions] = React.useState(false);

  const serverDomain = 'https://bbb-server-a6ji.onrender.com/';
  const imagesCloud = 'https://res.cloudinary.com/bbbptcloud/image/upload/v1699129130/static/';

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
  }, [isAuth, adminMode]);

  React.useEffect(() => {
    const startDate = new Date(2024, 11, 23).getTime();
    const finishDate = new Date(2024, 11, 25, 23, 59, 0).getTime();
    const currentTime = new Date().getTime();
    if (currentTime >= startDate && currentTime <= finishDate) {
      setIsBlackFriday(true);
    } else {
      setIsBlackFriday(false);
    }
  }, [isBlackFriday]);

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
