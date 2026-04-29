import { useEffect, useState } from "react";
import { BarChart3, BellRing, FileStack, ListChecks, UsersRound } from "lucide-react";
import DashboardShell from "../components/DashboardShell.jsx";
import { Card, StatCard, StatusPill } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const fallback = {
  analytics: { clients: 1, accountants: 1, pendingFilings: 1, completedFilings: 1, revenueDue: 3539 },
  clients: [{ _id: "c1", name: "Rohan Gupta", companyName: "Gupta Retail LLP", assignedAccountant: { name: "Nisha Rao" } }],
  accountants: [{ _id: "a1", name: "Nisha Rao", email: "ca@whitecircle.in" }],
  documents: [{ _id: "d1", client: { name: "Rohan Gupta" }, category: "GST", month: "April 2026", notes: "Sales invoices" }],
  filings: [{ _id: "f1", client: { name: "Rohan Gupta" }, accountant: { name: "Nisha Rao" }, type: "GST", period: "April 2026", status: "In Process" }],
  notifications: [{ _id: "n1", title: "GST reminder", message: "GSTR-3B due soon." }]
};

export default function AdminDashboard() {
  const { api } = useAuth();
  const [data, setData] = useState(fallback);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [status, setStatus] = useState("");

  async function loadDashboard() {
    const fresh = await api("/admin/dashboard");
    setData(fresh);
  }

  useEffect(() => {
    loadDashboard().catch(() => setData(fallback));
  }, []);

  async function assignAccountant(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("Assigning accountant...");
    try {
      await api("/admin/assign-accountant", {
        method: "POST",
        body: JSON.stringify({ clientId: form.get("clientId"), accountantId: form.get("accountantId") })
      });
      await loadDashboard();
      setStatus("Accountant assigned.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function updateFiling(filingId, nextStatus) {
    setStatus("Updating filing...");
    try {
      await api(`/admin/filings/${filingId}`, { method: "PATCH", body: JSON.stringify({ status: nextStatus }) });
      await loadDashboard();
      setStatus("Filing updated.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function createReminder(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("Creating reminder...");
    try {
      await api("/admin/reminders", {
        method: "POST",
        body: JSON.stringify({
          user: form.get("user"),
          title: form.get("title"),
          message: form.get("message"),
          channel: form.get("channel")
        })
      });
      await loadDashboard();
      event.currentTarget.reset();
      setStatus("Reminder created.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <DashboardShell title="Admin Dashboard" subtitle="Manage clients, accountants, filings, analytics, proofs, and reminder controls." tabs={["Operations", "Analytics", "Reminders"]}>
      <div className="grid gap-5 md:grid-cols-5">
        <StatCard label="Clients" value={data.analytics.clients} icon={UsersRound} />
        <StatCard label="Accountants" value={data.analytics.accountants} icon={UsersRound} />
        <StatCard label="Pending" value={data.analytics.pendingFilings} icon={ListChecks} />
        <StatCard label="Completed" value={data.analytics.completedFilings} icon={BarChart3} tone="green" />
        <StatCard label="Revenue due" value={`Rs. ${data.analytics.revenueDue}`} icon={FileStack} />
      </div>

      {status && <p className="mt-5 rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">{status}</p>}

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
          <form onSubmit={assignAccountant} className="mt-5 grid gap-3">
            <select name="clientId" className="rounded border border-slate-300 px-3 py-3" required>
              {data.clients.map((client) => <option key={client._id} value={client._id}>{client.name}</option>)}
            </select>
            <select name="accountantId" className="rounded border border-slate-300 px-3 py-3" required>
              {data.accountants.map((accountant) => <option key={accountant._id} value={accountant._id}>{accountant.name}</option>)}
            </select>
            <button className="rounded bg-navy px-4 py-3 text-sm font-semibold text-white">Assign accountant</button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-semibold text-navy">Task assignment and filing proofs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500"><tr><th className="py-2">Client</th><th>Type</th><th>Period</th><th>Accountant</th><th>Status</th><th>Update</th></tr></thead>
              <tbody>
                {data.filings.map((filing) => (
                  <tr key={filing._id} className="border-t border-slate-100">
                    <td className="py-3">{filing.client?.name}</td>
                    <td>{filing.type}</td>
                    <td>{filing.period}</td>
                    <td>{filing.accountant?.name || "Unassigned"}</td>
                    <td><StatusPill value={filing.status} /></td>
                    <td>
                      <select className="rounded border border-slate-300 px-2 py-1" value={filing.status} onChange={(event) => updateFiling(filing._id, event.target.value)}>
                        {["Pending", "In Process", "Filed"].map((item) => <option key={item}>{item}</option>)}
                      </select>
                    </td>
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
            <div key={doc._id} className="mb-3 flex items-center justify-between gap-3 rounded bg-slate-50 p-4">
              <div><p className="font-semibold">{doc.client?.name}</p><p className="text-sm text-slate-500">{doc.category} - {doc.month}</p></div>
              <button onClick={() => setSelectedDocument(doc)} className="rounded bg-navy px-3 py-2 text-sm font-semibold text-white">Review</button>
            </div>
          ))}
          {selectedDocument && (
            <div className="mt-4 rounded border border-green-200 bg-green-50 p-4 text-sm">
              <p className="font-semibold text-navy">Reviewing {selectedDocument.category} document</p>
              <p className="mt-1 text-slate-600">Client: {selectedDocument.client?.name}</p>
              <p className="text-slate-600">Month: {selectedDocument.month || "Not provided"}</p>
              <p className="text-slate-600">Notes: {selectedDocument.notes || "No notes"}</p>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-navy"><BellRing className="text-mint" /> Reminder control</h2>
          <form onSubmit={createReminder} className="mb-5 grid gap-3">
            <select name="user" className="rounded border border-slate-300 px-3 py-3" required>
              {data.clients.map((client) => <option key={client._id} value={client._id}>{client.name}</option>)}
            </select>
            <input name="title" className="rounded border border-slate-300 px-3 py-3" placeholder="Reminder title" required />
            <textarea name="message" className="rounded border border-slate-300 px-3 py-3" placeholder="Reminder message" required />
            <select name="channel" className="rounded border border-slate-300 px-3 py-3">
              {["in-app", "email", "sms"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <button className="rounded bg-mint px-4 py-3 text-sm font-semibold text-white">Create reminder</button>
          </form>
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
