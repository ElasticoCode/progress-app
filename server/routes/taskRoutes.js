import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

import { handleValidationErrors } from "../validators/validationResultHandler.js";
import { getTasks, createTask } from "../controllers/taskController.js";

const router = express.Router();

// タスク一覧取得API
router.get("/", authMiddleware, getTasks);

// タスク作成API
router.post("/", authMiddleware, handleValidationErrors, createTask);

export default router;