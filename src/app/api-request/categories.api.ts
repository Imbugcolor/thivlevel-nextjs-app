import { http } from "@/lib/utils/http";

export const categoriesApiRequest = {
    getList: () => http.get<Category[]>(`/category`),
}