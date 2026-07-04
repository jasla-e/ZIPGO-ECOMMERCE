import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersAsync } from "../redux/slices/ordersSlice";

function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders?.orders || []);

  useEffect(() => {
    dispatch(fetchOrdersAsync());
  }, [dispatch]);

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  //  STATUS STYLES//
  const getStatusStyle = (status = "pending") => {
    switch (status) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "confirmed":
        return "bg-indigo-200 text-indigo-800";
      case "shipped":
        return "bg-blue-200 text-blue-800";
      case "out_for_delivery":
        return "bg-purple-200 text-purple-800";
      case "delivered":
        return "bg-green-200 text-green-800";
      case "completed":
        return "bg-gray-300 text-gray-800";
      default:
        return "bg-yellow-200 text-yellow-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-28 px-4 md:px-10">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          My Orders
        </h1>
      </div>

      {/* EMPTY */}
      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">

          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border p-4 shadow-sm"
            >

              {/* TOP ROW */}
              <div className="flex justify-between items-center">

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Order #{order.id}
                  </p>

                  <p className="text-xs text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>

                  {/* STATUS BADGE */}
                  <span
                    className={`inline-block mt-2 text-xs px-2 py-1 rounded ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status || "pending"}
                  </span>
                </div>

                <div className="text-right">
                  <p className="font-bold text-green-600">
                    ₹{order.totalAmount}
                  </p>

                  <p className="text-xs text-gray-500">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>

              {/* ITEMS */}
              <div className="mt-3 space-y-2">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={item.image}
                        className="w-10 h-10 rounded object-cover"
                        alt=""
                      />

                      <div>
                        <p className="text-sm text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm font-medium">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* ADDRESS */}
              <p className="text-xs text-gray-500 mt-3 leading-snug">
                {order.address?.fullName}, {order.address?.house},{" "}
                {order.address?.city} - {order.address?.pincode},{" "}
                Ph: {order.address?.phone}
              </p>

              {/*  ADMIN NOTIFICATION */}
              {order.notification && (
                <div className="mt-3 text-xs text-blue-700 bg-blue-50 p-2 rounded">
                  {order.notification}
                </div>
              )}

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default Orders;