import React from 'react';
import './scss/app.scss';
import './scss/style.scss';
import AppRoutes from './componetns/AppRoutes';
import { AuthContext } from './context';
export const SearchContext = React.createContext();

function App() {
  const [searchValue, setSearchValue] = React.useState('');

  const [isAuth, setIsAuth] = React.useState(false);
  const [adminMode, setAdminMode] = React.useState(false);

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

  const serverDomain = 'https://bbb-server-a6ji.onrender.com/';
  const imagesCloud = 'https://res.cloudinary.com/bbbptcloud/image/upload/v1699129130/static/';

  React.useEffect(() => {
    if (localStorage.getItem('auth', 'true')) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
    if (localStorage.getItem('adminMode', 'true')) {
      setAdminMode(true);
    } else {
      setAdminMode(false);
    }
    setLoading(false);
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
        }}
      >
        <SearchContext.Provider value={{ searchValue, setSearchValue }}>
          <AppRoutes />
        </SearchContext.Provider>
      </AuthContext.Provider>
    </>
  );
}

export default App;
