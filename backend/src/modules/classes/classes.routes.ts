import { Router } from "express";
import { listClasses, createClassHandler, updateClassHandler, findClassByIdHandler } from "./classes.controller";

const router = Router();

router.get("/", listClasses);
router.post("/", createClassHandler);
router.put("/:id", updateClassHandler);
router.get("/:id", findClassByIdHandler);

export default router;