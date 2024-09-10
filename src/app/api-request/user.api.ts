import { NEXT_SERVER_URL } from "@/config";
import { checkTokenExp } from "@/lib/refreshtoken";
import { http } from "@/lib/utils/http";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { User } from "../types/schema/user";
import { AddressProfile } from "../types/profile.address";

interface RegisterRequest {
  username: string,
  email: string,
  password: string,
}

interface ActiveResponse {
  message: string,
  user: User,
}

interface UpdateProfileRequest {
  username?: string,
  phone?: string,
  address?: AddressProfile,
  gender?: string,
  dateOfbirth?: string,
}

interface UpdatePasswordRequest {
  old_password: string,
  new_password: string,
}

export const userApiRequest = {
  register: (body: RegisterRequest) => http.post<{ message: string}>('/user/register', body),
  active: (token: string) => http.get<ActiveResponse>(`/user/active/${token}`), 
  getUserCurrent: (token: string) => http.get("/user/current", { token }),
  updatePhoto: async(token: string, dispatch: any, formData: FormData) => {
    let accessToken = '';
    if (token) {
      const result = await checkTokenExp(token, dispatch)
      accessToken = result ? result  : token
    }
    return http.patch<User>('/user/photo', formData, { token: accessToken })
  },
  updateProfile: async(token: string, dispatch: any, body: UpdateProfileRequest) => {
    let accessToken = '';
    if (token) {
      const result = await checkTokenExp(token, dispatch)
      accessToken = result ? result  : token
    }
    return http.patch<User>('/user/update', body, { token: accessToken })
  },
  updatePassword: async(token: string, dispatch: any, body: UpdatePasswordRequest) => {
    let accessToken = '';
    if (token) {
      const result = await checkTokenExp(token, dispatch)
      accessToken = result ? result  : token
    }
    return http.patch<User>('/user/password', body, { token: accessToken })
  },
  logOut: async (token?: string, dispatch?: ThunkDispatch<any, any, any>) => {
    try {
        let accessToken = '';
        if (token) {
          const result = await checkTokenExp(token, dispatch)
          accessToken = result ? result  : token
        }
        const res = await fetch(`${NEXT_SERVER_URL}/api/user`, {
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
