import { AddressFullObject } from "@/lib/location/useLocationForm";
import { checkTokenExp } from "@/lib/refreshtoken";
import { http } from "@/lib/utils/http";
import { PaypalDataResponse } from "./paypal.api";
import { OrdersDataResponse } from "../types/responses/order.response";
import { Order } from "../types/schema/order";
export interface CreateCheckoutSessionRequest {
    name: string,
    phone: string,
    address: AddressFullObject
}
export interface CreateStripeCheckoutRequest extends CreateCheckoutSessionRequest {}
export interface CreateVnpayCheckoutRequest extends CreateCheckoutSessionRequest {}
export interface CreateCodOrderRequest extends CreateCheckoutSessionRequest {}
export interface CreatePaypalCheckoutRequest extends CreateCheckoutSessionRequest{
    socketId: string,
    userId: string,
}
interface StripeCheckoutSessionResponse {
    url: string,
    status: number
}
interface VnpayCheckoutSessionResponse {
    paymentUrl: string
}
interface PaypalCheckoutSessionResponse extends PaypalDataResponse {}
interface FilterOrdersOptions {
    search: string,
    sort: string,
    status: string,
}
  
export const ordersApiRequest = {
    createStripeCheckoutSession: async(token: string, dispatch: any, body: CreateStripeCheckoutRequest) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.post<StripeCheckoutSessionResponse>('/order/create-stripe-checkout-session', body, { token: accessToken })
    },
    createPaypalCheckoutSession: async(token: string, dispatch: any, body: CreatePaypalCheckoutRequest) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.post<PaypalCheckoutSessionResponse>('/order/create-paypal-checkout-session', body, { token: accessToken })
    },
    createVnpayCheckoutSession: async(token: string, dispatch: any, body: CreateVnpayCheckoutRequest) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.post<VnpayCheckoutSessionResponse>('/order/create-vnpay-checkout', body, { token: accessToken })
    },
    createCodOrder:  async(token: string, dispatch: any, body: CreateCodOrderRequest) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.post<VnpayCheckoutSessionResponse>('/order/create-cod-order', body, { token: accessToken })
    },
    getList: async(token: string, dispatch: any, limit?: number, page?: number, filterOptions?: FilterOrdersOptions) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        let query = limit && page ? `limit=${limit}&page=${page}` : ''
        if(filterOptions) {
            filterOptions.search && (query += `&search=${filterOptions.search}`)
            filterOptions.status && (query += `&${filterOptions.status}`)
            filterOptions.sort && (query += `&${filterOptions.sort}`)
        }
        return http.get<OrdersDataResponse>(`/order/my?${query}`, { token: accessToken }) 
    },
    getPurchase: async(token: string, dispatch: any, id: string) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.get<Order>(`/order/my/${id}`, { token: accessToken })
    },
    cancelOrder: async(token: string, dispatch: any, id: string) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.patch<Order>(`/order/cancel-order/${id}`, {}, { token: accessToken })
    },
}