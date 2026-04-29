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

  useEffect(() => {
    api("/accountant/dashboard").then(setData).catch(() => setData(fallback));
  }, [api]);

  return (
    <DashboardShell title="Accountant Panel" subtitle="Access assigned clients, review files, update statuses, and upload acknowledgements." tabs={["Assigned clients", "Filing queue", "Proofs"]}>
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Assigned clients" value={data.clients.length} icon={UsersRound} />
        <StatCard label="Documents" value={data.documents.length} icon={FolderOpen} />
        <StatCard label="Open filings" value={data.filings.filter((item) => item.status !== "Filed").length} icon={FileCheck2} />
        <StatCard label="Chats" value={data.chats.length} icon={MessageCircle} tone="green" />
      </div>

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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500"><tr><th className="py-2">Client</th><th>Type</th><th>Period</th><th>Status</th><th>Proof</th></tr></thead>
              <tbody>
                {data.filings.map((filing) => (
                  <tr key={filing._id} className="border-t border-slate-100">
                    <td className="py-3">{filing.client?.name}</td>
                    <td>{filing.type}</td>
                    <td>{filing.period}</td>
                    <td><StatusPill value={filing.status} /></td>
                    <td><button className="rounded bg-navy px-3 py-2 text-xs font-semibold text-white">Upload ack</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-xl font-semibold text-navy">Uploaded files</h2>
          {data.documents.map((doc) => (
            <div key={doc._id} className="mb-3 rounded bg-slate-50 p-4">
              <p className="font-semibold">{doc.client?.name} · {doc.category}</p>
              <p className="text-sm text-slate-600">{doc.month} · {doc.notes}</p>
            </div>
          ))}
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-semibold text-navy">Client chat</h2>
          {data.chats.map((chat) => (
            <div key={chat._id} className="mb-3 rounded bg-slate-50 p-4">
              <p className="mb-2 text-sm font-semibold text-slate-500">{chat.client?.name}</p>
              {chat.messages.slice(-2).map((message, index) => <p key={index}>{message.body}</p>)}
            </div>
          ))}
        </Card>
      </div>
    </DashboardShell>
  );
}
