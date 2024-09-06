import authReducer from "./authSlice";
import productReducer from "./productSlice";
import productDetailReducer from "./productdetailSlice";
import categoryReducer from "./categorySlice";
import notifyReducer from "./notifySlice";
import cartReducer from "./cartSlice";
import purchaseDetailReducer from "./purchasedetailSlice";

export const RootReducers = {
    auth: authReducer,
    producs: productReducer,
    productDetail: productDetailReducer,
    categories: categoryReducer,
    notify: notifyReducer,
    cart: cartReducer,
    purchaseDetail: purchaseDetailReducer,
}