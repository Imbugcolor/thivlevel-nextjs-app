// Define the initial state using that type

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProductDetailState {
  data_cached: Product[];
}

const initialState: ProductDetailState = {
  data_cached: [],
};

export const ProductDetailSlice = createSlice({
  name: "productdetail",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getProductDetail: (state, action: PayloadAction<Product>) => {
        if(state.data_cached.find(data => data._id === action.payload._id)) return state;
        state.data_cached.push(action.payload)
    },
    addReviewProduct: (state, action: PayloadAction<Review>) => {
      state.data_cached.map(data => { 
        data._id === action.payload.productId ? data.reviews?.push(action.payload) : data 
      })
    },
  }
});

export const { 
 getProductDetail, addReviewProduct
} = ProductDetailSlice.actions;

export default ProductDetailSlice.reducer;
