import express from "express";
import { validateRegister, validateLogin } from "../validators/authValidator.js";
import { handleValidationErrors } from "../validators/validationResultHandler.js";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// ユーザー新規登録API
router.post("/register", validateRegister, handleValidationErrors, registerUser);

// ユーザーログインAPI
router.post("/login", validateLogin, handleValidationErrors, loginUser);

export default router;