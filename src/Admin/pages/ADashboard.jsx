import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingBag, Users, ShoppingCart, IndianRupee } from "lucide-react";

import {
  fetchDashboardAsync,
  fetchTopProductsAsync,
} from "../../redux/slices/dashboardSlice";

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line, Pie, Bar } from "react-chartjs-2";

// Register Chart.js components globally
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ----------------------------------------------------
// REUSABLE STAT CARD
// ----------------------------------------------------

function StatCard({ title, value, icon: Icon, bgColor }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:shadow-gray-100/50">
      <div>
        <p className="text-gray-400 text-xs font-semibold tracking-wider uppercase">
          {title}
        </p>

        <h2 className="text-3xl font-bold mt-2 text-gray-800 tracking-tight">
          {value}
        </h2>
      </div>

      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-100 ${bgColor}`}
      >
        <Icon size={24} />
      </div>
    </div>
  );
}

// ----------------------------------------------------
// ADMIN DASHBOARD
// ----------------------------------------------------

function ADashboard() {
  const dispatch = useDispatch();

  const [selectedMonth, setSelectedMonth] = useState("All");

  // Dashboard Redux state
  const {
    data: dashboardData,
    topProducts,
    loading,
    topProductsLoading,
  } = useSelector((state) => state.dashboard);

  // ----------------------------------------------------
  // FETCH DASHBOARD
  // ----------------------------------------------------

  useEffect(() => {
    dispatch(fetchDashboardAsync());
  }, [dispatch]);

  // ----------------------------------------------------
  // MONTH CHANGE
  // ----------------------------------------------------

  useEffect(() => {
    if (selectedMonth === "All") {
      return;
    }

    const monthNumber = new Date(
      `${selectedMonth} 1, 2000`
    ).getMonth() + 1;

    dispatch(fetchTopProductsAsync(monthNumber));
  }, [selectedMonth, dispatch]);

  // ----------------------------------------------------
  // DASHBOARD VALUES
  // ----------------------------------------------------

  const totalProducts = dashboardData?.totalProducts || 0;

  const totalUsers = dashboardData?.totalUsers || 0;

  const totalOrders = dashboardData?.totalOrders || 0;

  const totalRevenue = dashboardData?.yearlyRevenue || 0;

  // ----------------------------------------------------
  // ORDER STATUS
  // ----------------------------------------------------

  const orderStatus = dashboardData?.orderStatus || [];

  const pendingOrdersCount =
    orderStatus.find(
      (item) => item.status?.toLowerCase() === "pending"
    )?.count || 0;

  const shippedOrdersCount =
    orderStatus.find(
      (item) => item.status?.toLowerCase() === "shipped"
    )?.count || 0;

  const deliveredOrdersCount =
    orderStatus.find(
      (item) => item.status?.toLowerCase() === "delivered"
    )?.count || 0;

  const completedOrdersCount =
    orderStatus.find(
      (item) => item.status?.toLowerCase() === "completed"
    )?.count || 0;

  // ----------------------------------------------------
  // MONTHLY REVENUE CHART
  // ----------------------------------------------------

  const salesChartData = useMemo(() => {
    const monthsOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyRevenue = dashboardData?.monthlyRevenue || [];

    const monthlyMap = {};

    monthsOrder.forEach((month) => {
      monthlyMap[month] = 0;
    });

    monthlyRevenue.forEach((item) => {
      const monthIndex = Number(item.month) - 1;

      if (monthIndex >= 0 && monthIndex < 12) {
        const monthName = monthsOrder[monthIndex];

        monthlyMap[monthName] = Number(item.revenue) || 0;
      }
    });

    return {
      labels: monthsOrder,

      datasets: [
        {
          fill: true,
          label: "Revenue (₹)",

          data: monthsOrder.map(
            (month) => monthlyMap[month]
          ),

          borderColor: "#4f46e5",
          borderWidth: 3,

          pointBackgroundColor: "#4f46e5",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,

          pointRadius: 4,
          pointHoverRadius: 6,

          pointHoverBackgroundColor: "#3730a3",
          pointHoverBorderColor: "#ffffff",
          pointHoverBorderWidth: 3,

          tension: 0.35,

          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;

            if (!chartArea) return null;

            const gradient = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            );

            gradient.addColorStop(
              0,
              "rgba(79, 70, 229, 0.18)"
            );

            gradient.addColorStop(
              1,
              "rgba(79, 70, 229, 0.00)"
            );

            return gradient;
          },
        },
      ],
    };
  }, [dashboardData]);

  // ----------------------------------------------------
  // MONTHLY REVENUE CHART OPTIONS
  // ----------------------------------------------------

  const salesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor: "#111827",

        titleFont: {
          size: 13,
          family: "Inter, sans-serif",
          weight: "600",
        },

        bodyFont: {
          size: 13,
          family: "Inter, sans-serif",
        },

        padding: 12,
        cornerRadius: 12,
        displayColors: false,

        callbacks: {
          label: (context) =>
            ` ₹${Number(context.raw).toLocaleString()}`,
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#9ca3af",

          font: {
            family: "Inter, sans-serif",
            size: 12,
          },
        },
      },

      y: {
        grid: {
          color: "#f3f4f6",
          borderDash: [6, 6],
        },

        border: {
          display: false,
        },

        ticks: {
          color: "#9ca3af",

          font: {
            family: "Inter, sans-serif",
            size: 12,
          },

          callback: (value) =>
            value >= 1000
              ? `₹${value / 1000}k`
              : `₹${value}`,
        },
      },
    },
  };

  // ----------------------------------------------------
  // CATEGORY SALES CHART
  // ----------------------------------------------------

  const categoryChartData = useMemo(() => {
    const categorySales =
      dashboardData?.categorySales || [];

    const sortedCategories = [...categorySales].sort(
      (a, b) => Number(b.sales) - Number(a.sales)
    );

    const labels = sortedCategories.map(
      (item) => item.categoryName
    );

    const dataValues = sortedCategories.map(
      (item) => Number(item.sales) || 0
    );

    const finalLabels =
      labels.length > 0
        ? labels
        : ["No Categories"];

    const finalData =
      dataValues.length > 0
        ? dataValues
        : [0];

    const wrappedLabels = finalLabels.map((label) => {
      if (label.includes(" ")) {
        return label.split(" ");
      }

      return label.length > 12
        ? label.substring(0, 10) + "..."
        : label;
    });

    const presetBackgrounds = [
      "rgba(99, 102, 241, 0.85)",
      "rgba(78, 186, 158, 0.85)",
      "rgba(255, 176, 124, 0.85)",
      "rgba(142, 154, 166, 0.85)",
      "rgba(244, 114, 182, 0.85)",
      "rgba(168, 85, 247, 0.85)",
    ];

    const presetHovers = [
      "#4f46e5",
      "#3fa389",
      "#e69660",
      "#73818f",
      "#db2777",
      "#9333ea",
    ];

    const finalBackgrounds = wrappedLabels.map(
      (_, index) =>
        presetBackgrounds[
          index % presetBackgrounds.length
        ]
    );

    const finalHovers = wrappedLabels.map(
      (_, index) =>
        presetHovers[
          index % presetHovers.length
        ]
    );

    return {
      labels: wrappedLabels,

      datasets: [
        {
          label: "Revenue Contribution (₹)",

          data: finalData,

          backgroundColor: finalBackgrounds,

          hoverBackgroundColor: finalHovers,

          borderRadius: 6,

          borderSkipped: false,

          barThickness:
            finalLabels.length > 6 ? 14 : 24,
        },
      ],
    };
  }, [dashboardData]);

  // ----------------------------------------------------
  // CATEGORY CHART OPTIONS
  // ----------------------------------------------------

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor: "#111827",
        padding: 12,
        cornerRadius: 12,

        bodyFont: {
          family: "Inter, sans-serif",
          size: 13,
          weight: "500",
        },

        callbacks: {
          title: (context) => {
            const label = context[0].label;

            return Array.isArray(label)
              ? label.join(" ")
              : label;
          },

          label: (context) =>
            ` Total Sales: ₹${Number(
              context.raw
            ).toLocaleString()}`,
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          autoSkip: false,
          maxTicksLimit: 50,
          color: "#374151",

          font: {
            family: "Inter, sans-serif",
            size: 10,
            weight: "600",
            lineHeight: 1.2,
          },

          maxRotation: 0,
          minRotation: 0,
        },
      },

      y: {
        grid: {
          color: "#f3f4f6",
          borderDash: [6, 6],
        },

        border: {
          display: false,
        },

        ticks: {
          color: "#9ca3af",

          font: {
            family: "Inter, sans-serif",
            size: 11,
          },

          callback: (value) =>
            value >= 1000
              ? `₹${value / 1000}k`
              : `₹${value}`,
        },
      },
    },
  };

  // ----------------------------------------------------
  // ORDER STATUS PIE CHART
  // ----------------------------------------------------

  const orderPieData = {
    labels: [
      "Pending",
      "Shipped",
      "Delivered",
      "Completed",
    ],

    datasets: [
      {
        data: [
          pendingOrdersCount,
          shippedOrdersCount,
          deliveredOrdersCount,
          completedOrdersCount,
        ],

        backgroundColor: [
          "#FFB07C",
          "#8E9AA6",
          "#4EBA9E",
          "#1C7B64",
        ],

        hoverBackgroundColor: [
          "#e69660",
          "#73818f",
          "#3fa389",
          "#135948",
        ],

        borderWidth: 4,
        borderColor: "#ffffff",
        hoverOffset: 10,
      },
    ],
  };

  // ----------------------------------------------------
  // PIE OPTIONS
  // ----------------------------------------------------

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          boxWidth: 8,
          usePointStyle: true,
          pointStyle: "circle",

          font: {
            family: "Inter, sans-serif",
            size: 12,
            weight: "500",
          },

          color: "#4b5563",
          padding: 24,
        },
      },

      tooltip: {
        backgroundColor: "#111827",
        padding: 12,
        cornerRadius: 12,

        bodyFont: {
          family: "Inter, sans-serif",
          size: 13,
          weight: "500",
        },
      },
    },
  };

  const hasOrderData =
    pendingOrdersCount > 0 ||
    shippedOrdersCount > 0 ||
    deliveredOrdersCount > 0 ||
    completedOrdersCount > 0;

  // ----------------------------------------------------
  // MONTHS
  // ----------------------------------------------------

  const months = [
    "All",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // ----------------------------------------------------
  // LOADING
  // ----------------------------------------------------

  if (loading && !dashboardData) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // ----------------------------------------------------
  // RECENT ORDERS
  // ----------------------------------------------------

  const recentOrders =
    dashboardData?.recentOrders || [];

  // ----------------------------------------------------
  // RETURN
  // ----------------------------------------------------

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen w-full box-border font-sans">

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={ShoppingBag}
          bgColor="bg-gradient-to-br from-blue-500 to-indigo-500"
        />

        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          bgColor="bg-gradient-to-br from-emerald-400 to-teal-600"
        />

        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={ShoppingCart}
          bgColor="bg-gradient-to-br from-orange-400 to-pink-500"
        />

        <StatCard
          title="Yearly Revenue"
          value={`₹${Number(totalRevenue).toLocaleString()}`}
          icon={IndianRupee}
          bgColor="bg-gradient-to-br from-indigo-500 to-purple-700"
        />

      </div>

      {/* MONTHLY REVENUE */}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full">

        <div className="mb-4">

          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            Monthly Revenue Analytics
          </h2>

          <p className="text-xs text-gray-400 mt-0.5">
            Real-time dynamic invoice calculations across months
          </p>

        </div>

        <div className="h-[290px] w-full">
          <Line
            data={salesChartData}
            options={salesChartOptions}
          />
        </div>

      </div>

      {/* PIE + CATEGORY */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">

        {/* ORDER STATUS */}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[390px] w-full lg:col-span-1">

          <div>

            <h2 className="text-lg font-bold text-gray-800 tracking-tight">
              Order Status Overview
            </h2>

            <p className="text-xs text-gray-400 mt-0.5">
              Fulfillment pipeline categorization breakdown
            </p>

          </div>

          <div className="flex-1 relative min-h-0 mt-4">

            {!hasOrderData ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                No Orders Data Available
              </div>
            ) : (
              <Pie
                data={orderPieData}
                options={pieChartOptions}
              />
            )}

          </div>

        </div>

        {/* CATEGORY SALES */}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[390px] w-full lg:col-span-2">

          <div>

            <h2 className="text-lg font-bold text-gray-800 tracking-tight">
              Category Sales Distribution
            </h2>

            <p className="text-xs text-gray-400 mt-0.5">
              Revenue contributions across distinct store categories
            </p>

          </div>

          <div className="flex-1 relative min-h-0 mt-6">

            <Bar
              data={categoryChartData}
              options={categoryChartOptions}
            />

          </div>

        </div>

      </div>

      {/* TOP PRODUCTS + RECENT ORDERS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">

        {/* TOP PRODUCTS */}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">

          <div>

            <h2 className="text-lg font-bold text-gray-800 tracking-tight">
              Top Performing Products (By Sales)
            </h2>

            <div className="flex items-center justify-between mb-4">

              <p className="text-xs text-gray-400 mt-0.5">
                Ranked by unit checkout quantities
              </p>

              <select
                value={selectedMonth}
                onChange={(e) =>
                  setSelectedMonth(e.target.value)
                }
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {months.map((month) => (
                  <option
                    key={month}
                    value={month}
                  >
                    {month}
                  </option>
                ))}
              </select>

            </div>

            <div className="space-y-1">

              {topProductsLoading ? (
                <div className="text-gray-400 text-sm py-12 text-center">
                  Loading products...
                </div>
              ) : topProducts.length === 0 ? (
                <div className="text-gray-400 text-sm py-12 text-center">
                  No product sales data found
                </div>
              ) : (
                topProducts.map((product, index) => (

                  <div
                    key={
                      product.productId || index
                    }
                    className="flex justify-between items-center border-b border-gray-50 py-3.5 last:border-0"
                  >

                    <div className="flex flex-col">

                      <span className="text-gray-700 font-medium text-sm">
                        {product.productName ||
                          "Unnamed Item"}
                      </span>

                      <span className="text-xs text-gray-400 mt-0.5">
                        Available Stock:{" "}
                        {product.availableStock ?? 0}
                      </span>

                    </div>

                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-semibold shadow-sm border border-indigo-100/50">
                      {product.quantitySold ?? 0} units sold
                    </span>

                  </div>

                ))
              )}

            </div>

          </div>

        </div>

        {/* RECENT ORDERS */}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">

          <h2 className="text-lg font-bold text-gray-800 tracking-tight">
            Recent Orders Activity
          </h2>

          <p className="text-xs text-gray-400 mt-0.5 mb-4">
            Latest purchases recorded over checkout routing
          </p>

          <table className="w-full text-sm text-left">

            <thead>

              <tr className="text-gray-400 border-b border-gray-100 text-xs font-semibold tracking-wider uppercase">

                <th className="pb-3">
                  Order ID
                </th>

                <th className="pb-3">
                  Status
                </th>

                <th className="pb-3 text-right">
                  Total Price
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-50">

              {recentOrders.length === 0 ? (

                <tr>

                  <td
                    colSpan="3"
                    className="text-gray-400 text-sm py-12 text-center"
                  >
                    No structural logs located
                  </td>

                </tr>

              ) : (

                recentOrders.map(
                  (order, index) => {

                    const cleanedStatus =
                      String(
                        order.status ||
                          "Pending"
                      )
                        .toLowerCase()
                        .trim();

                    return (

                      <tr
                        key={
                          order.orderId ||
                          index
                        }
                        className="text-gray-600 hover:bg-gray-50/60 transition-colors"
                      >

                        <td className="py-3.5 font-mono text-xs font-medium text-indigo-600">
                          #
                          {String(
                            order.orderId
                          ).slice(-6)}
                        </td>

                        <td className="py-3.5">

                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                              cleanedStatus ===
                                "completed" ||
                              cleanedStatus ===
                                "delivered"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : cleanedStatus ===
                                  "shipped"
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : "bg-amber-50 text-amber-700 border-amber-100"
                            }`}
                          >
                            {order.status ||
                              "Pending"}
                          </span>

                        </td>

                        <td className="py-3.5 text-right font-semibold text-gray-800">
                          ₹
                          {Number(
                            order.totalAmount ||
                              0
                          ).toLocaleString()}
                        </td>

                      </tr>

                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default ADashboard;