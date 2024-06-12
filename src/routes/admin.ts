import express from "express";
import { AdminController } from "../controllers";

const router = express.Router();

router.get("/refresh", AdminController.refreshCupOfTheDay);
router.get("/refresh/tracks", AdminController.refreshTracksOfMonth);

export default router;