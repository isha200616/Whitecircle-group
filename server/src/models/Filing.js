import mongoose from "mongoose";

const filingSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    accountant: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["GST", "ITR", "TDS", "ROC", "Trademark"], required: true },
    period: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["Pending", "In Process", "Filed"], default: "Pending" },
    acknowledgementUrl: String,
    proofUploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notes: String
  },
  { timestamps: true }
);

export default mongoose.model("Filing", filingSchema);
