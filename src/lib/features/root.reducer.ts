import authReducer from "./authSlice";
import productReducer from "./productSlice";
import categoryReducer from "./categorySlice";

export const RootReducers = {
    auth: authReducer,
    producs: productReducer,
    categories: categoryReducer
}