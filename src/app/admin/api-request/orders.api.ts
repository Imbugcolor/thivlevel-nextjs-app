import { OrdersDataResponse } from "@/app/types/responses/order.response";
import { Order } from "@/app/types/schema/order";
import { AddressFullObject } from "@/lib/location/useLocationForm";
import { checkTokenExp } from "@/lib/refreshtoken";
import { http } from "@/lib/utils/http";

interface OrderFilterQuery {
    status: string
    search: string
    sort: string
}
interface UpdateOrderStatus {
    status: string,
}

export interface UpdateOrder {
    name?: string,
    phone?: string,
    address?: AddressFullObject
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
        return http.get<OrdersDataResponse>(`/order/all?${query}`, { token: accessToken }) 
    },
    getOrder: async(token: string, dispatch: any, id: string) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.get<Order>(`/order/detail/${id}`, { token: accessToken })
    },
    updateStatus: async(token: string, dispatch: any, id: string, body: UpdateOrderStatus) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.patch<Order>(`/order/status/${id}`, { status: body.status }, { token: accessToken })
    },
    updateOrder: async(token: string, dispatch: any, id: string, body: UpdateOrder) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.patch<Order>(`/order/${id}`, body, { token: accessToken })
    },
}