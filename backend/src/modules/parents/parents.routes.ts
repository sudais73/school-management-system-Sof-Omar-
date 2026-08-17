import { Router } from "express";
import { requireAuth } from "@/middleware/auth.middleware";
import { requireRole } from "@/middleware/require-role.middleware";
import { getMyChildResultHandler, inviteParentHandler, myChildrenHandler } from "./parents.controller";

const router = Router();
router.get("/my-children", requireAuth, requireRole("PARENT"), myChildrenHandler);  
router.get("/results", requireAuth, requireRole("PARENT"), getMyChildResultHandler);
router.use(requireAuth, requireRole("SUPER_ADMIN", "ADMIN"));
router.post("/invite", inviteParentHandler);

export default router;