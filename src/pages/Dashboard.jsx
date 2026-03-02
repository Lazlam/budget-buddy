import React, { useState } from "react";
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

export default function Dashboard() {
  const [showAdd, setShowAdd] = useState(false);
  const queryClient = useQueryClient();
  const currentMonth = format(new Date(), "yyyy-MM");

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data } = await supabase.from("transactions").select("*").order("date", { ascending: false });
      return data || [];
    },
  });

  const { data: budgets = [] } = useQuery({
    queryKey: ["budgets"],
    queryFn: async () => {
      const { data } = await supabase.from("budgets").select("*").eq("month", currentMonth);
      return data || [];
    },
  });

  const createTx = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from("transactions").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });

  const monthTxs = transactions.filter((t) => t.date?.startsWith(currentMonth));
  const totalIncome = monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + (t.amount || 0), 0);
  const totalExpenses = monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + (t.amount || 0), 0);
  const balance = totalIncome - totalExpenses;

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">{format(new Date(), "MMMM yyyy")} Overview</p>
          </div>
          <Button onClick={() => setShowAdd(true)} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl gap-2 h-11 shadow-sm">
            <Plus className="w-4 h-4" />Add Transaction
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard title="Income" value={`$${totalIncome.toFixed(2)}`} icon={TrendingUp} color="#10b981" />
          <StatCard title="Expenses" value={`$${totalExpenses.toFixed(2)}`} icon={TrendingDown} color="#6366f1" />
          <StatCard title="Balance" value={`$${balance.toFixed(2)}`} icon={Wallet}
            color={balance >= 0 ? "#10b981" : "#ef4444"}
            subtitle={balance >= 0 ? "You're in the green!" : "Spending more than earning"} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Where Your Money Goes</h2>
            <SpendingChart transactions={monthTxs} />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
            <RecentTransactions transactions={transactions} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h2>
            <MonthlyTrend transactions={transactions} />
          </div>
          <AIInsightsPanel transactions={monthTxs} budgets={budgets} />
        </div>
      </div>
      <AddTransactionDialog open={showAdd} onOpenChange={setShowAdd} onSubmit={(data) => createTx.mutateAsync(data)} />
    </div>
  );
}