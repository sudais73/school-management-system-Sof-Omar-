import { Router } from "express";
import { listClasses, createClassHandler } from "./classes.controller";

const router = Router();

router.get("/", listClasses);
router.post("/", createClassHandler);

export default router;