import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      enum: ["GST", "ITR", "TDS", "Company Registration", "Trademark", "Invoice", "Other"],
      required: true
    },
    month: String,
    notes: String,
    files: [
      {
        originalName: String,
        filename: String,
        mimetype: String,
        size: Number,
        path: String
      }
    ],
    storageProvider: { type: String, default: "WhiteCircle Secure Vault Mock" }
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);
