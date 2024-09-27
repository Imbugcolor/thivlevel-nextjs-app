import { checkTokenExp } from "@/lib/refreshtoken";
import { http } from "@/lib/utils/http";

interface filterOptions {
    search: string
    sort: string
}

export const privateUsersApiRequest = {
    get: async(token: string, dispatch: any, limit?: number, page?: number, filterOptions?: filterOptions) => {
        let accessToken = '';
        const result = await checkTokenExp(token, dispatch)
        accessToken = result ? result  : token

      let query = limit && page ? `limit=${limit}&page=${page}` : ''
      if(filterOptions) {
        filterOptions.search && (query += `&search=${filterOptions.search}`)
        filterOptions.sort && (query += `&${filterOptions.sort}`)
      }
      return http.get<UsersDataResponse>(`/user?${query}`, {token: accessToken}) 
    },
}