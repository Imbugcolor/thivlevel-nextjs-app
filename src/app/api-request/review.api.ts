import { checkTokenExp } from "@/lib/refreshtoken";
import { http } from "@/lib/utils/http";

interface ReviewRequest {
    rating: number
    comment: string
    productId: string
}

interface FilterOptions {
    sort: string,
}

export const reviewApiRequest = {
    getReview: async(productId: string, limit: number, page: number, filterOptions?: FilterOptions) => { 
        let query = limit && page ? `limit=${limit}&page=${page}` : ''
        if(filterOptions) {
            filterOptions.sort && (query += `&${filterOptions.sort}`)
        }
        return http.get<ReviewDataResponse>(`/review/${productId}?${query}`) 
    },
    addReview: async(token: string, dispatch: any, body: ReviewRequest) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

        return http.post<Review>('/review', body, { token: accessToken })
    }
}