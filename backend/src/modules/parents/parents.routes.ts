import { Router } from "express";
import { requireAuth } from "@/middleware/auth.middleware";
import { requireRole } from "@/middleware/require-role.middleware";
import { inviteParentHandler } from "./parents.controller";

const router = Router();
router.use(requireAuth, requireRole("SUPER_ADMIN", "ADMIN"));
router.post("/invite", inviteParentHandler);

export default router;