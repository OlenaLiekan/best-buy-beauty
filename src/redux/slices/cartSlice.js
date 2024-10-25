import { createSlice } from '@reduxjs/toolkit';
import { calcTotalPrice } from '../../js/calcTotalPrice';
import { getCartFromLS } from '../../js/getCartFromLS';

const { items, totalPrice } = getCartFromLS();

const initialState = {
  totalPrice,
  items,
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
      const findItem = state.items.find(obj => obj.id === action.payload.id && !obj.isLashes);
      const lashesItem = state.items.find(
        obj =>
          obj.id === action.payload.id &&
          obj.isLashes &&
          obj.curlArr === action.payload.curlArr &&
          obj.thicknessArr === action.payload.thicknessArr &&
          obj.lengthArr === action.payload.lengthArr
      );
      if (findItem) {
        findItem.count++;
      } else if (lashesItem) {
        lashesItem.count++;
      } else {
        state.items.push({
          ...action.payload,
          count: 1,
        });
      }
      state.totalPrice = calcTotalPrice(state.items);
    },
    minusItem(state, action) {
      const findItem = state.items.find(obj => obj.id === action.payload && !obj.isLashes);
      const lashesItem = state.items.find(obj => obj.index === action.payload && obj.isLashes);

      if (findItem && findItem.count > 0) {
        findItem.count--;
      } else if (lashesItem && lashesItem.count > 0) {
        lashesItem.count--;
      }
      state.totalPrice = state.items.reduce((sum, obj) => {
        return obj.available ? obj.price * obj.count + sum : 0 + sum;
      }, 0);
    },
    removeItem(state, action) {
      const findItem = state.items.find(obj => obj.id === action.payload && !obj.isLashes);
      const lashesItem = state.items.find(obj => obj.index === action.payload && obj.isLashes);
      if (findItem) {
        state.items = state.items.filter(obj => obj.id !== action.payload);
      } else if (lashesItem) {
        state.items = state.items.filter(obj => obj.index !== action.payload);
      }
      state.totalPrice = state.items.reduce((sum, obj) => {
        return obj.available ? obj.price * obj.count + sum : 0 + sum;
      }, 0);
    },
    clearItems(state) {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

export const { addItem, minusItem, removeItem, clearItems } = cartSlice.actions;

export default cartSlice.reducer;
