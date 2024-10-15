// Define the initial state using that type
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationPayload<T> {
  data: T[];
  unreads?: number;
  total: number;
  page: number;
}

export interface UserNotificationState {
  data: UserNotification[];
  unreads: number;
  total: number;
  page: number;
}

export interface GeneralNotificationState {
  data: NotificationSchema[];
  unreads: number;
  total: number;
  page: number;
}

export interface AdminNotificationState extends GeneralNotificationState {}

export interface NotificationState {
  user: UserNotificationState;
  general: GeneralNotificationState;
  admin: AdminNotificationState;
}

const initialState: NotificationState = {
  user: {
    data: [],
    unreads: 0,
    total: 0,
    page: 1,
  },
  general: {
    data: [],
    unreads: 0,
    total: 0,
    page: 1,
  },
  admin: {
    data: [],
    unreads: 0,
    total: 0,
    page: 1,
  }
};

export const NotificationSlice = createSlice({
  name: "notification",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getUserNotifications: (
      state,
      action: PayloadAction<NotificationPayload<UserNotification>>
    ) => {
      state.user.data = action.payload.data;
      state.user.total = action.payload.total;
      state.user.page = action.payload.page;

      if (action.payload.unreads) {
        state.user.unreads = action.payload.unreads
      }
    },
    getGeneralNotifications: (
      state,
      action: PayloadAction<NotificationPayload<NotificationSchema>>
    ) => {
      state.general.data = action.payload.data;
      state.general.total = action.payload.total;
      state.general.page = action.payload.page;
      if (action.payload.unreads) {
        state.general.unreads = action.payload.unreads
      }
    },
    getAdminNotifications: (
      state,
      action: PayloadAction<NotificationPayload<NotificationSchema>>
    ) => {
      state.admin.data = action.payload.data;
      state.admin.total = action.payload.total;
      state.admin.page = action.payload.page;
      if (action.payload.unreads) {
        state.admin.unreads = action.payload.unreads
      }
    },
    readUserNotification:  (state, action: PayloadAction<{ id: string }>) => {
      state.user.unreads = state.user.unreads - 1;
      const notification = state.user.data.find(item => item._id === action.payload.id);
      if (notification) {
        notification.status = 'READ'
      }
    },
    addUserNotification: (state, action: PayloadAction<UserNotification>) => {
      state.user.data.unshift(action.payload)
      state.user.total = state.user.total + 1;
      state.user.unreads = state.user.unreads + 1;
    },
    addGeneralNotification: (state, action: PayloadAction<NotificationSchema>) => {
      state.general.data.unshift(action.payload)
      state.general.total = state.general.total + 1;
      state.general.unreads = state.general.unreads + 1;
    },
    addAdminNotification: (state, action: PayloadAction<NotificationSchema>) => {
      state.admin.data.unshift(action.payload)
      state.admin.total = state.admin.total + 1;
      state.admin.unreads = state.admin.unreads + 1;
    },
    changeUserNotificationPage: (state, action: PayloadAction<number>) => {
      state.user.page = action.payload;
    },
    changeGeneralNotificationPage: (state, action: PayloadAction<number>) => {
      state.general.page = action.payload;
    },
  },
});

export const {
  getUserNotifications,
  getGeneralNotifications,
  getAdminNotifications,
  changeUserNotificationPage,
  changeGeneralNotificationPage,
  readUserNotification,
  addUserNotification,
  addGeneralNotification,
  addAdminNotification,
} = NotificationSlice.actions;

export default NotificationSlice.reducer;
