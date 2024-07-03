import express from "express";
import { ChallengeController } from "../controllers";

const router = express.Router();

router.get("/:year/:month/:day", ChallengeController.getChallengesByYearAndMonthAndDay);

export default router;