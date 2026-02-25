import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./products/productSlice";
import productFormReducer from "./products/productFormSlice";
import authReducer from "./auth/authSlice";
import cartReducer from "./products/cartSlice";
import wishlistReducer from "./products/wishlistSlice";
import orderReducer from "./products/orderSlice";
import reviewReducer from "./products/reviewSlice";
 
export const store = configureStore({
  reducer: {
    products: productReducer,
    productForm: productFormReducer,
    auth: authReducer,
    cart:cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
    review: reviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
