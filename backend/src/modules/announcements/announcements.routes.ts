import { Router } from "express";
import { requireAuth } from "@/middleware/auth.middleware";
import { requireRole } from "@/middleware/require-role.middleware";
import { createAnnouncementHandler, listAnnouncementsHandler } from "./announcements.controller";

const router = Router();
router.use(requireAuth);

router.get("/", listAnnouncementsHandler); // every role — admin gets everything, others get their filtered view
router.post("/", requireRole("SUPER_ADMIN", "ADMIN"), createAnnouncementHandler);

export default router;