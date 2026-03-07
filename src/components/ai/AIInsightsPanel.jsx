import React, { useState } from "react";
import { supabase } from "@/api/supabase";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai"; // 1. Added Gemini Import

export default function AIInsightsPanel({ transactions, budgets }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const CURRENCY = "€";

  const generateInsights = async () => {
    setLoading(true);
    const expensesByCategory = {};
    const incomeTotal = transactions.filter(t => t.type === "income").reduce((s, t) => s + (t.amount || 0), 0);
    const expenseTotal = transactions.filter(t => t.type === "expense").reduce((s, t) => s + (t.amount || 0), 0);
    
    transactions.filter(t => t.type === "expense").forEach(t => {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + (t.amount || 0);
    });
    
    const budgetInfo = budgets.map(b => ({ category: b.category, limit: b.monthly_limit, spent: expensesByCategory[b.category] || 0 }));

    const prompt = `You are a friendly financial advisor for a family. Analyze their spending data and give practical advice.

Income: ${CURRENCY}${incomeTotal.toFixed(2)}, Expenses: ${CURRENCY}${expenseTotal.toFixed(2)}, Net: ${CURRENCY}${(incomeTotal - expenseTotal).toFixed(2)}
Expenses by category: ${Object.entries(expensesByCategory).map(([c, a]) => `${c}: ${CURRENCY}${a.toFixed(2)}`).join(", ")}
Budget limits: ${budgetInfo.map(b => `${b.category}: ${CURRENCY}${b.spent.toFixed(2)}/${CURRENCY}${b.limit.toFixed(2)}`).join(", ") || "None set"}

Give a brief, friendly analysis with: 1) Summary 2) Top Insight 3) 2-3 Money Saving Tips 4) Budget Alerts. Use markdown, be encouraging and concise.`;

    // 2. The Real Gemini API Call
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      setInsights(responseText);
    } catch (error) {
      console.error("Gemini Error:", error);
      setInsights("**Oops!** I couldn't connect to my AI brain. Please make sure your API key is correct in your `.env` file.");
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 rounded-xl"><Sparkles className="w-5 h-5 text-indigo-600" /></div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Money Advisor</h3>
            <p className="text-xs text-gray-500">Personalized insights based on your spending</p>
          </div>
        </div>
        {insights && (
          <Button variant="ghost" size="icon" onClick={generateInsights} disabled={loading} className="text-indigo-600">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        )}
      </div>
      <AnimatePresence mode="wait">
        {!insights && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
            <p className="text-sm text-gray-500 mb-4">Get AI-powered insights about your spending habits.</p>
            <Button onClick={generateInsights} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl gap-2">
              <Sparkles className="w-4 h-4" />Analyze My Spending
            </Button>
          </motion.div>
        )}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-8 gap-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm text-gray-500">Analyzing your finances...</p>
          </motion.div>
        )}
        {insights && !loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="prose prose-sm prose-indigo max-w-none bg-white rounded-xl p-5 border border-indigo-100">
              <ReactMarkdown components={{
                p: ({ children }) => <p className="text-sm text-gray-700 leading-relaxed my-2">{children}</p>,
                strong: ({ children }) => <strong className="text-gray-900">{children}</strong>,
                h2: ({ children }) => <h3 className="text-sm font-bold text-gray-900 mt-3 mb-1">{children}</h3>,
                h3: ({ children }) => <h4 className="text-sm font-bold text-gray-900 mt-3 mb-1">{children}</h4>,
                ul: ({ children }) => <ul className="my-1 space-y-1">{children}</ul>,
                li: ({ children }) => <li className="text-sm text-gray-700">{children}</li>,
              }}>{insights}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}