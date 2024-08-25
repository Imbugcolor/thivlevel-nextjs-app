interface User {
    _id: string;
    username: string;
    email: string;
    imageProfile: ImageObject;
    address: string
    dateOfbirth: string;
    gender: string
    cart: CartItem[];
    role: number;
    isVerifyPhone: boolean;
    isLogSocialNetwork:boolean;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
} 

