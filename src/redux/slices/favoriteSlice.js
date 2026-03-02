import { createSlice } from '@reduxjs/toolkit';
import { getFavoritesFromLS } from '../../js/getFavoritesFromLS';

const { favoriteItems } = getFavoritesFromLS();

const initialState = {
  favoriteItems,
};

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    addFavorite(state, action) {
      const newFavoriteItem = action.payload;

      if (newFavoriteItem.kitId) {
        const existingItem = state.favoriteItems.find(obj => obj.id === newFavoriteItem.id);
        if (!existingItem) {
          state.favoriteItems.push(newFavoriteItem);
        }
      }
    },
    minusFavorite(state, action) {
      const newFavoriteItem = action.payload;

      if (newFavoriteItem.kitId) {
        const existingItem = state.favoriteItems.find(obj => obj.id === newFavoriteItem.id);
        if (existingItem) {
          state.favoriteItems = state.favoriteItems.filter(obj => obj.id !== newFavoriteItem.id);
        }
      }
    },
  },
});

export const { addFavorite, minusFavorite } = favoriteSlice.actions;

export default favoriteSlice.reducer;
