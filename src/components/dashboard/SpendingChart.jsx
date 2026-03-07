import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useCurrency } from "@/contexts/CurrencyContext";

const CATEGORY_COLORS = {
  food: "#f97316", groceries: "#22c55e", transport: "#3b82f6",
  entertainment: "#a855f7", shopping: "#ec4899", bills: "#f59e0b",
  rent: "#ef4444", subscriptions: "#6366f1", education: "#14b8a6",
  health: "#10b981", travel: "#8b5cf6", other: "#6b7280",
};

const formatCategory = (cat) => cat?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

// Displays category name and amount formatted in user's selected currency
const CustomTooltip = ({ active, payload }) => {
  // Get the formatMoney function from currency context for consistent formatting
  const { formatMoney } = useCurrency();
  // Tooltip amounts in spending pie chart
  if (active && payload?.[0]) return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-lg">
      {/* Display category name */}
      <p className="text-sm font-semibold text-gray-900">{formatCategory(payload[0].name)}</p>
      {/* Display the amount spent in this category */}
      <p className="text-sm text-gray-500">{formatMoney(payload[0].value)}</p>
    </div>
  );
  return null; // Don't show anything when not hovering
};

export default function SpendingChart({ transactions }) {
  // Get the formatMoney function from currency context to display amounts in user's selected currency
  const { formatMoney } = useCurrency();
  
  // 1: Create an object to store total spending per category
  const expensesByCategory = {};
  
  // 2: Loop through all expenses and sum them up by category
  // Filter only expense transactions (not income), then add each transaction amount to its category
  transactions.filter((t) => t.type === "expense").forEach((t) => {
    expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
  });
  
  // 3: Convert category spending object to array format and sort by amount (highest first)
  // Sorted by value descending so largest expenses appear first
  const data = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // Show message if no expenses recorded this month
  if (data.length === 0) return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">No expenses yet this month</div>
  );

  // Main page layout
  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="w-48 h-48">
        {/* ResponsiveContainer makes chart responsive to container width/height */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" strokeWidth={0}>
              {/* Color each pie slice according to its category color */}
              {data.map((entry) => <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#6b7280"} />)}
            </Pie>
            {/* Tooltip shown on hover with custom formatting */}
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend list showing top 6 categories */}
      <div className="flex-1 space-y-2 w-full">
        {/* Display only the top 6 spending categories (slice(0, 6)) to avoid cluttering the legend */}
        {data.slice(0, 6).map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            {/* Category color indicator and name */}
            <div className="flex items-center gap-2">
              {/* Small colored circle matching the pie chart segment color */}
              <div className="w-3 h-3 rounded-full" style={{ background: CATEGORY_COLORS[item.name] || "#6b7280" }} />
              {/* Display formatted category name */}
              <span className="text-sm text-gray-600">{formatCategory(item.name)}</span>
            </div>
            {/* Display spending amount for this category */}
            <span className="text-sm font-semibold text-gray-900">{formatMoney(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}