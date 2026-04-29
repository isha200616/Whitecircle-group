export function Card({ children, className = "" }) {
  return <div className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

export function StatCard({ label, value, icon: Icon, tone = "navy" }) {
  const toneClass = tone === "green" ? "bg-green-50 text-green-700" : "bg-blue-50 text-navy";
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-navy">{value}</p>
        </div>
        {Icon && <span className={`rounded p-3 ${toneClass}`}><Icon size={22} /></span>}
      </div>
    </Card>
  );
}

export function StatusPill({ value }) {
  const map = {
    Pending: "bg-amber-50 text-amber-700",
    "In Process": "bg-blue-50 text-blue-700",
    Filed: "bg-green-50 text-green-700",
    Paid: "bg-green-50 text-green-700",
    Due: "bg-rose-50 text-rose-700"
  };
  return <span className={`rounded px-2.5 py-1 text-xs font-semibold ${map[value] || "bg-slate-100 text-slate-700"}`}>{value}</span>;
}
