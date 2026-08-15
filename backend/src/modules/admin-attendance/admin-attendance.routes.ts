import { Router } from "express";
import { requireAuth } from "@/middleware/auth.middleware";
import { requireRole } from "@/middleware/require-role.middleware";
import { dailyOverviewHandler, classDetailHandler, studentHistoryHandler } from "./admin-attendance.controller";

const router = Router();
router.use(requireAuth, requireRole("SUPER_ADMIN", "ADMIN"));

router.get("/daily", dailyOverviewHandler);
router.get("/class", classDetailHandler);
router.get("/student", studentHistoryHandler);

export default router;