import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  removeFromCart,
  updateCartAsync,
  getCart,
  clearCartAsync,
} from "../redux/slices/cartSlice";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

 
  const { cartItems = [], totalPrice = 0 } = useSelector(
    (state) => state.cart || {}
  );

  
  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-4 md:px-10">

     
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Your Cart
        </h1>

        <p className="text-gray-500 mt-2">
          {cartItems.length} items in your travel bag
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">
            Your cart is empty
          </h2>

          <p className="text-gray-500 mt-3">
            Add your favourite travel essentials.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">

 {/* CART ITEMS */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4"
              >

                <img
                  src={item.product?.image}
                  alt={item.product?.name}
                  className="w-28 h-28 object-cover rounded-xl"
                />

                <div className="flex-1">

                  <h2 className="font-bold text-lg text-gray-900">
                    {item.product?.name}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.product?.maincategory}
                  </p>

                  <p className="text-xl font-bold mt-3">
                    ₹{item.product?.price}
                  </p>

{/* QUANTITY */}
                  <div className="flex items-center gap-3 mt-4">

                    {/* DECREASE */}
                    <button
                      onClick={() =>
                        item.quantity > 1 &&
                        dispatch(
                          updateCartAsync({
                            id: item.id,
                            updatedItem: {
                              ...item,
                              quantity: item.quantity - 1,
                            },
                          })
                        )
                      }
                      className="w-9 h-9 rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                      -
                    </button>

                    <span className="font-semibold text-lg">
                      {item.quantity}
                    </span>

                    {/* INCREASE */}
                    <button
                      onClick={() =>
                        dispatch(
                          updateCartAsync({
                            id: item.id,
                            updatedItem: {
                              ...item,
                              quantity: item.quantity + 1,
                            },
                          })
                        )
                      }
                      className="w-9 h-9 rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                      +
                    </button>

                  </div>
                </div>

{/* REMOVE */}
                <div className="flex flex-col justify-between items-end">

                  <button
                    onClick={() =>
                      dispatch(removeFromCart(item.id))
                    }
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>

                  <p className="font-bold text-lg">
                    ₹{(item.product?.price || 0) * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

{/* RIGHT SIDE */}
<div className="h-fit sticky top-28">

  {/* ORDER SUMMARY */}
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

    <h2 className="text-2xl font-bold text-gray-900">
      Order Summary
    </h2>

    <div className="flex justify-between mt-6 text-gray-600">
      <span>Total Items</span>
      <span>{cartItems.length}</span>
    </div>

    <div className="flex justify-between mt-4 text-lg font-bold text-gray-900">
      <span>Total Price</span>
      <span>₹{totalPrice}</span>
    </div>

    {/* CHECKOUT BUTTON */}
    <button
      onClick={() => navigate("/checkout")}
      className="w-full mt-8 bg-black text-white py-4
        rounded-xl hover:bg-gray-800 transition"
    >
      Proceed to Checkout
    </button>

  </div>

  {/* CLEAR CART - SEPARATE BOX */}
  <div className="bg-white rounded-2xl p-4 mt-4 shadow-sm border border-gray-100">

    <button
      onClick={() => dispatch(clearCartAsync())}
      className="w-full py-3 text-red-500 font-semibold
        rounded-xl hover:bg-red-50 transition"
    >
      Clear Cart
    </button>

  </div>

</div>

        </div>
      )}
    </div>
  );
}

export default Cart;