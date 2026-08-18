import { Router } from "express";
import { requireAuth } from "@/middleware/auth.middleware";
import { requireRole } from "@/middleware/require-role.middleware";
import { mySubjectsHandler, myResultHandler } from "./student-portal.controller";

const router = Router();
router.use(requireAuth, requireRole("STUDENT"));
router.get("/subjects", mySubjectsHandler);
router.get("/result", myResultHandler);

export default router;