import { Router } from "express";
import { requireAuth } from "@/middleware/auth.middleware";
import { requireRole } from "@/middleware/require-role.middleware";
import { getMyChildResultHandler, inviteParentHandler, myChildrenHandler, parentSummaryHandler } from "./parents.controller";

const router = Router();
router.get("/my-children", requireAuth, requireRole("PARENT"), myChildrenHandler);  
router.get("/results", requireAuth, requireRole("PARENT"), getMyChildResultHandler);
router.get("/summary", requireAuth, requireRole("PARENT"), parentSummaryHandler);
router.use(requireAuth, requireRole("SUPER_ADMIN", "ADMIN"));
router.post("/invite", inviteParentHandler);

export default router;