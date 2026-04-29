import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  MessageCircle,
  PlayCircle,
  UploadCloud
} from "lucide-react";
import { useState } from "react";
import Footer from "../components/Footer.jsx";
import { dashboardStats, faq, features, pricing, quickHighlights, services, testimonials } from "../data/content.js";

export default function Home() {
  const [active, setActive] = useState(0);
  const testimonial = testimonials[active];

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 dashboard-grid opacity-70" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-20">
          <div className="animate-fadeUp">
            <div className="mb-5 inline-flex items-center gap-2 rounded bg-white/10 px-3 py-2 text-sm text-green-100">
              <PlayCircle size={17} /> Live compliance operations for Indian businesses
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              India’s Most Trusted Tax & Compliance Platform
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              WhiteCircle Group brings GST, ITR, TDS, registrations, document vaults, CA support, reminders, invoices, and filing proofs into one secure workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="flex items-center gap-2 rounded bg-mint px-5 py-3 font-semibold text-white shadow-lg shadow-green-950/20">
                Get Started <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="rounded border border-white/30 px-5 py-3 font-semibold text-white">Login</Link>
              <a href="#pricing" className="rounded bg-white px-5 py-3 font-semibold text-navy">Book Consultation</a>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {quickHighlights.map(({ label, icon: Icon }) => (
                <span key={label} className="flex items-center gap-2 rounded bg-white/10 px-3 py-2 text-sm text-slate-200">
                  <Icon size={16} /> {label}
                </span>
              ))}
            </div>
          </div>
          <div className="glass animate-float rounded-lg p-4 text-ink shadow-soft">
            <div className="rounded-lg bg-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Compliance command center</p>
                  <h2 className="text-xl font-semibold text-navy">April Filing Snapshot</h2>
                </div>
                <span className="rounded bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">98% on track</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {dashboardStats.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded border border-slate-200 p-4">
                    <Icon className="mb-3 text-mint" size={22} />
                    <p className="text-2xl font-semibold text-navy">{value}</p>
                    <p className="text-sm text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-3">
                {["GST April 2026", "ITR FY 2025-26", "TDS Q1 FY 2026-27"].map((item, index) => (
                  <div key={item} className="flex items-center justify-between rounded bg-slate-50 px-4 py-3">
                    <span className="font-medium">{item}</span>
                    <span className={index === 2 ? "text-green-700" : "text-blue-700"}>{index === 2 ? "Filed" : "In Process"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="bg-mist py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-mint">Services</p>
            <h2 className="mt-2 text-3xl font-semibold text-navy">Tax and compliance workflows, handled end to end</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map(({ title, text, icon: Icon }) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
                <Icon className="mb-5 text-mint" size={28} />
                <h3 className="text-lg font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-mint">Dashboard Preview</p>
            <h2 className="mt-2 text-3xl font-semibold text-navy">Every stakeholder gets the right control surface</h2>
            <p className="mt-4 leading-7 text-slate-600">Clients upload and track. Accountants process and file. Admins assign, monitor, and control reminders across the whole practice.</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {[["Upload", UploadCloud], ["File", FileText], ["Chat", MessageCircle]].map(([label, Icon]) => (
                <div key={label} className="rounded bg-white p-4 text-center shadow-sm">
                  <Icon className="mx-auto mb-3 text-mint" />
                  <p className="font-semibold text-navy">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 h-36 rounded bg-white p-4 shadow-sm">
              <div className="h-3 w-1/2 rounded bg-slate-200" />
              <div className="mt-5 grid gap-3">
                <div className="h-3 rounded bg-green-100" />
                <div className="h-3 w-4/5 rounded bg-blue-100" />
                <div className="h-3 w-3/5 rounded bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold">Built for deadline-first compliance</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map(({ title, text, icon: Icon }) => (
              <div key={title} className="rounded-lg border border-white/10 bg-white/5 p-5">
                <Icon className="mb-4 text-green-300" />
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-mist py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-navy">Transparent plans for every compliance stage</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {pricing.map((plan) => (
              <div key={plan.name} className={`rounded-lg border p-6 shadow-sm ${plan.featured ? "border-mint bg-white shadow-soft" : "border-slate-200 bg-white"}`}>
                <p className="text-sm font-semibold text-mint">{plan.tag}</p>
                <h3 className="mt-2 text-2xl font-semibold text-navy">{plan.name}</h3>
                <p className="mt-3 text-3xl font-bold text-navy">{plan.price}</p>
                <div className="mt-6 space-y-3">
                  {plan.items.map((item) => (
                    <p key={item} className="flex items-center gap-2 text-sm text-slate-600"><Check className="text-mint" size={17} /> {item}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-mint">Testimonials</p>
          <blockquote className="mt-4 text-2xl font-medium leading-10 text-navy">“{testimonial.quote}”</blockquote>
          <p className="mt-5 font-semibold">{testimonial.name}</p>
          <p className="text-sm text-slate-500">{testimonial.role}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button className="rounded border border-slate-200 p-2" onClick={() => setActive((active + testimonials.length - 1) % testimonials.length)} aria-label="Previous testimonial"><ChevronLeft /></button>
            <button className="rounded border border-slate-200 p-2" onClick={() => setActive((active + 1) % testimonials.length)} aria-label="Next testimonial"><ChevronRight /></button>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-mist py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-semibold text-navy">FAQ</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {faq.map(([question, answer]) => (
              <div key={question} className="rounded-lg border border-slate-200 bg-white p-5">
                <h3 className="font-semibold text-navy">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
