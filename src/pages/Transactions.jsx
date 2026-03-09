import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { supabase } from "@/api/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus, Search, ArrowUpRight, ArrowDownLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import AddTransactionDialog from "@/components/transactions/AddTransactionDialog";
import { useCurrency } from "@/contexts/CurrencyContext"; 

const formatCategory = (cat) => cat?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export default function Transactions() {
  const { t } = useTranslation();
  const { formatMoney } = useCurrency(); 
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data } = await supabase.from("transactions").select("*").order("date", { ascending: false });
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

  const deleteTx = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });
  
  const filtered = transactions.filter((t) => {
    const matchSearch = t.title?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || t.type === typeFilter;
    const matchCat = catFilter === "all" || t.category === catFilter;
    return matchSearch && matchType && matchCat;
  });

  const categories = [...new Set(transactions.map((t) => t.category))].sort();

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  return (
    // Main background dark mode
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{t("transactions_title", "Transactions")}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{transactions.length} {t("total_transactions", "total transactions")}</p>
          </div>
          <Button onClick={() => setShowAdd(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2 h-11">
            <Plus className="w-4 h-4" />{t("add_transaction_btn", "Add Transaction")}
          </Button>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <Input placeholder={t("search_transactions", "Search transactions...")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500" />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-36 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white"><SelectValue /></SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="all" className="dark:text-gray-200 dark:focus:bg-gray-700">{t("all_types", "All Types")}</SelectItem>
              <SelectItem value="income" className="dark:text-gray-200 dark:focus:bg-gray-700">{t("type_income", "Income")}</SelectItem>
              <SelectItem value="expense" className="dark:text-gray-200 dark:focus:bg-gray-700">{t("type_expense", "Expense")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="w-full sm:w-44 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white"><SelectValue /></SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="all" className="dark:text-gray-200 dark:focus:bg-gray-700">{t("all_categories", "All Categories")}</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c} className="dark:text-gray-200 dark:focus:bg-gray-700">{formatCategory(c)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* List Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors duration-200">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm">{t("no_transactions", "No transactions found")}</div>
            ) : (
              filtered.map((tx, i) => (
                <motion.div key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-gray-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    {/* Dark mode opacities for the transaction icons */}
                    <div className={`p-2.5 rounded-xl ${tx.type === "income" ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-red-50 dark:bg-red-500/10"}`}>
                      {tx.type === "income" ? <ArrowDownLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <ArrowUpRight className="w-4 h-4 text-red-500 dark:text-red-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.title}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatCategory(tx.category)} · {format(new Date(tx.date), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-white"}`}>
                      {tx.type === "income" ? "+" : "-"}{formatMoney(tx.amount)}
                    </span>
                    <Button variant="ghost" size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 dark:hover:text-red-400 dark:hover:bg-red-500/10"
                      onClick={() => deleteTx.mutate(tx.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
      <AddTransactionDialog open={showAdd} onOpenChange={setShowAdd} onSubmit={(data) => createTx.mutateAsync(data)} />
    </div>
  );
}