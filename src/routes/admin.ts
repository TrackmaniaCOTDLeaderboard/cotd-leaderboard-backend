import express from "express";
import { AdminController } from "../controllers";

const router = express.Router();

router.get("/refresh", AdminController.refreshCupOfTheDay);
router.get("/refresh/tracks", AdminController.refreshTracksOfMonth);
router.get("/monitor/cotd", AdminController.getCotDStatus);
router.get("/monitor/totd", AdminController.getTotDStatus);

router.get("/test", AdminController.test);

export default router;