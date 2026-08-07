import { Router } from "express";
import { createTeacherHandler, listTeachersHandler } from "./teachers.controller";


const router = Router();
router.post("/", createTeacherHandler);
router.get("/", listTeachersHandler);

export default router;