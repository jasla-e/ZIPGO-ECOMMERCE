import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  updateOrderStatusAsync,
  searchOrdersAsync,
  fetchAllOrdersAsync,
} from "../../redux/slices/ordersSlice";

import { toast } from "react-toastify";

import {
  Search,
  ChevronDown,
  ChevronRight,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  Eye,
  X,
} from "lucide-react";

function AOrders() {
  const dispatch = useDispatch();

  const { orders = [], loading } = useSelector(
    (state) => state.orders
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // SEARCH + FILTER
 useEffect(() => {
  // Initial load / back to All Orders
  if (!searchTerm && filter === "all") {
    dispatch(fetchAllOrdersAsync());
    return;
  }

  // Search/filter
  const timer = setTimeout(() => {
    dispatch(
      searchOrdersAsync({
        search: searchTerm,
        status: filter === "all" ? "" : filter,
      })
    );
  }, 400);

  return () => clearTimeout(timer);
}, [dispatch, searchTerm, filter]);


  // GET PRODUCT IMAGE
  const getProductImage = (image) => {
    if (!image) return null;

    // If backend already returns a complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Remove starting slash if present
    const cleanImage = image.replace(/^\/+/, "");

    // Backend image URL
    return `https://localhost:7150/${cleanImage}`;
  };

  // STATUS FLOW
  const statusFlow = {
    pending: ["shipped"],
    shipped: ["delivered"],
    delivered: ["completed"],
    completed: [],
  };

  const statusStyles = {
    pending: {
      badge:
        "bg-yellow-50 text-yellow-700 border border-yellow-200",
      dot: "bg-yellow-500",
    },

    shipped: {
      badge:
        "bg-blue-50 text-blue-700 border border-blue-200",
      dot: "bg-blue-500",
    },

    delivered: {
      badge:
        "bg-green-50 text-green-700 border border-green-200",
      dot: "bg-green-500",
    },

    completed: {
      badge:
        "bg-gray-100 text-gray-700 border border-gray-200",
      dot: "bg-gray-500",
    },
  };

  const isValidTransition = (current, next) =>
    statusFlow[current]?.includes(next);

  const getStatusStyle = (status) =>
    statusStyles[status] || statusStyles.pending;

  // STATUS UPDATE
  const handleStatusChange = async (
  id,
  currentStatus = "pending",
  newStatus
) => {
  // Check whether the transition is allowed
  if (!isValidTransition(currentStatus, newStatus)) {
    toast.error("Invalid status transition!");
    return;
  }

  const notifications = {
    shipped: "Your order has been shipped 🚚",
    delivered: "Your order has been delivered 📦",
    completed: "Your order is completed ✅",
  };

  // Convert lowercase UI value to backend format
  const backendStatus =
    newStatus.charAt(0).toUpperCase() + newStatus.slice(1);

  try {
    await dispatch(
      updateOrderStatusAsync({
        id,
        data: {
          status: backendStatus,
          notification: notifications[newStatus] || "",
        },
      })
    ).unwrap();

    toast.success(`Order moved to ${backendStatus}`);

    // Refresh the same filtered/searched list
    dispatch(
      searchOrdersAsync({
        search: searchTerm,
        status: filter === "all" ? "" : filter,
      })
    );

    // Update selected order
    setSelectedOrder((prev) =>
      prev
        ? {
            ...prev,
            status: backendStatus,
          }
        : prev
    );
  } catch (error) {
    console.error("STATUS UPDATE ERROR:", error);
    toast.error("Failed to update order status");
  }
};

  // GET ITEMS
  const getOrderItems = (order) => {
    return order?.orderItems || order?.items || [];
  };

  // TOTAL QUANTITY
  const getTotalQuantity = (order) => {
    const items = getOrderItems(order);

    return items.reduce(
      (total, item) =>
        total + (item.quantity || 0),
      0
    );
  };

  // ADDRESS
  const getAddress = (order) => {
    if (!order?.address) {
      return "-";
    }

    if (typeof order.address === "string") {
      return order.address;
    }

    const address = order.address;

    return [
      address.house,
      address.street,
      address.city,
      address.state,
      address.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  // LOADING
  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto" />

          <p className="text-sm text-gray-500 mt-4">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  // UI
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-full">

      {/* HEADER */}
      <div className="mb-6">
        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center">
            <Package size={20} />
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Orders Workspace
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage and inspect customer orders
            </p>
          </div>

        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">

        {/* SEARCH */}
        <div className="relative w-full sm:max-w-md">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by Order ID, Name, Phone, Status..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="
              w-full
              h-11
              pl-10
              pr-4
              bg-white
              border
              border-gray-200
              rounded-lg
              text-sm
              text-gray-800
              placeholder:text-gray-400
              outline-none
              focus:border-gray-400
              focus:ring-2
              focus:ring-gray-100
            "
          />

        </div>

        {/* FILTER */}
        <div className="relative">

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="
              appearance-none
              h-11
              min-w-[150px]
              bg-white
              border
              border-gray-200
              rounded-lg
              px-4
              pr-10
              text-sm
              text-gray-700
              outline-none
              cursor-pointer
              focus:border-gray-400
            "
          >
            <option value="all">
              All Orders
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="shipped">
              Shipped
            </option>

            <option value="delivered">
              Delivered
            </option>

            <option value="completed">
              Completed
            </option>
          </select>

          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />

        </div>

      </div>

      {/* MASTER / DETAIL */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

        {/* ORDERS LIST */}
        <div className="xl:col-span-8 bg-white border border-gray-200 rounded-xl overflow-hidden">

          {/* TABLE HEADER */}
          <div
            className="
              hidden
              md:grid
              grid-cols-[1.1fr_1.4fr_0.8fr_1fr_1fr_0.8fr]
              gap-4
              px-5
              py-4
              bg-gray-50
              border-b
              border-gray-200
              text-xs
              font-semibold
              text-gray-500
              uppercase
              tracking-wide
            "
          >
            <div>Order</div>
            <div>Customer</div>
            <div>Items</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {/* ORDERS */}
          {orders.length === 0 ? (
            <div className="py-16 text-center">

              <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                <Package
                  size={22}
                  className="text-gray-400"
                />
              </div>

              <p className="font-semibold text-gray-700 mt-4">
                No orders found
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Try changing your search or filter.
              </p>

            </div>
          ) : (
            <div>

              {orders.map((order) => {

                const currentStatus =
                  order.status?.toLowerCase() ||
                  "pending";

                const isSelected =
                  selectedOrder?.id === order.id;

                const style =
                  getStatusStyle(currentStatus);

                return (
                  <div
                    key={order.id}
                    onClick={() =>
                      setSelectedOrder(order)
                    }
                    className={`
                      group
                      cursor-pointer
                      border-b
                      border-gray-100
                      last:border-b-0
                      transition
                      ${
                        isSelected
                          ? "bg-gray-50"
                          : "bg-white hover:bg-gray-50"
                      }
                    `}
                  >

                    {/* DESKTOP ROW */}
                    <div
                      className="
                        hidden
                        md:grid
                        grid-cols-[1.1fr_1.4fr_0.8fr_1fr_1fr_0.8fr]
                        gap-4
                        items-center
                        px-5
                        py-4
                      "
                    >

                      {/* ORDER */}
                      <div className="flex items-center gap-2">

                        <ChevronRight
                          size={16}
                          className={`
                            transition
                            ${
                              isSelected
                                ? "text-gray-900 rotate-90"
                                : "text-gray-300"
                            }
                          `}
                        />

                        <div>

                          <p className="text-sm font-semibold text-gray-900">
                            #{order.id}
                          </p>

                          <p className="text-[11px] text-gray-400 mt-1">
                            {order.orderDate
                              ? new Date(
                                  order.orderDate
                                ).toLocaleDateString()
                              : "-"}
                          </p>

                        </div>

                      </div>

                      {/* CUSTOMER */}
                      <div className="flex items-center gap-3 min-w-0">

                        <div
                          className="
                            w-9
                            h-9
                            rounded-full
                            bg-gray-100
                            flex
                            items-center
                            justify-center
                            shrink-0
                          "
                        >
                          <User
                            size={16}
                            className="text-gray-500"
                          />
                        </div>

                        <div className="min-w-0">

                          <p className="text-sm font-medium text-gray-800 truncate">
                            {order.customerName ||
                              "-"}
                          </p>

                          {order.phone && (
                            <p className="text-[11px] text-gray-400 truncate">
                              {order.phone}
                            </p>
                          )}

                        </div>

                      </div>

                      {/* ITEMS */}
                      <div className="text-sm text-gray-600">
                        {getTotalQuantity(order)} Qty
                      </div>

                      {/* AMOUNT */}
                      <div className="text-sm font-semibold text-gray-900">
                        ₹{order.totalAmount}
                      </div>

                      {/* STATUS */}
                      <div>

                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-1.5
                            px-2.5
                            py-1
                            rounded-md
                            text-[11px]
                            font-medium
                            capitalize
                            ${style.badge}
                          `}
                        >

                          <span
                            className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                          />

                          {currentStatus}

                        </span>

                      </div>

                      {/* ACTION */}
                      <div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            text-xs
                            font-semibold
                            text-blue-600
                            hover:text-blue-800
                            transition
                          "
                        >
                          <Eye size={14} />
                          Inspect
                        </button>

                      </div>

                    </div>

                    {/* MOBILE ROW */}
                    <div className="md:hidden p-4">

                      <div className="flex justify-between gap-3">

                        <div className="flex gap-3">

                          <div
                            className="
                              w-9
                              h-9
                              rounded-full
                              bg-gray-100
                              flex
                              items-center
                              justify-center
                              shrink-0
                            "
                          >
                            <User
                              size={16}
                              className="text-gray-500"
                            />
                          </div>

                          <div>

                            <p className="font-semibold text-sm text-gray-900">
                              #{order.id}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              {order.customerName ||
                                "-"}
                            </p>

                          </div>

                        </div>

                        <div className="text-right">

                          <p className="font-semibold text-sm">
                            ₹{order.totalAmount}
                          </p>

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1
                              mt-1
                              px-2
                              py-1
                              rounded-md
                              text-[10px]
                              capitalize
                              ${style.badge}
                            `}
                          >

                            <span
                              className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                            />

                            {currentStatus}

                          </span>

                        </div>

                      </div>

                      <div
                        className="
                          flex
                          justify-between
                          items-center
                          mt-4
                          pt-3
                          border-t
                          border-gray-100
                          text-xs
                          text-gray-500
                        "
                      >

                        <span>
                          {getTotalQuantity(order)} Qty
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="text-blue-600 font-semibold"
                        >
                          Inspect
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* ORDER DETAILS */}
        <div className="xl:col-span-4 xl:-mt-24">

          {!selectedOrder ? (

            <div
              className="
                bg-white
                border
                border-gray-200
                rounded-xl
                min-h-[500px]
                flex
                items-center
                justify-center
                p-6
              "
            >

              <div className="text-center">

                <div
                  className="
                    w-14
                    h-14
                    rounded-full
                    bg-gray-100
                    mx-auto
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Package
                    size={24}
                    className="text-gray-400"
                  />
                </div>

                <h3 className="font-semibold text-gray-700 mt-4">
                  No Order Selected
                </h3>

                <p className="text-xs text-gray-400 mt-1 max-w-[220px] mx-auto">
                  Select an order from the list to inspect
                  its details.
                </p>

              </div>

            </div>

          ) : (

            <div
              className="
                bg-white
                border
                border-gray-200
                rounded-xl
                overflow-hidden
              "
            >

              {/* DETAIL HEADER */}
              <div className="p-5 border-b border-gray-100">

                <div className="flex justify-between items-start gap-3">

                  <div>

                    <p className="text-xs text-gray-400">
                      Order
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-1">
                      #{selectedOrder.id}
                    </h2>

                  </div>

                  <div className="flex items-center gap-2">

                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-1.5
                        px-2.5
                        py-1.5
                        rounded-md
                        text-[11px]
                        font-medium
                        capitalize
                        ${
                          getStatusStyle(
                            selectedOrder.status?.toLowerCase() ||
                              "pending"
                          ).badge
                        }
                      `}
                    >

                      <span
                        className={`
                          w-1.5
                          h-1.5
                          rounded-full
                          ${
                            getStatusStyle(
                              selectedOrder.status?.toLowerCase() ||
                                "pending"
                            ).dot
                          }
                        `}
                      />

                      {selectedOrder.status ||
                        "Pending"}

                    </span>

                    <button
                      onClick={() =>
                        setSelectedOrder(null)
                      }
                      className="
                        xl:hidden
                        w-7
                        h-7
                        rounded-md
                        hover:bg-gray-100
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <X size={16} />
                    </button>

                  </div>

                </div>

                {/* ORDER META */}
                <div
                  className="
                    flex
                    items-center
                    gap-4
                    mt-4
                    text-xs
                    text-gray-500
                  "
                >

                  <span>
                    {selectedOrder.orderDate
                      ? new Date(
                          selectedOrder.orderDate
                        ).toLocaleDateString()
                      : "-"}
                  </span>

                  <span className="text-gray-300">
                    |
                  </span>

                  <span>
                    {getTotalQuantity(
                      selectedOrder
                    )}{" "}
                    Qty
                  </span>

                  <span className="ml-auto font-bold text-gray-900">
                    ₹{selectedOrder.totalAmount}
                  </span>

                </div>

              </div>

              {/* DETAILS CONTENT */}
              <div className="p-5 space-y-6">

                {/* CUSTOMER */}
                <section>

                  <div className="flex items-center gap-2 mb-3">

                    <User
                      size={16}
                      className="text-gray-500"
                    />

                    <h3
                      className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-wide
                        text-gray-500
                      "
                    >
                      Customer
                    </h3>

                  </div>

                  <div
                    className="
                      bg-gray-50
                      border
                      border-gray-100
                      rounded-lg
                      p-3
                    "
                  >

                    <p className="text-sm font-semibold text-gray-900">
                      {selectedOrder.customerName ||
                        "-"}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Phone:{" "}
                      {selectedOrder.phone ||
                        "-"}
                    </p>

                  </div>

                </section>

                {/* ADDRESS */}
                <section>

                  <div className="flex items-center gap-2 mb-3">

                    <MapPin
                      size={16}
                      className="text-gray-500"
                    />

                    <h3
                      className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-wide
                        text-gray-500
                      "
                    >
                      Delivery Address
                    </h3>

                  </div>

                  <div
                    className="
                      bg-gray-50
                      border
                      border-gray-100
                      rounded-lg
                      p-3
                    "
                  >

                    {typeof selectedOrder.address ===
                      "object" &&
                    selectedOrder.address ? (

                      <div className="text-xs text-gray-700 leading-relaxed">

                        {selectedOrder.address
                          .fullName && (
                          <p className="font-semibold text-sm text-gray-900">
                            {
                              selectedOrder
                                .address
                                .fullName
                            }
                          </p>
                        )}

                        {selectedOrder.address
                          .house && (
                          <p>
                            {
                              selectedOrder
                                .address
                                .house
                            }
                          </p>
                        )}

                        {selectedOrder.address
                          .street && (
                          <p>
                            {
                              selectedOrder
                                .address
                                .street
                            }
                          </p>
                        )}

                        {selectedOrder.address
                          .city && (
                          <p>
                            {
                              selectedOrder
                                .address
                                .city
                            }
                          </p>
                        )}

                        {selectedOrder.address
                          .state && (
                          <p>
                            {
                              selectedOrder
                                .address
                                .state
                            }
                          </p>
                        )}

                        {selectedOrder.address
                          .pincode && (
                          <p>
                            {
                              selectedOrder
                                .address
                                .pincode
                            }
                          </p>
                        )}

                        {selectedOrder.address
                          .phone && (
                          <p className="mt-1">
                            Ph:{" "}
                            {
                              selectedOrder
                                .address
                                .phone
                            }
                          </p>
                        )}

                      </div>

                    ) : (

                      <p className="text-xs text-gray-700 leading-relaxed">
                        {getAddress(
                          selectedOrder
                        )}
                      </p>

                    )}

                  </div>

                </section>

                {/* PACKAGE ITEMS */}
                <section>

                  <div className="flex items-center gap-2 mb-3">

                    <Package
                      size={16}
                      className="text-gray-500"
                    />

                    <h3
                      className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-wide
                        text-gray-500
                      "
                    >
                      Package Items
                    </h3>

                  </div>

                  <div
                    className="
                      border
                      border-gray-200
                      rounded-lg
                      overflow-hidden
                    "
                  >

                    {getOrderItems(
                      selectedOrder
                    ).length > 0 ? (

                      getOrderItems(
                        selectedOrder
                      ).map((item, index) => (

                        <div
                          key={
                            item.productId ||
                            index
                          }
                          className="
                            flex
                            items-center
                            gap-3
                            p-3
                            border-b
                            border-gray-100
                            last:border-b-0
                          "
                        >

                          {/* IMAGE */}
                          {getProductImage(
                            item.productImage
                          ) ? (

                            <img
                              src={getProductImage(
                                item.productImage
                              )}
                              alt={
                                item.productName ||
                                "Product"
                              }
                              className="
                                w-14
                                h-14
                                rounded-lg
                                object-cover
                                bg-gray-100
                                border
                                border-gray-200
                                shrink-0
                              "
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";

                                if (
                                  e.currentTarget
                                    .nextElementSibling
                                ) {
                                  e.currentTarget.nextElementSibling.style.display =
                                    "flex";
                                }
                              }}
                            />

                          ) : null}

                          <div
                            className="
                              w-14
                              h-14
                              rounded-lg
                              bg-gray-100
                              border
                              border-gray-200
                              items-center
                              justify-center
                              text-[9px]
                              text-gray-400
                              text-center
                              shrink-0
                            "
                            style={{
                              display: getProductImage(
                                item.productImage
                              )
                                ? "none"
                                : "flex",
                            }}
                          >
                            No
                            <br />
                            Image
                          </div>

                          {/* PRODUCT */}
                          <div className="flex-1 min-w-0">

                            <p
                              className="
                                text-xs
                                font-semibold
                                text-gray-800
                                truncate
                              "
                            >
                              {item.productName ||
                                "Product"}
                            </p>

                            <p
                              className="
                                text-[11px]
                                text-gray-500
                                mt-1
                              "
                            >
                              Qty:{" "}
                              {item.quantity || 0}
                            </p>

                          </div>

                          {/* PRICE */}
                          <div
                            className="
                              text-xs
                              font-semibold
                              text-gray-900
                            "
                          >
                            ₹
                            {item.price
                              ? item.price *
                                (item.quantity || 1)
                              : 0}
                          </div>

                        </div>

                      ))

                    ) : (

                      <div className="p-4 text-xs text-gray-400 text-center">
                        No products found.
                      </div>

                    )}

                  </div>

                </section>

                {/* PAYMENT */}
                <section>

                  <div
                    className="
                      border-t
                      border-gray-200
                      pt-4
                    "
                  >

                    <div
                      className="
                        flex
                        justify-between
                        items-center
                        text-xs
                        mb-3
                      "
                    >

                      <div className="flex items-center gap-2">

                        <CreditCard
                          size={15}
                          className="text-gray-400"
                        />

                        <span className="text-gray-500">
                          Payment Method
                        </span>

                      </div>

                      <span className="font-medium text-gray-800">
                        {selectedOrder.paymentMethod ||
                          "-"}
                      </span>

                    </div>

                    <div
                      className="
                        flex
                        justify-between
                        items-center
                      "
                    >

                      <span className="text-sm font-semibold text-gray-700">
                        Total
                      </span>

                      <span className="text-lg font-bold text-gray-900">
                        ₹{selectedOrder.totalAmount}
                      </span>

                    </div>

                  </div>

                </section>

                {/* UPDATE STATUS */}
                <section>

                  <div className="flex items-center gap-2 mb-3">

                    <Truck
                      size={16}
                      className="text-gray-500"
                    />

                    <h3
                      className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-wide
                        text-gray-500
                      "
                    >
                      Update Shipping Status
                    </h3>

                  </div>

                  <div className="relative">

                    <select
                      value={
                        selectedOrder.status?.toLowerCase() ||
                        "pending"
                      }
                      onChange={(e) => {

                        const newStatus =
                          e.target.value;

                        const currentStatus =
                          selectedOrder.status?.toLowerCase() ||
                          "pending";

                        handleStatusChange(
                          selectedOrder.id,
                          currentStatus,
                          newStatus
                        );

                      }}
                      className="
                        appearance-none
                        w-full
                        h-11
                        bg-gray-900
                        text-white
                        rounded-lg
                        px-4
                        pr-10
                        text-sm
                        font-medium
                        outline-none
                        cursor-pointer
                      "
                    >

                      <option
                        value={
                          selectedOrder.status?.toLowerCase() ||
                          "pending"
                        }
                      >
                        Current:{" "}
                        {selectedOrder.status ||
                          "Pending"}
                      </option>

                      {(
                        statusFlow[
                          selectedOrder.status?.toLowerCase() ||
                            "pending"
                        ] || []
                      ).map((status) => (

                        <option
                          key={status}
                          value={status}
                        >
                          Move to{" "}
                          {status
                            .charAt(0)
                            .toUpperCase() +
                            status.slice(1)}
                        </option>

                      ))}

                    </select>

                    <ChevronDown
                      size={16}
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-white
                        pointer-events-none
                      "
                    />

                  </div>

                </section>

                {/* DATE */}
                <p className="text-[11px] text-gray-400">
                  Order Date:{" "}
                  {selectedOrder.orderDate
                    ? new Date(
                        selectedOrder.orderDate
                      ).toLocaleString()
                    : "-"}
                </p>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default AOrders;