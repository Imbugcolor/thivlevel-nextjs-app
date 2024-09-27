// Define the initial state using that type

import { User } from "@/app/types/schema/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UsersPayload {
  data: User[];
  total: number;
  page: number;
}

export interface UsersFilterFields {
  search: string;
  sort: string;
}

export interface UserState {
  data: User[];
  total: number;
  page: number;
  filter: UsersFilterFields;
}

const initialState: UserState = {
  data: [],
  total: 0,
  page: 1,
  filter: {
    search: "",
    sort: "",
  },
};

export const UserSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getUsers: (state, action: PayloadAction<UsersPayload>) => {
      state.data = action.payload.data;
      state.total = action.payload.total;
      state.page = action.payload.page;
    },
    searchUsers: (state, action: PayloadAction<string>) => {
      state.filter.search = action.payload;
    },
    sortUsers: (state, action: PayloadAction<string>) => {
      state.filter.sort = action.payload;
    },
    changeUsersPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
});

export const { 
  getUsers, sortUsers, searchUsers, changeUsersPage
} = UserSlice.actions;

export default UserSlice.reducer;
