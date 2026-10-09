import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { clearCartAsync } from "../redux/slices/cartSlice";

function Payment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const razorpayOrder = JSON.parse(
    localStorage.getItem("razorpayOrder")
  );

  useEffect(() => {
    if (!razorpayOrder) {
      navigate("/checkout");
      return;
    }

    const timer = setTimeout(() => {
      openRazorpay();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const openRazorpay = () => {
    const options = {
      key: razorpayOrder.razorpayKeyId,

      amount:
        razorpayOrder.order.totalAmount * 100,

      currency: "INR",

      name: "ZIPGO",

      description: `Order #${razorpayOrder.order.id}`,

      order_id:
        razorpayOrder.razorpayOrderId,

      handler: async function (response) {
  try {
    console.log(
      "Razorpay Payment Success:",
      response
    );

    const token = localStorage.getItem("token");

    const verifyData = {
      orderId: razorpayOrder.order.id,
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature,
    };

    console.log("VERIFY DATA:", verifyData);

    await axios.post(
      "https://localhost:7150/api/Payment/verify",
      verifyData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Payment verified successfully");

// Clear cart in Redux and backend
await dispatch(clearCartAsync()).unwrap();

console.log("Cart cleared successfully");

localStorage.removeItem("razorpayOrder");

navigate("/orders");
   
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR:", error);
    console.log("BACKEND ERROR:", error.response?.data);
  }
},
      prefill: {
        name: razorpayOrder.address?.fullName || "",
        contact: razorpayOrder.address?.phone || "",
      },

      theme: {
        color: "#000000",
      },

      modal: {
        ondismiss: function () {
          navigate("/checkout");
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.open();
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