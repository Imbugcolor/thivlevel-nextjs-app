import { Order } from "../schema/order";

interface OrdersDataResponse {
    page: string,
    total: number,
    data: Order[],
}