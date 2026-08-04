import { Router } from "express";
import { login } from "./auth.controllers";

const router = Router();
router.post("/login", login);

export default router;