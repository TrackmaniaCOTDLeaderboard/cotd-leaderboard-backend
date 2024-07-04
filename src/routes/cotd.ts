import express from "express";
import { CotdController } from "../controllers";

const router = express.Router();

router.get("/:year/:month/:day", CotdController.getCotdByYearAndMonthAndDay);

export default router;