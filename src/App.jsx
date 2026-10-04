import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getUser } from "./utils/auth";
import { getWishlist } from "./redux/slices/wishlistSlice";
import { getCart } from "./redux/slices/cartSlice";
import { Routes, Route } from "react-router-dom";


import UserLayout from "./layout/UserLayout";
import Intro from "./pages/Intro";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import CheckoutPage from "./pages/CheckoutPage";
import Payment from "./pages/Payment";


import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import Profile from "./pages/Profile";

import AProtectedRoute from "./Admin/routes/AProtectedRoute";
import AdminLayout from "./Admin/layout/AdminLayout";
import ADashboard from "./Admin/pages/ADashboard";
import AProducts from "./Admin/pages/AProducts";
import AUsers from "./Admin/pages/AUsers";
import AOrders from "./Admin/pages/AOrders"



function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = getUser();

    if (user?.id) {
      dispatch(getWishlist());
      dispatch(getCart()); // 
    }
  }, [dispatch]);

  return (
    <>
     
      <Routes>
        
       <Route element={<UserLayout />}>
          <Route path="/" element={<Intro />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product/:id" element={<ProductDetails />} />
     
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
     
     
     
     
     
       </Route>
        
        {/* AUTH */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />


        {/* WISHLIST */}
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        {/* CART */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        {/* PAYMENT */}
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        {/* ORDERS */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

{/*admin*/}
      <Route
  path="/admin"
  element={
    <AProtectedRoute>
      <AdminLayout />
    </AProtectedRoute>
  }
>
  <Route index element={<ADashboard />} />
  <Route path="products" element={<AProducts />} />
  <Route path="orders" element={<AOrders />} />
  <Route path="users" element={<AUsers />} />
</Route>

      </Routes>
    </>
  );
}

export default App;