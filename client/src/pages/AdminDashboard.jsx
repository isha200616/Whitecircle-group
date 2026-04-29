import { useEffect, useState } from "react";
import { BarChart3, BellRing, FileStack, ListChecks, UsersRound } from "lucide-react";
import DashboardShell from "../components/DashboardShell.jsx";
import { Card, StatCard, StatusPill } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const fallback = {
  analytics: { clients: 1, accountants: 1, pendingFilings: 1, completedFilings: 1, revenueDue: 3539 },
  clients: [{ _id: "c1", name: "Rohan Gupta", companyName: "Gupta Retail LLP", assignedAccountant: { name: "Nisha Rao" } }],
  accountants: [{ _id: "a1", name: "Nisha Rao", email: "ca@whitecircle.in" }],
  documents: [{ _id: "d1", client: { name: "Rohan Gupta" }, category: "GST", month: "April 2026" }],
  filings: [{ _id: "f1", client: { name: "Rohan Gupta" }, accountant: { name: "Nisha Rao" }, type: "GST", period: "April 2026", status: "In Process" }],
  notifications: [{ _id: "n1", title: "GST reminder", message: "GSTR-3B due soon." }]
};

export default function AdminDashboard() {
  const { api } = useAuth();
  const [data, setData] = useState(fallback);

  useEffect(() => {
    api("/admin/dashboard").then(setData).catch(() => setData(fallback));
  }, [api]);

  return (
    <DashboardShell title="Admin Dashboard" subtitle="Manage clients, accountants, filings, analytics, proofs, and reminder controls." tabs={["Operations", "Analytics", "Reminders"]}>
      <div className="grid gap-5 md:grid-cols-5">
        <StatCard label="Clients" value={data.analytics.clients} icon={UsersRound} />
        <StatCard label="Accountants" value={data.analytics.accountants} icon={UsersRound} />
        <StatCard label="Pending" value={data.analytics.pendingFilings} icon={ListChecks} />
        <StatCard label="Completed" value={data.analytics.completedFilings} icon={BarChart3} tone="green" />
        <StatCard label="Revenue due" value={`₹${data.analytics.revenueDue}`} icon={FileStack} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <Card>
          <h2 className="mb-4 text-xl font-semibold text-navy">Manage clients</h2>
          <div className="space-y-3">
            {data.clients.map((client) => (
              <div key={client._id} className="rounded border border-slate-200 p-4">
                <p className="font-semibold">{client.name}</p>
                <p className="text-sm text-slate-500">{client.companyName || "Individual client"}</p>
                <p className="mt-2 text-xs text-slate-500">Assigned CA: {client.assignedAccountant?.name || "Unassigned"}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-semibold text-navy">Task assignment and filing proofs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500"><tr><th className="py-2">Client</th><th>Type</th><th>Period</th><th>Accountant</th><th>Status</th></tr></thead>
              <tbody>
                {data.filings.map((filing) => (
                  <tr key={filing._id} className="border-t border-slate-100">
                    <td className="py-3">{filing.client?.name}</td>
                    <td>{filing.type}</td>
                    <td>{filing.period}</td>
                    <td>{filing.accountant?.name || "Unassigned"}</td>
                    <td><StatusPill value={filing.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-xl font-semibold text-navy">Uploaded documents</h2>
          {data.documents.map((doc) => (
            <div key={doc._id} className="mb-3 flex items-center justify-between rounded bg-slate-50 p-4">
              <div><p className="font-semibold">{doc.client?.name}</p><p className="text-sm text-slate-500">{doc.category} · {doc.month}</p></div>
              <button className="rounded bg-navy px-3 py-2 text-sm font-semibold text-white">Review</button>
            </div>
          ))}
        </Card>
        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-navy"><BellRing className="text-mint" /> Reminder control</h2>
          {data.notifications.map((note) => (
            <div key={note._id} className="mb-3 rounded bg-slate-50 p-4">
              <p className="font-semibold">{note.title}</p>
              <p className="text-sm text-slate-600">{note.message}</p>
            </div>
          ))}
        </Card>
      </div>
    </DashboardShell>
  );
}
