import { http } from "@/lib/utils/http";

export const productsApiRequest = {
    getList: (size: number) => http.get<ProductDataResponse>(`/api/products?sizes=${size}`),
    getRecommendList: (size: number) => http.get<ProductDataResponse>(`/api/productsHomepage?limit=${size}&sort=-rating`),
    getBestSeller: (size: number) => http.get<ProductDataResponse>(`/api/productsHomepage?limit=${size}&sort=-sold`)
}