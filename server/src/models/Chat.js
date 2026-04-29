import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    accountant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    messages: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        body: { type: String, required: true },
        attachments: [String],
        readAt: Date,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
