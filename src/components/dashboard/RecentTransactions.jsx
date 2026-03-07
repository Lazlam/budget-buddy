import { format } from "date-fns";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { motion } from "framer-motion";

const formatCategory = (cat) => cat?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export default function RecentTransactions({ transactions }) {
  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
  if (recent.length === 0) return (
    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">No transactions yet. Add your first one!</div>
  );
  return (
    <div className="space-y-1">
      {recent.map((tx, i) => (
        <motion.div key={tx.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
          className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${tx.type === "income" ? "bg-emerald-50" : "bg-red-50"}`}>
              {tx.type === "income" ? <ArrowDownLeft className="w-4 h-4 text-emerald-600" /> : <ArrowUpRight className="w-4 h-4 text-red-500" />}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{tx.title}</p>
              <p className="text-xs text-gray-400">{formatCategory(tx.category)} · {format(new Date(tx.date), "MMM d")}</p>
            </div>
          </div>
          <span className={`text-sm font-semibold ${tx.type === "income" ? "text-emerald-600" : "text-gray-900"}`}>
            {tx.type === "income" ? "+" : "-"}€{tx.amount.toFixed(2)}
          </span>
        </motion.div>
      ))}
    </div>
  );
}