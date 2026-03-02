import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

const EXPENSE_CATEGORIES = ["food","groceries","transport","entertainment","shopping","bills","rent","subscriptions","education","health","travel","other"];
const INCOME_CATEGORIES = ["salary","freelance","gifts","other_income"];
const formatCategory = (cat) => cat?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export default function AddTransactionDialog({ open, onOpenChange, onSubmit }) {
  const [type, setType] = useState("expense");
  const [form, setForm] = useState({ title: "", amount: "", category: "", date: format(new Date(), "yyyy-MM-dd"), notes: "" });
  const [saving, setSaving] = useState(false);

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit({ ...form, amount: parseFloat(form.amount), type });
    setSaving(false);
    setForm({ title: "", amount: "", category: "", date: format(new Date(), "yyyy-MM-dd"), notes: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-xl">Add Transaction</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            {["expense","income"].map((t) => (
              <button key={t} type="button" onClick={() => { setType(t); setForm(f => ({ ...f, category: "" })); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize ${type === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input placeholder="e.g. Coffee, Rent, Paycheck" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount ($)</Label>
              <Input type="number" step="0.01" min="0.01" placeholder="0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })} required>
              <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c} value={c}>{formatCategory(c)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea placeholder="Any extra details..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
          </div>
          <Button type="submit" disabled={saving || !form.category} className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 rounded-xl">
            {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {saving ? "Saving..." : "Add Transaction"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}