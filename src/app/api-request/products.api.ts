import { http } from "@/lib/utils/http";

export type filterOptions = {
    // product_sku?: string,
    search?: string;
    sort?: string;
    category?: string;
    fromPrice?: string;
    toPrice?: string;
    sizes?: string[];
}


export const productsApiRequest = {
    getList: (limit?: number, page?: number, filterOptions?: filterOptions) => {
        let query = limit && page ? `limit=${limit}&page=${page}` : ''
        if(filterOptions) {
            filterOptions.search && (query += `&title[regex]=${filterOptions.search}`)
            filterOptions.category && (query += `&category=${filterOptions.category}`)
            filterOptions.fromPrice ? (query += `&price[gte]=${filterOptions.fromPrice}`) : (query += `&price[gte]=0`)
            filterOptions.toPrice && (query += `&price[lte]=${filterOptions.toPrice}`)
            filterOptions.sort && (query += `&${filterOptions.sort}`)
            filterOptions.sizes && (query += `&sizes=${filterOptions.sizes.toString()}`)
        }
        return http.get<ProductDataResponse>(`/products?${query}&isPublished=true`) 
    },
    getRecommendList: (limit: number) => http.get<ProductDataResponse>(`/products?limit=${limit}&page=1&sort=-rating`),
    getBestSeller: (limit: number) => http.get<ProductDataResponse>(`/products?limit=${limit}&page=1&sort=-sold`),
    getNewArrival: (limit: number) => http.get<ProductDataResponse>(`/products?limit=${limit}&page=1`),
    getProduct: (id: string) => http.get<ProductDetailDataResponse>(`/products/${id}`),
}