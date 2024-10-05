// Define the initial state using that type

import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { ProductPayload, ProductState } from "./productSlice";

const initialState: ProductState = {
  data: [],
  total: 0,
  page: 1,
  filter: {
    search: "",
    sort: "",
    category: "",
    fromPrice: "",
    toPrice: "",
    sizes: [],
  },
};

export const DeletedProductsSlice = createSlice({
  name: "deletedproducts",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getProducts: (state, action: PayloadAction<ProductPayload>) => {
      state.data = action.payload.data;
      state.total = action.payload.total;
      state.page = action.payload.page;
    },
    searchProducts: (state, action: PayloadAction<string>) => {
      state.filter.search = action.payload;
    },
    sortProducts: (state, action: PayloadAction<string>) => {
      state.filter.sort = action.payload;
    },
    filterCategory: (state, action: PayloadAction<string>) => {
      state.filter.category = action.payload;
    },
    filterPrice: (
      state,
      action: PayloadAction<{ fromPrice?: number; toPrice?: number }>
    ) => {
      if (action.payload.fromPrice) {
        state.filter.fromPrice = action.payload.fromPrice.toString();
      }

      if (action.payload.toPrice) {
        state.filter.toPrice = action.payload.toPrice.toString();
      }
    },
    filterSizes: (state, action: PayloadAction<string[]>) => {
      state.filter.sizes = action.payload;
    },
    removeAllFilter: (state) => {
      state.filter = {
        search: "",
        sort: "",
        category: "",
        fromPrice: "",
        toPrice: "",
        sizes: [],
      };
    },
    changePage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    restoreAction: (state, action: PayloadAction<string>) => {
      const newData = state.data.filter(
        (product) => product._id !== action.payload
      );

      state.data = newData
      state.total = state.total - 1;
    },
  },
});

export const {
  getProducts,
  searchProducts,
  sortProducts,
  filterCategory,
  filterPrice,
  filterSizes,
  removeAllFilter,
  changePage,
  restoreAction,
} = DeletedProductsSlice.actions;

export default DeletedProductsSlice.reducer;
