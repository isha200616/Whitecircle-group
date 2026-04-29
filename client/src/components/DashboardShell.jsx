import { LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardShell({ title, subtitle, tabs, children }) {
  const { user, logout } = useAuth();
  return (
    <main className="min-h-screen bg-mist">
      <section className="border-b border-slate-200 bg-navy text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-green-200"><ShieldCheck size={17} /> Secure workspace</div>
              <h1 className="text-3xl font-semibold">{title}</h1>
              <p className="mt-2 max-w-2xl text-slate-300">{subtitle}</p>
            </div>
            <button onClick={logout} className="flex items-center gap-2 rounded bg-white px-4 py-2 text-sm font-semibold text-navy">
              <LogOut size={16} /> Logout
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-slate-200">
            <span className="rounded bg-white/10 px-3 py-1">{user?.name}</span>
            <span className="rounded bg-white/10 px-3 py-1">{user?.role}</span>
            {tabs?.map((tab) => <span key={tab} className="rounded bg-white/10 px-3 py-1">{tab}</span>)}
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
    </main>
  );
}
