import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="mb-4 flex items-center gap-2 font-semibold">
            <ShieldCheck /> WhiteCircle Group
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-300">
            A secure professional platform for tax filing, compliance operations, accountant collaboration, and deadline-first business governance.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Services</h3>
          <p className="space-y-2 text-sm text-slate-300">GST Filing<br />ITR Filing<br />TDS Filing<br />Company Registration</p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Contact</h3>
          <p className="space-y-2 text-sm text-slate-300">support@whitecircle.in<br />+91 90000 00000<br />Mumbai, Bengaluru, Delhi NCR</p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-slate-400">
        © 2026 WhiteCircle Group. Built for secure compliance teams.
      </div>
    </footer>
  );
}
