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
      const product = state.data_cached.find((product) => product._id === action.payload.productId)

      if (product) {
        product.reviews?.push(action.payload)
      }
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const product = state.data_cached.find((product) => product._id === action.payload._id)
      if (product) {
        // This object is still wrapped in a Proxy, so we can "mutate" it
        Object.assign(product, action.payload)
      }
    },
  }
});

export const { 
 getProductDetail, addReviewProduct, updateProduct
} = ProductDetailSlice.actions;

export default ProductDetailSlice.reducer;
