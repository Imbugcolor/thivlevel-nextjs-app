// Define the initial state using that type

import { OrderItem } from "@/app/types/schema/order";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ReviewState {
  item: OrderItem | null
}

const initialState: ReviewState = {
    item: null
};

export const ReviewSlice = createSlice({
  name: "review",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setItemReview: (state, action: PayloadAction<OrderItem>) => {
        state.item = action.payload
    },
    clearItemReview: (state) => {
        state.item = null
    }
  },
});

export const { setItemReview, clearItemReview } = ReviewSlice.actions;

export default ReviewSlice.reducer;
