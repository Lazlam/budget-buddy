import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useCurrency } from "@/contexts/CurrencyContext";

const CATEGORY_COLORS = {
  food: "#f97316", groceries: "#22c55e", transport: "#3b82f6",
  entertainment: "#a855f7", shopping: "#ec4899", bills: "#f59e0b",
  rent: "#ef4444", subscriptions: "#6366f1", education: "#14b8a6",
  health: "#10b981", travel: "#8b5cf6", other: "#6b7280",
};

const formatCategory = (cat) => cat?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const CustomTooltip = ({ active, payload }) => {
  const { formatMoney } = useCurrency();

  if (active && payload?.[0]) return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">{formatCategory(payload[0].name)}</p>
      <p className="text-sm text-gray-500">{formatMoney(payload[0].value)}</p>
    </div>
  );
  return null;
};

export default function SpendingChart({ transactions }) {
  const { formatMoney } = useCurrency(); // <-- ADDED
  const expensesByCategory = {};
  
  transactions.filter((t) => t.type === "expense").forEach((t) => {
    expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
  });
  
  const data = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  if (data.length === 0) return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">No expenses yet this month</div>
  );

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" strokeWidth={0}>
              {data.map((entry) => <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#6b7280"} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-2 w-full">
        {data.slice(0, 6).map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: CATEGORY_COLORS[item.name] || "#6b7280" }} />
              <span className="text-sm text-gray-600">{formatCategory(item.name)}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{formatMoney(item.value)}</span> {/* <-- REPLACED HARDCODED € */}
          </div>
        ))}
      </div>
    </div>
  );
}