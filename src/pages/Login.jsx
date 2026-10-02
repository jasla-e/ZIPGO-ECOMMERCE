import { useState } from "react";
import { useDispatch } from "react-redux";

import { loginUser } from "../services/authApi";
import { setUser } from "../utils/auth";

import { useNavigate, Link } from "react-router-dom";

// CART
import { getCart, addToCartAsync } from "../redux/slices/cartSlice";

// WISHLIST
import { getWishlist, addToWishlistAsync } from "../redux/slices/wishlistSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const result = await loginUser(email, password);

    console.log("LOGIN RESPONSE:", result);

    alert("Login API successful");
  } catch (err) {
    console.log(" LOGIN ERROR:", err);
    alert(err.message);
  }
};

{/*cart restore*/}
      const pendingCartItem = JSON.parse(
        localStorage.getItem("pending_cart_item")
      );

      if (pendingCartItem) {
        await dispatch(addToCartAsync(pendingCartItem));
        localStorage.removeItem("pending_cart_item");
      }

      await dispatch(getCart());

      {/*wishlist restoring*/}
      await dispatch(getWishlist());
  
      const pendingWishlistItem = localStorage.getItem("pending_wishlist_item");

    if (user.role==="admin"){
      navigate("/admin");
    }else if (pendingWishlistItem && pendingWishlistItem!=="navbar"){
      await dispatch(addToWishlistAsync(JSON.parse(pendingWishlistItem))
    );
    localStorage.removeItem("pending_wishlist_item");
    navigate("/wishlist");
  }else if (pendingWishlistItem==="navbar"){
    localStorage.removeItem("pending_wishlist_item");
    navigate("/wishlist")
  }else if(pendingCartItem){
    navigate("/cart");
  }else{
    navigate("/home")
  }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow w-80"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input
          className="w-full border p-2 mb-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-4"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white p-2 rounded">
          Login
        </button>

        <p className="text-sm mt-3 text-center">
          No account?{" "}
          <Link className="text-blue-600" to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}