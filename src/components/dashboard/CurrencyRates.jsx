import React from "react";
import { useTranslation } from 'react-i18next';
import { useQuery } from "@tanstack/react-query";
import { Globe, Loader2, ArrowRight } from "lucide-react";

export default function CurrencyRates() {
  const { t } = useTranslation();

  // Fetch live rates from a free public API
  const { data, isLoading, isError } = useQuery({
    queryKey: ["exchangeRates"],
    queryFn: async () => {
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/EUR");
      if (!res.ok) throw new Error("Failed to fetch rates");
      return res.json();
    },
    refetchInterval: 600000, // Automatically refresh in the background every 10 minutes!
  });

  const targetCurrencies = ["USD", "GBP", "JPY", "AUD", "CAD"];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-50 rounded-xl">
          <Globe className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t("live_rates_title", "Live Exchange Rates")}</h2>
          <p className="text-xs text-gray-500">{t("live_rates_subtitle", "Base: 1 Euro (€)")}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
        </div>
      ) : isError ? (
        <div className="flex-1 flex items-center justify-center py-8 text-sm text-red-500 bg-red-50 rounded-xl">
          {t("rates_error", "Could not load exchange rates.")}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {targetCurrencies.map(currency => (
            <div key={currency} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">€1</span>
                <ArrowRight className="w-3 h-3 text-gray-400" />
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">
                  {/* JPY doesn't use decimals, the others get 4 decimals for accuracy */}
                  {data?.rates[currency]?.toFixed(currency === 'JPY' ? 2 : 4)}
                </span>
                <span className="text-xs font-medium text-gray-500 ml-1">{currency}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}