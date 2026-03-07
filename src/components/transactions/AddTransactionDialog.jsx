// Modal dialog form for adding new income or expense transactions
// Supports switching between income/expense types, selecting category, setting amount and date

import React, { useState } from "react"; // React hooks for state management
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Custom modal dialog component
import { Button } from "@/components/ui/button"; // Custom button component
import { Input } from "@/components/ui/input"; // Custom input field component
import { Label } from "@/components/ui/label"; // Custom label component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Custom dropdown component
import { Textarea } from "@/components/ui/textarea"; // Custom textarea component for notes
import { format } from "date-fns"; // Date formatting library
import { Loader2 } from "lucide-react"; // Loader spinner icon
import { useCurrency } from "@/contexts/CurrencyContext"; // Custom hook for currency context

// Predefined expense categories - users select one when creating expense transaction
const EXPENSE_CATEGORIES = ["food","groceries","transport","entertainment","shopping","bills","rent","subscriptions","education","health","travel","other"];

// Predefined income categories - users select one when creating income transaction
const INCOME_CATEGORIES = ["salary","freelance","gifts","other_income"];

// Helper function that converts category strings from database format to display format
// Example: "food_delivery" → "Food Delivery"
const formatCategory = (cat) => cat?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

// Modal dialog component for adding new transactions
// Props: open = boolean to show/hide dialog, onOpenChange = callback to toggle modal, onSubmit = callback after form submission
export default function AddTransactionDialog({ open, onOpenChange, onSubmit }) {
  // Get currency settings from context to display in the form
  const { formatMoney, currency } = useCurrency(); // currency = "USD", "EUR", etc. from user settings
  
  // Form state management
  const [type, setType] = useState("expense"); // Toggle between "expense" and "income"
  // Form data object containing all transaction details
  const [form, setForm] = useState({ 
    title: "", // Transaction title/description (e.g., "Groceries", "Paycheck")
    amount: "", // Transaction amount
    category: "", // Selected category
    date: format(new Date(), "yyyy-MM-dd"), // Defaults to today's date
    notes: "" // Optional notes/details
  });
  const [saving, setSaving] = useState(false); // Loading state while submitting form

  // Select categories based on transaction type (expense or income have different category lists)
  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  // FUNCTION: Handle form submission
  // Validates input, sends data to parent component, and resets form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setSaving(true); // Show loading state
    
    // Call the parent component's onSubmit callback with form data
    // Converts amount string to number and includes transaction type
    await onSubmit({ ...form, amount: parseFloat(form.amount), type });
    
    setSaving(false); // Hide loading state
    // Reset form fields for next transaction
    setForm({ title: "", amount: "", category: "", date: format(new Date(), "yyyy-MM-dd"), notes: "" });
    // Close the modal dialog
    onOpenChange(false);
  };

  // MAIN LAYOUT: Modal dialog with form
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* Dialog header */}
        <DialogHeader><DialogTitle className="text-xl">Add Transaction</DialogTitle></DialogHeader>
        
        {/* Transaction form */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          
          {/* TYPE SELECTOR: Toggle between expense and income */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            {["expense","income"].map((t) => (
              // Each button toggles the type and resets category
              <button key={t} type="button" onClick={() => { setType(t); setForm(f => ({ ...f, category: "" })); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize ${type === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
                {t}
              </button>
            ))}
          </div>
          
          {/* TITLE INPUT: Transaction description */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input placeholder="e.g. Coffee, Rent, Paycheck" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          
          {/* AMOUNT AND DATE: Two-column layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* AMOUNT INPUT: Transaction amount in user's selected currency */}
            <div className="space-y-2">
              {/* CURRENCY FORMAT: Label shows the user's selected currency (USD, EUR, GBP, etc.) */}
              <Label>Amount ({currency})</Label>
              {/* Number input with 2 decimal places */}
              <Input type="number" step="0.01" min="0.01" placeholder="0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            </div>
            
            {/* DATE INPUT: Transaction date picker */}
            <div className="space-y-2">
              <Label>Date</Label>
              {/* Date input defaults to today's date */}
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
          </div>
          
          {/* CATEGORY SELECTOR: Dropdown with categories based on type */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })} required>
              <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
              <SelectContent>
                {/* Map through available categories and display them */}
                {categories.map((c) => <SelectItem key={c} value={c}>{formatCategory(c)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          {/* NOTES INPUT: Optional additional details */}
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea placeholder="Any extra details..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
          </div>
          
          {/* SUBMIT BUTTON: Add Transaction */}
          <Button type="submit" disabled={saving || !form.category} className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 rounded-xl">
            {/* Show spinner and text while saving */}
            {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {saving ? "Saving..." : "Add Transaction"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}