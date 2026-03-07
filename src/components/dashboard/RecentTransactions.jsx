// React component that displays the 8 most recent transactions from the user's account
// Shows a summary including category, date, transaction type (income/expense), and formatted amount
// Uses animations and icon indicators to display whether money came in (green) or went out (red)

import { format } from "date-fns"; // Library for formatting dates (e.g., "Jan 15")
import { ArrowUpRight, ArrowDownLeft } from "lucide-react"; // Icons: up arrow for expenses, down arrow for income
import { motion } from "framer-motion"; // Animation library for smooth transitions and entrance effects
import { useCurrency } from "@/contexts/CurrencyContext"; // Custom hook to access formatMoney() for currency display

// Helper function that converts category strings from database format to display format
// Example: "food_delivery" → "Food Delivery"
// Replaces underscores with spaces and capitalizes first letter of each word
const formatCategory = (cat) => cat?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

// Main component that shows a scrollable list of recent transactions
// Props: transactions = array of all transaction objects
export default function RecentTransactions({ transactions }) {
  // Get the formatMoney function from currency context to display amounts in user's selected currency
  const { formatMoney } = useCurrency();
  // Sort all transactions by date (newest first) and take only the first 8 items
  // [...transactions] creates a copy to avoid mutating the original array
  // sort() arranges by date descending (newest dates have larger timestamp values)
  // slice(0, 8) extracts the 8 most recent items
  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
  
  // Show empty state message if user has no transactions yet
  // This prevents rendering an empty list and provides helpful guidance
  if (recent.length === 0) return (
    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">No transactions yet. Add your first one!</div>
  );

  // Render the transaction list with animations
  return (
    <div className="space-y-1">
      {/* Loop through each transaction and render it with animation */}
      {recent.map((tx, i) => (
        // Framer Motion wrapper that animates each transaction item sliding in
        // delay: i * 0.05 staggeres the animation (each item appears 50ms after the previous)
        // Initial state: hidden (opacity 0) and shifted left (x: -10)
        // Final state: visible (opacity 1) and in position (x: 0)
        <motion.div key={tx.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
          className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors">
          {/* Left section: category icon and transaction details */}
          <div className="flex items-center gap-3">
            {/* Icon indicator showing transaction direction */}
            {/* Income transactions: green background with down arrow icon (money coming down into wallet) */}
            {/* Expense transactions: red background with up arrow icon (money going up out of wallet) */}
            <div className={`p-2 rounded-xl ${tx.type === "income" ? "bg-emerald-50" : "bg-red-50"}`}>
              {tx.type === "income" ? <ArrowDownLeft className="w-4 h-4 text-emerald-600" /> : <ArrowUpRight className="w-4 h-4 text-red-500" />}
            </div>
            {/* Transaction title and metadata (category + date) */}
            <div>
              <p className="text-sm font-medium text-gray-900">{tx.title}</p>
              <p className="text-xs text-gray-400">
                {/* Format category displayname and show the transaction date (e.g., "Jan 15") */}
                {formatCategory(tx.category)} · {format(new Date(tx.date), "MMM d")}
              </p>
            </div>
          </div>
          {/* Right section: transaction amount with +/- prefix and color coding */}
          {/* Green text for income, dark gray for expenses */}
          <span className={`text-sm font-semibold ${tx.type === "income" ? "text-emerald-600" : "text-gray-900"}`}>
            {/* CURRENCY FORMAT: Display formatted amount with +/- prefix based on transaction type */}
            {tx.type === "income" ? "+" : "-"}{formatMoney(tx.amount)}
          </span>
        </motion.div>
      ))}
    </div>
  );
}