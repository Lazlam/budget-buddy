import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { supabase } from "@/api/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "../components/PasswordInput";
import { Wallet, Loader2, Mail, Lock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'el' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (view === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/update-password`,
        });
        if (error) throw error;
        setSuccess(t("success_reset_link"));
      } else if (view === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess(t("success_account_created"));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* NEW LANGUAGE TOGGLE BUTTON (Right above the logo) */}
        <div className="flex justify-end mb-4 pr-4 sm:pr-0">
          <Button variant="outline" size="sm" onClick={toggleLanguage} className="bg-white shadow-sm font-medium text-gray-700">
            {i18n.language === 'en' ? '🇬🇷 ΕΛ' : '🇬🇧 EN'}
          </Button>
        </div>

        <div className="flex justify-center">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg">
            <Wallet className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          BudgetBuddy
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {view === "login" && t("welcome_login")}
          {view === "signup" && t("welcome_signup")}
          {view === "forgot" && t("welcome_forgot")}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleAuth}>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t("email_label")}</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full rounded-xl h-11" 
                  placeholder="you@example.com" 
                />
              </div>
            </div>

            {view !== "forgot" && (
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">{t("password_label")}</label>
                  {view === "login" && (
                    <button type="button" onClick={() => { setView("forgot"); setError(null); setSuccess(null); }} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      {t("forgot_password_link")}
                    </button>
                  )}
                </div>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <PasswordInput 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 block w-full rounded-xl h-11" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <div className="flex gap-2 text-sm text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <p>{success}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button type="submit" disabled={isLoading || success} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 h-11">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                view === "login" ? t("sign_in_btn") : view === "signup" ? t("sign_up_btn") : t("send_reset_link_btn")
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t("or_divider")}</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              {view === "forgot" ? (
                <button type="button" onClick={() => { setView("login"); setError(null); setSuccess(null); }} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  {t("back_to_signin")}
                </button>
              ) : (
                <button type="button" onClick={() => { setView(view === "login" ? "signup" : "login"); setError(null); setSuccess(null); }} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  {view === "login" ? t("need_account_signup") : t("already_have_account_signin")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}