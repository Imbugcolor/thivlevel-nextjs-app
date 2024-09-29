import { ShippingAdress } from "../shipping.address";

interface OrderItem extends CartItem {}

interface Order {
    _id: string,
    user: string,
    name: string,
    email: string,
    address: ShippingAdress,
    phone: string,
    total: number,
    method: string,
    isPaid: boolean,
    items: OrderItem[],
    status: string,
    paymentId: string,
    createdAt: Date,
    updatedAt: Date,
}