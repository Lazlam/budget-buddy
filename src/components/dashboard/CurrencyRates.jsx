import React from "react";
import { useTranslation } from 'react-i18next';
import { useQuery } from "@tanstack/react-query";
import { Globe, Loader2, ArrowRight } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

export default function CurrencyRates() {
  const { t } = useTranslation();
  const { formatMoney } = useCurrency();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["exchangeRates"],
    queryFn: async () => {
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/EUR");
      if (!res.ok) throw new Error("Failed to fetch rates");
      return res.json();
    },
    refetchInterval: 600000,
  });

  const targetCurrencies = ["USD", "GBP", "JPY", "AUD", "CAD"];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm h-full flex flex-col transition-colors duration-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
          <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("live_rates_title", "Live Exchange Rates")}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t("live_rates_subtitle", "Base: 1 Euro (€)")}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-spin" />
        </div>
      ) : isError ? (
        <div className="flex-1 flex items-center justify-center py-8 text-sm text-red-500 bg-red-50 dark:bg-red-500/10 rounded-xl">
          {t("rates_error", "Could not load exchange rates.")}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {targetCurrencies.map(currency => (
            <div key={currency} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-500/50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">€1</span>
                <ArrowRight className="w-3 h-3 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {data?.rates[currency]?.toFixed(currency === 'JPY' ? 2 : 4)}
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">{currency}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}