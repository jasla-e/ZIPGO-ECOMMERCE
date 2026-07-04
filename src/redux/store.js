import {configureStore} from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice"
import cartReducer from "./slices/cartSlice"
import wishlistReducer from "./slices/wishlistSlice"
import OrdersReducer from "./slices/ordersSlice";
import usersReducer from "./slices/usersSlice";

const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: OrdersReducer, 
    users:usersReducer,
  },
});
export default store;