import express from "express";
import { CotdController } from "../controllers";

const router = express.Router();

router.get("/", CotdController.test);

export default router;
