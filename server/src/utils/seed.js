import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Chat from "../models/Chat.js";
import Document from "../models/Document.js";
import Filing from "../models/Filing.js";
import Invoice from "../models/Invoice.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

dotenv.config();

async function seed() {
  await connectDB();
  await Promise.all([
    User.deleteMany({}),
    Document.deleteMany({}),
    Filing.deleteMany({}),
    Invoice.deleteMany({}),
    Notification.deleteMany({}),
    Chat.deleteMany({})
  ]);

  const admin = await User.create({
    name: "Aarav Mehta",
    email: "admin@whitecircle.in",
    password: "Password123",
    role: "admin",
    phone: "9000000001"
  });

  const accountant = await User.create({
    name: "Nisha Rao",
    email: "ca@whitecircle.in",
    password: "Password123",
    role: "accountant",
    phone: "9000000002"
  });

  const client = await User.create({
    name: "Rohan Gupta",
    email: "client@whitecircle.in",
    password: "Password123",
    role: "client",
    phone: "9000000003",
    companyName: "Gupta Retail LLP",
    gstin: "27ABCDE1234F1Z5",
    assignedAccountant: accountant._id
  });

  await Filing.create([
    {
      client: client._id,
      accountant: accountant._id,
      type: "GST",
      period: "April 2026",
      dueDate: new Date("2026-05-20"),
      status: "In Process",
      notes: "Sales register received; purchase reconciliation pending."
    },
    {
      client: client._id,
      accountant: accountant._id,
      type: "ITR",
      period: "FY 2025-26",
      dueDate: new Date("2026-07-31"),
      status: "Pending"
    },
    {
      client: client._id,
      accountant: accountant._id,
      type: "TDS",
      period: "Q1 FY 2026-27",
      dueDate: new Date("2026-07-31"),
      status: "Filed",
      acknowledgementUrl: "/uploads/sample-tds-ack.pdf"
    }
  ]);

  await Document.create({
    client: client._id,
    uploadedBy: client._id,
    category: "GST",
    month: "April 2026",
    notes: "Sales invoices and purchase bills for monthly GST filing.",
    files: [{ originalName: "sales-register.xlsx", filename: "sample-sales-register.xlsx", path: "/uploads/sample-sales-register.xlsx", size: 42000 }]
  });

  await Invoice.create([
    {
      client: client._id,
      invoiceNumber: "WCG-2026-001",
      service: "GST Monthly Compliance",
      amount: 2999,
      tax: 540,
      status: "Due",
      dueDate: new Date("2026-05-15"),
      razorpayOrderId: "order_mock_001"
    },
    {
      client: client._id,
      invoiceNumber: "WCG-2026-002",
      service: "ITR Advisory",
      amount: 4999,
      tax: 900,
      status: "Paid",
      dueDate: new Date("2026-04-15"),
      paidAt: new Date("2026-04-10")
    }
  ]);

  await Notification.create([
    { user: client._id, title: "GST reminder", message: "GSTR-3B is due on 20 May 2026.", channel: "email", dueAt: new Date("2026-05-20") },
    { user: client._id, title: "Invoice due", message: "Invoice WCG-2026-001 is awaiting payment.", channel: "in-app" },
    { user: accountant._id, title: "Task assigned", message: "GST April 2026 filing assigned for Gupta Retail LLP.", channel: "in-app" }
  ]);

  await Chat.create({
    client: client._id,
    accountant: accountant._id,
    messages: [
      { sender: client._id, body: "I uploaded April invoices. Please confirm if anything else is needed." },
      { sender: accountant._id, body: "Received. Please add the purchase register too, and I will reconcile today." }
    ]
  });

  console.log("Seed complete");
  console.table([
    { role: "admin", email: admin.email, password: "Password123" },
    { role: "accountant", email: accountant.email, password: "Password123" },
    { role: "client", email: client.email, password: "Password123" }
  ]);

  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
