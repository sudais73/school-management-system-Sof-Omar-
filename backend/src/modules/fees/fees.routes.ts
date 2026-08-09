import { Router } from "express";
import { requireAuth } from "@/middleware/auth.middleware";
import { requireRole } from "@/middleware/require-role.middleware";
import {
  createFeeStructureHandler,
  listStructuresHandler,
  listStudentFeesHandler,
  recordPaymentHandler,
} from "./fees.controller";

const router = Router();

router.use(requireAuth);

router.get("/structures", listStructuresHandler);
router.post("/structures", requireRole("SUPER_ADMIN", "ADMIN"), createFeeStructureHandler);
router.get("/student-fees", listStudentFeesHandler);
router.post("/payments", requireRole("SUPER_ADMIN", "ADMIN"), recordPaymentHandler);

export default router;