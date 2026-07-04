import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingBag, Users, ShoppingCart, IndianRupee } from "lucide-react";

// Redux slice actions
import { fetchUsersAsync } from "../../redux/slices/usersSlice";
import { fetchAllOrdersAsync } from "../../redux/slices/ordersSlice";
import { fetchProducts } from "../../redux/slices/productSlice";

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



// REUSABLE STAT CARD COMPONENT

function StatCard({ title, value, icon: Icon, bgColor }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:shadow-gray-100/50">
      <div>
        <p className="text-gray-400 text-xs font-semibold tracking-wider uppercase">{title}</p>
        <h2 className="text-3xl font-bold mt-2 text-gray-800 tracking-tight">{value}</h2>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-100 ${bgColor}`}>
        <Icon size={24} />
      </div>
    </div>
  );
}


// PRIMARY ADMIN DASHBOARD MODULE

function ADashboard() {
  const dispatch = useDispatch();
   const [selectedMonth, setSelectedMonth] = useState("All");
 
  const usersRootState = useSelector((state) => state.users);
  const ordersRootState = useSelector((state) => state.orders);
  const productsRootState = useSelector((state) => state.products);

  //  Data Extraction Layer 
  const products = useMemo(() => {
    if (!productsRootState) return [];
    if (Array.isArray(productsRootState)) return productsRootState;
    return productsRootState.items || productsRootState.products || productsRootState.data || [];
  }, [productsRootState]);

  const users = useMemo(() => {
    if (!usersRootState) return [];
    if (Array.isArray(usersRootState)) return usersRootState;
    return usersRootState.items || usersRootState.users || usersRootState.data || [];
  }, [usersRootState]);

  const orders = useMemo(() => {
    if (!ordersRootState) return [];
    if (Array.isArray(ordersRootState)) return ordersRootState;
    return ordersRootState.orders || ordersRootState.data || ordersRootState.allOrders || [];
  }, [ordersRootState]);

  // 3. Asynchronous Lifecycle Fetching Mount
  useEffect(() => {
    dispatch(fetchUsersAsync());
    dispatch(fetchAllOrdersAsync());
    dispatch(fetchProducts());
  }, [dispatch]);

  // General Metrics
  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalOrders = orders.length;

  //  4. Order Status Filters
  const pendingOrdersCount = useMemo(() => {
    return orders.filter((o) => {
      const status = String(o?.status || "").toLowerCase().trim();
      return status === "pending" || status === "processing" || status === "ordered" || status === "";
    }).length;
  }, [orders]);

  const shippedOrdersCount = useMemo(() => {
    return orders.filter((o) => {
      const status = String(o?.status || "").toLowerCase().trim();
      return status === "shipped" || status === "dispatched" || status === "transit";
    }).length;
  }, [orders]);

  const deliveredOrdersCount = useMemo(() => {
    return orders.filter((o) => {
      const status = String(o?.status || "").toLowerCase().trim();
      return status === "delivered";
    }).length;
  }, [orders]);

  const completedOrdersCount = useMemo(() => {
    return orders.filter((o) => {
      const status = String(o?.status || "").toLowerCase().trim();
      return status === "completed" || status === "success";
    }).length;
  }, [orders]);

  
 // Yearly Revenue Summation
const totalRevenue = useMemo(() => {
  const currentYear = new Date().getFullYear();

  return orders.reduce((acc, o) => {
    const orderDate = new Date(o?.createdAt || o?.date);

    if (orderDate.getFullYear() === currentYear) {
      return acc + (Number(o?.totalAmount || o?.price) || 0);
    }

    return acc;
  }, 0);
}, [orders]);

  // Compute Hot Selling Products based on units sold
const topPerformingProducts = useMemo(() => {
  const salesMap = {};

  orders.forEach((order) => {
    const orderDate = new Date(order?.createdAt || order?.date);

    const orderMonth = orderDate.toLocaleString("default", {
      month: "short",
    });

    // FILTER BY MONTH
    if (
      selectedMonth !== "All" &&
      orderMonth !== selectedMonth
    ) {
      return;
    }

    const items = order?.items || order?.products || [];

    if (Array.isArray(items)) {
      items.forEach((item) => {
        const productId =
          item?.productId || item?.id || item?._id;

        const quantity = Number(item?.quantity || 1);

        if (productId) {
          salesMap[productId] =
            (salesMap[productId] || 0) + quantity;
        }
      });
    } else if (order?.productId) {
      salesMap[order.productId] =
        (salesMap[order.productId] || 0) +
        Number(order?.quantity || 1);
    }
  });

  return products
    .map((product) => {
      const id = product?._id || product?.id;

      return {
        ...product,
        unitsSold: salesMap[id] || 0,
      };
    })
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);
}, [products, orders, selectedMonth]);
  
  // 🚀 INCLUDES EVERY CATEGORY DYNAMICALLY

  const categoryChartData = useMemo(() => {
    const categoryRevenueMap = {};

    
    products.forEach((p) => {
      if (p?.category) {
        const formattedCat = p.category.trim().replace(/\b\w/g, (c) => c.toUpperCase());
        categoryRevenueMap[formattedCat] = 0;
      }
    });

   
    const productLookup = {};
    products.forEach((p) => {
      const id = p?._id || p?.id;
      if (id && p?.category) {
        productLookup[id] = p.category.trim().replace(/\b\w/g, (c) => c.toUpperCase());
      }
    });

    // Aggregate total transaction calculations against each category accurately
    orders.forEach((order) => {
      const items = order?.items || order?.products || [];
      const totalOrderAmount = Number(order?.totalAmount || order?.price || 0);

      if (Array.isArray(items) && items.length > 0) {
        items.forEach((item) => {
          const pId = item?.productId || item?.id || item?._id;
          const matchedCategory = productLookup[pId] || "General";
          const proportionalAmount = Number(item?.price || 0) * Number(item?.quantity || 1) || (totalOrderAmount / items.length);
          
          categoryRevenueMap[matchedCategory] = (categoryRevenueMap[matchedCategory] || 0) + proportionalAmount;
        });
      } else {
        const directPId = order?.productId;
        const fallbackCategory = productLookup[directPId] || "General";
        categoryRevenueMap[fallbackCategory] = (categoryRevenueMap[fallbackCategory] || 0) + totalOrderAmount;
      }
    });

    //  Sort arrays from top revenue down to lowest
    const sortedCategories = Object.entries(categoryRevenueMap).sort((a, b) => b[1] - a[1]);

    const labels = sortedCategories.map(([category]) => category);
    const dataValues = sortedCategories.map(([_, revenue]) => revenue);

    const finalLabels = labels.length > 0 ? labels : ["Electronics", "Clothing", "Home & Living", "Books"];
    const finalData = dataValues.length > 0 ? dataValues : [32000, 24000, 17000, 9500];

    // Split multi-word labels into arrays so Chart.js automatically wraps text cleanly across multiple lines
    const wrappedLabels = finalLabels.map(label => {
      if (label.includes(" ")) {
        return label.split(" ");
      }
      return label.length > 12 ? label.substring(0, 10) + "..." : label;
    });

    const presetBackgrounds = [
      "rgba(99, 102, 241, 0.85)",  // Indigo
      "rgba(78, 186, 158, 0.85)",  // Mint Green
      "rgba(255, 176, 124, 0.85)", // Soft Apricot
      "rgba(142, 154, 166, 0.85)", // Slate Grey
      "rgba(244, 114, 182, 0.85)", // Pastel Pink
      "rgba(168, 85, 247, 0.85)",  // Soft Violet
    ];

    const presetHovers = [
      "#4f46e5", "#3fa389", "#e69660", "#73818f", "#db2777", "#9333ea"
    ];

    const finalBackgrounds = wrappedLabels.map((_, i) => presetBackgrounds[i % presetBackgrounds.length]);
    const finalHovers = wrappedLabels.map((_, i) => presetHovers[i % presetHovers.length]);

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
          barThickness: finalLabels.length > 6 ? 14 : 24, 
        }
      ]
    };
  }, [products, orders]);

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        padding: 12,
        cornerRadius: 12,
        bodyFont: { family: "Inter, sans-serif", size: 13, weight: "500" },
        callbacks: {
          title: (context) => {
            const label = context[0].label;
            return Array.isArray(label) ? label.join(" ") : label;
          },
          label: (context) => ` Total Sales: ₹${context.raw.toLocaleString()}`,
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { 
          autoSkip: false,  // Forces Chart.js to display every single label
          maxTicksLimit: 50,
          color: "#374151", 
          font: { 
            family: "Inter, sans-serif", 
            size: 10,       
            weight: "600",
            lineHeight: 1.2 
          },
          maxRotation: 0, 
          minRotation: 0
        }
      },
      y: {
        grid: { color: "#f3f4f6", borderDash: [6, 6] },
        border: { display: false },
        ticks: { 
          color: "#9ca3af", 
          font: { family: "Inter, sans-serif", size: 11 },
          callback: (value) => value >= 1000 ? `₹${value / 1000}k` : `₹${value}`
        }
      }
    }
  };

  
  const salesChartData = useMemo(() => {
    const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap = {};
    monthsOrder.forEach((m) => { monthlyMap[m] = 0; });

    orders.forEach((order) => {
      const dateSource = order?.createdAt || order?.date;
      if (dateSource) {
        const monthName = new Date(dateSource).toLocaleString("default", { month: "short" });
        if (monthlyMap[monthName] !== undefined) {
          monthlyMap[monthName] += (Number(order?.totalAmount || order?.price) || 0);
        }
      }
    });

    return {
      labels: monthsOrder,
      datasets: [
        {
          fill: true,
          label: "Revenue (₹)",
          data: monthsOrder.map((m) => monthlyMap[m]),
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
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, "rgba(79, 70, 229, 0.18)"); 
            gradient.addColorStop(1, "rgba(79, 70, 229, 0.00)"); 
            return gradient;
          },
        },
      ],
    };
  }, [orders]);

  const salesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        titleFont: { size: 13, family: "Inter, sans-serif", weight: "600" },
        bodyFont: { size: 13, family: "Inter, sans-serif" },
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          label: (context) => ` ₹${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#9ca3af", font: { family: "Inter, sans-serif", size: 12 } },
      },
      y: {
        grid: { color: "#f3f4f6", borderDash: [6, 6] },
        border: { display: false },
        ticks: { 
          color: "#9ca3af", 
          font: { family: "Inter, sans-serif", size: 12 },
          callback: (value) => value >= 1000 ? `₹${value / 1000}k` : `₹${value}`
        },
      },
    },
  };

  
  //  ORDER STATUS PIE GRAPH
 
  const orderPieData = {
    labels: ["Pending", "Shipped", "Delivered", "Completed"],
    datasets: [
      {
        data: [pendingOrdersCount, shippedOrdersCount, deliveredOrdersCount, completedOrdersCount],
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
          "#135948"
        ],
        borderWidth: 4,
        borderColor: "#ffffff",
        hoverOffset: 10,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "bottom", 
        labels: { 
          boxWidth: 8, 
          usePointStyle: true, 
          pointStyle: 'circle', 
          font: { family: "Inter, sans-serif", size: 12, weight: "500" }, 
          color: "#4b5563", 
          padding: 24 
        } 
      },
      tooltip: {
        backgroundColor: "#111827",
        padding: 12,
        cornerRadius: 12,
        bodyFont: { family: "Inter, sans-serif", size: 13, weight: "500" },
      }
    },
  };

  const hasOrderData = pendingOrdersCount > 0 || shippedOrdersCount > 0 || deliveredOrdersCount > 0 || completedOrdersCount > 0;

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

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen w-full box-border font-sans">
      
      {/* 📊 STAT CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={totalProducts} icon={ShoppingBag} bgColor="bg-gradient-to-br from-blue-500 to-indigo-500" />
        <StatCard title="Total Users" value={totalUsers} icon={Users} bgColor="bg-gradient-to-br from-emerald-400 to-teal-600" />
        <StatCard title="Total Orders" value={totalOrders} icon={ShoppingCart} bgColor="bg-gradient-to-br from-orange-400 to-pink-500" />
        <StatCard title="Yearly Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={IndianRupee} bgColor="bg-gradient-to-br from-indigo-500 to-purple-700" />
      </div>

      {/* 📈 SALES DYNAMIC AREA GRAPH CONTAINER */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Monthly Revenue Analytics</h2>
          <p className="text-xs text-gray-400 mt-0.5">Real-time dynamic invoice calculations across months</p>
        </div>
        <div className="h-[290px] w-full">
          <Line data={salesChartData} options={salesChartOptions} />
        </div>
      </div>


      {/* 📊 PIE CHART & VERTICAL BAR CHART ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        
        {/* Order Status Pie Chart (SMALLER WIDTH) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[390px] w-full lg:col-span-1">
          <div>
            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Order Status Overview</h2>
            <p className="text-xs text-gray-400 mt-0.5">Fulfillment pipeline categorization breakdown</p>
          </div>
          <div className="flex-1 relative min-h-0 mt-4">
            {!hasOrderData ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                No Orders Data Available
              </div>
            ) : (
              <Pie data={orderPieData} options={pieChartOptions} />
            )}
          </div>
        </div>

        {/* 📈 DYNAMIC VERTICAL BAR CHART (BIGGER WIDTH) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[390px] w-full lg:col-span-2">
          <div>
            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Category Sales Distribution</h2>
            <p className="text-xs text-gray-400 mt-0.5">Revenue contributions across distinct store categories</p>
          </div>
          <div className="flex-1 relative min-h-0 mt-6">
            <Bar data={categoryChartData} options={categoryChartOptions} />
          </div>
        </div>

      </div>



      {/* 📦 INVENTORY INSIGHTS AND RECENT TRANSACTIONS ROWS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        
        {/* Top Performing Products */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Top Performing Products (By Sales)</h2>
            <div className="flex items-center justify-between mb-4">
  <p className="text-xs text-gray-400 mt-0.5">
    Ranked by unit checkout quantities
  </p>

  <select
    value={selectedMonth}
    onChange={(e) => setSelectedMonth(e.target.value)}
    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
  >
    {months.map((month) => (
      <option key={month} value={month}>
        {month}
      </option>
    ))}
  </select>
    </div>
            <div className="space-y-1">
              {topPerformingProducts.length === 0 ? (
                <div className="text-gray-400 text-sm py-12 text-center">No product catalog data found</div>
              ) : (
                topPerformingProducts.map((p, index) => (
                  <div key={p._id || p.id || index} className="flex justify-between items-center border-b border-gray-50 py-3.5 last:border-0">
                    <div className="flex flex-col">
                      <span className="text-gray-700 font-medium text-sm">{p.title || p.name || "Unnamed Item"}</span>
                      <span className="text-xs text-gray-400 mt-0.5">Available Stock: {p.stock || 0}</span>
                    </div>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-semibold shadow-sm border border-indigo-100/50">
                      {p.unitsSold} units sold
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders Processing Activity Log */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">Recent Orders Activity</h2>
          <p className="text-xs text-gray-400 mt-0.5 mb-4">Latest purchases recorded over checkout routing</p>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 text-xs font-semibold tracking-wider uppercase">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Total Price</th>
              </tr>
            </thead>
           <tbody className="divide-y divide-gray-50">
  {orders.length === 0 ? (
    <tr>
      <td colSpan="3" className="text-gray-400 text-sm py-12 text-center">
        No structural logs located
      </td>
    </tr>
  ) : (
    [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((o, index) => {
        const cleanedStatus = String(
          o.status || "Pending"
        ).toLowerCase().trim();

        return (
          <tr
            key={o._id || o.id || index}
            className="text-gray-600 hover:bg-gray-50/60 transition-colors"
          >
            <td className="py-3.5 font-mono text-xs font-medium text-indigo-600">
              #{String(o._id || o.id).slice(-6)}
            </td>

            <td className="py-3.5">
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                  cleanedStatus === "completed" ||
                  cleanedStatus === "delivered" ||
                  cleanedStatus === "success"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : cleanedStatus === "shipped"
                    ? "bg-blue-50 text-blue-700 border-blue-100"
                    : "bg-amber-50 text-amber-700 border-amber-100"
                }`}
              >
                {o.status || "Pending"}
              </span>
            </td>

            <td className="py-3.5 text-right font-semibold text-gray-800">
              ₹{(o.totalAmount || o.price || 0).toLocaleString()}
            </td>
          </tr>
        );
        })
       )}
    </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default ADashboard;