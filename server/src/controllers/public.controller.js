import { verifyGSTIN } from "../services/gstin.service.js";

export function gstinLookup(req, res) {
  res.json(verifyGSTIN(req.params.gstin));
}

export function complianceCalendar(_req, res) {
  res.json([
    { date: "2026-05-11", title: "GSTR-1 monthly filing", type: "GST" },
    { date: "2026-05-20", title: "GSTR-3B payment and return", type: "GST" },
    { date: "2026-07-31", title: "Income Tax Return filing", type: "ITR" },
    { date: "2026-07-31", title: "Quarterly TDS return", type: "TDS" }
  ]);
}
