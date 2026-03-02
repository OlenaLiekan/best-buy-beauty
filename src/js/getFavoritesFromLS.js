export const getFavoritesFromLS = () => {
  const data = localStorage.getItem('favorite');
  const favoriteItems = data ? JSON.parse(data) : [];

  return {
    favoriteItems,
  };
};
