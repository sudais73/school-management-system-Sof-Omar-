import { Router } from "express";
import { listStudentsHandler, createStudentHandler } from "./students.controller";

const router = Router();
router.get("/", listStudentsHandler);
router.post("/", createStudentHandler);

export default router;