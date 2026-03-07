import { motion } from "framer-motion";
import { useCurrency } from "@/contexts/CurrencyContext";

// Map category names to their display colors for visual consistency
const CATEGORY_COLORS = {
  food: "#f97316", groceries: "#22c55e", transport: "#3b82f6",
  entertainment: "#a855f7", shopping: "#ec4899", bills: "#f59e0b",
  rent: "#ef4444", subscriptions: "#6366f1", education: "#14b8a6",
  health: "#10b981", travel: "#8b5cf6", other: "#6b7280",
};

// Convert category slug (e.g., "food_delivery") to title case ("Food Delivery")
const formatCategory = (cat) => cat?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

// BudgetCard displays a single budget with spent amount, limit, and progress bar
export default function BudgetCard({ budget, spent }) {
  const { formatMoney } = useCurrency(); // Get currency formatter with user's selected currency
  
  // Calculate what percentage of the budget has been spent (capped at 100%)
  const percentage = budget.monthly_limit > 0 ? Math.min((spent / budget.monthly_limit) * 100, 100) : 0;
  // Calculate how much budget is left (negative if over budget)
  const remaining = budget.monthly_limit - spent;
  // Check if spending has exceeded the budget limit
  const isOver = remaining < 0;
  // Get the color for this budget category, or use gray as fallback
  const color = CATEGORY_COLORS[budget.category] || "#6b7280";

  return (
    // Animated card that fades in and slides up when first rendered
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Colored dot indicator for this budget category */}
          <div className="w-3 h-3 rounded-full" style={{ background: color }} />
          <span className="text-sm font-semibold text-gray-900">{formatCategory(budget.category)}</span>
        </div>
        {/* Status badge: red if over, amber if >80%, green if on track */}
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${isOver ? "bg-red-50 text-red-600" : percentage > 80 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
          {isOver ? "Over budget" : percentage > 80 ? "Almost there" : "On track"}
        </span>
      </div>
      {/* Amount display: spent / limit and remaining or overage */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <span className="text-2xl font-bold text-gray-900">{formatMoney(spent)}</span>
          <span className="text-sm text-gray-400 ml-1">/ {formatMoney(budget.monthly_limit)}</span>
        </div>
        <span className={`text-sm font-medium ${isOver ? "text-red-500" : "text-gray-500"}`}>
          {isOver ? `${formatMoney(Math.abs(remaining))} over` : `${formatMoney(remaining)} left`}
        </span>
      </div>
      {/* Progress bar filled by spending percentage */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        {/* Red if over budget, category color otherwise */}
        <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full" style={{ background: isOver ? "#ef4444" : color }} />
      </div>
    </motion.div>
  );
}