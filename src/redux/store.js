import {configureStore} from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice"
import cartReducer from "./slices/cartSlice"
import wishlistReducer from "./slices/wishlistSlice"
import OrdersReducer from "./slices/ordersSlice";
import usersReducer from "./slices/usersSlice";
import dashboardReducer from "./slices/dashboardSlice";


const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: OrdersReducer, 
    users:usersReducer,
    dashboard: dashboardReducer,
  },
});
export default store;