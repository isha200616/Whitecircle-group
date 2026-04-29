import {
  BarChart3,
  BellRing,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileCheck2,
  FileText,
  Landmark,
  LockKeyhole,
  MessageCircle,
  ReceiptIndianRupee,
  ShieldCheck,
  Sparkles,
  Stamp,
  UploadCloud
} from "lucide-react";

export const services = [
  { title: "GST Filing", icon: ReceiptIndianRupee, text: "Monthly GSTR-1, GSTR-3B, reconciliation, and notices." },
  { title: "ITR Filing", icon: FileText, text: "Salary, business, capital gains, and tax planning support." },
  { title: "TDS Filing", icon: Landmark, text: "Quarterly returns, challans, Form 16/16A, and corrections." },
  { title: "Company Registration", icon: Building2, text: "Private limited, LLP, OPC, and startup registrations." },
  { title: "Trademark", icon: Stamp, text: "Search, filing, objection replies, and brand protection." },
  { title: "Compliance Calendar", icon: CalendarDays, text: "Deadline planning for GST, TDS, ROC, PF, ESI, and ITR." }
];

export const features = [
  { title: "Auto reminders", icon: BellRing, text: "Smart email, SMS, and in-app nudges before every critical due date." },
  { title: "Secure storage", icon: LockKeyhole, text: "Organized document vault with category, month, and notes metadata." },
  { title: "CA support", icon: MessageCircle, text: "Dedicated accountant chat keeps every filing conversation auditable." },
  { title: "Status tracking", icon: CheckCircle2, text: "Know what is pending, in process, filed, or awaiting payment." }
];

export const pricing = [
  { name: "Starter", price: "₹1,499", tag: "For individuals", items: ["ITR filing", "Document vault", "Reminder alerts", "Email support"] },
  { name: "Growth", price: "₹4,999", tag: "For small businesses", featured: true, items: ["GST + TDS filing", "CA chat", "Invoice tracking", "GSTIN checks"] },
  { name: "Enterprise", price: "Custom", tag: "For multi-entity teams", items: ["Admin controls", "Accountant assignment", "Analytics", "Priority support"] }
];

export const testimonials = [
  { name: "Priya Nair", role: "Founder, BloomFoods", quote: "WhiteCircle gave us one clean place for documents, invoices, GST reminders, and CA communication." },
  { name: "Kunal Shah", role: "Director, Orbit Labs", quote: "The dashboard makes compliance feel controlled. Our team can see every filing status without chasing emails." },
  { name: "Meera Iyer", role: "Consultant", quote: "Their ITR workflow is fast, transparent, and easy to follow even during peak filing season." }
];

export const faq = [
  ["Can I upload multiple documents?", "Yes. Upload GST, ITR, TDS, invoice, and registration documents with month-wise categories."],
  ["Does the app support role-based dashboards?", "Yes. Clients, admins, and accountants get separate dashboards and protected API routes."],
  ["Is payment integration live?", "The code includes a Razorpay-style mock order field that can be replaced with live Razorpay APIs."],
  ["Can reminders be automated?", "The backend includes mock email/SMS/in-app notification services and seed reminders for deadlines."]
];

export const dashboardStats = [
  { label: "Filings tracked", value: "12.4k", icon: FileCheck2 },
  { label: "Documents stored", value: "82k", icon: UploadCloud },
  { label: "Businesses served", value: "4.8k", icon: BriefcaseBusiness },
  { label: "Compliance score", value: "98%", icon: BarChart3 }
];

export const quickHighlights = [
  { label: "Bank-grade access controls", icon: ShieldCheck },
  { label: "Smart compliance intelligence", icon: Sparkles },
  { label: "Deadline-first operations", icon: CalendarDays }
];
