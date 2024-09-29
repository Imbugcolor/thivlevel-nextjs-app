// Define the initial state using that type

import { Order } from "@/app/types/schema/order";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PurchaseDetailState {
  data_cached: Order[];
}

const initialState: PurchaseDetailState = {
  data_cached: [],
};

export const PurchaseDetailSlice = createSlice({
  name: "purchasedetail",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getPurchaseDetail: (state, action: PayloadAction<Order>) => {
        if(state.data_cached.find(data => data._id === action.payload._id)) return state;
        state.data_cached.push(action.payload)
    },
    cancelOrder: (state, action: PayloadAction<string>) => {
      const order = state.data_cached.find(data => data._id === action.payload)

        if(order) {
            order.status = 'Canceled';
        }
    }
  }
});

export const { 
    getPurchaseDetail, cancelOrder
} = PurchaseDetailSlice.actions;

export default PurchaseDetailSlice.reducer;
