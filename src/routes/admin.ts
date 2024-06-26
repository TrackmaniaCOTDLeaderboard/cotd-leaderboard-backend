import express from "express";
import { AdminController } from "../controllers";
import { requiresAuthentication } from "../middleware/authentication";

const router = express.Router();

router.post("/service/:service", requiresAuthentication, AdminController.startService)

router.get("/monitor/cotd", AdminController.getCotDStatus);
router.get("/monitor/totd", AdminController.getTotDStatus);
router.get("/status", AdminController.getStatus);

router.post("/clearErrors", requiresAuthentication, AdminController.clearErrors);

export default router;