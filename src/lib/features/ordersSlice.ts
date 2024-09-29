// Define the initial state using that type

import { Order } from "@/app/types/schema/order";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OrdersPayload {
  data: Order[];
  total: number;
  page: number;
}

export interface OrdersFilter {
  search: string;
  sort: string;
  status: string;
}

export interface OrdersState {
  data: Order[];
  total: number;
  page: number;
  filter: OrdersFilter;
}

const initialState: OrdersState = {
  data: [],
  total: 0,
  page: 1,
  filter: {
    search: "",
    status: "",
    sort: "sort=-createdAt",
  },
};

export const OrdersSlice = createSlice({
  name: "orders",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getOrders: (state, action: PayloadAction<OrdersPayload>) => {
      state.data = action.payload.data;
      state.total = action.payload.total;
      state.page = action.payload.page;
    },
    searchOrders: (state, action: PayloadAction<string>) => {
      state.filter.search = action.payload;
    },
    sortOrders: (state, action: PayloadAction<string>) => {
      state.filter.sort = action.payload;
    },
    statusOrders: (state, action: PayloadAction<string>) => {
        state.filter.status = action.payload;
    },
    changeOrdesPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
});

export const { 
  getOrders, searchOrders, sortOrders, statusOrders, changeOrdesPage
} = OrdersSlice.actions;

export default OrdersSlice.reducer;
