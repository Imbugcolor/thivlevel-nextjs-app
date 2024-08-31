// Define the initial state using that type

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CategoryState {
  data: Category[];
}

const initialState: CategoryState = {
  data: [],
};

export const CategorySlice = createSlice({
  name: "category",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getCategories: (state, action: PayloadAction<Category[]>) => {
      state.data = action.payload;
    },
  },
});

export const { getCategories } = CategorySlice.actions;

export default CategorySlice.reducer;
