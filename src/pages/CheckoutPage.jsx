import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { clearCartAsync } from "../redux/slices/cartSlice";
import { placeOrderAsync } from "../redux/slices/ordersSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(
    (state) => state.cart?.cartItems || []
  );

  const [user, setUser] = useState(null);

  const [selectedAddressId, setSelectedAddressId] =
    useState(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [house, setHouse] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found");
      return;
    }

    const response = await fetch(
      "https://localhost:7150/api/Address",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch addresses");
    }

    const addresses = await response.json();

    const userData = {
      addresses: addresses || [],
    };

    setUser(userData);

    // AUTO FILL FIRST ADDRESS
    if (addresses.length > 0) {
      const firstAddress = addresses[0];

      setSelectedAddressId(firstAddress.id);

      setFullName(firstAddress.fullName || "");
      setPhone(firstAddress.phone || "");
      setHouse(firstAddress.houseArea || "");
      setCity(firstAddress.city || "");
      setPincode(firstAddress.pincode || "");
    }

  } catch (error) {
    console.log("CHECKOUT ADDRESS ERROR:", error);
  }
  };

  const handlePlaceOrder = async () => {
    if (
      !fullName ||
      !phone ||
      !house ||
      !city ||
      !pincode
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
     toast.error("Pincode must be exactly 6 digits");
      return;
    }

    const newOrder = {
      items: cartItems,
      totalAmount,
      paymentMethod,

      address: {
        fullName,
        phone,
        house,
        city,
        pincode,
      },

      createdAt: new Date(),
    };

    try {
      if (paymentMethod === "COD") {
        const result = await dispatch(
          placeOrderAsync(newOrder)
        ).unwrap();

        if (result) {
          await dispatch(clearCartAsync());

          toast.success("Order placed successfully..");

          navigate("/orders");
        }

        return;
      }

      if (paymentMethod === "UPI") {
        localStorage.setItem(
          "tempOrder",
          JSON.stringify(newOrder)
        );

        navigate("/payment");
      }

    } catch (error) {
      console.log(error);
      toast.error("Order failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-28 px-4 md:px-10 pb-10">

      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Checkout
        </h1>

        <p className="text-gray-500 mt-2">
          Complete your order securely
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-8">

          {/* SHIPPING */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">

            {/* SAVED ADDRESSES */}
            {user?.addresses?.length > 0 && (
              <div className="mb-8">

                <h3 className="font-semibold text-lg mb-4">
                  Saved Addresses
                </h3>

                <div className="space-y-3">

                  {user.addresses.map((address) => (

                    <div
                      key={address.id}
                      onClick={() => {
                        setSelectedAddressId(address.id);

                        setFullName(address.fullName || "");
                        setPhone(address.phone || "");
                        setHouse(address.house || "");
                        setCity(address.city || "");
                        setPincode(address.pincode || "");
                      }}
                      className={`border rounded-2xl p-4 cursor-pointer transition ${
                        selectedAddressId === address.id
                          ? "border-black bg-gray-50"
                          : "border-gray-200"
                      }`}
                    >

                      <div className="flex items-start gap-3">

                        <input
                          type="radio"
                          checked={
                            selectedAddressId === address.id
                          }
                          readOnly
                          className="mt-1"
                        />

                        <div>

                          <h4 className="font-semibold">
                            {address.fullName}
                          </h4>

                          <p className="text-sm text-gray-500 mt-1">
                            {address.house}
                          </p>

                          <p className="text-sm text-gray-500">
                            {address.city}
                          </p>

                          <p className="text-sm text-gray-500">
                            {address.pincode}
                          </p>

                          <p className="text-sm text-gray-500">
                            {address.phone}
                          </p>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h2 className="text-2xl font-bold mb-6">
              Shipping Address
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <input
                className={inputStyle}
                placeholder="Full Name"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
              />

              <input
                className={inputStyle}
                placeholder="Phone Number"
                value={phone}
                maxLength={10}
                inputMode="numeric"
                onChange={(e) => {
                  const value =
                    e.target.value.replace(/\D/g, "");

                  if (value.length <= 10)
                    setPhone(value);
                }}
              />

              <input
                className={`${inputStyle} md:col-span-2`}
                placeholder="House / Street"
                value={house}
                onChange={(e) =>
                  setHouse(e.target.value)
                }
              />

              <input
                className={inputStyle}
                placeholder="City"
                value={city}
                onChange={(e) =>
                  setCity(e.target.value)
                }
              />

              <input
                className={inputStyle}
                placeholder="Pincode"
                value={pincode}
                maxLength={6}
                inputMode="numeric"
                onChange={(e) => {
                  const value =
                    e.target.value.replace(/\D/g, "");

                  setPincode(value);
                }}
              />

            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">

            <h2 className="text-2xl font-bold mb-6">
              Payment Method
            </h2>

            <div className="space-y-4">

              <label className={`border rounded-2xl p-5 flex items-center cursor-pointer ${
                paymentMethod === "COD"
                  ? "border-black bg-gray-50"
                  : "border-gray-200"
              }`}>

                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <div className="ml-4">
                  <h3 className="font-semibold">
                    Cash on Delivery
                  </h3>

                  <p className="text-sm text-gray-500">
                    Pay when delivered
                  </p>
                </div>
              </label>

              <label className={`border rounded-2xl p-5 flex items-center cursor-pointer ${
                paymentMethod === "UPI"
                  ? "border-black bg-gray-50"
                  : "border-gray-200"
              }`}>

                <input
                  type="radio"
                  value="UPI"
                  checked={paymentMethod === "UPI"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <div className="ml-4">
                  <h3 className="font-semibold">
                    UPI Payment
                  </h3>

                  <p className="text-sm text-gray-500">
                    Pay via Razorpay
                  </p>
                </div>
              </label>

            </div>
          </div>

        </div>

        {/* SUMMARY */}
        <div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-7 sticky top-28">

            <h2 className="text-xl font-bold mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.title} × {item.quantity}
                  </span>

                  <span>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 font-bold flex justify-between">

              <span>Total</span>

              <span>₹{totalAmount}</span>

            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full mt-6 bg-black text-white py-3 rounded-xl font-bold"
            >
              Confirm Order
            </button>

          </div>
        </div>

      </div>
      
      
      <>
  <div className="min-h-screen bg-gray-100 pt-28 px-4 md:px-10 pb-10">
   
  </div>

  <ToastContainer
    position="top-right"
    autoClose={2000}
    hideProgressBar={false}
    newestOnTop={true}
    closeOnClick
    pauseOnHover
    theme="light"
  />
   </>
    </div>
    
  );
}

const inputStyle =
  "w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none";

export default CheckoutPage;