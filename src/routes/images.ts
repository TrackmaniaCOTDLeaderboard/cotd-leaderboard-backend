import express from "express";
import { ImagesController } from "../controllers";

const router = express.Router();

router.get("/flag/:zoneId", ImagesController.getFlag);

export default router;