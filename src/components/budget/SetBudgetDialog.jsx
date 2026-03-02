import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const CATEGORIES = ["food","groceries","transport","entertainment","shopping","bills","rent","subscriptions","education","health","travel","other"];
const formatCategory = (cat) => cat?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export default function SetBudgetDialog({ open, onOpenChange, onSubmit, existingCategories }) {
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
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle className="text-xl">Set Budget Limit</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {available.map((c) => <SelectItem key={c} value={c}>{formatCategory(c)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Monthly Limit ($)</Label>
            <Input type="number" step="1" min="1" placeholder="e.g. 200" value={form.monthly_limit} onChange={(e) => setForm({ ...form, monthly_limit: e.target.value })} required />
          </div>
          <Button type="submit" disabled={saving || !form.category} className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 rounded-xl">
            {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {saving ? "Saving..." : "Set Budget"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}