import { checkTokenExp } from "@/lib/refreshtoken";
import { http } from "@/lib/utils/http";

export interface UserNotificationsResponse {
  data: UserNotification[];
  page: string;
  total: number;
}

export interface GeneralNotificationResponse {
  data: NotificationSchema[]
  page: string;
  total: number;
}

export const notificationApiRequest = {
  getUserNotifications: async (
    token: string,
    dispatch: any,
    limit: number,
    page: number
  ) => {
    let accessToken = "";
    if (token) {
      const result = await checkTokenExp(token, dispatch);
      accessToken = result ? result : token;
    }
    let query = limit && page ? `limit=${limit}&page=${page}` : "";
    return http.get<UserNotificationsResponse>(
      `/notification/me?${query}&sort=-createdAt`,
      { token: accessToken }
    );
  },
  getGeneralNotifications: async (
    token: string,
    dispatch: any,
    limit: number,
    page: number
  ) => {
    let accessToken = "";
    if (token) {
      const result = await checkTokenExp(token, dispatch);
      accessToken = result ? result : token;
    }
    let query = limit && page ? `limit=${limit}&page=${page}` : "";
    return http.get<GeneralNotificationResponse>(
      `/notification/general?${query}&sort=-createdAt`,
      { token: accessToken }
    );
  },
  read: async (token: string, dispatch: any, id: string) => {
    let accessToken = "";
    if (token) {
      const result = await checkTokenExp(token, dispatch);
      accessToken = result ? result : token;
    }
    return http.patch<UserNotification>(
      `/notification/read/${id}`,
      {},
      { token: accessToken }
    );
  },
};
