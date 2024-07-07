import express from "express";
import { PlayerController } from "../controllers";

const router = express.Router();

router.get("/id/:id", PlayerController.getPlayerById);
router.get("/name", PlayerController.getPlayersByName);
router.get("/maps/:id", PlayerController.getMapsOfPlayer);

export default router;