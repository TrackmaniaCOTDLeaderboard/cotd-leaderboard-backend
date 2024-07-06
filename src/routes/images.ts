import express from "express";
import { ImageController } from "../controllers";

const router = express.Router();

router.get("/flag/:zoneId", ImageController.getFlag);

export default router;