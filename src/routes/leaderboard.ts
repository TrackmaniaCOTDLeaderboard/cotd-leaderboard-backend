import express from "express";
import { LeaderboardController } from "../controllers";

const router = express.Router();

router.get("/cup/global", LeaderboardController.getGlobalCupLeaderboard);
router.get("/cup/monthly/:year/:month", LeaderboardController.getMonthlyCupLeaderboard);

router.get("/time-attack/global", LeaderboardController.getGlobalTimeAttackLeaderboard);
router.get("/time-attack/monthly/:year/:month", LeaderboardController.getMonthlyTimeAttackLeaderboard);

router.get("/challenge/global", LeaderboardController.getGlobalChallengeLeaderboard);
router.get("/challenge/monthly/:year/:month", LeaderboardController.getMonthlyChallengeLeaderboard);

router.get("/mapper", LeaderboardController.getMapperLeaderboard);

export default router;