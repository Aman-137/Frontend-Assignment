import { useAppSelector } from "../app/hooks";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useMemo } from "react";

/* ================= COLORS ================= */

const STATUS_COLORS = {
  COMPLETED: "#22c55e", // green
  PENDING: "#facc15", // yellow
  CANCELLED: "#ef4444", // red
};

/* ================= COMPONENT ================= */

const Dashboard = () => {
  const products = useAppSelector((state) => state.products.items);
  const orders = useAppSelector((state) => state.orders.items);

  /* ================= SUMMARY ================= */

  const totalProducts = products.filter((p) => !p.isDeleted).length;
  const activeProducts = products.filter(
    (p) => p.status === "ACTIVE" && !p.isDeleted
  ).length;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

  const revenue = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + o.total, 0);

  /* ================= ORDERS PER DAY (LAST 7 DAYS) ================= */

  const ordersPerDay = useMemo(() => {
    const today = new Date();
    const last7Days: { date: string; orders: number }[] = [];

    // Prepare last 7 days with 0 orders
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const key = d.toLocaleDateString();
      last7Days.push({ date: key, orders: 0 });
    }

    // Count orders per day
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt).toLocaleDateString();
      const day = last7Days.find((d) => d.date === orderDate);
      if (day) {
        day.orders += 1;
      }
    });

    return last7Days;
  }, [orders]);

  /* ================= ORDER STATUS PIE ================= */

  const orderStatusData = useMemo(() => {
    const stats = {
      PENDING: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    orders.forEach((order) => {
      stats[order.status]++;
    });

    return [
      { name: "Pending", value: stats.PENDING },
      { name: "Completed", value: stats.COMPLETED },
      { name: "Cancelled", value: stats.CANCELLED },
    ];
  }, [orders]);

  /* ================= UI ================= */

  return (
    <div className="text-white">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 md:gap-4 gap-8 md:mb-32 mb-16">
        <SummaryCard title="Total Products" value={totalProducts} />
        <SummaryCard title="Active Products" value={activeProducts} />
        <SummaryCard title="Total Orders" value={totalOrders} />
        <SummaryCard title="Pending Orders" value={pendingOrders} />
        <SummaryCard title="Revenue" value={`₹${revenue}`} highlight />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders per day */}
        <div className="rounded-xl p-[1px] bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500 hover:shadow-lg hover:shadow-green-500/20 transition">
          <div className="bg-[#111] p-4 rounded-xl h-full">
            <h2 className="font-semibold mb-4">Orders (Last 7 Days)</h2>

            <ResponsiveContainer width="100%" height={360}>
              <BarChart
                data={ordersPerDay}
                margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
              >
                {/* Gradient */}
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#16a34a" />
                  </linearGradient>

                  {/* Glow */}
                  <filter id="barGlow">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <XAxis
                  dataKey="date"
                  stroke="#888"
                  tick={{ fill: "#aaa", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  stroke="#888"
                  tick={{ fill: "#aaa", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#22c55e" }}
                />

                <Bar
                  dataKey="orders"
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                  filter="url(#barGlow)"
                  animationDuration={1200}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Order status */}
        <div className="rounded-xl p-[1px] bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500 hover:shadow-lg hover:shadow-green-500/20 transition">
          <div className="bg-[#111] p-4 rounded-xl">
            <h2 className="font-semibold mb-4">Order Status Distribution</h2>

            <ResponsiveContainer width="100%" height={360}>
              <PieChart>
                <defs>
                  {/* Glow filter */}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={140}
                  paddingAngle={4}
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {orderStatusData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={Object.values(STATUS_COLORS)[index]}
                      filter="url(#glow)"
                    />
                  ))}
                </Pie>

                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm shadow-lg">
                          <p className="font-semibold text-white">
                            {payload[0].name}
                          </p>
                          <p className="text-gray-400">
                            Orders: {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= CARD COMPONENT ================= */

const SummaryCard = ({
  title,
  value,
  highlight = false,
}: {
  title: string;
  value: number | string;
  highlight?: boolean;
}) => (
  <div className="animated-border rounded-xl">
    <div className="relative z-10 rounded-xl p-4">
      <p className="text-sm text-gray-400">{title}</p>
      <p className={`text-2xl font-bold ${highlight ? "text-green-400" : ""}`}>
        {value}
      </p>
    </div>
  </div>
);

export default Dashboard;
