import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './i18n';
import App from "./App";
import "./index.css"; 
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { ThemeProvider } from '@/contexts/ThemeContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      
      <CurrencyProvider>
        <ThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </CurrencyProvider>
    </QueryClientProvider>
  </React.StrictMode>
);