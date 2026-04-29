import { Router } from "express";
import { getClientDashboard, sendClientMessage, uploadDocuments } from "../controllers/client.controller.js";
import { authorize, protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.use(protect, authorize("client"));
router.get("/dashboard", getClientDashboard);
router.post("/documents", upload.array("files", 8), uploadDocuments);
router.post("/chat", sendClientMessage);

export default router;
