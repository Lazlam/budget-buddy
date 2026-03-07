import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { supabase } from "@/api/supabase";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Send, Loader2, Sparkles, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useCurrency } from "@/contexts/CurrencyContext";

export default function AIAdvisor() {
  const { t } = useTranslation();
  const { formatMoney } = useCurrency();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const currentMonth = format(new Date(), "yyyy-MM");

  // Fetch transactions and budgets to build AI context
  const { data: transactions = [] } = useQuery({
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

  // Build AI context based on user's financial data
  const buildContext = () => {
    const monthTxs = transactions.filter((t) => t.date?.startsWith(currentMonth));
    const income = monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + (t.amount || 0), 0);
    const expenses = monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + (t.amount || 0), 0);
    const byCategory = {};
    monthTxs.filter((t) => t.type === "expense").forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] || 0) + (t.amount || 0);
    });
    
    // AI now gets context perfectly formatted in the user's chosen currency
    return `User's Financial Data (${format(new Date(), "MMMM yyyy")}):
- Income: ${formatMoney(income)}
- Expenses: ${formatMoney(expenses)}
- Balance: ${formatMoney(income - expenses)}
- Expenses by category: ${Object.entries(byCategory).map(([c, a]) => `${c}: ${formatMoney(a)}`).join(", ")}
- Budget limits: ${budgets.map((b) => `${b.category}: ${formatMoney(b.monthly_limit)}`).join(", ") || "None set"}
- Recent transactions: ${monthTxs.slice(0, 15).map((t) => `${t.title}(${formatMoney(t.amount)}, ${t.type}, ${t.category})`).join("; ")}`;
  };

  // Handle sending user message and getting AI response
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    
    // Build prompt with financial context and user question, then call Gemini API
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `You are a friendly, smart financial advisor for a family. You have access to their real spending data. Be concise, helpful, and use markdown formatting for readability.

      ${buildContext()}

      User: ${userMsg}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      setMessages((prev) => [...prev, { role: "assistant", content: responseText }]);
    } catch (e) {
      console.error("Gemini Error:", e);
      setMessages((prev) => [...prev, { role: "assistant", content: t("ai_error", "Sorry, my AI brain is having trouble connecting right now! Check your API key.") }]);
    }
    
    setLoading(false);
  };

  //Have a couple of quick prompts ready for user
  const quickPrompts = [
    t("prompt_1", "How am I doing this month?"), 
    t("prompt_2", "Where can I cut spending?"), 
    t("prompt_3", "Help me make a savings plan"), 
    t("prompt_4", "What should my budget be?")
  ];

  // Main page layout
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col" style={{ height: "calc(100vh - 80px)" }}>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t("ai_advisor_title", "AI Money Advisor")}</h1>
              <p className="text-sm text-gray-500">{t("ai_advisor_subtitle", "Ask anything about your finances")}</p>
            </div>
          </div>
        </div>

        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-6">
              <div className="p-4 bg-indigo-50 rounded-2xl"><Bot className="w-10 h-10 text-indigo-500" /></div>
              <div>
                <p className="text-gray-900 font-medium mb-1">{t("ai_greeting", "Hi! I'm your AI Money Advisor")}</p>
                <p className="text-sm text-gray-500 max-w-sm">{t("ai_description", "I can analyze your spending, help you budget, and give personalized tips.")}</p>
              </div>

              {/* Quick prompt buttons for user to get started */}
              <div className="flex flex-wrap justify-center gap-2">
                {quickPrompts.map((prompt) => (
                  <button key={prompt} onClick={() => setInput(prompt)}
                    className="text-sm px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all">
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div 
                key={`msg-${i}-${msg.role}`} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-indigo-600 text-white" : "bg-white border border-gray-100 shadow-sm"}`}>
                  {msg.role === "user" ? (
                    <p className="text-sm">{msg.content}</p>
                  ) : (
                    <div className="text-sm whitespace-pre-wrap">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-gray-200 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex gap-3 items-start"
            >
              
              <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
        {/* Input area */}
        <div className="flex gap-3">
          <Input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
            placeholder={t("ai_input_placeholder", "Ask about your spending, budget tips, savings goals...")}
            className="flex-1 h-12 rounded-xl" disabled={loading} />
          <Button onClick={handleSend} disabled={loading || !input.trim()} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl h-12 w-12">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}