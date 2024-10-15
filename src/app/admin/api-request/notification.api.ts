import { checkTokenExp } from "@/lib/refreshtoken";
import { http } from "@/lib/utils/http";

export interface AdminNotificationsResponse {
    data: NotificationSchema[],
    page: string,
    total: number,
}

export const privateNotificationRequest = {
    get: async(token: string, dispatch: any, limit: number, page: number) => {
        let accessToken = '';
        if (token) {
          const result = await checkTokenExp(token, dispatch)
          accessToken = result ? result  : token
        }
        let query = limit && page ? `limit=${limit}&page=${page}` : ''
        return http.get<AdminNotificationsResponse>(`/notification/admin?${query}&sort=-createdAt`, { token: accessToken })
    },
}