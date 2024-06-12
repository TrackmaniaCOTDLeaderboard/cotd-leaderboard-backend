import express from "express";
import { LeaderboardController } from "../controllers";

const router = express.Router();

router.get("/global/player/:id", LeaderboardController.getGlobalPlayerDetails);

export default router;