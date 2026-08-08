import { Router } from "express";
import { listClasses, createClassHandler, updateClassHandler, findClassByIdHandler } from "./classes.controller";
import { requireAuth } from "@/middleware/auth.middleware";
import { requireRole } from "@/middleware/require-role.middleware";

const router = Router();
router.use(requireAuth);

router.get("/", listClasses);
router.post("/", requireRole("ADMIN",'SUPER_ADMIN'), createClassHandler);
router.put("/:id", requireRole("ADMIN", "SUPER_ADMIN"), updateClassHandler);
router.get("/:id", findClassByIdHandler);

export default router;