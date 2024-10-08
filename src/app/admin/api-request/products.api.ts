import { filterOptions } from "@/app/api-request/products.api";
import { ImageObject } from "@/app/types/schema/image";
import { checkTokenExp } from "@/lib/refreshtoken";
import { http } from "@/lib/utils/http";

interface CreateProduct {
    product_sku: string;
  
    title: string;
  
    description: string;
  
    content: string;
  
    price: number;
  
    images: ImageObject[];
  
    category: string;
  
    variants: Variant[];

    isPublished: boolean;
}

interface UpdateProduct extends Partial<CreateProduct> {}
interface PublishProduct {
  publish: boolean
}
interface FilterProductOptions extends filterOptions {}

export const privateProductApiRequest = {
    get: (limit?: number, page?: number, filterOptions?: FilterProductOptions) => {
      let query = limit && page ? `limit=${limit}&page=${page}` : ''
      if(filterOptions) {
        filterOptions.search && (query += `&search=${filterOptions.search}`)
        filterOptions.category && (query += `&category=${filterOptions.category}`)
        filterOptions.fromPrice ? (query += `&price[gte]=${filterOptions.fromPrice}`) : (query += `&price[gte]=0`)
        filterOptions.toPrice && (query += `&price[lte]=${filterOptions.toPrice}`)
        filterOptions.sort && (query += `&${filterOptions.sort}`)
        filterOptions.sizes && (query += `&sizes=${filterOptions.sizes.toString()}`)
      }
      return http.get<ProductDataResponse>(`/products?${query}`) 
    },
    getDeletedList: async(token: string, dispatch: any, limit?: number, page?: number, filterOptions?: FilterProductOptions) => {
      let accessToken = "";
      if (token) {
        const result = await checkTokenExp(token, dispatch);
        accessToken = result ? result : token;
      }
      let query = limit && page ? `limit=${limit}&page=${page}` : ''
      if(filterOptions) {
        filterOptions.search && (query += `&search=${filterOptions.search}`)
        filterOptions.category && (query += `&category=${filterOptions.category}`)
        filterOptions.fromPrice ? (query += `&price[gte]=${filterOptions.fromPrice}`) : (query += `&price[gte]=0`)
        filterOptions.toPrice && (query += `&price[lte]=${filterOptions.toPrice}`)
        filterOptions.sort && (query += `&${filterOptions.sort}`)
        filterOptions.sizes && (query += `&sizes=${filterOptions.sizes.toString()}`)
      }
      return http.get<ProductDataResponse>(`/products/deleted?${query}`, {token: accessToken} ) 
    },
    create: async(token: string, dispatch: any, body: CreateProduct) => {
        let accessToken = "";
        if (token) {
          const result = await checkTokenExp(token, dispatch);
          accessToken = result ? result : token;
        }
        return http.post<Product>('/products', body, {token: accessToken})
    },
    update: async(token: string, dispatch: any, id: string, body: UpdateProduct) => {
        let accessToken = "";
        if (token) {
          const result = await checkTokenExp(token, dispatch);
          accessToken = result ? result : token;
        }
        return http.patch<Product>(`/products/${id}`, body, {token: accessToken})
    },
    delete: async(token: string, dispatch: any, id: string) => {
      let accessToken = "";
      if (token) {
        const result = await checkTokenExp(token, dispatch);
        accessToken = result ? result : token;
      }
      return http.patch<Product>(`/products/${id}/delete`, {}, {token: accessToken})
    },
    restore: async(token: string, dispatch: any, id: string) => {
      let accessToken = "";
      if (token) {
        const result = await checkTokenExp(token, dispatch);
        accessToken = result ? result : token;
      }
      return http.patch<Product>(`/products/${id}/restore`, {}, {token: accessToken})
    },
    publish: async(token: string, dispatch: any, id: string, body: PublishProduct) => {
      let accessToken = "";
      if (token) {
        const result = await checkTokenExp(token, dispatch);
        accessToken = result ? result : token;
      }
      return http.patch<Product>(`/products/${id}/publish`, body, {token: accessToken})
    }
}