import { Router } from "express";
import {
  getAccountantPanel,
  updateAssignedFiling,
  uploadAcknowledgement
} from "../controllers/accountant.controller.js";
import { authorize, protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.use(protect, authorize("accountant"));
router.get("/dashboard", getAccountantPanel);
router.patch("/filings/:id", updateAssignedFiling);
router.post("/filings/:id/acknowledgement", upload.single("acknowledgement"), uploadAcknowledgement);

export default router;
