import express from "express";
import { ResultsController } from "../controllers";

const router = express.Router();

router.get("/cup/:year/:month/:day", ResultsController.getCupResults);
router.get("/challenge/:year/:month/:day", ResultsController.getChallengeResults);
router.get("/time-attack/:year/:month/:day", ResultsController.getTimeAttackResults);

router.get("/player/cup/:id", ResultsController.getCupResultsOfPlayer);
router.get("/player/challenge/:id", ResultsController.getChallengeResultsOfPlayer);
router.get("/player/time-attack/:id", ResultsController.getTimeAttackResultsOfPlayer);

export default router;