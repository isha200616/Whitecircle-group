import Chat from "../models/Chat.js";
import Document from "../models/Document.js";
import Filing from "../models/Filing.js";
import User from "../models/User.js";

export async function getAccountantPanel(req, res) {
  const clients = await User.find({ role: "client", assignedAccountant: req.user._id }).select("-password");
  const clientIds = clients.map((client) => client._id);
  const [documents, filings, chats] = await Promise.all([
    Document.find({ client: { $in: clientIds } }).sort({ createdAt: -1 }).populate("client", "name companyName"),
    Filing.find({ accountant: req.user._id }).sort({ dueDate: 1 }).populate("client", "name companyName"),
    Chat.find({ accountant: req.user._id }).populate("client", "name companyName").populate("messages.sender", "name role")
  ]);

  res.json({ clients, documents, filings, chats });
}

export async function updateAssignedFiling(req, res) {
  const filing = await Filing.findOneAndUpdate(
    { _id: req.params.id, accountant: req.user._id },
    req.body,
    { new: true }
  );
  if (!filing) return res.status(404).json({ message: "Assigned filing not found" });
  res.json(filing);
}

export async function uploadAcknowledgement(req, res) {
  const file = req.file;
  const filing = await Filing.findOneAndUpdate(
    { _id: req.params.id, accountant: req.user._id },
    {
      status: "Filed",
      acknowledgementUrl: file ? `/uploads/${file.filename}` : req.body.acknowledgementUrl,
      proofUploadedBy: req.user._id
    },
    { new: true }
  );
  if (!filing) return res.status(404).json({ message: "Assigned filing not found" });
  res.json(filing);
}
