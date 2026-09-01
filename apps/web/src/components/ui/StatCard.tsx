interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
}

export default function StatCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon,
}: StatCardProps) {
  const changeColors = {
    positive: "text-green-600",
    negative: "text-red-500",
    neutral: "text-warm-gray-light",
  };

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium tracking-widest text-warm-gray-light uppercase">
          {label}
        </span>
        {icon && <span className="text-warm-gray-light">{icon}</span>}
      </div>
      <div className="text-3xl font-serif font-bold text-navy">{value}</div>
      {change && (
        <p className={`text-sm mt-2 ${changeColors[changeType]}`}>{change}</p>
      )}
    </div>
  );
}
