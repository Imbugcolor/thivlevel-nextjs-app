// Define the initial state using that type

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface QuickViewState {
  product: Product | null
}

const initialState: QuickViewState = {
    product: null
};

export const QuickViewSlice = createSlice({
  name: "quickview",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setProductView: (state, action: PayloadAction<Product>) => {
        state.product = action.payload
    },
    clearProductView: (state) => {
        state.product = null
    }
  },
});

export const { setProductView, clearProductView } = QuickViewSlice.actions;

export default QuickViewSlice.reducer;
