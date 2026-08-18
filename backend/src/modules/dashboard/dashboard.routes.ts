import { Router } from "express";
import { requireAuth } from "@/middleware/auth.middleware";
import { requireRole } from "@/middleware/require-role.middleware";
import { adminSummaryHandler } from "./dashboard.controller";

const router = Router();
router.use(requireAuth, requireRole("SUPER_ADMIN", "ADMIN"));
router.get("/admin-summary", adminSummaryHandler);

export default router;