import { createSlice } from '@reduxjs/toolkit';

const category = localStorage.getItem('categoryId');

const initialState = {
  brandId: 0,
  categoryId: category ? category : 0,
  currentPage: 1,
  sort: {
    name: 'novidades',
    sortProperty: 'id',
  },
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategoryId(state, action) {
      state.categoryId = action.payload;
      state.currentPage = initialState.currentPage;
      state.brandId = initialState.brandId;
    },
    setBrandId(state, action) {
      state.brandId = action.payload;
      state.currentPage = initialState.currentPage;
    },
    setSearch(state) {
      state.brandId = initialState.brandId;
      state.currentPage = initialState.currentPage;
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setFilters(state, action) {
      state.currentPage = Number(action.payload.currentPage);
      state.sort = action.payload.sort;
      state.brandId = Number(action.payload.brandId);
      state.categoryId = Number(action.payload.categoryId);
    },
  },
});

export const { setCategoryId, setBrandId, setSort, setCurrentPage, setFilters, setSearch } =
  filterSlice.actions;

export default filterSlice.reducer;
