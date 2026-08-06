import { Router } from "express";
import { listClassesWithSubjects, createSubjectHandler } from "./subjects.controller";

const router = Router();

router.get("/", listClassesWithSubjects);
router.post("/", createSubjectHandler);

export default router;