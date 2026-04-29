import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    service: { type: String, required: true },
    amount: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    status: { type: String, enum: ["Draft", "Due", "Paid", "Overdue"], default: "Due" },
    dueDate: Date,
    paidAt: Date,
    razorpayOrderId: String
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
