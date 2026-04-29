import { useEffect, useState } from "react";
import { BellRing, CalendarDays, CreditCard, FileCheck2, MessageCircle, UploadCloud } from "lucide-react";
import DashboardShell from "../components/DashboardShell.jsx";
import { Card, StatCard, StatusPill } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";

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

  useEffect(() => {
    api("/client/dashboard").then(setData).catch(() => setData(fallback));
  }, [api]);

  async function upload(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setUploadStatus("Uploading...");
    try {
      await api("/client/documents", { method: "POST", body: form });
      setUploadStatus("Documents uploaded to secure vault.");
    } catch (error) {
      setUploadStatus(error.message);
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
                    <td>{filing.acknowledgementUrl ? <a className="text-mint" href={filing.acknowledgementUrl}>Download</a> : "Pending"}</td>
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
                <div className="text-right"><p className="font-semibold">₹{invoice.amount + invoice.tax}</p><StatusPill value={invoice.status} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-xl font-semibold text-navy">Secure cloud storage</h2>
          {data.documents.map((doc) => (
            <div key={doc._id} className="mb-3 rounded border border-slate-200 p-4">
              <p className="font-semibold">{doc.category} · {doc.month}</p>
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
    </DashboardShell>
  );
}
