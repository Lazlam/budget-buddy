import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { supabase } from "@/api/supabase";
import { LayoutDashboard, ArrowLeftRight, Target, Sparkles, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";

const NAV_ITEMS = [
  { label: "Dashboard", page: "Dashboard", icon: LayoutDashboard },
  { label: "Transactions", page: "Transactions", icon: ArrowLeftRight },
  { label: "Budgets", page: "Budgets", icon: Target },
  { label: "AI Advisor", page: "AIAdvisor", icon: Sparkles },
];

export default function Layout({ children, currentPageName }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { currency, setCurrency } = useCurrency();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'el' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    // Added dark background to main wrapper
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-gray-900 transition-colors duration-200">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 p-6 sticky top-0 h-screen transition-colors duration-200">
        <div className="mb-10">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            <span className="text-indigo-600 dark:text-indigo-400">Budget</span>Buddy
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">{t("smart_money_tagline", "Smart money management")}</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={`/${item.page === 'Dashboard' ? '' : item.page.toLowerCase()}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" 
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
                {t(item.label)} 
              </Link>
            );
          })}
        </nav>
        
        {/* Desktop Bottom Actions */}
        <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="EUR">🇪🇺 EUR (€)</option>
            <option value="USD">🇺🇸 USD ($)</option>
            <option value="GBP">🇬🇧 GBP (£)</option>
            <option value="JPY">🇯🇵 JPY (¥)</option>
            <option value="AUD">🇦🇺 AUD ($)</option>
            <option value="CAD">🇨🇦 CAD ($)</option>
          </select>
          <Button variant="outline" size="sm" onClick={toggleLanguage} className="w-full justify-center dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
            {i18n.language === 'en' ? '🇬🇷 ΕΛ' : '🇬🇧 EN'}
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 dark:hover:bg-red-500/10" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />{t("logout_btn", "Sign Out")}
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center justify-between transition-colors duration-200">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white"><span className="text-indigo-600 dark:text-indigo-400">Budget</span>Buddy</h1>
        
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-gray-900 dark:text-white">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/20 dark:bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-14 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-4 space-y-1 shadow-lg transition-colors duration-200">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPageName === item.page;
              return (
                <Link key={item.page} to={`/${item.page === 'Dashboard' ? '' : item.page.toLowerCase()}`} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" 
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }`}>
                  <item.icon className={`w-5 h-5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
                  {t(item.label)}
                </Link>
              );
            })}
            
            <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-2">
              {/* MOBILE CURRENCY SELECTOR ADDED HERE */}
              <select 
                value={currency} 
                onChange={(e) => {
                  setCurrency(e.target.value);
                  setMobileOpen(false); // Close menu on select
                }}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="EUR">🇪🇺 EUR (€)</option>
                <option value="USD">🇺🇸 USD ($)</option>
                <option value="GBP">🇬🇧 GBP (£)</option>
                <option value="JPY">🇯🇵 JPY (¥)</option>
                <option value="AUD">🇦🇺 AUD ($)</option>
                <option value="CAD">🇨🇦 CAD ($)</option>
              </select>

              <Button variant="outline" className="w-full justify-center text-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700" onClick={() => { toggleLanguage(); setMobileOpen(false); }}>
                 {i18n.language === 'en' ? '🇬🇷 Αλλαγή σε Ελληνικά' : '🇬🇧 Switch to English'}
              </Button>
              
              <Button variant="ghost" className="w-full justify-start text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10" onClick={handleLogout}>
                <LogOut className="w-5 h-5 mr-3" />{t("logout_btn", "Sign Out")}
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 md:pt-0 pt-14 overflow-y-auto">{children}</main>
    </div>
  );
}