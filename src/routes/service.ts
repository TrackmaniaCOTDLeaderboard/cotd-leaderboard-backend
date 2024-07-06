import express from "express";
import { ServiceController } from "../controllers";
import { requiresAuthentication } from "../middleware/authentication";

const router = express.Router();

router.post("/start/:service", requiresAuthentication, ServiceController.startService);

export default router;