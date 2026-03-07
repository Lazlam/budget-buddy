import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, startOfMonth, subMonths } from "date-fns";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-lg">
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-sm font-semibold" style={{ color: p.color }}>{p.name}: €{p.value.toFixed(2)}</p>
      ))}
    </div>
  );
  return null;
};

export default function MonthlyTrend({ transactions }) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(now, 5 - i);
    return { start: startOfMonth(d), label: format(d, "MMM") };
  });
  const data = months.map(({ start, label }) => {
    const monthStr = format(start, "yyyy-MM");
    const monthTxs = transactions.filter((t) => t.date?.startsWith(monthStr));
    return {
      name: label,
      Income: monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
      Expenses: monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  });
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Expenses" fill="#6366f1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}