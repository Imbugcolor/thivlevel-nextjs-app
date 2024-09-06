// Define the initial state using that type

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProductPayload {
  data: Product[];
  total: number;
  page: number;
}

export interface ProductFilterFields {
  search: string;
  sort: string;
  category: string;
  fromPrice: string;
  toPrice: string;
  sizes: string[];
}

export interface ProductState {
  data: Product[];
  total: number;
  page: number;
  filter: ProductFilterFields;
}

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

export const ProductSlice = createSlice({
  name: "product",
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
    filterPrice: (state, action: PayloadAction<{ fromPrice?: number, toPrice?: number }>) => {
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
      }
    },
    changePage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    }
  },
});

export const { 
  getProducts, searchProducts, 
  sortProducts, filterCategory, 
  filterPrice, filterSizes, 
  removeAllFilter, changePage 
} = ProductSlice.actions;

export default ProductSlice.reducer;
