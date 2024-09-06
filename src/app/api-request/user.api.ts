import { checkTokenExp } from "@/lib/refreshtoken";
import { http } from "@/lib/utils/http";
import { ThunkDispatch } from "@reduxjs/toolkit";

export const userApiRequest = {
  getUserCurrent: (token: string) => http.get("/user/current", { token }),
  logOut: async (token?: string, dispatch?: ThunkDispatch<any, any, any>) => {
    try {
        let accessToken = '';
        if (token) {
          const result = await checkTokenExp(token, dispatch)
          accessToken = result ? result  : token
        }
        const res = await fetch(`http://localhost:8080/api/user`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": accessToken ? accessToken : '',
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
