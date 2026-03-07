import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { supabase } from "@/api/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BudgetCard from "@/components/budget/BudgetCard";
import SetBudgetDialog from "@/components/budget/SetBudgetDialog";
import { useCurrency } from "@/contexts/CurrencyContext"; // <-- ADDED

export default function Budgets() {
  const { t } = useTranslation();
  const { formatMoney } = useCurrency(); // <-- ADDED
  const [showAdd, setShowAdd] = useState(false);
  const queryClient = useQueryClient();
  const currentMonth = format(new Date(), "yyyy-MM");

  const { data: budgets = [], isLoading } = useQuery({
    queryKey: ["budgets", currentMonth],
    queryFn: async () => {
      const { data } = await supabase.from("budgets").select("*").eq("month", currentMonth);
      return data || [];
    },
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data } = await supabase.from("transactions").select("*").order("date", { ascending: false });
      return data || [];
    },
  });

  const createBudget = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from("budgets").insert([{ ...data, month: currentMonth }]);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgets"] }),
  });

  const deleteBudget = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("budgets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgets"] }),
  });

  const spentByCategory = {};
  transactions.filter((t) => t.date?.startsWith(currentMonth) && t.type === "expense")
    .forEach((t) => { spentByCategory[t.category] = (spentByCategory[t.category] || 0) + (t.amount || 0); });

  const totalBudget = budgets.reduce((s, b) => s + (b.monthly_limit || 0), 0);
  const totalSpent = budgets.reduce((s, b) => s + (spentByCategory[b.category] || 0), 0);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{t("budgets_title", "Budgets")}</h1>
            <p className="text-gray-500 text-sm mt-1">{format(new Date(), "MMMM yyyy")} {t("limits_text", "limits")}</p>
          </div>
          <Button onClick={() => setShowAdd(true)} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl gap-2 h-11">
            <Plus className="w-4 h-4" />{t("set_budget_btn", "Set Budget")}
          </Button>
        </div>

        {budgets.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Used formatMoney for all budget totals */}
              <div><p className="text-sm text-gray-500">{t("total_budgeted", "Total Budgeted")}</p><p className="text-2xl font-bold text-gray-900">{formatMoney(totalBudget)}</p></div>
              <div><p className="text-sm text-gray-500">{t("total_spent", "Total Spent")}</p><p className="text-2xl font-bold text-gray-900">{formatMoney(totalSpent)}</p></div>
              <div>
                <p className="text-sm text-gray-500">{t("remaining", "Remaining")}</p>
                <p className={`text-2xl font-bold ${totalBudget - totalSpent >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {formatMoney(totalBudget - totalSpent)}
                </p>
              </div>
            </div>
          </div>
        )}

        {budgets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 shadow-sm text-center">
            <p className="text-gray-400 text-sm mb-4">{t("no_budgets", "No budgets set yet!")}</p>
            <Button onClick={() => setShowAdd(true)} variant="outline" className="rounded-xl gap-2">
              <Plus className="w-4 h-4" />{t("set_first_budget_btn", "Set Your First Budget")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((b) => (
              <div key={b.id} className="relative group">
                <BudgetCard budget={b} spent={spentByCategory[b.category] || 0} />
                <Button variant="ghost" size="icon"
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                  onClick={() => deleteBudget.mutate(b.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      <SetBudgetDialog open={showAdd} onOpenChange={setShowAdd}
        onSubmit={(data) => createBudget.mutateAsync(data)}
        existingCategories={budgets.map((b) => b.category)} />
    </div>
  );
}