import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
export interface CartState extends Cart {}

// Define the initial state using that type
const initialState: CartState = {
    _id: '',
    userId: '',
    items: [],
    subTotal: 0,
    updatedAt: null,
    createdAt: null,
}

export const CartSlice = createSlice({
  name: 'cart',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getCart: (state, action: PayloadAction<Cart>) => {
        state._id = action.payload._id
        state.userId = action.payload.userId
        state.items = action.payload.items
        state.subTotal = action.payload.subTotal
        state.createdAt = action.payload.createdAt
        state.updatedAt = action.payload.updatedAt
    },
    incrementItemCart: (state, action: PayloadAction<CartItem>) => {
      state.items?.map(item => { 
        if(item._id === action.payload._id) {
          item.quantity = item.quantity + 1;
          item.total = item.total + item.price
          state.subTotal = state.subTotal + item.price
        }
      })
    },
    decrementItemCart: (state, action: PayloadAction<CartItem>) => {
        state.items?.map(item => { 
          if(item._id === action.payload._id) {
            item.quantity = item.quantity - 1;
            item.total = item.total - item.price
            state.subTotal = state.subTotal - item.price
          }
        })
    },
    removeItemCart: (state, action: PayloadAction<CartItem>) => {
      state.items = state.items?.filter(item => item._id !== action.payload._id)
      state.subTotal = state.subTotal - action.payload.total
    },
  }
})

export const { getCart, incrementItemCart, decrementItemCart, removeItemCart } = CartSlice.actions

export default CartSlice.reducer