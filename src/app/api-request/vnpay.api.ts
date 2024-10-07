import { http } from "@/lib/utils/http"

interface ReturnUrlResponse {
    success: boolean
    message: string
}
export const vnpayApiRequest = {
    verifyReturnUrl: async(query: any) => {
        return http.get<ReturnUrlResponse>(`/vnpay/vnpay_return${query}`);
    },
}