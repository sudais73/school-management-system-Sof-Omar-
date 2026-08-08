import { Router } from "express";
import { login, logout, refresh, setupAccountHandler } from "./auth.controllers";

const router = Router();
router.post("/login", login);
router.post("/setup-account", setupAccountHandler); 
router.post("/refresh", refresh);
router.post("/logout", logout);
    

export default router;