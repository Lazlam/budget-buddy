import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/api/supabase";
import { Loader2 } from "lucide-react";
import UpdatePassword from "./pages/UpdatePassword";
import './index.css';

// Import your pages
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import AIAdvisor from "./pages/AIAdvisor";
import Auth from "./pages/Auth"; // We need to import your new Auth page!

export default function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Check if the user is logged in right when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // 2. Listen for any logins or logouts while the app is running
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Clean up the listener when the app closes
    return () => subscription.unsubscribe();
  }, []);

  // Show a quick spinner while checking the locks
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  // THE SECURITY GUARD: If no session, force them to the login screen!
  if (!session) {
    return <Auth />;
  }

  // IF LOGGED IN: Open the doors to the normal app!
  return (
    <Routes>
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/" element={<Layout currentPageName="Dashboard"><Dashboard /></Layout>} />
      <Route path="/Transactions" element={<Layout currentPageName="Transactions"><Transactions /></Layout>} />
      <Route path="/Budgets" element={<Layout currentPageName="Budgets"><Budgets /></Layout>} />
      <Route path="/AIAdvisor" element={<Layout currentPageName="AIAdvisor"><AIAdvisor /></Layout>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}