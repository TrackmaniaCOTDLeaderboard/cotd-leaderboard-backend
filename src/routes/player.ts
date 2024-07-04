import express from "express";
import { PlayerController } from "../controllers";

const router = express.Router();

router.get("/id/:id", PlayerController.getPlayerById);
router.get("/name", PlayerController.getPlayersByName);

export default router;