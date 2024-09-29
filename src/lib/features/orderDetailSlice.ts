// Define the initial state using that type

import { Order } from "@/app/types/schema/order";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OrderDetailState {
  data_cached: Order[];
}

const initialState: OrderDetailState = {
  data_cached: [],
};

interface UpdateOrderStatus {
    id: string,
    status: string,
}
 
export const OrderDetailSlice = createSlice({
  name: "orderdetail",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getOrder: (state, action: PayloadAction<Order>) => {
        if(state.data_cached.find(data => data._id === action.payload._id)) return state;
        state.data_cached.push(action.payload)
    },
    updateStatus: (state, action: PayloadAction<UpdateOrderStatus>) => {
        const order = state.data_cached.find(data => data._id === action.payload.id)

        if(order) {
            order.status = action.payload.status;
        }
    }
  }
});

export const { 
    getOrder, updateStatus
} = OrderDetailSlice.actions;

export default OrderDetailSlice.reducer;
