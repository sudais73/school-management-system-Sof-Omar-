import { Router } from "express";
import { login, logout, refresh, regenerateOtpHandler, setupAccountHandler } from "./auth.controllers";

const router = Router();
router.post("/login", login);
router.post("/setup-account", setupAccountHandler); 
router.post("/refresh", refresh);
router.post("/logout", logout);
    import { requireAuth } from "@/middleware/auth.middleware";
import { requireRole } from "@/middleware/require-role.middleware";

router.post("/regenerate-otp/:userId", requireAuth, requireRole("SUPER_ADMIN", "ADMIN"), regenerateOtpHandler);

export default router;