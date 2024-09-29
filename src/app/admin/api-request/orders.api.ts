import { OrdersDataResponse } from "@/app/types/responses/order.response";
import { Order } from "@/app/types/schema/order";
import { checkTokenExp } from "@/lib/refreshtoken";
import { http } from "@/lib/utils/http";

interface OrderFilterQuery {
    status: string
    search: string
    sort: string
}
export const privateOrdersApiRequest = {
    getTotalRevenue: async(token: string, dispatch: any) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.get<number>('/order/revenue/total', { token: accessToken })
    },
    getOrders: async(token: string, dispatch: any, limit?: number, page?: number, filterOptions?: OrderFilterQuery) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        let query = limit && page ? `limit=${limit}&page=${page}` : ''
        if(filterOptions) {
            filterOptions.search && (query += `&search=${filterOptions.search}`)
            filterOptions.status && (query += `&${filterOptions.status}`)
            filterOptions.sort && (query += `&${filterOptions.sort}`)
        }
        return http.get<OrdersDataResponse>(`/order?${query}`, { token: accessToken }) 
    },
    getOrder: async(token: string, dispatch: any, id: string) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.get<Order>(`/order/${id}`, { token: accessToken })
    },
}