import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brandId: 0,
  currentPage: 1,
  sort: {
    name: 'popularidade',
    sortProperty: 'rating',
  },
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
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
    },
  },
});

export const { setBrandId, setSort, setCurrentPage, setFilters, setSearch } = filterSlice.actions;

export default filterSlice.reducer;
