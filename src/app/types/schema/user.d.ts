interface User {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    phone?: string;
    address?: string;
    dateOfbirth?: string;
    gender: string
    role: string[];
    type: string;
    createdAt: string;
    updatedAt: string;
}