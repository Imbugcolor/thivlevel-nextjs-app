import { AddressFullObject } from "@/lib/location/useLocationForm";
import { checkTokenExp } from "@/lib/refreshtoken";
import { http } from "@/lib/utils/http";

interface GeneratePaypalTokenResponse {
    clientId: any,
    clientToken: any,
}

export interface PaypalJsonResponse {
    id: string
    links: any[]
    status: string
    details?: any,
    debug_id?: any,
}

export interface PaypalDataResponse {
    httpStatusCode: number
    jsonResponse: any
}
  
export const paypalApiRequest = {
    generateToken: async(token: string, dispatch: any) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.get<GeneratePaypalTokenResponse>('/paypal/generate-token', { token: accessToken })
    },
    captureOrder: async(orderID: string) => http.post<PaypalDataResponse>(`/paypal/${orderID}/capture`, {})
}