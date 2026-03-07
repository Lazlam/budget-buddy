import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { supabase } from "@/api/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import SpendingChart from "@/components/dashboard/SpendingChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import MonthlyTrend from "@/components/dashboard/MonthlyTrend";
import AIInsightsPanel from "@/components/ai/AIInsightsPanel";
import AddTransactionDialog from "@/components/transactions/AddTransactionDialog";
import CurrencyRates from "@/components/dashboard/CurrencyRates";
import { useCurrency } from "@/contexts/CurrencyContext";

export default function Dashboard() {
  const { t } = useTranslation();
  const { formatMoney } = useCurrency();
  const [showAdd, setShowAdd] = useState(false);
  const queryClient = useQueryClient();
  const currentMonth = format(new Date(), "yyyy-MM");

  // Fetch transactions and budgets for current month to display on dashboard
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data } = await supabase.from("transactions").select("*").order("date", { ascending: false });
      return data || [];
    },
  });

  // Fetch budgets to provide context for AI insights panel
  const { data: budgets = [] } = useQuery({
    queryKey: ["budgets"],
    queryFn: async () => {
      const { data } = await supabase.from("budgets").select("*").eq("month", currentMonth);
      return data || [];
    },
  });

  // Mutation to create a new transaction, then refresh transactions list
  const createTx = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from("transactions").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });

  // Calculate total income, expenses, and balance for current month to display in stat cards
  const monthTxs = transactions.filter((t) => t.date?.startsWith(currentMonth));
  const totalIncome = monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + (t.amount || 0), 0);
  const totalExpenses = monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + (t.amount || 0), 0);
  const balance = totalIncome - totalExpenses;

  
  // Show spinner while fetching transactions and budgets
  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  // Main page layout
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Title and action button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            {/* Page title and current month overview text */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{t("dashboard_title", "Dashboard")}</h1>
            <p className="text-gray-500 text-sm mt-1">{format(new Date(), "MMMM yyyy")} {t("overview_text", "Overview")}</p>
          </div>
          {/* Button to open modal for creating new transaction */}
          <Button onClick={() => setShowAdd(true)} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl gap-2 h-11 shadow-sm">
            <Plus className="w-4 h-4" />{t("add_transaction_btn", "Add Transaction")}
          </Button>
        </div>

        {/* Display income, expenses, and balance for current month */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* StatCard receives amount and formatMoney() displays it with currency conversion */}
          {/* Income card showing total income for current month in user's selected currency */}
          <StatCard title={t("income_stat", "Income")} value={formatMoney(totalIncome)} icon={TrendingUp} color="#10b981" />
          
          {/* Expenses card showing total expenses for current month */}
          <StatCard title={t("expenses_stat", "Expenses")} value={formatMoney(totalExpenses)} icon={TrendingDown} color="#6366f1" />
          
          {/* Balance card showing income minus expenses, with green color if positive, red if negative */}
          <StatCard title={t("balance_stat", "Balance")} value={formatMoney(balance)} icon={Wallet}
            color={balance >= 0 ? "#10b981" : "#ef4444"}
            subtitle={balance >= 0 ? t("balance_positive", "You're in the green!") : t("balance_negative", "Spending more than earning")} />
        </div>

        {/* Spending breakdown pie chart + recent transactions list */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie chart showing where money goes by category */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("where_money_goes", "Where Your Money Goes")}</h2>
            {/* SpendingChart analyzes monthTxs and displays expenses grouped by category as pie chart */}
            <SpendingChart transactions={monthTxs} />
          </div>
          
          {/* List of 8 most recent transactions with animation on load */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("recent_transactions", "Recent Transactions")}</h2>
            {/* RecentTransactions shows last 8 transactions across all months, sorted by date newest first */}
            <RecentTransactions transactions={transactions} />
          </div>
        </div>

        {/* Monthly trend chart + AI insights panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line chart showing income vs expenses over last 6 months for trend visualization */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("monthly_trend", "Monthly Trend")}</h2>
            {/* MonthlyTrend renders bar chart comparing income and expenses monthly */}
            <MonthlyTrend transactions={transactions} />
          </div>
          
          {/* AI chatbot that analyzes current month transactions and budget recommendations using Gemini */}
          {/* Passes current month transactions (monthTxs) and budgets  */}
          <AIInsightsPanel transactions={monthTxs} budgets={budgets} />
        </div>

        {/* Display live exchange rates from EUR to other currencies */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Display live EUR to other currency exchange rates that update every 10 minutes */}
          <CurrencyRates />
        </div>
      </div>
      
      {/* Form for adding new transactions */}
      {/* open prop controls visibility, onOpenChange closes it, onSubmit handles form submission */}
      <AddTransactionDialog open={showAdd} onOpenChange={setShowAdd} onSubmit={(data) => createTx.mutateAsync(data)} />
    </div>
  );
}