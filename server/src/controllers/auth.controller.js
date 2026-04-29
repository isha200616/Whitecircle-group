import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateDeadlineReminders } from "../services/notification.service.js";

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "dev-secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

function sendAuth(res, user) {
  const token = signToken(user);
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
      gstin: user.gstin
    }
  });
}

export async function register(req, res) {
  const { name, email, password, phone, companyName, gstin } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const user = await User.create({ name, email, password, phone, companyName, gstin, role: "client" });
  await generateDeadlineReminders(user._id);
  sendAuth(res, user);
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  sendAuth(res, user);
}

export async function me(req, res) {
  res.json({ user: req.user });
}
