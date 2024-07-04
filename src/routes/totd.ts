import express from "express";
import { TotdController } from "../controllers";

const router = express.Router();

router.get("/:year/:month", TotdController.getTotdsByYearAndMonth);
router.get("/:year/:month/:day", TotdController.getTotdsByYearMonthAndDay);

export default router;