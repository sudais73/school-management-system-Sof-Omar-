import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    message: "Backend is running 🚀",
  });
});

export default router;