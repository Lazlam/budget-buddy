import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  // 1. Remember their choice even if they close the app (defaults to EUR)
  const [currency, setCurrency] = useState(() => localStorage.getItem('app_currency') || 'EUR');

  useEffect(() => {
    localStorage.setItem('app_currency', currency);
  }, [currency]);

  // 2. Fetch the live rates globally!
  const { data: ratesData } = useQuery({
    queryKey: ["exchangeRates"],
    queryFn: async () => {
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/EUR");
      if (!res.ok) throw new Error("Failed to fetch rates");
      return res.json();
    },
    refetchInterval: 600000, // Still updates every 10 mins
  });

  const rates = ratesData?.rates || { EUR: 1 };

  // 3. The Magic Function: Converts the math AND adds the correct symbol automatically!
  const formatMoney = (amountInEur) => {
    const rate = rates[currency] || 1;
    const convertedAmount = amountInEur * rate;

    // Intl.NumberFormat is built into JavaScript and knows every currency symbol in the world
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    }).format(convertedAmount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatMoney }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);