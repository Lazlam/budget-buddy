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
      // Updated with dark mode background, border, and transition
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all duration-200">
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ background: color }} />
          {/* Updated text color for dark mode */}
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCategory(budget.category)}</span>
        </div>
        
        {/* Updated badge backgrounds to be subtle in dark mode */}
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          isOver 
            ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400" 
            : percentage > 80 
              ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" 
              : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        }`}>
          {isOver ? "Over budget" : percentage > 80 ? "Almost there" : "On track"}
        </span>
      </div>

      <div className="flex items-end justify-between mb-3">
        <div>
          {/* Updated text colors */}
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatMoney(spent)}</span>
          <span className="text-sm text-gray-400 dark:text-gray-500 ml-1">/ {formatMoney(budget.monthly_limit)}</span>
        </div>
        <span className={`text-sm font-medium ${isOver ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}>
          {isOver ? `${formatMoney(Math.abs(remaining))} over` : `${formatMoney(remaining)} left`}
        </span>
      </div>

      {/* Progress bar background for dark mode */}
      <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full" style={{ background: isOver ? "#ef4444" : color }} />
      </div>
    </motion.div>
  );
}