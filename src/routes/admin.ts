import express from "express";
import { AdminController } from "../controllers";
import { requiresAuthentication } from "../middleware/authentication";

const router = express.Router();

router.get("/monitor/cotd", requiresAuthentication, AdminController.getCotDStatus);
router.get("/monitor/totd", requiresAuthentication, AdminController.getTotDStatus);
router.get("/status", requiresAuthentication, AdminController.getStatus);

router.post("/clearErrors", requiresAuthentication, AdminController.clearErrors);

export default router;