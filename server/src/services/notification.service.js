import Notification from "../models/Notification.js";

export async function createNotification({ user, title, message, channel = "in-app", dueAt }) {
  const notification = await Notification.create({ user, title, message, channel, dueAt });
  console.log(`[${channel.toUpperCase()} MOCK] ${title}: ${message}`);
  return notification;
}

export async function generateDeadlineReminders(userId) {
  const deadlines = [
    { title: "GST GSTR-3B Reminder", message: "Monthly GSTR-3B filing is due soon.", days: 4 },
    { title: "TDS Return Reminder", message: "Quarterly TDS return preparation window is open.", days: 11 },
    { title: "ITR Planning Reminder", message: "Upload Form 16 and investment proofs for ITR review.", days: 20 }
  ];

  return Promise.all(
    deadlines.map((item) =>
      createNotification({
        user: userId,
        title: item.title,
        message: item.message,
        channel: "email",
        dueAt: new Date(Date.now() + item.days * 24 * 60 * 60 * 1000)
      })
    )
  );
}
