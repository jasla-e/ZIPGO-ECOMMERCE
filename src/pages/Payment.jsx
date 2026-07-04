import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { clearCart } from "../redux/slices/cartSlice";
import { placeOrderAsync } from "../redux/slices/ordersSlice";

function Payment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const tempOrder = JSON.parse(localStorage.getItem("tempOrder"));

  useEffect(() => {
    if (!tempOrder) {
      navigate("/checkout");
      return;
    }

    
    setTimeout(() => {
      openRazorpay();
    }, 300);
  }, []);

  const openRazorpay = () => {
    const options = {
      key: "rzp_test_Srudb8fRWQmJH5",
      amount: tempOrder.totalAmount * 100,
      currency: "INR",
      name: "My E-Commerce Store",
      description: "Order Payment",

      handler: async function (response) {
        await dispatch(
          placeOrderAsync({
            ...tempOrder,
            paymentMethod: "RAZORPAY",
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            createdAt: new Date(),
          })
        );

        dispatch(clearCart());
        localStorage.removeItem("tempOrder");

        navigate("/orders");
      },

      prefill: {
        name: tempOrder.address.fullName,
        contact: tempOrder.address.phone,
      },

      theme: {
        color: "#000",
      },

      modal: {
        ondismiss: function () {
          navigate("/checkout"); // if user closes popup
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h2 className="text-xl font-semibold">
        Opening Payment Gateway...
      </h2>
    </div>
  );
}

export default Payment;