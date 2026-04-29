import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Auth({ mode }) {
  const isRegister = mode === "register";
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: isRegister ? "" : "client@whitecircle.in",
    password: "Password123",
    phone: "",
    companyName: "",
    gstin: ""
  });

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      const user = isRegister ? await register(form) : await login({ email: form.email, password: form.password });
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="min-h-screen bg-mist px-4 py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-lg bg-white shadow-soft md:grid-cols-[.9fr_1.1fr]">
        <section className="bg-navy p-8 text-white">
          <ShieldCheck className="mb-6 text-green-300" size={42} />
          <h1 className="text-3xl font-semibold">{isRegister ? "Create your compliance workspace" : "Welcome back to WhiteCircle"}</h1>
          <p className="mt-4 leading-7 text-slate-300">Use the seeded demo credentials after running the seed command: admin@whitecircle.in, ca@whitecircle.in, or client@whitecircle.in with Password123.</p>
        </section>
        <form onSubmit={submit} className="grid gap-4 p-8">
          {isRegister && (
            <>
              <input className="rounded border border-slate-300 px-4 py-3" name="name" placeholder="Full name" value={form.name} onChange={update} required />
              <input className="rounded border border-slate-300 px-4 py-3" name="companyName" placeholder="Company name" value={form.companyName} onChange={update} />
              <input className="rounded border border-slate-300 px-4 py-3" name="phone" placeholder="Phone" value={form.phone} onChange={update} />
              <input className="rounded border border-slate-300 px-4 py-3" name="gstin" placeholder="GSTIN" value={form.gstin} onChange={update} />
            </>
          )}
          <input className="rounded border border-slate-300 px-4 py-3" name="email" type="email" placeholder="Email" value={form.email} onChange={update} required />
          <input className="rounded border border-slate-300 px-4 py-3" name="password" type="password" placeholder="Password" value={form.password} onChange={update} required />
          {error && <p className="rounded bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <button className="rounded bg-mint px-5 py-3 font-semibold text-white">{isRegister ? "Register" : "Login"}</button>
          <p className="text-sm text-slate-600">
            {isRegister ? "Already registered?" : "New to WhiteCircle?"}{" "}
            <Link className="font-semibold text-navy" to={isRegister ? "/login" : "/register"}>{isRegister ? "Login" : "Create account"}</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
