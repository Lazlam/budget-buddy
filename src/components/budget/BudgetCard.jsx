import { motion } from "framer-motion";
import { useCurrency } from "@/contexts/CurrencyContext";

const CATEGORY_COLORS = {
  food: "#f97316", groceries: "#22c55e", transport: "#3b82f6",
  entertainment: "#a855f7", shopping: "#ec4899", bills: "#f59e0b",
  rent: "#ef4444", subscriptions: "#6366f1", education: "#14b8a6",
  health: "#10b981", travel: "#8b5cf6", other: "#6b7280",
};

const formatCategory = (cat) => cat?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export default function BudgetCard({ budget, spent }) {
  const { formatMoney } = useCurrency();
  
  const percentage = budget.monthly_limit > 0 ? Math.min((spent / budget.monthly_limit) * 100, 100) : 0;
  const remaining = budget.monthly_limit - spent;
  const isOver = remaining < 0;
  const color = CATEGORY_COLORS[budget.category] || "#6b7280";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ background: color }} />
          <span className="text-sm font-semibold text-gray-900">{formatCategory(budget.category)}</span>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${isOver ? "bg-red-50 text-red-600" : percentage > 80 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
          {isOver ? "Over budget" : percentage > 80 ? "Almost there" : "On track"}
        </span>
      </div>
      <div className="flex items-end justify-between mb-3">
        <div>
          <span className="text-2xl font-bold text-gray-900">{formatMoney(spent)}</span>
          <span className="text-sm text-gray-400 ml-1">/ {formatMoney(budget.monthly_limit)}</span>
        </div>
        <span className={`text-sm font-medium ${isOver ? "text-red-500" : "text-gray-500"}`}>
          {isOver ? `${formatMoney(Math.abs(remaining))} over` : `${formatMoney(remaining)} left`}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full" style={{ background: isOver ? "#ef4444" : color }} />
      </div>
    </motion.div>
  );
}