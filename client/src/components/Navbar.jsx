import { Link, NavLink, useNavigate } from "react-router-dom";
import { CircleUserRound, LogOut, Menu, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const dashboardPath = user ? `/${user.role}` : "/login";
  const links = [
    ["Services", "/#services"],
    ["Pricing", "/#pricing"],
    ["FAQ", "/#faq"]
  ];

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-semibold text-navy">
          <span className="flex h-10 w-10 items-center justify-center rounded bg-navy text-white">
            <ShieldCheck size={21} />
          </span>
          <span>WhiteCircle Group</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="hover:text-navy">{label}</a>
          ))}
          <NavLink to={dashboardPath} className="hover:text-navy">Dashboard</NavLink>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm text-slate-700">
                <CircleUserRound size={17} /> {user.name}
              </span>
              <button onClick={handleLogout} className="rounded bg-navy px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-navy">Login</Link>
              <Link to="/register" className="rounded bg-mint px-4 py-2 text-sm font-semibold text-white shadow-sm">Get Started</Link>
            </>
          )}
        </div>
        <button className="rounded border border-slate-200 p-2 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Menu">
          <Menu size={22} />
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium">
            {links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
            <Link to={dashboardPath}>Dashboard</Link>
            {user ? <button className="text-left text-navy" onClick={handleLogout}>Logout</button> : <Link to="/login">Login</Link>}
          </div>
        </div>
      )}
    </header>
  );
}
