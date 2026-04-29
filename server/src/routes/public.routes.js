import { Router } from "express";
import { complianceCalendar, gstinLookup } from "../controllers/public.controller.js";

const router = Router();

router.get("/gstin/:gstin", gstinLookup);
router.get("/calendar", complianceCalendar);

export default router;
