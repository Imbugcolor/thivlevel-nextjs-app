import { checkTokenExp } from "@/lib/refreshtoken";
import { http } from "@/lib/utils/http";

export const privateOrdersApiRequest = {
    getTotalRevenue: async(token: string, dispatch: any) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.get<number>('/order/revenue/total', { token: accessToken })
    },
}