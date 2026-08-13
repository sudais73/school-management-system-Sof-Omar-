import { Router } from "express";
import { requireAuth } from "@/middleware/auth.middleware";
import {
  listConversationsHandler, getConversationHandler,
  createConversationHandler, sendMessageHandler,
} from "./conversations.controller";

const router = Router();
router.use(requireAuth);

router.get("/", listConversationsHandler);
router.post("/", createConversationHandler);
router.get("/:id", getConversationHandler);
router.post("/:id", sendMessageHandler);

export default router;