import Document from "../models/Document.js";
import Filing from "../models/Filing.js";
import Invoice from "../models/Invoice.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { createNotification } from "../services/notification.service.js";

export async function getAdminDashboard(_req, res) {
  const [clients, accountants, documents, filings, invoices, notifications] = await Promise.all([
    User.find({ role: "client" }).select("-password").populate("assignedAccountant", "name email"),
    User.find({ role: "accountant" }).select("-password"),
    Document.find().sort({ createdAt: -1 }).limit(20).populate("client uploadedBy", "name email companyName"),
    Filing.find().sort({ dueDate: 1 }).populate("client accountant", "name email companyName"),
    Invoice.find().sort({ dueDate: 1 }).populate("client", "name companyName"),
    Notification.find().sort({ createdAt: -1 }).limit(20).populate("user", "name email role")
  ]);

  const analytics = {
    clients: clients.length,
    accountants: accountants.length,
    pendingFilings: filings.filter((filing) => filing.status === "Pending").length,
    completedFilings: filings.filter((filing) => filing.status === "Filed").length,
    revenueDue: invoices.filter((invoice) => invoice.status !== "Paid").reduce((sum, invoice) => sum + invoice.amount + invoice.tax, 0)
  };

  res.json({ analytics, clients, accountants, documents, filings, invoices, notifications });
}

export async function assignAccountant(req, res) {
  const { clientId, accountantId } = req.body;
  const [client, accountant] = await Promise.all([
    User.findById(clientId),
    User.findOne({ _id: accountantId, role: "accountant" })
  ]);
  if (!client || !accountant) return res.status(404).json({ message: "Client or accountant not found" });

  client.assignedAccountant = accountant._id;
  await client.save();
  res.json({ message: "Accountant assigned", client });
}

export async function createFiling(req, res) {
  const filing = await Filing.create(req.body);
  await createNotification({
    user: filing.client,
    title: `${filing.type} filing created`,
    message: `${filing.type} for ${filing.period} is now tracked in your dashboard.`
  });
  res.status(201).json(filing);
}

export async function updateFiling(req, res) {
  const filing = await Filing.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!filing) return res.status(404).json({ message: "Filing not found" });
  res.json(filing);
}

export async function createReminder(req, res) {
  const notification = await createNotification(req.body);
  res.status(201).json(notification);
}
