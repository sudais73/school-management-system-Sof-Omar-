import { Router } from "express";
import { requireAuth } from "@/middleware/auth.middleware";
import { requireRole } from "@/middleware/require-role.middleware";
import { myClassesHandler, getStructureHandler, createStructureHandler, listMarksHandler, saveMarksHandler } from "./grades.controller";

const router = Router();

router.use(requireAuth, requireRole("TEACHER"));

router.get("/classes", myClassesHandler);
router.get("/grade-structure", getStructureHandler);
router.post("/grade-structure", createStructureHandler);
router.get("/marks", listMarksHandler);
router.post("/marks", saveMarksHandler);

export default router;