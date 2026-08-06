import { Router } from "express";
import { listClasses, createClassHandler, updateClassHandler } from "./classes.controller";

const router = Router();

router.get("/", listClasses);
router.post("/", createClassHandler);
router.put("/:id", updateClassHandler);

export default router;