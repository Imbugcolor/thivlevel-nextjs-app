import { ImageObject } from "@/app/types/schema/image";
import { checkTokenExp } from "@/lib/refreshtoken";
import { http } from "@/lib/utils/http";

interface UploadResponse {
    message: string
    images: ImageObject[]
}

export const uploadApiRequest = {
  uploadImages: async (token: string, dispatch: any, formData: FormData) => {
    let accessToken = "";
    if (token) {
      const result = await checkTokenExp(token, dispatch);
      accessToken = result ? result : token;
    }
    return http.post<UploadResponse>("/upload/images", formData, { token: accessToken });
  },
};
