import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { supabase } from "@/api/supabase";
import { LayoutDashboard, ArrowLeftRight, Target, Sparkles, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "Dashboard", page: "Dashboard", icon: LayoutDashboard },
  { label: "Transactions", page: "Transactions", icon: ArrowLeftRight },
  { label: "Budgets", page: "Budgets", icon: Target },
  { label: "AI Advisor", page: "AIAdvisor", icon: Sparkles },
];

export default function Layout({ children, currentPageName }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'el' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 p-6 sticky top-0 h-screen">
        <div className="mb-10">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            <span className="text-indigo-600">Budget</span>Buddy
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">{t("smart_money_tagline", "Smart money management")}</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={`/${item.page === 'Dashboard' ? '' : item.page.toLowerCase()}`} // Replaced missing createPageUrl function to prevent errors!
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-indigo-600" : ""}`} />
                {t(item.label)} {/* This will translate "Dashboard", "Budgets", etc. */}
              </Link>
            );
          })}
        </nav>
        
        {/* Desktop Bottom Actions: Toggle Language & Logout */}
        <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-gray-100">
          <Button variant="outline" size="sm" onClick={toggleLanguage} className="w-full justify-center">
            {i18n.language === 'en' ? '🇬🇷 ΕΛ' : '🇬🇧 EN'}
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-500 hover:text-red-500" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />{t("logout_btn", "Sign Out")}
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900"><span className="text-indigo-600">Budget</span>Buddy</h1>
        
        <div className="flex items-center gap-2">
          {/* Mobile Language Toggle */}
          <Button variant="outline" size="sm" className="h-8 px-2" onClick={toggleLanguage}>
             {i18n.language === 'en' ? '🇬🇷 ΕΛ' : '🇬🇧 EN'}
          </Button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-100 p-4 space-y-1 shadow-lg">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPageName === item.page;
              return (
                <Link key={item.page} to={`/${item.page === 'Dashboard' ? '' : item.page.toLowerCase()}`} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}>
                  <item.icon className={`w-5 h-5 ${isActive ? "text-indigo-600" : ""}`} />
                  {t(item.label)}
                </Link>
              );
            })}
            
            <div className="pt-2 mt-2 border-t border-gray-100 flex flex-col gap-2">
              <Button variant="ghost" className="w-full justify-start text-gray-500 hover:text-red-500 hover:bg-red-50" onClick={handleLogout}>
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