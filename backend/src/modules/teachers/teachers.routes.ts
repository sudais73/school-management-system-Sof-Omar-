import { Router } from "express";
import { createTeacherHandler } from "./teachers.controller";
import { setupAccountHandler } from "../auth/auth.controllers";

const router = Router();
router.post("/", createTeacherHandler);
router.post("/setup-account", setupAccountHandler);

export default router;