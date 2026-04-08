import express from "express";
import { validateRegister, validateLogin } from "../validators/authValidator.js";
import { handleValidationErrors } from "../validators/validationResultHandler.js";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// 新規登録API
router.post("/register", validateRegister, handleValidationErrors, registerUser);

// ログインAPI
router.post("/login", validateLogin, handleValidationErrors, loginUser);

export default router;