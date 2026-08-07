import { Router } from "express";
import { login, setupAccountHandler } from "./auth.controllers";

const router = Router();
router.post("/login", login);
router.post("/setup-account", setupAccountHandler); 
    

export default router;