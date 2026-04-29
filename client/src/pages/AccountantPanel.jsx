import { useEffect, useState } from "react";
import { FileCheck2, FolderOpen, MessageCircle, UsersRound } from "lucide-react";
import DashboardShell from "../components/DashboardShell.jsx";
import { Card, StatCard, StatusPill } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const fallback = {
  clients: [{ _id: "c1", name: "Rohan Gupta", companyName: "Gupta Retail LLP" }],
  documents: [{ _id: "d1", client: { name: "Rohan Gupta" }, category: "GST", month: "April 2026", notes: "Sales invoices and register" }],
  filings: [{ _id: "f1", client: { name: "Rohan Gupta" }, type: "GST", period: "April 2026", status: "In Process" }],
  chats: [{ _id: "ch1", client: { name: "Rohan Gupta" }, messages: [{ sender: { name: "Rohan Gupta" }, body: "I uploaded April invoices." }] }]
};

export default function AccountantPanel() {
  const { api } = useAuth();
  const [data, setData] = useState(fallback);
  const [status, setStatus] = useState("");
  const [replyByChat, setReplyByChat] = useState({});

  async function loadPanel() {
    const fresh = await api("/accountant/dashboard");
    setData(fresh);
  }

  useEffect(() => {
    loadPanel().catch(() => setData(fallback));
  }, []);

  async function updateStatus(filingId, nextStatus) {
    setStatus("Updating filing...");
    try {
      await api(`/accountant/filings/${filingId}`, { method: "PATCH", body: JSON.stringify({ status: nextStatus }) });
      await loadPanel();
      setStatus("Filing status updated.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function uploadAck(event, filingId) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("Uploading acknowledgement...");
    try {
      await api(`/accountant/filings/${filingId}/acknowledgement`, { method: "POST", body: form });
      await loadPanel();
      event.currentTarget.reset();
      setStatus("Acknowledgement uploaded and filing marked filed.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function sendReply(event, chatId) {
    event.preventDefault();
    const body = (replyByChat[chatId] || "").trim();
    if (!body) return;

    setStatus("Sending reply...");
    try {
      await api(`/accountant/chats/${chatId}`, { method: "POST", body: JSON.stringify({ body }) });
      setReplyByChat((current) => ({ ...current, [chatId]: "" }));
      await loadPanel();
      setStatus("Reply sent.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <DashboardShell title="Accountant Panel" subtitle="Access assigned clients, review files, update statuses, and upload acknowledgements." tabs={["Assigned clients", "Filing queue", "Proofs"]}>
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Assigned clients" value={data.clients.length} icon={UsersRound} />
        <StatCard label="Documents" value={data.documents.length} icon={FolderOpen} />
        <StatCard label="Open filings" value={data.filings.filter((item) => item.status !== "Filed").length} icon={FileCheck2} />
        <StatCard label="Chats" value={data.chats.length} icon={MessageCircle} tone="green" />
      </div>

      {status && <p className="mt-5 rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">{status}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <Card>
          <h2 className="mb-4 text-xl font-semibold text-navy">Assigned clients</h2>
          {data.clients.map((client) => (
            <div key={client._id} className="mb-3 rounded border border-slate-200 p-4">
              <p className="font-semibold">{client.name}</p>
              <p className="text-sm text-slate-500">{client.companyName}</p>
            </div>
          ))}
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-semibold text-navy">Filing status queue</h2>
          <div className="space-y-4">
            {data.filings.map((filing) => (
              <div key={filing._id} className="rounded border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{filing.client?.name} - {filing.type}</p>
                    <p className="text-sm text-slate-500">{filing.period}</p>
                  </div>
                  <StatusPill value={filing.status} />
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1.4fr]">
                  <select className="rounded border border-slate-300 px-3 py-2" value={filing.status} onChange={(event) => updateStatus(filing._id, event.target.value)}>
                    {["Pending", "In Process", "Filed"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                  <form onSubmit={(event) => uploadAck(event, filing._id)} className="flex flex-wrap gap-2">
                    <input name="acknowledgement" type="file" className="min-w-0 flex-1 rounded border border-slate-300 px-3 py-2 text-sm" />
                    <button className="rounded bg-navy px-3 py-2 text-xs font-semibold text-white">Upload ack</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-xl font-semibold text-navy">Uploaded files</h2>
          {data.documents.map((doc) => (
            <div key={doc._id} className="mb-3 rounded bg-slate-50 p-4">
              <p className="font-semibold">{doc.client?.name} - {doc.category}</p>
              <p className="text-sm text-slate-600">{doc.month} - {doc.notes}</p>
              <p className="mt-2 text-xs text-slate-500">{doc.files?.length || 0} file(s) available</p>
            </div>
          ))}
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-semibold text-navy">Client chat</h2>
          {data.chats.map((chat) => (
            <div key={chat._id} className="mb-4 rounded bg-slate-50 p-4">
              <p className="mb-2 text-sm font-semibold text-slate-500">{chat.client?.name}</p>
              <div className="mb-3 max-h-40 space-y-2 overflow-y-auto">
                {chat.messages.slice(-4).map((message, index) => (
                  <p key={index} className="rounded bg-white px-3 py-2 text-sm">{message.sender?.name || "Team"}: {message.body}</p>
                ))}
              </div>
              <form onSubmit={(event) => sendReply(event, chat._id)} className="flex gap-2">
                <input
                  className="min-w-0 flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Reply to client"
                  value={replyByChat[chat._id] || ""}
                  onChange={(event) => setReplyByChat((current) => ({ ...current, [chat._id]: event.target.value }))}
                />
                <button className="rounded bg-mint px-3 py-2 text-sm font-semibold text-white">Send</button>
              </form>
            </div>
          ))}
        </Card>
      </div>
    </DashboardShell>
  );
}
