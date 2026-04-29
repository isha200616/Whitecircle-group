import { useEffect, useState } from "react";
import { BellRing, CalendarDays, CreditCard, FileCheck2, MessageCircle, UploadCloud } from "lucide-react";
import DashboardShell from "../components/DashboardShell.jsx";
import { Card, StatCard, StatusPill } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");

const fallback = {
  summary: { pending: 1, inProcess: 1, filed: 1, unpaidInvoices: 1 },
  filings: [
    { _id: "1", type: "GST", period: "April 2026", dueDate: "2026-05-20", status: "In Process", acknowledgementUrl: "" },
    { _id: "2", type: "ITR", period: "FY 2025-26", dueDate: "2026-07-31", status: "Pending", acknowledgementUrl: "" },
    { _id: "3", type: "TDS", period: "Q1 FY 2026-27", dueDate: "2026-07-31", status: "Filed", acknowledgementUrl: "/uploads/sample-tds-ack.pdf" }
  ],
  documents: [{ _id: "d1", category: "GST", month: "April 2026", notes: "Sales register and invoices", files: [{ originalName: "sales-register.xlsx" }] }],
  invoices: [{ _id: "i1", invoiceNumber: "WCG-2026-001", service: "GST Monthly Compliance", amount: 2999, tax: 540, status: "Due" }],
  notifications: [{ _id: "n1", title: "GST reminder", message: "GSTR-3B is due on 20 May 2026." }],
  chat: { messages: [{ sender: { name: "Nisha Rao", role: "accountant" }, body: "Please upload the purchase register for April." }] }
};

