import express from "express";
import { getTables, addTable, getTableByNumber } from "../controllers/tableController.js";

const router = express.Router();

router.get("/", getTables);
router.get("/:tableNumber", getTableByNumber);  // Add this line
router.post("/", addTable);

export default router;