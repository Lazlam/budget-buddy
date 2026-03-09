import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

const CATEGORIES = ["food","groceries","transport","entertainment","shopping","bills","rent","subscriptions","education","health","travel","other"];
const formatCategory = (cat) => cat?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export default function SetBudgetDialog({ open, onOpenChange, onSubmit, existingCategories }) {
  const { currency } = useCurrency();
  const [form, setForm] = useState({ category: "", monthly_limit: "" });
  const [saving, setSaving] = useState(false);
  const available = CATEGORIES.filter((c) => !existingCategories.includes(c));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit({ category: form.category, monthly_limit: parseFloat(form.monthly_limit) });
    setSaving(false);
    setForm({ category: "", monthly_limit: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm !bg-white dark:!bg-gray-900 !border-gray-200 dark:!border-gray-700 transition-colors">
        <DialogHeader><DialogTitle className="text-xl text-gray-900 dark:text-white">Set Budget Limit</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label className="text-gray-900 dark:text-gray-300">Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger className="bg-white dark:!bg-gray-800 border-gray-200 dark:!border-gray-700 text-gray-900 dark:text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:!bg-gray-800 border-gray-200 dark:!border-gray-700">
                {available.map((c) => <SelectItem key={c} value={c} className="text-gray-900 dark:text-gray-200 focus:bg-gray-100 dark:focus:!bg-gray-700">{formatCategory(c)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-900 dark:text-gray-300">Monthly Limit ({currency})</Label>
            <Input className="bg-white dark:!bg-gray-800 border-gray-200 dark:!border-gray-700 text-gray-900 dark:text-white" type="number" step="1" min="1" placeholder="e.g. 200" value={form.monthly_limit} onChange={(e) => setForm({ ...form, monthly_limit: e.target.value })} required />
          </div>
          <Button type="submit" disabled={saving || !form.category} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11 rounded-xl">
            {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {saving ? "Saving..." : "Set Budget"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}