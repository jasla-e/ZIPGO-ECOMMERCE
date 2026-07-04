import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrdersAsync,
  updateOrderStatusAsync,
} from "../../redux/slices/ordersSlice";


function AOrders() {
  const dispatch = useDispatch();

  const { orders = [], loading } = useSelector((state) => state.orders);

  //search//
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    dispatch(fetchAllOrdersAsync());
  }, [dispatch]);

  const statusFlow = {
    pending: ["shipped"],
    shipped: ["delivered"],
    delivered: ["completed"],
    completed: [],
  };

  const [filter,setFilter]=useState("all");

  const isValidTransition = (current, next) =>
    statusFlow[current]?.includes(next);

  const handleStatusChange = (id, currentStatus = "pending", newStatus) => {
    if (!isValidTransition(currentStatus, newStatus)) {
      alert("Invalid status transition!");
      return;
    }

    const notifications = {
      shipped: "Your order has been shipped 🚚",
      delivered: "Your order has been delivered 📦",
      completed: "Your order is completed ✅",
    };

    

    dispatch(
      updateOrderStatusAsync({
        id,
        data: {
          status: newStatus,
          notification: notifications[newStatus] || "",
        },
      })
    ).then(() => {
      dispatch(fetchAllOrdersAsync());
    });
  };

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    completed: "bg-gray-200 text-gray-700",
  };

  const getStatusStyle = (status) =>
    statusStyles[status] || statusStyles.pending;

  
  const filteredOrders = useMemo(() => {
  let data = orders;

  
  if (filter !== "all") {
    data = data.filter((order) => order.status === filter);
  }

  const keyword = searchTerm.toLowerCase();

  if (keyword) {
    data = data.filter((order) => {
      return (
        order.id?.toString().toLowerCase().includes(keyword) ||
        order.status?.toLowerCase().includes(keyword) ||
        order.paymentMethod?.toLowerCase().includes(keyword) ||
        order.address?.fullName?.toLowerCase().includes(keyword) ||
        order.address?.phone?.toString().toLowerCase().includes(keyword)
      );
    });
  }
 return data;
  }, [orders, filter, searchTerm]);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="p-3 md:p-4 bg-white rounded-xl shadow">

      <h1 className="text-xl font-bold mb-3">
        Orders List
      </h1>

  <div className="flex flex-col md:flex-row gap-2 mb-3">


  <input
    type="text"
    placeholder="Search by Order ID, Name, Phone, Status..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full md:w-80 border px-3 py-2 rounded-md text-sm"
  />

 
     <select
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
    className="border px-3 py-2 rounded-md text-sm"
     >
    <option value="all">All Orders</option>
    <option value="pending">Pending</option>
    <option value="shipped">Shipped</option>
    <option value="delivered">Delivered</option>
    <option value="completed">Completed</option>
     </select>
  </div>
  <div className="space-y-3">

        {filteredOrders.map((order) => {
          const currentStatus = order.status || "pending";

          return (
            <div
              key={order.id}
              className="border rounded-lg shadow-sm p-3 bg-white"
            >

              {/* TOP */}
              <div className="flex justify-between items-center mb-2">

                <div>
                  <p className="font-semibold text-sm">
                    Order #{order.id}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "-"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-sm">
                    ₹{order.totalAmount}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>

              {/* PRODUCTS */}
              <div className="space-y-1 mb-2">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-2 items-center bg-gray-50 p-1.5 rounded"
                  >
                    <img
                      src={item.image}
                      className="w-9 h-9 rounded object-cover"
                      alt=""
                    />

                    <div className="text-[11px]">
                      <p className="font-medium">{item.title}</p>
                      <p>Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ADDRESS */}
              <div className="text-xs leading-snug">
                <div>
                  <p>{order.address?.fullName || "-"}</p>
                  <p>{order.address?.house || ""}</p>
                  <p>
                    {order.address?.city || ""} - {order.address?.pincode || ""}
                  </p>
                  <p>Ph: {order.address?.phone || "-"}</p>
                </div>
              </div>

              {/* STATUS */}
              <div className="flex items-center justify-between mt-2">

                <span
                  className={`px-2 py-0.5 rounded text-[11px] ${getStatusStyle(
                    currentStatus
                  )}`}
                >
                  {currentStatus}
                </span>

                <select
                  value={currentStatus}
                  onChange={(e) =>
                    handleStatusChange(
                      order.id,
                      currentStatus,
                      e.target.value
                    )
                  }
                  className="border rounded px-2 py-0.5 text-[11px]"
                >
                  <option value={currentStatus}>
                    Current: {currentStatus}
                  </option>

                  {(statusFlow[currentStatus] || []).map((s) => (
                    <option key={s} value={s}>
                      Move to {s}
                    </option>
                  ))}
                </select>

              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}

export default AOrders;