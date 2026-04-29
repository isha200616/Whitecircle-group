import { Router } from "express";
import {
  assignAccountant,
  createFiling,
  createReminder,
  getAdminDashboard,
  updateFiling
} from "../controllers/admin.controller.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();

router.use(protect, authorize("admin"));
router.get("/dashboard", getAdminDashboard);
router.post("/assign-accountant", assignAccountant);
router.post("/filings", createFiling);
router.patch("/filings/:id", updateFiling);
router.post("/reminders", createReminder);

export default router;
