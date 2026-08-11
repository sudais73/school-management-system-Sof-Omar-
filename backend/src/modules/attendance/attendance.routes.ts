import { Router } from "express";
import { getAttendanceHandler, saveAttendanceHandler } from "./attendance.controller";

const router = Router();

router.get("/attendance", getAttendanceHandler);
router.post("/attendance", saveAttendanceHandler);

export default router;