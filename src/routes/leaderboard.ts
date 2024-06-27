import express from "express";
import { LeaderboardController } from "../controllers";

const router = express.Router();

router.get("/cup/global", LeaderboardController.getGlobalCupLeaderboard);
router.get("/cup/monthly/:year/:month", LeaderboardController.getMonthlyCupLeaderboard);
router.get("/time-attack/global", LeaderboardController.getGlobalTimeAttackLeaderboard);
router.get("/challenge/global", LeaderboardController.getGlobalChallengeLeaderboard);

export default router;