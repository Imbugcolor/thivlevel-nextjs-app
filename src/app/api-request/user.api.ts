import { http } from "@/lib/utils/http";

export const userApiRequest = {
  getUserCurrent: (token: string) => http.get("/user/current", { token }),
  logOut: async (token?: string) => {
    try {
        const res = await fetch(`api/user`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token ? token : '',
            },
        })

        if (!res.ok) {
            const errorData = await res.json();
            console.log(errorData);
            throw Error(errorData);
        }
  
        return window.location.href = '/auth';
    } catch (error: any) {
        throw Error(error);
    }
  },
};
