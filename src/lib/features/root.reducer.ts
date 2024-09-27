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
    users: userReducer
}