export default function ClientDashboard() {
  const { api } = useAuth();
  const [data, setData] = useState(fallback);
  const [uploadStatus, setUploadStatus] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatStatus, setChatStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentInvoice, setPaymentInvoice] = useState(null);

  useEffect(() => {
    api("/client/dashboard").then(setData).catch(() => setData(fallback));
  }, [api]);

  async function upload(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setUploadStatus("Uploading...");
    try {
      await api("/client/documents", { method: "POST", body: form });
      const fresh = await api("/client/dashboard");
      setData(fresh);
      setUploadStatus("Documents uploaded to secure vault.");
      event.currentTarget.reset();
    } catch (error) {
      setUploadStatus(error.message);
    }
  }

  async function payInvoice(invoiceId) {
    setPaymentStatus("Confirming mock payment...");
    try {
      const paidInvoice = await api(`/client/invoices/${invoiceId}/pay`, { method: "PATCH" });
      setData((current) => ({
        ...current,
        summary: {
          ...current.summary,
          unpaidInvoices: Math.max(0, current.summary.unpaidInvoices - 1)
        },
        invoices: current.invoices.map((invoice) => (invoice._id === paidInvoice._id ? paidInvoice : invoice))
      }));
      setPaymentInvoice(null);
      setPaymentStatus("Payment marked as paid.");
    } catch (error) {
      setPaymentStatus(error.message);
    }
  }

  async function sendMessage(event) {
    event.preventDefault();
    const body = chatMessage.trim();
    if (!body) return;

    setChatStatus("Sending...");
    try {
      const chat = await api("/client/chat", { method: "POST", body: JSON.stringify({ body }) });
      setData((current) => ({ ...current, chat }));
      setChatMessage("");
      setChatStatus("Message sent.");
    } catch (error) {
      setChatStatus(error.message);
    }
  }

  return (
    <DashboardShell title="Client Dashboard" subtitle="Track filings, upload documents, pay invoices, and chat with your accountant." tabs={["GST", "ITR", "TDS"]}>
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Pending filings" value={data.summary.pending} icon={CalendarDays} />
        <StatCard label="In process" value={data.summary.inProcess} icon={FileCheck2} />
        <StatCard label="Filed" value={data.summary.filed} icon={FileCheck2} tone="green" />
        <StatCard label="Unpaid invoices" value={data.summary.unpaidInvoices} icon={CreditCard} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-navy"><UploadCloud className="text-mint" /> Upload documents</h2>
          <form onSubmit={upload} className="grid gap-3 md:grid-cols-2">
            <select name="category" className="rounded border border-slate-300 px-3 py-3" required>
              {["GST", "ITR", "TDS", "Company Registration", "Trademark", "Invoice", "Other"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <input name="month" className="rounded border border-slate-300 px-3 py-3" placeholder="Month or period" />
            <textarea name="notes" className="rounded border border-slate-300 px-3 py-3 md:col-span-2" placeholder="Notes for accountant" />
            <input name="files" className="rounded border border-dashed border-slate-300 px-3 py-3 md:col-span-2" type="file" multiple />
            <button className="rounded bg-mint px-4 py-3 font-semibold text-white md:w-fit">Upload files</button>
            {uploadStatus && <p className="self-center text-sm text-slate-600">{uploadStatus}</p>}
          </form>
        </Card>

        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-navy"><BellRing className="text-mint" /> Reminders</h2>
          <div className="space-y-3">
            {data.notifications.map((note) => (
              <div key={note._id} className="rounded bg-slate-50 p-3">
                <p className="font-semibold text-navy">{note.title}</p>
                <p className="text-sm text-slate-600">{note.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-xl font-semibold text-navy">Filing history</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500"><tr><th className="py-2">Type</th><th>Period</th><th>Due date</th><th>Status</th><th>Ack</th></tr></thead>
              <tbody>
                {data.filings.map((filing) => (
                  <tr key={filing._id} className="border-t border-slate-100">
                    <td className="py-3 font-semibold">{filing.type}</td>
                    <td>{filing.period}</td>
                    <td>{new Date(filing.dueDate).toLocaleDateString()}</td>
                    <td><StatusPill value={filing.status} /></td>
                    <td>
                      {filing.acknowledgementUrl ? (
                        <a className="text-mint" href={`${API_BASE}${filing.acknowledgementUrl}`} target="_blank" rel="noreferrer">Download</a>
                      ) : "Pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-semibold text-navy">Invoices and payments</h2>
          <div className="space-y-3">
            {data.invoices.map((invoice) => (
              <div key={invoice._id} className="flex items-center justify-between rounded bg-slate-50 p-4">
                <div><p className="font-semibold">{invoice.invoiceNumber}</p><p className="text-sm text-slate-500">{invoice.service}</p></div>
                <div className="text-right">
                  <p className="font-semibold">Rs. {invoice.amount + invoice.tax}</p>
                  <StatusPill value={invoice.status} />
                  {invoice.status !== "Paid" && (
                    <button onClick={() => setPaymentInvoice(invoice)} className="mt-2 rounded bg-mint px-3 py-1.5 text-xs font-semibold text-white">
                      Pay now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {paymentStatus && <p className="mt-3 text-sm text-slate-600">{paymentStatus}</p>}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-xl font-semibold text-navy">Secure cloud storage</h2>
          {data.documents.map((doc) => (
            <div key={doc._id} className="mb-3 rounded border border-slate-200 p-4">
              <p className="font-semibold">{doc.category} - {doc.month}</p>
              <p className="text-sm text-slate-600">{doc.notes}</p>
              <p className="mt-2 text-xs text-slate-500">{doc.files?.length || 0} file(s)</p>
            </div>
          ))}
        </Card>
        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-navy"><MessageCircle className="text-mint" /> CA support chat</h2>
          <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
            {data.chat?.messages?.map((message, index) => (
              <div key={index} className="rounded bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-500">{message.sender?.name || "Team"}</p>
                <p>{message.body}</p>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="mt-4 grid gap-3">
            <textarea
              className="min-h-24 rounded border border-slate-300 px-3 py-3 text-sm outline-none focus:border-mint"
              placeholder="Type your message for the accountant"
              value={chatMessage}
              onChange={(event) => setChatMessage(event.target.value)}
            />
            <div className="flex flex-wrap items-center gap-3">
              <button className="rounded bg-navy px-4 py-2 text-sm font-semibold text-white" type="submit">
                Send message
              </button>
              {chatStatus && <p className="text-sm text-slate-600">{chatStatus}</p>}
            </div>
          </form>
        </Card>
      </div>

      {paymentInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 px-4 py-6">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase text-mint">Mock QR payment</p>
                <h2 className="mt-1 text-2xl font-semibold text-navy">{paymentInvoice.invoiceNumber}</h2>
                <p className="mt-1 text-sm text-slate-500">{paymentInvoice.service}</p>
              </div>
              <button onClick={() => setPaymentInvoice(null)} className="rounded border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600">
                Close
              </button>
            </div>

            <div className="mx-auto mt-6 w-full max-w-xs overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-2">
              <img
                src="/upi-payment-qr.jpeg"
                alt="UPI payment QR for Ishani Dutta"
                className="h-auto w-full rounded bg-white object-contain"
              />
            </div>

            <div className="mt-5 rounded bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-navy">Scan and pay</p>
              <p className="mt-1">Amount: Rs. {paymentInvoice.amount + paymentInvoice.tax}</p>
              <p className="mt-1">UPI ID: idutta795@okicici</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={() => payInvoice(paymentInvoice._id)} className="rounded bg-mint px-4 py-3 text-sm font-semibold text-white">
                I have paid
              </button>
              <button onClick={() => setPaymentInvoice(null)} className="rounded border border-slate-300 px-4 py-3 text-sm font-semibold text-navy">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
