import authReducer from "./authSlice";
import productReducer from "./productSlice";
import productDetailReducer from "./productdetailSlice";
import quickViewReducer from "./quickviewSlice";
import categoryReducer from "./categorySlice";
import notifyReducer from "./notifySlice";
import cartReducer from "./cartSlice";
import purchaseDetailReducer from "./purchasedetailSlice";
import reviewReducer from "./reviewSlice"
import userReducer from "./userSlice"
import ordersReducer from "./ordersSlice"
import orderDetailReducer from './orderDetailSlice'
import deletedProductsReducer from './deletedProductsSlice'
import clientReducer from './clientSlice'
import notificationReducer from './notificationSlice'

export const RootReducers = {
    auth: authReducer,
    producs: productReducer,
    productDetail: productDetailReducer,
    categories: categoryReducer,
    notify: notifyReducer,
    cart: cartReducer,
    purchaseDetail: purchaseDetailReducer,
    quickview: quickViewReducer,
    review: reviewReducer,
    users: userReducer,
    orders: ordersReducer,
    orderDetail: orderDetailReducer,
    deletedProducts: deletedProductsReducer,
    client: clientReducer,
    notification: notificationReducer,
}