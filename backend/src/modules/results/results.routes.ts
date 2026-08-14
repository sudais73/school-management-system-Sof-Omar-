import { Router } from "express";
import { requireAuth } from "@/middleware/auth.middleware";
import { requireRole } from "@/middleware/require-role.middleware";
import { getResultsHandler } from "./results.controller";

const router = Router();
router.use(requireAuth, requireRole("SUPER_ADMIN", "ADMIN"));
router.get("/", getResultsHandler);

export default router;