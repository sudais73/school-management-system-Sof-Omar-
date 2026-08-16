import { Router } from "express";
import { requireAuth } from "@/middleware/auth.middleware";
import { requireRole } from "@/middleware/require-role.middleware";
import { inviteParentHandler, myChildrenHandler } from "./parents.controller";

const router = Router();
router.get("/my-children", requireAuth, requireRole("PARENT"), myChildrenHandler);  

router.use(requireAuth, requireRole("SUPER_ADMIN", "ADMIN"));
router.post("/invite", inviteParentHandler);

export default router;