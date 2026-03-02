import { createSlice } from '@reduxjs/toolkit';
import { calcTotalPrice } from '../../js/calcTotalPrice';
import { getCartFromLS } from '../../js/getCartFromLS';

const { items, totalPrice } = getCartFromLS();

const initialState = {
  totalPrice,
  items,
};

const isOldLashesModel = item => {
  return item.isLashes && !item.kitId;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /*addItem(state, action) {
            state.items.push(action.payload);
            state.totalPrice = state.items.reduce((sum, obj) => {
                return obj.price + sum;
            }, 0);
        },*/
    addItem(state, action) {
      const newItem = action.payload;

      if (isOldLashesModel(newItem)) {
        const existingItem = state.items.find(
          obj =>
            isOldLashesModel(obj) &&
            obj.id === newItem.id &&
            obj.curlArr === newItem.curlArr &&
            obj.thicknessArr === newItem.thicknessArr &&
            obj.lengthArr === newItem.lengthArr
        );

        if (existingItem) {
          existingItem.count++;
        } else {
          state.items.push({ ...newItem, count: 1 });
        }
      } else {
        const existingItem = state.items.find(obj => obj.id === newItem.id);
        if (existingItem) {
          existingItem.count++;
        } else {
          state.items.push({ ...newItem, count: 1 });
        }
      }

      state.totalPrice = calcTotalPrice(state.items);
    },

    minusItem(state, action) {
      const payload = action.payload;

      if (payload.isLashes && !payload.kitId) {
        const item = state.items.find(
          obj =>
            isOldLashesModel(obj) &&
            obj.id === payload.id &&
            obj.curlArr === payload.curlArr &&
            obj.thicknessArr === payload.thicknessArr &&
            obj.lengthArr === payload.lengthArr
        );
        if (item && item.count > 0) {
          item.count--;
        }
      } else {
        const item = state.items.find(obj => obj.id === payload.id);
        if (item && item.count > 0) {
          item.count--;
        }
      }

      state.totalPrice = calcTotalPrice(state.items);
    },

    removeItem(state, action) {
      const payload = action.payload;

      if (payload.isLashes && !payload.kitId) {
        state.items = state.items.filter(
          obj =>
            !(
              isOldLashesModel(obj) &&
              obj.id === payload.id &&
              obj.curlArr === payload.curlArr &&
              obj.thicknessArr === payload.thicknessArr &&
              obj.lengthArr === payload.lengthArr
            )
        );
      } else {
        state.items = state.items.filter(obj => obj.id !== payload.id);
      }

      state.totalPrice = calcTotalPrice(state.items);
    },

    clearItems(state) {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

export const { addItem, minusItem, removeItem, clearItems } = cartSlice.actions;

export default cartSlice.reducer;
