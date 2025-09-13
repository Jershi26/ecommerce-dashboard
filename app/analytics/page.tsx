"use client";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useOrders } from "../context/OrdersContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const { orders } = useOrders();

  // Compute real KPI data
  const totalRevenue = orders.reduce(
    (sum, o) => sum + o.total,
    0
  );
  const totalOrders = orders.length;
  const totalCustomers = new Set(orders.map((o) => o.address.phone)).size;

  // Sales over months (example)
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const monthlySales = monthLabels.map((_, idx) =>
    orders
      .filter(
        (o) =>
          new Date(o.date).getMonth() === idx
      )
      .reduce((sum, o) => sum + o.total, 0)
  );

  const salesData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Sales (₹)",
        data: monthlySales,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Category breakdown
  const categoryMap: { [key: string]: number } = {};
  orders.forEach((o) =>
    o.items.forEach((item) => {
      const cat = item.name; // Simplified: treat name as category
      categoryMap[cat] = (categoryMap[cat] || 0) + (item.qty || 1);
    })
  );
  const categoryData = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        data: Object.values(categoryMap),
        backgroundColor: ["#3b82f6", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6", "#f43f5e"],
        borderWidth: 1,
      },
    ],
  };

  // Top products based on sales
  const productSalesMap: { [key: string]: { sales: number; revenue: number } } = {};
  orders.forEach((o) =>
    o.items.forEach((item) => {
      const price = item.offer ? item.price * (1 - item.offer / 100) : item.price;
      if (!productSalesMap[item.name]) productSalesMap[item.name] = { sales: 0, revenue: 0 };
      productSalesMap[item.name].sales += item.qty || 1;
      productSalesMap[item.name].revenue += (item.qty || 1) * price;
    })
  );
  const topProducts = Object.entries(productSalesMap)
    .sort((a, b) => b[1].sales - a[1].sales)
    .slice(0, 5)
    .map(([name, data]) => ({
      name,
      sales: data.sales,
      revenue: `₹${data.revenue.toLocaleString()}`,
    }));

  const kpis = [
    { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, color: "bg-blue-100 text-blue-700" },
    { title: "Total Orders", value: totalOrders, color: "bg-green-100 text-green-700" },
    { title: "Total Customers", value: totalCustomers, color: "bg-purple-100 text-purple-700" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl shadow ${kpi.color} text-center font-bold hover:scale-105 transition-transform`}
          >
            <p className="text-sm">{kpi.title}</p>
            <p className="text-xl sm:text-2xl">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl shadow bg-white">
          <h2 className="font-semibold mb-4 text-gray-800">📈 Sales Over Time</h2>
          <Line data={salesData} />
        </div>

        <div className="p-6 rounded-2xl shadow bg-white">
          <h2 className="font-semibold mb-4 text-gray-800">📊 Sales by Product</h2>
          <Doughnut data={categoryData} />
        </div>
      </div>

      {/* Top Products */}
      <div className="p-6 rounded-2xl shadow bg-white">
        <h2 className="font-semibold mb-4 text-gray-800">🏆 Top Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Sales</th>
                <th className="px-4 py-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.sales}</td>
                  <td className="px-4 py-2">{p.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
