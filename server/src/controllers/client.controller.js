import Chat from "../models/Chat.js";
import Document from "../models/Document.js";
import Filing from "../models/Filing.js";
import Invoice from "../models/Invoice.js";
import Notification from "../models/Notification.js";

export async function getClientDashboard(req, res) {
  const [filings, documents, invoices, notifications, chat] = await Promise.all([
    Filing.find({ client: req.user._id }).sort({ dueDate: 1 }).populate("accountant", "name email"),
    Document.find({ client: req.user._id }).sort({ createdAt: -1 }),
    Invoice.find({ client: req.user._id }).sort({ dueDate: 1 }),
    Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(8),
    Chat.findOne({ client: req.user._id }).populate("messages.sender", "name role")
  ]);

  const summary = {
    pending: filings.filter((item) => item.status === "Pending").length,
    inProcess: filings.filter((item) => item.status === "In Process").length,
    filed: filings.filter((item) => item.status === "Filed").length,
    unpaidInvoices: invoices.filter((item) => item.status !== "Paid").length
  };

  res.json({ summary, filings, documents, invoices, notifications, chat });
}

export async function uploadDocuments(req, res) {
  const files = (req.files || []).map((file) => ({
    originalName: file.originalname,
    filename: file.filename,
    mimetype: file.mimetype,
    size: file.size,
    path: `/uploads/${file.filename}`
  }));

  const document = await Document.create({
    client: req.user._id,
    uploadedBy: req.user._id,
    category: req.body.category,
    month: req.body.month,
    notes: req.body.notes,
    files
  });

  res.status(201).json(document);
}

export async function sendClientMessage(req, res) {
  let chat = await Chat.findOne({ client: req.user._id });
  if (!chat) {
    if (!req.user.assignedAccountant) return res.status(400).json({ message: "No accountant assigned yet" });
    chat = await Chat.create({ client: req.user._id, accountant: req.user.assignedAccountant, messages: [] });
  }

  chat.messages.push({ sender: req.user._id, body: req.body.body });
  await chat.save();
  await chat.populate("messages.sender", "name role");
  res.status(201).json(chat);
}

export async function payInvoice(req, res) {
  const invoice = await Invoice.findOneAndUpdate(
    { _id: req.params.id, client: req.user._id },
    { status: "Paid", paidAt: new Date(), razorpayOrderId: `order_mock_${Date.now()}` },
    { new: true }
  );

  if (!invoice) return res.status(404).json({ message: "Invoice not found" });
  res.json(invoice);
}
