import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";


import { getUser, logoutUser } from "../utils/auth";

// CART//
import { clearCart, getCart } from "../redux/slices/cartSlice";

// WISHLIST//
import {
  clearWishlist,
  getWishlist,
} from "../redux/slices/wishlistSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = useSelector(
    (state) => state.cart?.cartItems || []
  );

  const wishlistCount = useSelector(
    (state) => state.wishlist?.items?.length || 0
  );

  const [user, setUser] = useState(getUser());
  const [userMenuOpen, setUserMenuOpen] = useState(false);


  const desktopMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // CLICK OUTSIDE TO CLOSE USER DROPDOWNS//
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuOpen &&
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(event.target) &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);



 useEffect(() => {
  const currentUser = getUser();

  console.log("USER AFTER REFRESH:", currentUser);

  setUser(currentUser);

 const userId =
  currentUser?.id ||
  currentUser?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

if (userId) {
  dispatch(getCart());
  dispatch(getWishlist());
} else {
  dispatch(clearCart());
  dispatch(clearWishlist());
}
}, [dispatch]);

useEffect(() => {
  setUserMenuOpen(false);
}, [location.pathname]);

  // CART CLICKING//
  const handleCartClick = () => {
    const user = getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/cart");
  };


  const handleWishlistClick = () => {
    const user = getUser();
    if (!user) {
      localStorage.setItem("pending_wishlist_item", "navbar");
      navigate("/login");
      return;
    }
    navigate("/wishlist");
  };

  //  LOGOUT//
  const handleLogout = () => {
    dispatch(clearCart());
    dispatch(clearWishlist());
    logoutUser();
    setUser(null);
    setUserMenuOpen(false);
    navigate("/");
  };

  const navItem =
    "cursor-pointer px-2 py-1 rounded-md hover:bg-gray-100 transition";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">

        {/* LOGO */}
        <Link to="/">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" className="w-7 h-7 md:w-10 md:h-10" alt="Logo" />
            <h1 className="text-lg md:text-2xl font-bold">ZIPGO</h1>
          </div>
        </Link>

        {/* DESKTOP */}
        <ul className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/home">
            <li className={navItem}>Home</li>
          </Link>

          {/*  Search bar removed from here */}

          {/* CART */}
          <li
            className={`${navItem} relative`}
            onClick={handleCartClick}
          >
            🛒 Cart
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </li>

          {/* WISHLIST */}
          <li
            className={`${navItem} relative`}
            onClick={handleWishlistClick}
          >
            ❤️ Wishlist
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </li>

          {/* USER */}
            { user ? (
              <div className="relative" ref={desktopMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="px-2 py-1 rounded-md hover:bg-gray-100 transition text-green-600 font-medium"
                >
                  👤 {user.name}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (     
              <li
                className={navItem}
                onClick={() => navigate("/login")}
              >
                Login
              </li>
            )}
          
        </ul>

        {/* MOBILE */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/home">
            <span className="text-sm font-medium">Home</span>
          </Link>

        

          {/* CART */}
          <div
            className="relative cursor-pointer"
            onClick={handleCartClick}
          >
            <span className="text-lg">🛒</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </div>

          {/* WISHLIST */}
          <div
            className="relative cursor-pointer"
            onClick={handleWishlistClick}
          >
            <span className="text-lg">❤️</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>

          {/* USER */}
          {user ? (
            <div className="relative" ref={mobileMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="text-sm font-medium flex items-center gap-1"
              >
                👤 {user.name}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg z-50">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-medium"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;