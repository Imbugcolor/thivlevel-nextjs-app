import { checkTokenExp } from "@/lib/refreshtoken";
import { http } from "@/lib/utils/http";

interface AddCartRequest {
    productId: string,
    variantId: string,
    quantity: number
}

interface UpdateCartRequest {
    cartId: string,
    itemId: string,
}
  
export const cartApiRequest = {
    addCart: async(token: string, dispatch: any, body: AddCartRequest) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.patch<Cart>('/cart', body, { token: accessToken })
    },
    increment: async(token: string, dispatch: any, body: UpdateCartRequest) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token
        return http.patch<Cart>('/cart/increment', body, { token: accessToken })
    },
    decrement: async(token: string, dispatch: any, body: UpdateCartRequest) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token
        return http.patch<Cart>('/cart/decrement', body, { token: accessToken })
    },
    removeItem: async(token: string, dispatch: any, body: UpdateCartRequest) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token
        return http.patch<Cart>('/cart/delete-item', body, { token: accessToken })
    },
}